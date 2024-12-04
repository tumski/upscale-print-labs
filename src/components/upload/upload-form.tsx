'use client';

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { uploadImage } from "@/app/actions";

export function UploadForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.heic']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleSubmit = async () => {
    if (!file) return;

    try {
      setIsUploading(true);
      
      // Create FormData and append file
      const formData = new FormData();
      formData.append('file', file);

      const result = await uploadImage(formData);

      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: result.error
        });
        return;
      }

      // Store the URL in localStorage for the compare page
      localStorage.setItem('originalImageUrl', result.url);
      
      // Navigate to compare page
      router.push('/compare');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Something went wrong. Please try again."
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-4 min-h-[200px]
          flex flex-col items-center justify-center text-center
          cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-200'}
          ${preview ? 'bg-black/5' : 'bg-white'}
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} disabled={isUploading} />
        
        {preview ? (
          <div className="relative w-full aspect-square max-w-[280px]">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="space-y-4 p-4">
            <div className="text-base sm:text-lg font-medium">
              {isDragActive ? (
                <p>Drop your photo here</p>
              ) : (
                <>
                  <p>Tap to upload or drag and drop</p>
                  <p className="text-sm text-gray-500 mt-2">
                    JPEG, PNG, WEBP or HEIC
                  </p>
                </>
              )}
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