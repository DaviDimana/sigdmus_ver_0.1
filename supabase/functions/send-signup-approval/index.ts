
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SignupRequest {
  nome: string;
  email: string;
  instituicao: string;
  setor: string;
  funcao: string;
  instrumento?: string;
  telefone: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

    const requestData: SignupRequest = await req.json();
    console.log('Received signup request:', requestData);

    // Salvar solicitação no banco
    const { data: solicitacao, error: dbError } = await supabase
      .from('solicitacoes_cadastro')
      .insert({
        nome: requestData.nome,
        email: requestData.email,
        instituicao: requestData.instituicao,
        setor: requestData.setor,
        funcao: requestData.funcao,
        instrumento: requestData.instrumento || null,
        telefone: requestData.telefone,
        status: 'pendente'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    // Preparar email de notificação
    const emailBody = `
      <h2>Nova Solicitação de Cadastro - Sistema Musical</h2>
      <p><strong>Nome:</strong> ${requestData.nome}</p>
      <p><strong>Email:</strong> ${requestData.email}</p>
      <p><strong>Instituição:</strong> ${requestData.instituicao}</p>
      <p><strong>Setor:</strong> ${requestData.setor}</p>
      <p><strong>Função:</strong> ${requestData.funcao}</p>
      ${requestData.instrumento ? `<p><strong>Instrumento:</strong> ${requestData.instrumento}</p>` : ''}
      <p><strong>Telefone:</strong> ${requestData.telefone}</p>
      <hr>
      <p>Para aprovar ou rejeitar esta solicitação, acesse o painel de administração do sistema.</p>
      <p>ID da solicitação: ${solicitacao.id}</p>
    `;

    // Enviar email real usando Resend
    console.log('Sending email notification to: davidimana123@gmail.com');
    
    const emailResult = await resend.emails.send({
      from: 'Sistema Musical <onboarding@resend.dev>',
      to: ['davidimana123@gmail.com'],
      subject: `Nova Solicitação de Cadastro - ${requestData.nome}`,
      html: emailBody,
    });

    if (emailResult.error) {
      console.error('Email sending error:', emailResult.error);
      throw new Error(`Erro ao enviar email: ${emailResult.error}`);
    }

    console.log('Email sent successfully:', emailResult.data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Solicitação enviada com sucesso',
        solicitacaoId: solicitacao.id 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in send-signup-approval function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
