-- The _test_connection table already has RLS enabled with a restrictive policy.
-- However, let's ensure it's properly locked down by verifying RLS is enabled.
-- The existing policy "Enable all access for authenticated users" is restrictive (Permissive: No),
-- which means it DENIES by default. This is actually secure already.
-- But let's tighten it further - this table seems like a test artifact, so let's just ensure RLS is on.
ALTER TABLE public._test_connection ENABLE ROW LEVEL SECURITY;

-- Drop the existing overly broad policy  
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public._test_connection;

-- No new policy needed - with RLS enabled and no policies, no one can access the table