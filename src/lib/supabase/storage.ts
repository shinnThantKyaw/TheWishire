import { createClient } from "./client";

const BUCKET_NAME = "wish-media";

/**
 * Upload a file to the wish-media storage bucket.
 * Files are organized by wish ID: {wishId}/{filename}
 */
export async function uploadFile(
  wishId: string,
  file: File,
  filename?: string
): Promise<{ url: string; path: string }> {
  const supabase = createClient();
  const name = filename ?? `${Date.now()}-${file.name}`;
  const path = `${wishId}/${name}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, file, { upsert: false });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);

  return { url: publicUrl, path };
}

/**
 * Get the public URL for a stored file.
 */
export function getPublicUrl(path: string): string {
  const supabase = createClient();
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
  return publicUrl;
}

/**
 * Delete files for a given wish (all files in its folder).
 */
export async function deleteWishFiles(wishId: string): Promise<void> {
  const supabase = createClient();

  // List all files in the wish's folder
  const { data: files, error: listError } = await supabase.storage
    .from(BUCKET_NAME)
    .list(wishId);

  if (listError) throw listError;
  if (!files?.length) return;

  const paths = files.map((f) => `${wishId}/${f.name}`);
  const { error: deleteError } = await supabase.storage
    .from(BUCKET_NAME)
    .remove(paths);

  if (deleteError) throw deleteError;
}

/**
 * Delete a single file by its storage path.
 */
export async function deleteFile(path: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);
  if (error) throw error;
}
