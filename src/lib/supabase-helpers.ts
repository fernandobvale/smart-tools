import { supabase } from './supabase';
import { toast } from '@/hooks/use-toast';

export const checkSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from('_test_connection').select('*').limit(1);
    
    if (error) {
      console.error('Erro na conexão com Supabase:', error);
      toast({
        title: "Erro de Conexão",
        description: "Não foi possível conectar ao Supabase. Verifique se você está conectado à internet e se o serviço está disponível.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  } catch (error) {
    console.error('Erro ao tentar conectar com Supabase:', error);
    toast({
      title: "Erro de Conexão",
      description: "Erro ao tentar conectar com Supabase. Verifique sua conexão com a internet.",
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
        description: "Não foi possível acessar o bucket de armazenamento. Verifique se você tem as permissões necessárias.",
        variant: "destructive",
      });
      return false;
    }

    if (!bucket) {
      toast({
        title: "Bucket não encontrado",
        description: `O bucket ${bucketName} não existe. Por favor, crie-o no painel do Supabase.`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Erro ao verificar bucket ${bucketName}:`, error);
    toast({
      title: "Erro no Bucket",
      description: "Erro ao verificar o bucket de armazenamento. Verifique sua conexão.",
      variant: "destructive",
    });
    return false;
  }
};