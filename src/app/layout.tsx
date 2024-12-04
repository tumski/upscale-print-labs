import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Upscale Print Labs - Gallery-Quality Photo Prints",
  description: "Transform your digital photos into stunning, gallery-quality prints with AI-powered upscaling.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={cn(inter.className, "h-full antialiased")}>{children}</body>
    </html>
  );
}
