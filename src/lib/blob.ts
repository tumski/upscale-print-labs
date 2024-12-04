import { put } from "@vercel/blob";
import { nanoid } from "nanoid";

export async function uploadToBlob(file: File) {
  try {
    const filename = `${nanoid()}-${file.name}`;
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false,
    });

    return {
      url: blob.url,
      success: true as const,
    };
  } catch (error) {
    console.error("Error uploading to blob:", error);
    return {
      success: false as const,
      error: "Failed to upload image",
    };
  }
}
