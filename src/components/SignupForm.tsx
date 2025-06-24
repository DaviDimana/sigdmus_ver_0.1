import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import InstitutionSelector from './SignupForm/InstitutionSelector';
import SectorSelector from './SignupForm/SectorSelector';
import FunctionInstrumentFields from './SignupForm/FunctionInstrumentFields';
import PersonalInfoFields from './SignupForm/PersonalInfoFields';
import ApprovalNotice from './SignupForm/ApprovalNotice';

interface SignupFormProps {
  onBack: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    instituicao: '',
    setor: '',
    funcao: '',
    instrumento: ''
  });
  const [loading, setLoading] = useState(false);
  const [instituicoes, setInstituicoes] = useState<any[]>([]);
  const [setores, setSetores] = useState<any[]>([]);
  const { signUp } = useAuth();

  const fetchInitialData = async () => {
    const { data: instituicoesData, error: instituicoesError } = await supabase.from('instituicoes').select('*');
    if (instituicoesError) console.error('Error fetching instituicoes', instituicoesError);
    else setInstituicoes(instituicoesData || []);
    
    const { data: setoresData, error: setoresError } = await supabase.from('setores').select('*');
    if (setoresError) console.error('Error fetching setores', setoresError);
    else setSetores(setoresData || []);
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem');
      setLoading(false);
      return;
    }

    try {
      await signUp(formData.email, formData.password, {
        name: formData.name,
        instituicao: formData.instituicao,
        setor: formData.setor,
        funcao: formData.funcao,
        instrumento: formData.instrumento
      });
      toast.success('Cadastro realizado! Verifique sua caixa de entrada para confirmar seu e-mail.');
      onBack();
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error.message || 'Erro ao realizar cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm animate-scale-in w-full">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-gray-900">Criar Nova Conta</CardTitle>
        <CardDescription className="text-gray-600 text-base">
          Preencha os dados para solicitar seu cadastro
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <PersonalInfoFields formData={formData} setFormData={setFormData} />
          
          <InstitutionSelector 
            value={formData.instituicao}
            onChange={(value) => setFormData(prev => ({ ...prev, instituicao: value }))}
            instituicoes={instituicoes}
            onInstitutionAdded={fetchInitialData}
          />
          
          <SectorSelector
            value={formData.setor}
            onChange={(value) => setFormData(prev => ({ ...prev, setor: value }))}
            setores={setores}
            onSectorAdded={fetchInitialData}
          />

          <FunctionInstrumentFields 
            formData={formData}
            setFormData={setFormData}
          />

          <ApprovalNotice />

          <Button 
            type="submit" 
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 group" 
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processando...</span>
              </div>
            ) : (
              <span>Solicitar Cadastro</span>
            )}
          </Button>
        </form>

        <Button
          variant="outline"
          onClick={onBack}
          className="w-full h-12 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
        >
          <div className="flex items-center justify-center space-x-2">
            <ArrowLeft className="h-4 w-4 text-gray-500 group-hover:text-blue-600" />
            <span className="font-medium">Voltar para Login</span>
          </div>
        </Button>
      </CardContent>
    </Card>
  );
};

export default SignupForm;
