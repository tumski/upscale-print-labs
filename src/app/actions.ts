"use server";

import { uploadToBlob } from "@/lib/blob";

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false as const, error: "No file provided" };
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/heic"];
    if (!validTypes.includes(file.type)) {
      return { success: false as const, error: "Invalid file type" };
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { success: false as const, error: "File too large (max 10MB)" };
    }

    const result = await uploadToBlob(file);
    if (!result.success) {
      return result;
    }

    return {
      success: true as const,
      url: result.url,
    };
  } catch (error) {
    console.error("Error in uploadImage:", error);
    return { success: false as const, error: "Failed to process image" };
  }
}
