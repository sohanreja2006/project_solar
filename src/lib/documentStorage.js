import { supabase } from './supabase';

export const DOCUMENT_TYPES = [
  {
    key: 'caste_cert',
    label: 'Caste Certificate',
    bengali: 'জাতি শংসাপত্র',
    description: 'SC / ST / OBC certificate if applicable',
    required: false,
    icon: '📑',
    accept: 'image/*,.pdf',
  },
  {
    key: 'electricity_bill',
    label: 'Electricity Bill',
    bengali: 'বিদ্যুৎ বিল',
    description: 'Latest WBSEDCL / electricity consumer bill',
    required: true,
    icon: '⚡',
    accept: 'image/*,.pdf',
  },
  {
    key: 'bank_passbook',
    label: 'Passbook / Canceled Cheque',
    bengali: 'ব্যাংক পাসবই / বাতিল চেক',
    description: 'First page of passbook showing A/C & IFSC, or canceled cheque',
    required: true,
    icon: '🏦',
    accept: 'image/*,.pdf',
  },
  {
    key: 'aadhaar_card',
    label: 'Aadhaar Card',
    bengali: 'আধার কার্ড',
    description: 'Front & back or e-Aadhaar of applicant',
    required: true,
    icon: '🪪',
    accept: 'image/*,.pdf',
  },
  {
    key: 'pan_card',
    label: 'PAN Card',
    bengali: 'প্যান কার্ড',
    description: 'PAN card photo or PDF of applicant',
    required: true,
    icon: '💳',
    accept: 'image/*,.pdf',
  },
  {
    key: 'applicant_gps_photo',
    label: 'Applicant GPS Photo',
    bengali: 'আবেদনকারীর জিপিএস ছবি',
    description: 'Photograph of applicant at roof/premises with GPS tag or selfie',
    required: true,
    icon: '📸',
    accept: 'image/*',
  },
  {
    key: 'customer_sign',
    label: 'Customer Signature',
    bengali: 'গ্রাহকের স্বাক্ষর',
    description: 'Photo or scan of customer signature on plain paper',
    required: true,
    icon: '✍️',
    accept: 'image/*',
  },
];

export const STORAGE_BUCKET = 'documents';

/**
 * High-performance browser-side image compression using HTML5 Canvas.
 * Compresses heavy 4-10MB smartphone photos down to ~150-250KB before upload,
 * keeping crisp legibility while saving 95%+ of Supabase free storage!
 */
export async function compressImage(file, maxDimension = 1400, quality = 0.72) {
  // If not an image (e.g. PDF), return original file
  if (!file || !file.type.startsWith('image/')) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        let { width, height } = img;

        // Scale proportionally if either dimension exceeds maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            // Create a new File from compressed Blob
            const compressedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, '.jpg'),
              { type: 'image/jpeg', lastModified: Date.now() }
            );
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => resolve(file);
    };

    reader.onerror = () => resolve(file);
  });
}

/**
 * Upload an application document to Supabase Storage bucket.
 * Returns the public URL of the uploaded document.
 */
export async function uploadApplicationDocument(userId, docKey, file, onProgress) {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  if (onProgress) onProgress('Compressing...');
  const preparedFile = await compressImage(file);

  const cleanUserId = userId ? String(userId).replace(/[^a-zA-Z0-9_-]/g, '') : 'applicant';
  const fileExt = preparedFile.name.split('.').pop() || 'jpg';
  const fileName = `${Date.now()}_${docKey}_${Math.random().toString(36).slice(2, 8)}.${fileExt}`;
  const filePath = `${cleanUserId}/${fileName}`;

  if (onProgress) onProgress('Uploading...');

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, preparedFile, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error(`Upload failed for ${docKey}:`, error);
    throw error;
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(data.path);

  return urlData?.publicUrl || null;
}
