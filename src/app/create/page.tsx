'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { UploadForm } from '@/components/upload/upload-form';

export default function CreatePage() {
  const router = useRouter();

  const onUploadComplete = useCallback((url: string) => {
    // Store the URL in localStorage
    localStorage.setItem('originalImageUrl', url);
    // Navigate to the compare page
    router.push('/compare');
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col p-4">
      <div className="w-full max-w-[280px] mx-auto sm:max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 sm:text-3xl">Upload Your Photo</h1>
        <UploadForm onComplete={onUploadComplete} />
      </div>
    </main>
  );
} 