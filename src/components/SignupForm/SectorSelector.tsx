
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SectorSelectorProps {
  value: string;
  onChange: (value: string) => void;
  setores: Array<{ id: string; nome: string }>;
  onSectorAdded: () => void;
}

const SectorSelector: React.FC<SectorSelectorProps> = ({ 
  value, 
  onChange, 
  setores, 
  onSectorAdded 
}) => {
  const [newSetor, setNewSetor] = useState('');
  const { toast } = useToast();

  const handleAddSetor = async () => {
    if (!newSetor.trim()) return;

    try {
      const { data, error } = await supabase
        .from('setores')
        .insert({ nome: newSetor.trim() })
        .select()
        .single();

      if (error) throw error;
      
      onSectorAdded();
      onChange(data.nome);
      setNewSetor('');
      
      toast({
        title: "Setor adicionado",
        description: "Novo setor criado com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro", 
        description: error.message === 'duplicate key value violates unique constraint "setores_nome_key"' 
          ? "Este setor já existe." 
          : "Erro ao adicionar setor.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="setor">Setor *</Label>
      <div className="flex gap-2">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Selecione um setor" />
          </SelectTrigger>
          <SelectContent>
            {setores.map((setor) => (
              <SelectItem key={setor.id} value={setor.nome}>
                {setor.nome.replace(/_/g, ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-1">
          <Input
            placeholder="Novo setor"
            value={newSetor}
            onChange={(e) => setNewSetor(e.target.value)}
            className="w-40"
          />
          <Button
            type="button"
            onClick={handleAddSetor}
            disabled={!newSetor.trim()}
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

export default SectorSelector;
