import { enhanceImage } from "@/lib/topaz";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    console.log("API Config:", {
      hasApiKey: !!process.env.TOPAZ_API_KEY,
      hasApiUrl: !!process.env.TOPAZ_API_URL,
      apiUrl: process.env.TOPAZ_API_URL,
      nodeEnv: process.env.NODE_ENV,
    });

    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    const result = await enhanceImage(imageUrl, {
      outputFormat: "jpeg",
      faceEnhancement: true,
    });

    if (!result.success) {
      console.error("Enhancement failed:", result.error);
      return NextResponse.json(
        { error: result.error || "Enhancement failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Enhancement error details:", {
      name: err?.name,
      message: err?.message,
      stack: err?.stack,
      nodeEnv: process.env.NODE_ENV,
    });

    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
