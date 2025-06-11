
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle } from 'lucide-react';

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

  const funcoes = [
    { value: 'MUSICO', label: 'Músico' },
    { value: 'ESTUDANTE', label: 'Estudante' },
    { value: 'PROFESSOR', label: 'Professor' },
    { value: 'MAESTRO', label: 'Maestro' },
    { value: 'ARQUIVISTA', label: 'Arquivista' },
    { value: 'GERENTE', label: 'Gerente' }
  ];

  const instrumentos = [
    { value: 'FLAUTA', label: 'Flauta' },
    { value: 'OBOÉ', label: 'Oboé' },
    { value: 'CLARINETE', label: 'Clarinete' },
    { value: 'FAGOTE', label: 'Fagote' },
    { value: 'TROMPA', label: 'Trompa' },
    { value: 'TROMPETE', label: 'Trompete' },
    { value: 'TROMBONE', label: 'Trombone' },
    { value: 'TUBA', label: 'Tuba' },
    { value: 'VIOLINO_I', label: 'Violino I' },
    { value: 'VIOLINO_II', label: 'Violino II' },
    { value: 'VIOLA', label: 'Viola' },
    { value: 'VIOLONCELO', label: 'Violoncelo' },
    { value: 'CONTRABAIXO', label: 'Contrabaixo' },
    { value: 'HARPA', label: 'Harpa' },
    { value: 'PIANO', label: 'Piano' },
    { value: 'PERCUSSAO', label: 'Percussão' },
    { value: 'SOPRANO', label: 'Soprano' },
    { value: 'CONTRALTO', label: 'Contralto' },
    { value: 'TENOR', label: 'Tenor' },
    { value: 'BAIXO', label: 'Baixo' }
  ];

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

  const handleAddInstituicao = async (novaInstituicao: string) => {
    try {
      const { data, error } = await supabase
        .from('instituicoes')
        .insert({ nome: novaInstituicao })
        .select()
        .single();

      if (error) throw error;
      
      await fetchInstituicoes();
      setFormData(prev => ({ ...prev, instituicao: data.nome }));
      
      toast({
        title: "Instituição adicionada",
        description: "Nova instituição criada com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar instituição.",
        variant: "destructive",
      });
    }
  };

  const handleAddSetor = async (novoSetor: string) => {
    try {
      const { data, error } = await supabase
        .from('setores')
        .insert({ nome: novoSetor })
        .select()
        .single();

      if (error) throw error;
      
      await fetchSetores();
      setFormData(prev => ({ ...prev, setor: data.nome }));
      
      toast({
        title: "Setor adicionado",
        description: "Novo setor criado com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro", 
        description: "Erro ao adicionar setor.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-signup-approval', {
        body: formData
      });

      if (error) throw error;

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
        description: "Erro ao enviar solicitação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const needsInstrument = ['MUSICO', 'ESTUDANTE', 'PROFESSOR'].includes(formData.funcao);
  const cannotHaveInstrument = ['MAESTRO', 'ARQUIVISTA', 'GERENTE'].includes(formData.funcao);

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instituicao">Instituição *</Label>
            <div className="flex gap-2">
              <Select
                value={formData.instituicao}
                onValueChange={(value) => setFormData(prev => ({ ...prev, instituicao: value }))}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Selecione ou digite nova instituição" />
                </SelectTrigger>
                <SelectContent>
                  {instituicoes.map((inst) => (
                    <SelectItem key={inst.id} value={inst.nome}>
                      {inst.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Nova instituição"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const value = e.currentTarget.value.trim();
                    if (value) {
                      handleAddInstituicao(value);
                      e.currentTarget.value = '';
                    }
                  }
                }}
                className="w-40"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="setor">Setor *</Label>
            <div className="flex gap-2">
              <Select
                value={formData.setor}
                onValueChange={(value) => setFormData(prev => ({ ...prev, setor: value }))}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Selecione ou digite novo setor" />
                </SelectTrigger>
                <SelectContent>
                  {setores.map((setor) => (
                    <SelectItem key={setor.id} value={setor.nome}>
                      {setor.nome.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Novo setor"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const value = e.currentTarget.value.trim();
                    if (value) {
                      handleAddSetor(value);
                      e.currentTarget.value = '';
                    }
                  }
                }}
                className="w-40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="funcao">Função *</Label>
              <Select
                value={formData.funcao}
                onValueChange={(value) => {
                  setFormData(prev => ({ 
                    ...prev, 
                    funcao: value,
                    instrumento: cannotHaveInstrument ? '' : prev.instrumento
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione sua função" />
                </SelectTrigger>
                <SelectContent>
                  {funcoes.map((funcao) => (
                    <SelectItem key={funcao.value} value={funcao.value}>
                      {funcao.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instrumento">Instrumento</Label>
              {cannotHaveInstrument ? (
                <Input value="—" disabled className="bg-gray-100" />
              ) : (
                <Select
                  value={formData.instrumento}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, instrumento: value }))}
                  disabled={!needsInstrument}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={needsInstrument ? "Selecione seu instrumento" : "—"} />
                  </SelectTrigger>
                  <SelectContent>
                    {instrumentos.map((inst) => (
                      <SelectItem key={inst.value} value={inst.value}>
                        {inst.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone *</Label>
            <Input
              id="telefone"
              type="tel"
              value={formData.telefone}
              onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
              placeholder="(xx) xxxxx-xxxx"
              required
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">Processo de Aprovação:</p>
                <p>
                  Sua solicitação será enviada para análise. Você receberá um email de confirmação 
                  quando sua conta for aprovada pelo administrador.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onBack}>
              Voltar
            </Button>
            <Button type="submit" disabled={loading || !formData.nome || !formData.email || !formData.instituicao || !formData.setor || !formData.funcao || !formData.telefone || (needsInstrument && !formData.instrumento)}>
              {loading ? 'Enviando...' : 'Enviar Solicitação'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignupForm;
