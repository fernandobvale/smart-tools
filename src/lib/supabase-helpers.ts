import { supabase } from './supabase';
import { toast } from '@/hooks/use-toast';

export const checkSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from('_test_connection').select('*').limit(1);
    
    if (error) {
      console.error('Erro na conexão com Supabase:', error);
      toast({
        title: "Erro de Conexão",
        description: `Não foi possível conectar ao Supabase: ${error.message}. Por favor, verifique sua conexão e tente novamente.`,
        variant: "destructive",
      });
      return false;
    }
    return true;
  } catch (error) {
    console.error('Erro ao tentar conectar com Supabase:', error);
    toast({
      title: "Erro de Conexão",
      description: "Erro ao tentar conectar com Supabase. Por favor, verifique sua conexão e tente novamente.",
      variant: "destructive",
    });
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
      toast({
        title: "Erro no Bucket",
        description: `Não foi possível acessar o bucket ${bucketName}. Verifique se ele existe e se você tem as permissões necessárias.`,
        variant: "destructive",
      });
      return false;
    }

    return !!bucket;
  } catch (error) {
    console.error(`Erro ao verificar bucket ${bucketName}:`, error);
    toast({
      title: "Erro no Bucket",
      description: `Erro ao verificar o bucket ${bucketName}. Verifique sua conexão e permissões.`,
      variant: "destructive",
    });
    return false;
  }
};