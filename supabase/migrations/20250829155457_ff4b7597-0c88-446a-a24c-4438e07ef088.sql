-- Create course_suggestions table
CREATE TABLE public.course_suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  suggestion_date DATE NOT NULL,
  suggested_course TEXT NOT NULL,
  school TEXT NOT NULL,
  attendant TEXT NOT NULL,
  observations TEXT,
  internet_searches TEXT NOT NULL,
  course_created BOOLEAN NOT NULL DEFAULT false,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.course_suggestions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own course suggestions" 
ON public.course_suggestions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own course suggestions" 
ON public.course_suggestions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own course suggestions" 
ON public.course_suggestions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own course suggestions" 
ON public.course_suggestions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_course_suggestions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_course_suggestions_updated_at
  BEFORE UPDATE ON public.course_suggestions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_course_suggestions_updated_at();