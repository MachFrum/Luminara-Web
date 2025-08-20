import { Storage } from 'aws-amplify';

/**
 * Uploads a file to the S3 bucket managed by Amplify.
 * 
 * @param file The file to upload.
 * @param progressCallback An optional callback to track upload progress.
 * @returns The key of the uploaded file.
 */
export const uploadFile = async (
  file: File,
  progressCallback?: (progress: { loaded: number; total: number }) => void
): Promise<string> => {
  try {
    const fileName = `${Date.now()}-${file.name}`;
    const result = await Storage.put(fileName, file, {
      contentType: file.type,
      progressCallback,
      level: 'public', // Or 'private' or 'protected' based on your needs
    });
    return result.key;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('File upload failed');
  }
};

/**
 * Deletes a file from the S3 bucket.
 * 
 * @param fileKey The key of the file to delete.
 */
export const deleteFile = async (fileKey: string): Promise<void> => {
  try {
    await Storage.remove(fileKey, { level: 'public' });
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('Failed to delete file');
  }
};

/**
 * Gets a publicly accessible URL for a file.
 * 
 * @param fileKey The key of the file.
 * @returns The public URL of the file.
 */
export const getFileUrl = async (fileKey: string): Promise<string> => {
  try {
    const url = await Storage.get(fileKey, { level: 'public' });
    // The URL might have query parameters for authentication, remove them for a clean public URL
    return url.split('?')[0];
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw new Error('Failed to get file URL');
  }
};
