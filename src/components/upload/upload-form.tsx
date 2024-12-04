'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadImage } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface UploadFormProps {
  onComplete?: (url: string) => void;
}

export function UploadForm({ onComplete }: UploadFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Show preview and store file
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setFile(file);
  }, []);

  const handleSubmit = async () => {
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      const result = await uploadImage(formData);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      // Call completion handler if provided
      if (onComplete) {
        onComplete(result.url);
      }

      toast({
        title: "Upload successful",
        description: "Your photo has been uploaded successfully.",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload photo",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/heic': ['.heic'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200 ease-in-out min-h-[200px]
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} disabled={isUploading} />
        
        {isUploading ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-gray-500">Uploading your photo...</p>
          </div>
        ) : preview ? (
          <div className="relative aspect-square w-full max-w-sm mx-auto">
            <Image
              src={preview}
              alt="Upload preview"
              fill
              className="object-contain rounded-lg"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4">
            <Upload className="h-8 w-8 text-gray-400" />
            <div>
              <p className="text-lg font-medium">Drop your photo here or click to upload</p>
              <p className="text-sm text-gray-500 mt-1">
                Supports JPG, PNG, WEBP, HEIC up to 10MB
              </p>
            </div>
          </div>
        )}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!file || isUploading}
        className="w-full h-14"
        size="lg"
      >
        {isUploading ? "Uploading..." : "Transform!"}
      </Button>
    </div>
  );
} 