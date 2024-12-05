import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  href: string;
  className?: string;
}

export function BackButton({ href, className }: BackButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("gap-2", className)}
      asChild
    >
      <Link href={href}>
        <ChevronLeft className="h-4 w-4" />
        Back
      </Link>
    </Button>
  );
} 