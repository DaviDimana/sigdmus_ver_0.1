
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import PersonalInfoFields from './SignupForm/PersonalInfoFields';
import InstitutionSelector from './SignupForm/InstitutionSelector';
import SectorSelector from './SignupForm/SectorSelector';
import FunctionInstrumentFields from './SignupForm/FunctionInstrumentFields';
import ApprovalNotice from './SignupForm/ApprovalNotice';

interface SignupFormProps {
  onBack: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    instituicao: '',
    setor: '',
    funcao: '',
    instrumento: '',
    telefone: ''
  });
  const [loading, setLoading] = useState(false);
  const [instituicoes, setInstituicoes] = useState<Array<{ id: string; nome: string }>>([]);
  const [setores, setSetores] = useState<Array<{ id: string; nome: string }>>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchInstituicoes();
    fetchSetores();
  }, []);

  const fetchInstituicoes = async () => {
    try {
      const { data, error } = await supabase
        .from('instituicoes')
        .select('id, nome')
        .order('nome');
      
      if (error) throw error;
      setInstituicoes(data || []);
    } catch (error) {
      console.error('Erro ao buscar instituições:', error);
    }
  };

  const fetchSetores = async () => {
    try {
      const { data, error } = await supabase
        .from('setores')
        .select('id, nome')
        .order('nome');
      
      if (error) throw error;
      setSetores(data || []);
    } catch (error) {
      console.error('Erro ao buscar setores:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Enviando dados:', formData);
      
      const insertData = {
        nome: formData.nome,
        email: formData.email,
        instituicao: formData.instituicao,
        setor: formData.setor,
        funcao: formData.funcao as any,
        telefone: formData.telefone,
        status: 'pendente',
        ...(formData.instrumento ? { instrumento: formData.instrumento as any } : {})
      };

      console.log('Dados para inserir:', insertData);

      const { data, error } = await supabase
        .from('solicitacoes_cadastro')
        .insert(insertData);

      if (error) {
        console.error('Erro detalhado:', error);
        throw error;
      }

      console.log('Sucesso:', data);

      toast({
        title: "Solicitação enviada!",
        description: "Sua solicitação de cadastro foi enviada para análise. Você receberá um email quando for aprovada.",
      });

      // Limpar formulário
      setFormData({
        nome: '',
        email: '',
        instituicao: '',
        setor: '',
        funcao: '',
        instrumento: '',
        telefone: ''
      });

      onBack();
    } catch (error: any) {
      console.error('Erro ao enviar solicitação:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao enviar solicitação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Verificar se todos os campos obrigatórios estão preenchidos
  const isFormValid = () => {
    const baseFields = formData.nome.trim() && 
                      formData.email.trim() && 
                      formData.instituicao.trim() && 
                      formData.setor.trim() && 
                      formData.funcao.trim() && 
                      formData.telefone.trim();
    
    // Se função requer instrumento, verificar se está preenchido
    const needsInstrument = ['MUSICO', 'ESTUDANTE', 'PROFESSOR'].includes(formData.funcao);
    const instrumentValid = !needsInstrument || formData.instrumento.trim();
    
    return baseFields && instrumentValid;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Criar Nova Conta</CardTitle>
        <CardDescription>
          Preencha todos os campos para solicitar o cadastro no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <PersonalInfoFields formData={formData} setFormData={setFormData} />

          <InstitutionSelector
            value={formData.instituicao}
            onChange={(value) => setFormData(prev => ({ ...prev, instituicao: value }))}
            instituicoes={instituicoes}
            onInstitutionAdded={fetchInstituicoes}
          />

          <SectorSelector
            value={formData.setor}
            onChange={(value) => setFormData(prev => ({ ...prev, setor: value }))}
            setores={setores}
            onSectorAdded={fetchSetores}
          />

          <FunctionInstrumentFields formData={formData} setFormData={setFormData} />

          <ApprovalNotice />

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onBack}>
              Voltar
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !isFormValid()}
            >
              {loading ? 'Enviando...' : 'Enviar Solicitação'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignupForm;
