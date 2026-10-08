'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CLINICAL_PRESETS } from '@/lib/presets';
import { compressImage } from '@/lib/imageCompression';
import {
  X,
  Camera,
  Upload,
  Sparkles,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  FlipHorizontal,
  Zap,
  Image as ImageIcon
} from 'lucide-react';

interface CaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaptureComplete: (data: { imageUrl: string; fileId?: string; presetId?: string }) => void;
}

export function CaptureModal({
  isOpen,
  onClose,
  onCaptureComplete
}: CaptureModalProps) {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'samples'>('camera');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Upload preview state
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);

  // Video and stream refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera stream safely
  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Initialize camera stream
  const startCamera = useCallback(async () => {
    stopCameraStream();
    setCameraError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported in this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.warn('[Camera] Failed to initialize video stream:', err);
      setCameraError(
        'Unable to access camera. Please allow camera permissions or choose a sample face below.'
      );
    }
  }, [facingMode, stopCameraStream]);

  // Manage camera lifecycle based on modal visibility and active tab
  useEffect(() => {
    if (isOpen && activeTab === 'camera') {
      startCamera();
    } else {
      stopCameraStream();
    }
    return () => {
      stopCameraStream();
    };
  }, [isOpen, activeTab, startCamera, stopCameraStream]);

  // Toggle front/back camera
  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  // Perform snapshot from active video stream
  const triggerSnapshot = async () => {
    if (!videoRef.current) return;
    setIsCapturing(true);

    try {
      const video = videoRef.current;
      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D rendering context failed');

      // If front camera, flip horizontally for natural mirror image
      if (facingMode === 'user') {
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, width, height);

      const rawDataUrl = canvas.toDataURL('image/jpeg', 0.95);

      // Client-side compression (max 1920x1080, JPEG 85%)
      const compressed = await compressImage(rawDataUrl, 1920, 1080, 0.85);

      // Upload to temporary ingestion route
      setIsUploading(true);
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: compressed.dataUrl })
      });
      const data = await res.json();

      stopCameraStream();
      onClose();

      onCaptureComplete({
        imageUrl: data.publicUrl || compressed.dataUrl,
        fileId: data.fileId
      });
    } catch (err) {
      console.error('[Snapshot Error]:', err);
      alert('Snapshot processing failed. Please try again or select a sample image.');
    } finally {
      setIsCapturing(false);
      setIsUploading(false);
      setCountdown(null);
    }
  };

  // 3-Second countdown snapshot trigger
  const startCountdownSnapshot = () => {
    if (countdown !== null || isCapturing) return;
    setCountdown(3);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(timer);
          triggerSnapshot();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle local file selection or drop
  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, WEBP).');
      return;
    }

    try {
      setIsUploading(true);
      // Client-side compression
      const compressed = await compressImage(file, 1920, 1080, 0.85);
      setPreviewUrl(compressed.dataUrl);
      setPreviewBlob(compressed.blob);

      // Upload to /api/upload
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: compressed.dataUrl })
      });
      const data = await res.json();

      onClose();
      onCaptureComplete({
        imageUrl: data.publicUrl || compressed.dataUrl,
        fileId: data.fileId
      });
    } catch (err) {
      console.error('[Upload Error]:', err);
      alert('Image upload failed. Please try another file.');
    } finally {
      setIsUploading(false);
    }
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Biometric Universal Capture
              </h3>
              <p className="text-[11px] text-slate-400">
                YouCam S2S v2.1 Normalized Image Ingestion Engine
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCameraStream();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-4 pt-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'camera'
                ? 'border-cyan-400 text-cyan-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Camera</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'upload'
                ? 'border-cyan-400 text-cyan-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>

          <button
            onClick={() => setActiveTab('samples')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'samples'
                ? 'border-cyan-400 text-cyan-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pre-Tested Samples</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* TAB 1: Live Webcam with Face Oval Alignment Guide */}
          {activeTab === 'camera' && (
            <div className="flex flex-col items-center">
              {cameraError ? (
                <div className="w-full bg-amber-950/30 border border-amber-800/80 rounded-2xl p-5 text-center space-y-3">
                  <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Camera Access Notice</h4>
                    <p className="text-xs text-amber-300/80 mt-1 max-w-md mx-auto">
                      {cameraError}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('samples')}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all"
                  >
                    Use Pre-Tested Sample Face
                  </button>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center">
                  {/* Viewfinder Frame */}
                  <div className="relative w-full max-w-md h-80 sm:h-96 bg-black rounded-2xl overflow-hidden border-2 border-slate-800 shadow-2xl flex items-center justify-center">
                    {/* Live Video Feed */}
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className={`w-full h-full object-cover ${
                        facingMode === 'user' ? 'scale-x-[-1]' : ''
                      }`}
                    />

                    {/* Face Oval Alignment Guide */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      {/* Outer Vignette Darkening */}
                      <div className="absolute inset-0 bg-slate-950/30" />

                      {/* Oval Cutout Guide */}
                      <div className="relative w-52 sm:w-60 h-68 sm:h-76 rounded-[50%/60%] border-2 border-cyan-400/80 shadow-[0_0_25px_rgba(6,182,212,0.4)] flex flex-col items-center justify-between p-4">
                        {/* Eye-level alignment guideline */}
                        <div className="w-full border-t border-dashed border-cyan-400/40 mt-16" />

                        {/* Center vertical axis */}
                        <div className="h-full border-l border-dashed border-cyan-400/30 absolute inset-y-0" />

                        {/* Target badge */}
                        <span className="bg-slate-950/80 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono px-2 py-0.5 rounded-full z-10">
                          ALIGN FACE HERE
                        </span>
                      </div>
                    </div>

                    {/* Flip Camera Button */}
                    <button
                      onClick={toggleFacingMode}
                      className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/70 border border-slate-700 text-white hover:bg-slate-800 transition-colors shadow-lg z-20"
                      title="Switch Front/Back Camera"
                    >
                      <FlipHorizontal className="w-4 h-4" />
                    </button>

                    {/* Countdown Overlay Animation */}
                    {countdown !== null && (
                      <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs animate-in zoom-in-50">
                        <span className="text-7xl font-black text-white drop-shadow-[0_0_20px_#22d3ee] animate-ping">
                          {countdown}
                        </span>
                      </div>
                    )}

                    {/* Shutter Flash Animation */}
                    {isCapturing && (
                      <div className="absolute inset-0 z-40 bg-white animate-in fade-in duration-75" />
                    )}

                    {/* Uploading Spinner */}
                    {isUploading && (
                      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm text-xs text-cyan-400">
                        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-2" />
                        <span className="font-mono font-semibold">
                          Compressing & Uploading to YouCam S2S...
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Camera Action Buttons */}
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={startCountdownSnapshot}
                      disabled={countdown !== null || isCapturing || isUploading}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all shadow-md disabled:opacity-50"
                    >
                      <Clock className="w-4 h-4 text-cyan-400" />
                      <span>3s Timer Snapshot</span>
                    </button>

                    <button
                      onClick={triggerSnapshot}
                      disabled={countdown !== null || isCapturing || isUploading}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-cyan-500/25 active:scale-95 disabled:opacity-50"
                    >
                      <Camera className="w-4 h-4 fill-slate-950" />
                      <span>Instant Capture</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Drag & Drop Local File Upload */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
                className="hidden"
              />

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-cyan-400 bg-cyan-950/30'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-950/60 hover:bg-slate-950/80'
                }`}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center text-xs text-cyan-400">
                    <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-2" />
                    <span className="font-mono">Compressing & Dispatching to YouCam...</span>
                  </div>
                ) : previewUrl ? (
                  <div className="flex flex-col items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Uploaded Preview"
                      className="w-32 h-32 object-cover rounded-xl border border-slate-700 shadow-lg mb-2"
                    />
                    <span className="text-xs font-bold text-white">Image Selected</span>
                    <span className="text-[11px] text-slate-400">Click to change file</span>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 shadow-md">
                      <Upload className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">
                      Drag & Drop your selfie here, or browse
                    </h4>
                    <p className="text-xs text-slate-400 max-w-xs">
                      Supports JPG, PNG, WEBP. Automatic high-resolution normalization (up to 1920x1080).
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Pre-Tested Clinical Sample Faces */}
          {activeTab === 'samples' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Instantly evaluate DermaTwin OS across 4 verified clinical phenotypes (conserves YouCam API units):
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CLINICAL_PRESETS.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => {
                      onClose();
                      onCaptureComplete({
                        imageUrl: preset.fullImageUrl,
                        presetId: preset.id
                      });
                    }}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-950 transition-all cursor-pointer group shadow-sm"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preset.avatarUrl}
                      alt={preset.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                          {preset.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">({preset.age}y)</span>
                      </div>
                      <p className="text-[11px] text-rose-400 font-medium truncate mt-0.5">
                        {preset.concern}
                      </p>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {preset.expectedSkinType} Phenotype
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
