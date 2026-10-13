import { getSupabaseBrowserClient } from "./client";

/**
 * Uploads a file to the specified Supabase Storage bucket.
 *
 * @param bucket - Target bucket name (e.g. "avatars", "documents")
 * @param path   - Storage path including filename (e.g. "user-123/avatar.png")
 * @param file   - File object to upload
 * @returns Public URL of the uploaded file
 * @throws Error if the upload fails
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<string> {
  const supabase = getSupabaseBrowserClient();

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Deletes a file from the specified Supabase Storage bucket.
 *
 * @param bucket - Target bucket name
 * @param path   - Storage path of the file to delete
 * @throws Error if the deletion fails
 */
export async function deleteFile(bucket: string, path: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();

  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) throw new Error(`Delete failed: ${error.message}`);
}

/**
 * Returns the public URL for a file in Supabase Storage without fetching it.
 *
 * @param bucket - Target bucket name
 * @param path   - Storage path of the file
 * @returns Public URL string
 */
export function getPublicUrl(bucket: string, path: string): string {
  const supabase = getSupabaseBrowserClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
