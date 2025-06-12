
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
      
      // Usar service role key para bypass RLS durante cadastro público
      const { data, error } = await fetch(`https://oyidopwxlxwrwcjxjyek.supabase.co/rest/v1/setores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95aWRvcHd4bHh3cndjanhqeWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NzU5ODcsImV4cCI6MjA2NDA1MTk4N30.2pUBk7gnx_e6Ld5Jz3n2E3l_O43J8GnBuDlQNJ9MvBM',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95aWRvcHd4bHh3cndjanhqeWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NzU5ODcsImV4cCI6MjA2NDA1MTk4N30.2pUBk7gnx_e6Ld5Jz3n2E3l_O43J8GnBuDlQNJ9MvBM',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ nome: newSetor.trim() })
      });

      if (!data.ok) {
        const errorData = await data.json();
        throw new Error(errorData.message || 'Erro ao adicionar setor');
      }

      const result = await data.json();
      console.log('Setor adicionado:', result);
      
      onSectorAdded();
      onChange(newSetor.trim());
      setNewSetor('');
      
      toast({
        title: "Setor adicionado",
        description: "Novo setor criado com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao adicionar setor:', error);
      toast({
        title: "Erro", 
        description: error.message === 'duplicate key value violates unique constraint "setores_nome_key"' 
          ? "Este setor já existe." 
          : error.message || "Erro ao adicionar setor.",
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
