import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100">
      <div className="container px-4 py-8 mx-auto text-center sm:py-16">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
          Turn Your Digital Memories Into Gallery-Quality Prints
        </h1>
        <p className="mt-4 text-base leading-7 text-gray-600 max-w-[280px] mx-auto sm:mt-6 sm:text-lg sm:max-w-2xl">
          AI-powered upscaling transforms any photo into a stunning, frame-worthy masterpiece
        </p>
        <div className="mt-8 sm:mt-10">
          <Button 
            asChild 
            size="lg" 
            className="w-full max-w-[280px] h-14 text-base sm:w-auto sm:px-8 sm:text-lg"
          >
            <Link href="/create">Transform Your Photo</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
