'use client';

import { Suspense } from 'react';
import { ProductSelector } from '@/components/product-selector';
import { BackButton } from '@/components/back-button';

export default function FormatPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <BackButton href="/compare" className="mb-6" />
        <h1 className="text-3xl font-bold mb-6">Choose Your Print Format</h1>
        <Suspense fallback={<div>Loading available formats...</div>}>
          <ProductSelector />
        </Suspense>
      </div>
    </main>
  );
} 