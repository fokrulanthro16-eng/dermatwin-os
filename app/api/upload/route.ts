import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const YOUCAM_API_KEY = process.env.YOUCAM_API_KEY || '';

/**
 * Uploads an image binary directly to YouCam's official AWS S3 storage via the File API.
 * Returns the registered YouCam file_id.
 */
async function uploadToYouCamStorage(buffer: Buffer, filename: string): Promise<string | null> {
  try {
    // 1. Initialize upload session
    const initRes = await fetch('https://yce-api-01.makeupar.com/s2s/v2.0/file', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${YOUCAM_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        files: [
          {
            file_name: filename,
            content_type: 'image/jpeg',
            file_size: buffer.length
          }
        ]
      })
    });

    const initData = await initRes.json();
    if (!initRes.ok || !initData.data?.files?.[0]) {
      console.warn('[YouCam Upload] File initialization failed:', initData);
      return null;
    }

    const fileMeta = initData.data.files[0];
    const fileId = fileMeta.file_id;
    const putReq = fileMeta.requests?.[0];

    if (!putReq?.url) {
      console.warn('[YouCam Upload] Missing S3 PUT URL in response');
      return null;
    }

    // 2. Perform HTTP PUT of image bytes to YouCam's pre-signed S3 URL
    const putRes = await fetch(putReq.url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Length': String(buffer.length)
      },
      body: new Uint8Array(buffer)
    });

    if (!putRes.ok) {
      console.warn(`[YouCam Upload] S3 PUT failed with status ${putRes.status}`);
      return null;
    }

    console.log(`[YouCam Upload] Successfully uploaded to YouCam S3. File ID: ${fileId}`);
    return fileId;
  } catch (err) {
    console.warn('[YouCam Upload] Error uploading to YouCam storage:', err);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    let buffer: Buffer | null = null;
    let filename = `selfie_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`;

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json({ error: 'No file found in form data' }, { status: 400 });
      }
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      if (file.name) {
        filename = `selfie_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;
      }
    } else {
      // JSON body with base64 dataUrl
      const body = await req.json();
      const imageStr: string = body.image || body.dataUrl || '';
      if (!imageStr) {
        return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
      }

      // Strip data:image/...;base64, prefix
      const base64Data = imageStr.replace(/^data:image\/\w+;base64,/, '');
      buffer = Buffer.from(base64Data, 'base64');
    }

    if (!buffer || buffer.length === 0) {
      return NextResponse.json({ error: 'Invalid or empty image buffer' }, { status: 400 });
    }

    // Ensure public/uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    // Upload to YouCam AWS storage to acquire file_id for task execution
    const fileId = await uploadToYouCamStorage(buffer, filename);

    return NextResponse.json({
      success: true,
      publicUrl,
      fileId: fileId || undefined,
      filename,
      sizeBytes: buffer.length
    });
  } catch (error) {
    console.error('[API /api/upload] Error processing upload:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to process image upload' },
      { status: 500 }
    );
  }
}
