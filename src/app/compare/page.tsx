'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function ComparePage() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [enhancedUrl, setEnhancedUrl] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get the image URL from localStorage
    const url = localStorage.getItem('originalImageUrl');
    if (url) {
      setImageUrl(url);
      enhanceOriginalImage(url);
    } else {
      // Redirect to upload page if no image URL found
      router.replace('/create');
    }
  }, [router]);

  const enhanceOriginalImage = async (url: string) => {
    try {
      setIsEnhancing(true);
      setError(null);

      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: url }),
      });

      const result = await response.json();

      if (!response.ok || !result.success || !result.url) {
        throw new Error(result.error || 'Failed to enhance image');
      }

      setEnhancedUrl(result.url);
    } catch (err) {
      console.error('Enhancement error:', err);
      setError(err instanceof Error ? err.message : 'Failed to enhance image');
    } finally {
      setIsEnhancing(false);
    }
  };

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
        
        <div className="grid gap-8 sm:grid-cols-2">
          {/* Original Image */}
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

          {/* Enhanced Image */}
          <div className="space-y-4">
            <div className="relative w-full aspect-square bg-black/5 rounded-lg">
              {isEnhancing ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                    <p className="text-sm text-gray-500">Enhancing your image...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <p className="text-sm text-red-500">{error}</p>
                    <Button 
                      size="sm" 
                      onClick={() => imageUrl && enhanceOriginalImage(imageUrl)}
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : enhancedUrl ? (
                <Image
                  src={enhancedUrl}
                  alt="Enhanced image"
                  fill
                  className="object-contain rounded-lg p-2"
                  sizes="(max-width: 280px) 100vw, (max-width: 768px) 50vw, 800px"
                />
              ) : null}
            </div>
            <p className="text-sm text-gray-500 text-center">Enhanced Image</p>
          </div>
        </div>
      </div>
    </main>
  );
} 