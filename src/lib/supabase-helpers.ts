import { supabase } from './supabase';
import { toast } from '@/hooks/use-toast';

export const checkSupabaseConnection = async () => {
  try {
    console.log('Tentando conectar ao Supabase...');
    const { data, error } = await supabase.from('_test_connection').select('count').single();
    
    if (error) {
      console.error('Erro na conexão com Supabase:', error);
      
      let errorMessage = "Erro de conexão com Supabase. ";
      if (error.message.includes('Failed to fetch')) {
        errorMessage += "Verifique sua conexão com a internet.";
      } else {
        errorMessage += error.message;
      }
      
      toast({
        title: "Erro de Conexão",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
    
    console.log('Conexão com Supabase estabelecida com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao tentar conectar com Supabase:', error);
    
    toast({
      title: "Erro de Conexão",
      description: "Não foi possível conectar ao Supabase. Verifique suas credenciais.",
      variant: "destructive",
    });
    return false;
  }
};

export const checkBucketExists = async (bucketName: string) => {
  try {
    console.log(`Verificando bucket ${bucketName}...`);
    const { data: buckets, error } = await supabase
      .storage
      .listBuckets();

    if (error) {
      console.error(`Erro ao verificar bucket ${bucketName}:`, error);
      toast({
        title: "Erro no Bucket",
        description: `Não foi possível acessar o bucket ${bucketName}. Verifique suas permissões.`,
        variant: "destructive",
      });
      return false;
    }

    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    if (!bucketExists) {
      console.log(`Bucket ${bucketName} não encontrado. Tentando criar...`);
      const { error: createError } = await supabase
        .storage
        .createBucket(bucketName, {
          public: true,
          fileSizeLimit: 52428800 // 50MB limit
        });

      if (createError) {
        console.error(`Erro ao criar bucket ${bucketName}:`, createError);
        toast({
          title: "Erro na Criação do Bucket",
          description: `Não foi possível criar o bucket ${bucketName}. ${createError.message}`,
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Bucket Criado",
        description: `O bucket ${bucketName} foi criado com sucesso.`,
      });
    }

    console.log(`Bucket ${bucketName} encontrado e acessível`);
    return true;
  } catch (error) {
    console.error(`Erro ao verificar bucket ${bucketName}:`, error);
    toast({
      title: "Erro no Bucket",
      description: "Erro ao verificar o bucket de armazenamento.",
      variant: "destructive",
    });
    return false;
  }
};