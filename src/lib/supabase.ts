import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jxhgbhxzqmxcyqunwjkk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4aGdiaHh6cW14Y3lxdW53amtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc0OTY0NDAsImV4cCI6MjAyMzA3MjQ0MH0.7PXHM0tWsHXQ3oGXqrQXLwzONYz-2Rq_QjYVhJqFvUE';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('_test_connection').select('*').limit(1);
    if (error) {
      console.error('Erro na conexão com Supabase:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Erro ao tentar conectar com Supabase:', error);
    return false;
  }
};

export const checkBucketExists = async (bucketName: string) => {
  try {
    const { data: bucket, error } = await supabase
      .storage
      .getBucket(bucketName);

    if (error) {
      console.error(`Erro ao verificar bucket ${bucketName}:`, error);
      return false;
    }

    return !!bucket;
  } catch (error) {
    console.error(`Erro ao verificar bucket ${bucketName}:`, error);
    return false;
  }
};