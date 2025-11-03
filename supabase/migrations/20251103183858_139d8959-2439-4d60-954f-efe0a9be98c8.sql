-- Create table for course images
CREATE TABLE IF NOT EXISTS public.course_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_name TEXT NOT NULL,
  prompt_pt TEXT NOT NULL,
  prompt_en TEXT NOT NULL,
  image_data TEXT,
  image_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.course_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own images"
  ON public.course_images
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own images"
  ON public.course_images
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own images"
  ON public.course_images
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own images"
  ON public.course_images
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_course_images_updated_at
  BEFORE UPDATE ON public.course_images
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_course_images_user_id ON public.course_images(user_id);
CREATE INDEX idx_course_images_created_at ON public.course_images(created_at DESC);