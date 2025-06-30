
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'https://bgznszxombwvwhufowpm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnem5zenhvbWJ3dndodWZvd3BtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0NDMwNzYsImV4cCI6MjA0NzAxOTA3Nn0.1iVBmqX8CxRArC5wtNBhaLlkSp9-zJMSlK6R_Tsnj0M';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Check your configuration.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
