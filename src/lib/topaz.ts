"use server";

import { uploadToBlob } from "./blob";

// Validate environment variables
const TOPAZ_API_URL = process.env.TOPAZ_API_URL?.trim().replace(/\/$/, "");
const TOPAZ_API_KEY = process.env.TOPAZ_API_KEY?.trim();

if (!TOPAZ_API_URL) {
  throw new Error("TOPAZ_API_URL is missing");
}

if (!TOPAZ_API_KEY) {
  throw new Error("TOPAZ_API_KEY is missing");
}

// Now TypeScript knows these are definitely strings
const apiUrl: string = TOPAZ_API_URL;
const apiKey: string = TOPAZ_API_KEY;

interface EnhanceOptions {
  outputWidth?: number;
  outputHeight?: number;
  outputFormat?: "jpeg" | "png" | "tiff";
  cropToFill?: boolean;
  faceEnhancement?: boolean;
  faceEnhancementCreativity?: number;
}

export async function enhanceImage(
  imageUrl: string,
  options: EnhanceOptions = {}
): Promise<{
  success: boolean;
  url?: string;
  error?: string;
}> {
  try {
    // Download the image from the URL
    console.log("Downloading image from:", imageUrl);
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(
        `Failed to download image from URL: ${imageResponse.statusText}`
      );
    }
    const imageBlob = await imageResponse.blob();
    console.log(
      "Image downloaded, size:",
      imageBlob.size,
      "type:",
      imageBlob.type
    );

    // Create a File object from the Blob
    const imageFile = new File([imageBlob], "image.jpg", {
      type: imageBlob.type,
    });

    // Prepare form data exactly as in the docs
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("model", "Standard V2");
    formData.append("output_format", options.outputFormat || "jpeg");
    formData.append(
      "face_enhancement",
      (options.faceEnhancement ?? true).toString()
    );
    formData.append(
      "face_enhancement_creativity",
      (options.faceEnhancementCreativity ?? 0).toString()
    );

    if (options.outputWidth) {
      formData.append("output_width", options.outputWidth.toString());
    }
    if (options.outputHeight) {
      formData.append("output_height", options.outputHeight.toString());
    }
    if (options.cropToFill !== undefined) {
      formData.append("crop_to_fill", options.cropToFill.toString());
    }

    // Log request details
    console.log("Topaz API Request:", {
      url: apiUrl,
      formDataKeys: Array.from(formData.keys()),
      imageFileInfo: {
        name: imageFile.name,
        type: imageFile.type,
        size: imageFile.size,
      },
    });

    // Create headers exactly as in the docs
    const headers = new Headers();
    headers.append("Accept", "image/jpeg");
    headers.append("X-API-Key", apiKey);

    // Make request to Topaz API
    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: formData,
    });

    // Log response details
    console.log("Topaz API Response:", {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Topaz API Error Response:", errorText);
      throw new Error(
        `Enhancement failed: ${response.status} ${
          response.statusText
        } - ${errorText.slice(0, 200)}...`
      );
    }

    // Get enhanced image data
    const enhancedImageBlob = await response.blob();

    // Upload enhanced image to Vercel Blob
    const blobFile = new File(
      [enhancedImageBlob],
      `enhanced-${Date.now()}.${options.outputFormat || "jpeg"}`,
      {
        type: enhancedImageBlob.type,
      }
    );
    const { url, success } = await uploadToBlob(blobFile);

    if (!success) {
      throw new Error("Failed to upload enhanced image to Blob storage");
    }

    return {
      success: true,
      url,
    };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Topaz enhancement error details:", {
      name: err?.name,
      message: err?.message,
      stack: err?.stack,
    });
    return {
      success: false,
      error: err?.message || "Unknown error occurred",
    };
  }
}

// Check enhancement status if needed
export async function checkEnhancementStatus(processId: string): Promise<{
  status: "processing" | "completed" | "failed";
  error?: string;
}> {
  try {
    const response = await fetch(
      `${TOPAZ_API_URL}/image/v1/status/${processId}`,
      {
        headers: {
          Authorization: `Bearer ${TOPAZ_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to check status: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      status: data.status,
      error: data.error,
    };
  } catch (error) {
    console.error("Status check error:", error);
    return {
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// Download enhanced image if needed (for retrying failed uploads to Blob)
export async function downloadEnhancedImage(processId: string): Promise<{
  success: boolean;
  data?: Blob;
  error?: string;
}> {
  try {
    const response = await fetch(
      `${TOPAZ_API_URL}/image/v1/download/${processId}`,
      {
        headers: {
          Authorization: `Bearer ${TOPAZ_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to download: ${response.statusText}`);
    }

    const imageBlob = await response.blob();
    return {
      success: true,
      data: imageBlob,
    };
  } catch (error) {
    console.error("Download error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
