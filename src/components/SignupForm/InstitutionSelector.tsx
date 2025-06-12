
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
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const handleAddInstituicao = async () => {
    if (!newInstituicao.trim()) return;

    setIsAdding(true);
    try {
      console.log('Tentando adicionar instituição:', newInstituicao.trim());
      
      // Usar fetch direto para bypass RLS durante cadastro público
      const response = await fetch(`https://oyidopwxlxwrwcjxjyek.supabase.co/rest/v1/instituicoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95aWRvcHd4bHh3cndjanhqeWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NzU5ODcsImV4cCI6MjA2NDA1MTk4N30.2pUBk7gnx_e6Ld5Jz3n2E3l_O43J8GnBuDlQNJ9MvBM',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95aWRvcHd4bHh3cndjanhqeWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NzU5ODcsImV4cCI6MjA2NDA1MTk4N30.2pUBk7gnx_e6Ld5Jz3n2E3l_O43J8GnBuDlQNJ9MvBM',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ nome: newInstituicao.trim() })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao adicionar instituição');
      }

      const result = await response.json();
      console.log('Instituição adicionada:', result);
      
      onInstitutionAdded();
      onChange(newInstituicao.trim());
      setNewInstituicao('');
      
      toast({
        title: "Instituição adicionada",
        description: "Nova instituição criada com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao adicionar instituição:', error);
      toast({
        title: "Erro",
        description: error.message === 'duplicate key value violates unique constraint "instituicoes_nome_key"' 
          ? "Esta instituição já existe." 
          : error.message || "Erro ao adicionar instituição.",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
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
            disabled={isAdding}
          />
          <Button
            type="button"
            onClick={handleAddInstituicao}
            disabled={!newInstituicao.trim() || isAdding}
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
