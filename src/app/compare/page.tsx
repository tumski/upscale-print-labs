'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ComparePage() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    // Get the image URL from localStorage
    const url = localStorage.getItem('originalImageUrl');
    if (url) {
      setImageUrl(url);
    } else {
      // Redirect to upload page if no image URL found
      router.replace('/create');
    }
  }, [router]);

  // Don't render anything while checking for image URL
  if (!imageUrl) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col p-4">
      <div className="w-full max-w-[280px] mx-auto sm:max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/create">← Back</Link>
          </Button>
          <h1 className="text-2xl font-bold sm:text-3xl">Compare Results</h1>
        </div>
        
        <div className="space-y-4">
          <div className="relative w-full aspect-square bg-black/5 rounded-lg">
            <Image
              src={imageUrl}
              alt="Original image"
              fill
              className="object-contain rounded-lg p-2"
              sizes="(max-width: 280px) 100vw, (max-width: 768px) 50vw, 800px"
            />
          </div>
          <p className="text-sm text-gray-500 text-center">Original Image</p>
        </div>
      </div>
    </main>
  );
} 