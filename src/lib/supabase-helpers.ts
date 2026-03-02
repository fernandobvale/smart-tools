import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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

// Função para verificar bucket via Edge Function
const checkBucketExists = async (bucketName: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('manage-storage-bucket', {
      body: { bucketName },
    });

    if (error) throw error;

    if (data?.created) {
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
