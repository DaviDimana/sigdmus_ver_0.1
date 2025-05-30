
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, User } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

const ProfileSettings: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    setor: profile?.setor || '',
    instrumento: profile?.instrumento || ''
  });

  const setores = [
    'ACERVO_OSUFBA', 'ACERVO_SCHWEBEL', 'ACERVO_PIERO', 'ACERVO_PINO',
    'ACERVO_WIDMER', 'MEMORIAL_LINDENBERG_CARDOSO', 'COMPOSITORES_DA_BAHIA', 'ACERVO_OSBA'
  ];

  const instrumentos = [
    'FLAUTA', 'OBOÉ', 'CLARINETE', 'FAGOTE', 'TROMPA', 'TROMPETE',
    'TROMBONE', 'TUBA', 'VIOLINO_I', 'VIOLINO_II', 'VIOLA',
    'VIOLONCELO', 'CONTRABAIXO', 'HARPA', 'PIANO', 'PERCUSSAO',
    'SOPRANO', 'CONTRALTO', 'TENOR', 'BAIXO'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updates: Partial<Tables<'user_profiles'>> = {
        name: formData.name,
      };

      // Apenas gerentes podem alterar setor
      if (profile?.role === 'GERENTE' || profile?.role === 'ADMIN') {
        updates.setor = formData.setor as any;
      }

      // Apenas músicos podem alterar instrumento
      if (profile?.role === 'MUSICO') {
        updates.instrumento = formData.instrumento as any;
      }

      await updateProfile(updates);

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar perfil. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center space-x-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src="" alt={profile?.name} />
          <AvatarFallback className="text-lg">
            {profile?.name ? getInitials(profile.name) : <User className="h-8 w-8" />}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <Button type="button" variant="outline" size="sm" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Alterar Foto
          </Button>
          <p className="text-sm text-gray-500 mt-1">
            JPG, PNG até 2MB
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={profile?.email}
            disabled
            className="bg-gray-50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            value={profile?.role}
            disabled
            className="bg-gray-50"
          />
        </div>

        {(profile?.role === 'GERENTE' || profile?.role === 'ADMIN') && (
          <div className="space-y-2">
            <Label htmlFor="setor">Setor</Label>
            <Select
              value={formData.setor}
              onValueChange={(value) => setFormData({ ...formData, setor: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um setor" />
              </SelectTrigger>
              <SelectContent>
                {setores.map((setor) => (
                  <SelectItem key={setor} value={setor}>
                    {setor.replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {profile?.role === 'MUSICO' && (
          <div className="space-y-2">
            <Label htmlFor="instrumento">Instrumento</Label>
            <Select
              value={formData.instrumento}
              onValueChange={(value) => setFormData({ ...formData, instrumento: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um instrumento" />
              </SelectTrigger>
              <SelectContent>
                {instrumentos.map((instrumento) => (
                  <SelectItem key={instrumento} value={instrumento}>
                    {instrumento}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar Alterações'}
      </Button>
    </form>
  );
};

export default ProfileSettings;
