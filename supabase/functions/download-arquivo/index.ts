import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Isso é específico para a função de preflight do CORS.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { filePath } = await req.json()
    if (!filePath) {
      throw new Error('O caminho do arquivo (filePath) é obrigatório.')
    }

    // Cria um cliente Supabase COM a autenticação do usuário que fez a chamada.
    // Isso é crucial para que a RLS funcione.
    const userSupabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Verifica na tabela 'arquivos' se o usuário atual tem permissão de SELECT
    // para a linha correspondente a este arquivo. A RLS entra em ação aqui.
    const { data: fileData, error: fileError } = await userSupabaseClient
      .from('arquivos')
      .select('id')
      .eq('path', filePath)
      .single()

    if (fileError || !fileData) {
      console.error('Erro de permissão ou arquivo não encontrado:', fileError)
      return new Response(JSON.stringify({ error: 'Acesso negado ou arquivo não encontrado.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      })
    }

    // Se o usuário tem permissão, agora usamos o cliente de SERVIÇO (admin)
    // para baixar o arquivo do Storage, ignorando a RLS para o download em si.
    const serviceSupabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: downloadData, error: downloadError } = await serviceSupabaseClient.storage
      .from('partituras') // O nome do seu bucket de storage
      .download(filePath)

    if (downloadError) {
      throw downloadError
    }

    // Retorna o arquivo para o cliente.
    return new Response(downloadData, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filePath.split('/').pop()}"`,
      },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
}) 