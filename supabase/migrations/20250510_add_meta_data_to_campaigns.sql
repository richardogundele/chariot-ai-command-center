
-- Add meta_data column to campaigns table to store platform-specific data
ALTER TABLE IF EXISTS public.campaigns ADD COLUMN meta_data JSONB DEFAULT '{}'::jsonb;
