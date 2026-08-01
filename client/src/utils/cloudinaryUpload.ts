/**
 * Reusable utility for uploading files directly to Cloudinary via backend API
 */

export interface CloudinaryUploadResponse {
  url: string;
  secure_url: string;
  public_id: string;
  format?: string;
  resource_type?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

/**
 * Upload a File object or DataURL string to Cloudinary.
 * If input is already an HTTP/HTTPS URL, returns it immediately.
 */
export const uploadToCloudinary = async (
  fileOrDataUrl: File | string,
  folder = 'bihar_darshan'
): Promise<CloudinaryUploadResponse> => {
  if (typeof fileOrDataUrl === 'string') {
    // If it's already a hosted URL (not a base64 DataURL), return as is
    if (fileOrDataUrl.startsWith('http://') || fileOrDataUrl.startsWith('https://')) {
      return {
        url: fileOrDataUrl,
        secure_url: fileOrDataUrl,
        public_id: '',
      };
    }

    // If it's a base64 DataURL, send via JSON payload
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: fileOrDataUrl,
        folder,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to upload image to Cloudinary');
    }

    const json = await response.json();
    return json.data;
  }

  // If it's a File object, send via FormData
  const formData = new FormData();
  formData.append('file', fileOrDataUrl);
  formData.append('folder', folder);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to upload file to Cloudinary');
  }

  const json = await response.json();
  return json.data;
};

/**
 * Delete a media file from Cloudinary by its public_id
 */
export const deleteFromCloudinary = async (publicId: string, resourceType = 'image'): Promise<void> => {
  if (!publicId) return;

  try {
    await fetch(`${API_BASE_URL}/upload`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_id: publicId,
        resource_type: resourceType,
      }),
    });
  } catch (error) {
    console.error(`Error requesting Cloudinary deletion for ${publicId}:`, error);
  }
};
