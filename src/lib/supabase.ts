import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jxhgbhxzqmxcyqunwjkk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4aGdiaHh6cW14Y3lxdW53amtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc0OTY0NDAsImV4cCI6MjAyMzA3MjQ0MH0.7PXHM0tWsHXQ3oGXqrQXLwzONYz-2Rq_QjYVhJqFvUE';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
});