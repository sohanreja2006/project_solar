-- ============================================================================
-- PM SURYA GHAR APPLICANT DOCUMENTS MIGRATION
-- Run this in your Supabase Dashboard -> SQL Editor
-- ============================================================================

-- 1. Add 7 document URL columns to solar_applications table
ALTER TABLE public.solar_applications
  ADD COLUMN IF NOT EXISTS caste_cert_url TEXT,
  ADD COLUMN IF NOT EXISTS electricity_bill_url TEXT,
  ADD COLUMN IF NOT EXISTS bank_passbook_url TEXT,
  ADD COLUMN IF NOT EXISTS aadhaar_card_url TEXT,
  ADD COLUMN IF NOT EXISTS pan_card_url TEXT,
  ADD COLUMN IF NOT EXISTS applicant_gps_photo_url TEXT,
  ADD COLUMN IF NOT EXISTS customer_sign_url TEXT;

-- 2. Ensure Storage Bucket 'documents' exists with Public Read access
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  true,
  10485760, -- 10MB per file
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE 
SET public = true,
    file_size_limit = 10485760;

-- 3. Storage Policies (Allow applicants to upload and view documents)
DROP POLICY IF EXISTS "Allow Public and Authenticated Uploads" ON storage.objects;
CREATE POLICY "Allow Public and Authenticated Uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'documents');

DROP POLICY IF EXISTS "Allow Public and Authenticated Reads" ON storage.objects;
CREATE POLICY "Allow Public and Authenticated Reads"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents');

DROP POLICY IF EXISTS "Allow Updates to Own Documents" ON storage.objects;
CREATE POLICY "Allow Updates to Own Documents"
ON storage.objects FOR UPDATE
USING (bucket_id = 'documents');
