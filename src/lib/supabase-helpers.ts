import { supabase } from './supabase';
import { toast } from '@/hooks/use-toast';

export const checkSupabaseConnection = async () => {
  try {
    console.log('Tentando conectar ao Supabase...');
    const { error } = await supabase.from('_test_connection').select('*').limit(1);
    
    if (error) {
      console.error('Erro na conexão com Supabase:', error);
      
      // Mensagem mais específica baseada no tipo de erro
      let errorMessage = "Erro de conexão com Supabase. ";
      if (error.message.includes('Failed to fetch')) {
        errorMessage += "Verifique se você está conectado à internet e se o projeto Supabase está acessível.";
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
      description: "Não foi possível conectar ao Supabase. Verifique suas credenciais e conexão com a internet.",
      variant: "destructive",
    });
    return false;
  }
};

export const checkBucketExists = async (bucketName: string) => {
  try {
    console.log(`Verificando bucket ${bucketName}...`);
    const { data: bucket, error } = await supabase
      .storage
      .getBucket(bucketName);

    if (error) {
      console.error(`Erro ao verificar bucket ${bucketName}:`, error);
      toast({
        title: "Erro no Bucket",
        description: `Não foi possível acessar o bucket ${bucketName}. Verifique suas credenciais e permissões.`,
        variant: "destructive",
      });
      return false;
    }

    if (!bucket) {
      console.log(`Bucket ${bucketName} não encontrado`);
      toast({
        title: "Bucket não encontrado",
        description: `O bucket ${bucketName} não existe. Por favor, crie-o no painel do Supabase.`,
        variant: "destructive",
      });
      return false;
    }

    console.log(`Bucket ${bucketName} encontrado e acessível`);
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