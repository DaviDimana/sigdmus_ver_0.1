
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
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const handleAddSetor = async () => {
    if (!newSetor.trim()) return;

    setIsAdding(true);
    try {
      console.log('Tentando adicionar setor:', newSetor.trim());
      
      const { data, error } = await supabase
        .from('setores')
        .insert({ nome: newSetor.trim() })
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar setor:', error);
        
        // Check for duplicate error
        if (error.code === '23505') {
          toast({
            title: "Erro",
            description: "Este setor já existe.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro",
            description: error.message || "Erro ao adicionar setor.",
            variant: "destructive",
          });
        }
        return;
      }

      console.log('Setor adicionado:', data);
      
      onSectorAdded();
      onChange(newSetor.trim());
      setNewSetor('');
      
      toast({
        title: "Setor adicionado",
        description: "Novo setor criado com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro inesperado ao adicionar setor:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao adicionar setor.",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
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
            disabled={isAdding}
          />
          <Button
            type="button"
            onClick={handleAddSetor}
            disabled={!newSetor.trim() || isAdding}
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
