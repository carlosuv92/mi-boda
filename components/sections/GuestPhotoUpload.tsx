'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Camera, Check, X, Image as ImageIcon, Images, Loader2, Upload } from 'lucide-react';

interface GuestPhotoUploadProps {
  guestName?: string;
  onUploadSuccess?: () => void;
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function GuestPhotoUpload({ guestName, onUploadSuccess }: GuestPhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState(0);
  const [total, setTotal] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const uploadFileToCloudinary = useCallback(async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET!);

    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText).secure_url);
        } else {
          reject(new Error('Error al subir la imagen'));
        }
      };

      xhr.onerror = () => reject(new Error('Error de conexión'));
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
      xhr.send(formData);
    });
  }, []);

  const uploadFiles = useCallback(async (files: File[]) => {
    const imageFiles = files.filter((f) => f.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      setError('Solo se permiten imágenes');
      return;
    }

    const oversized = imageFiles.filter((f) => f.size > MAX_FILE_SIZE);
    if (oversized.length > 0) {
      setError(`${oversized.length} foto(s) superan los 10MB`);
      return;
    }

    setError(null);
    setTotal(imageFiles.length);
    setUploaded(0);
    setSuccessCount(0);
    setUploading(true);
    setProgress(0);

    let okCount = 0;

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      setUploaded(i);

      try {
        const url = await uploadFileToCloudinary(file);

        const res = await fetch('/api/guest-gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url,
            subido_por: guestName || 'Invitado',
          }),
        });

        if (!res.ok) throw new Error('Error al guardar la foto');
        okCount++;
      } catch (err) {
        console.error('Error uploading file:', err);
      }
    }

    setUploaded(imageFiles.length);
    setSuccessCount(okCount);
    setSuccess(true);
    onUploadSuccess?.();

    setTimeout(() => {
      setShowUploader(false);
      setSuccess(false);
      setSuccessCount(0);
      setUploaded(0);
      setTotal(0);
      setProgress(0);
    }, 3000);
  }, [guestName, onUploadSuccess, uploadFileToCloudinary]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await uploadFiles(Array.from(files));
    }
    e.target.value = '';
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    dragCounter.current = 0;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await uploadFiles(Array.from(files));
    }
  };

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    return (
      <div className="text-center py-8 text-text-light text-sm font-cormorant">
        Configura Cloudinary para activar la subida de fotos
      </div>
    );
  }

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {!showUploader ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowUploader(true)}
          className="w-full py-4 bg-detalle text-charcoal rounded-xl
            font-cormorant text-lg font-medium shadow-sm hover:shadow-md
            transition-all duration-300"
        >
          Sube tus fotos
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-2xl p-6 border border-cream-dark"
        >
          {success ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex flex-col items-center gap-3 py-4"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <p className="font-cormorant text-lg text-green-700">
                {successCount === 1 ? '¡Foto subida!' : `¡${successCount} fotos subidas!`}
              </p>
              <p className="text-text-light text-sm font-cormorant">
                Estarán visibles después de ser aprobadas
              </p>
            </motion.div>
          ) : uploading ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <Loader2 className="w-10 h-10 text-principal animate-spin" />
              <span className="text-text-secondary font-cormorant text-lg">
                Subiendo {uploaded + 1} de {total}
              </span>
              <div className="w-48 h-2 bg-cream-dark rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-principal rounded-full"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-cormorant text-lg text-text-primary">
                  Subir fotos
                </h3>
                <button
                  onClick={() => {
                    setShowUploader(false);
                    setError(null);
                  }}
                  className="p-2 hover:bg-cream rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-text-secondary" />
                </button>
              </div>

              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`relative w-full py-12 px-4 border-2 border-dashed rounded-xl
                  transition-all duration-300 flex flex-col items-center justify-center gap-3 cursor-pointer
                  ${isDragOver
                    ? 'border-principal bg-principal/10 scale-[1.02]'
                    : 'border-cream-dark hover:border-principal/50 hover:bg-principal/5'
                  }`}
              >
                {isDragOver ? (
                  <>
                    <div className="w-16 h-16 rounded-full bg-principal/20 flex items-center justify-center">
                      <Upload className="w-8 h-8 text-principal" />
                    </div>
                    <span className="text-principal font-cormorant text-lg font-medium">
                      Suelta tus fotos aquí
                    </span>
                  </>
                ) : (
                  <>
                    <Images className="w-12 h-12 text-text-light" />
                    <span className="text-text-secondary font-cormorant text-lg">
                      Arrastra tus fotos aquí o toca para seleccionar
                    </span>
                    <span className="text-text-light text-xs font-cormorant">
                      Puedes subir varias fotos a la vez
                    </span>
                  </>
                )}
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm text-center mt-3 font-cormorant"
                >
                  {error}
                </motion.p>
              )}

              {!uploading && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const input = inputRef.current;
                      if (input) {
                        input.removeAttribute('capture');
                        input.click();
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3
                      bg-charcoal text-white rounded-xl hover:bg-charcoal-light
                      transition-colors font-cormorant text-base"
                  >
                    <ImageIcon className="w-5 h-5" />
                    Galería
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const input = inputRef.current;
                      if (input) {
                        input.setAttribute('capture', 'environment');
                        input.click();
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3
                      bg-detalle text-charcoal rounded-xl hover:bg-detalle-light
                      transition-colors font-cormorant text-base font-medium"
                  >
                    <Camera className="w-5 h-5" />
                    Cámara
                  </button>
                </div>
              )}
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
