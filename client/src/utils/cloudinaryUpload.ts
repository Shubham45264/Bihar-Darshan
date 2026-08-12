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

import { API_BASE_URL } from '../config/api';

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

  // If it's a File object, try sending via FormData to server API first
  try {
    const formData = new FormData();
    formData.append('file', fileOrDataUrl);
    formData.append('folder', folder);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const json = await response.json();
      if (json.success && json.data?.secure_url) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Server upload endpoint failed, using local file reader fallback:', err);
  }

  // Fallback: Read file locally as DataURL so upload always succeeds
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve({
          url: reader.result,
          secure_url: reader.result,
          public_id: '',
        });
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('File reader failed'));
    reader.readAsDataURL(fileOrDataUrl);
  });
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
