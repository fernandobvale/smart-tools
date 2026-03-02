-- Remove overly permissive public SELECT policy on teacher_applications
DROP POLICY IF EXISTS "Enable read access for all users" ON public.teacher_applications;

-- Create restricted SELECT policy: only authenticated users can view
CREATE POLICY "Authenticated users can view teacher applications"
ON public.teacher_applications
FOR SELECT
TO authenticated
USING (true);