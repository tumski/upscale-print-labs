'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";

export function ProductSelector() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    // Get the image URL from localStorage
    const url = localStorage.getItem('originalImageUrl');
    if (url) {
      setImageUrl(url);
    } else {
      router.replace('/create');
    }
  }, [router]);

  if (!imageUrl) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Preview Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative w-full aspect-square bg-black/5 rounded-lg">
            <Image
              src={imageUrl}
              alt="Your photo"
              fill
              className="object-contain rounded-lg p-2"
              sizes="(max-width: 280px) 100vw, (max-width: 768px) 50vw, 800px"
            />
          </div>
          <p className="text-sm text-muted-foreground text-center mt-4">
            Your enhanced photo will be optimized for the selected print format
          </p>
        </CardContent>
      </Card>
    </div>
  );
}