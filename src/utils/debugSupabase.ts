import { supabase } from '@/integrations/supabase/client';

export const debugSupabaseStorage = async () => {
  console.log('=== DEBUG SUPABASE STORAGE ===');
  
  try {
    // 1. Verificar buckets disponíveis
    console.log('1. Verificando buckets...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Erro ao listar buckets:', bucketsError);
    } else {
      console.log('Buckets encontrados:', buckets?.map(b => ({ name: b.name, public: b.public })));
    }
    
    // 2. Verificar se o bucket programas-concerto existe
    console.log('\n2. Verificando bucket programas-concerto...');
    const bucketExists = buckets?.some(b => b.name === 'programas-concerto');
    console.log('Bucket programas-concerto existe:', bucketExists);
    
    if (bucketExists) {
      // 3. Listar arquivos no bucket
      console.log('\n3. Listando arquivos no bucket...');
      const { data: files, error: filesError } = await supabase.storage
        .from('programas-concerto')
        .list();
      
      if (filesError) {
        console.error('Erro ao listar arquivos:', filesError);
      } else {
        console.log('Arquivos no bucket:', files);
      }
      
      // 4. Verificar policies do bucket
      console.log('\n4. Verificando policies...');
      // Nota: Policies só podem ser verificadas via SQL ou painel do Supabase
      console.log('Para verificar policies, vá ao painel do Supabase > Storage > Buckets > programas-concerto > Policies');
    }
    
    // 5. Verificar autenticação
    console.log('\n5. Verificando autenticação...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Erro de autenticação:', authError);
    } else {
      console.log('Usuário autenticado:', user?.id);
      console.log('Email:', user?.email);
    }
    
  } catch (error) {
    console.error('Erro geral no debug:', error);
  }
  
  console.log('=== FIM DEBUG ===');
};

// Função para testar upload de arquivo pequeno
export const testUpload = async () => {
  console.log('=== TESTE DE UPLOAD ===');
  
  try {
    // Criar um arquivo de teste pequeno
    const testContent = 'Teste de upload';
    const testFile = new File([testContent], 'teste.txt', { type: 'text/plain' });
    
    console.log('Arquivo de teste criado:', testFile.name, testFile.size, 'bytes');
    
    const { data, error } = await supabase.storage
      .from('programas-concerto')
      .upload('teste/teste.txt', testFile, {
        upsert: true,
        contentType: 'text/plain'
      });
    
    if (error) {
      console.error('Erro no teste de upload:', error);
      return false;
    }
    
    console.log('Upload de teste bem-sucedido:', data);
    
    // Limpar arquivo de teste
    const { error: deleteError } = await supabase.storage
      .from('programas-concerto')
      .remove(['teste/teste.txt']);
    
    if (deleteError) {
      console.error('Erro ao deletar arquivo de teste:', deleteError);
    } else {
      console.log('Arquivo de teste removido');
    }
    
    return true;
  } catch (error) {
    console.error('Erro no teste de upload:', error);
    return false;
  }
}; 