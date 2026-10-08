/**
 * Compresses an image File or Data URL to maximum 1920x1080 resolution at 85% JPEG quality.
 */
export async function compressImage(
  imageSource: File | string,
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.85
): Promise<{ blob: Blob; dataUrl: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      let { width, height } = img;

      // Scale dimensions proportionally
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2D context unavailable'));
        return;
      }

      // Draw with smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to JPEG dataUrl
      const dataUrl = canvas.toDataURL('image/jpeg', quality);

      // Convert to Blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas blob conversion failed'));
            return;
          }
          resolve({ blob, dataUrl, width, height });
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = (err) => reject(err);

    if (typeof imageSource === 'string') {
      img.src = imageSource;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(imageSource);
    }
  });
}
