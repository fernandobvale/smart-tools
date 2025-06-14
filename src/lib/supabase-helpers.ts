import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Create a special admin client for storage operations
const adminSupabase = createClient(
  'https://bgznszxombwvwhufowpm.supabase.co',
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Função para verificar conexão com Supabase
const checkSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from('_test_connection').select('count').single();
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao conectar com Supabase:', error);
    toast({
      title: "Erro de Conexão",
      description: "Não foi possível conectar ao Supabase.",
      variant: "destructive",
    });
    return false;
  }
};

// Função para verificar/criar bucket
const checkBucketExists = async (bucketName: string) => {
  try {
    const { data: buckets, error } = await adminSupabase.storage.listBuckets();
    
    if (error) {
      console.error('Erro ao listar buckets:', error);
      throw error;
    }

    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      const { error: createError } = await adminSupabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 52428800
      });

      if (createError) throw createError;
      
      toast({
        title: "Bucket Criado",
        description: `O bucket ${bucketName} foi criado com sucesso.`,
      });
    }

    return true;
  } catch (error) {
    console.error('Erro ao verificar/criar bucket:', error);
    toast({
      title: "Erro no Bucket",
      description: "Erro ao verificar o bucket de armazenamento.",
      variant: "destructive",
    });
    return false;
  }
};

export { checkSupabaseConnection, checkBucketExists };
