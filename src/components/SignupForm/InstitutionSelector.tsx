
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface InstitutionSelectorProps {
  value: string;
  onChange: (value: string) => void;
  instituicoes: Array<{ id: string; nome: string }>;
  onInstitutionAdded: () => void;
}

const InstitutionSelector: React.FC<InstitutionSelectorProps> = ({ 
  value, 
  onChange, 
  instituicoes, 
  onInstitutionAdded 
}) => {
  const [newInstituicao, setNewInstituicao] = useState('');
  const { toast } = useToast();

  const handleAddInstituicao = async () => {
    if (!newInstituicao.trim()) return;

    try {
      const { data, error } = await supabase
        .from('instituicoes')
        .insert({ nome: newInstituicao.trim() })
        .select()
        .single();

      if (error) throw error;
      
      onInstitutionAdded();
      onChange(data.nome);
      setNewInstituicao('');
      
      toast({
        title: "Instituição adicionada",
        description: "Nova instituição criada com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message === 'duplicate key value violates unique constraint "instituicoes_nome_key"' 
          ? "Esta instituição já existe." 
          : "Erro ao adicionar instituição.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="instituicao">Instituição *</Label>
      <div className="flex gap-2">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Selecione uma instituição" />
          </SelectTrigger>
          <SelectContent>
            {instituicoes.map((inst) => (
              <SelectItem key={inst.id} value={inst.nome}>
                {inst.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-1">
          <Input
            placeholder="Nova instituição"
            value={newInstituicao}
            onChange={(e) => setNewInstituicao(e.target.value)}
            className="w-40"
          />
          <Button
            type="button"
            onClick={handleAddInstituicao}
            disabled={!newInstituicao.trim()}
            size="sm"
            className="px-3"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InstitutionSelector;
