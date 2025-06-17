
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import AvatarUpload from './AvatarUpload';
import type { Tables } from '@/integrations/supabase/types';

const ProfileSettings: React.FC = () => {
  const { profile, updateProfile, user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    telefone: '',
    setor: '',
    instrumento: '',
    instituicao: '',
    avatar_url: ''
  });

  // Initialize form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        telefone: profile.telefone || '',
        setor: profile.setor || '',
        instrumento: profile.instrumento || '',
        instituicao: profile.instituicao || '',
        avatar_url: profile.avatar_url || ''
      });
    }
  }, [profile]);

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

  const handleAvatarUpdate = (avatarUrl: string) => {
    setFormData(prev => ({ ...prev, avatar_url: avatarUrl }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Erro",
        description: "O nome é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não encontrado. Faça login novamente.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const updates: Partial<Tables<'user_profiles'>> = {
        name: formData.name.trim(),
        telefone: formData.telefone.trim() || null,
        instituicao: formData.instituicao.trim() || null,
        avatar_url: formData.avatar_url || null
      };

      // Apenas gerentes e admins podem alterar setor
      if (profile && (profile.role === 'GERENTE' || profile.role === 'ADMIN') && formData.setor) {
        updates.setor = formData.setor as any;
      }

      // Apenas músicos podem alterar instrumento
      if (profile && profile.role === 'MUSICO' && formData.instrumento) {
        updates.instrumento = formData.instrumento as any;
      }

      await updateProfile(updates);

      toast({
        title: "Sucesso!",
        description: "Perfil atualizado com sucesso!",
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

  if (!profile || !user) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-gray-500">Carregando perfil...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AvatarUpload
        currentAvatarUrl={formData.avatar_url}
        userName={profile.name}
        userId={user.id}
        onAvatarUpdate={handleAvatarUpdate}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="Digite seu nome"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={profile.email}
            disabled
            className="bg-gray-50"
            placeholder="Email do usuário"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone</Label>
          <Input
            id="telefone"
            type="tel"
            value={formData.telefone}
            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
            placeholder="(00) 00000-0000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instituicao">Instituição</Label>
          <Input
            id="instituicao"
            value={formData.instituicao}
            onChange={(e) => setFormData({ ...formData, instituicao: e.target.value })}
            placeholder="Nome da instituição"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Função</Label>
          <Input
            id="role"
            value={profile.role}
            disabled
            className="bg-gray-50"
            placeholder="Função do usuário"
          />
        </div>

        {(profile.role === 'GERENTE' || profile.role === 'ADMIN') && (
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

        {profile.role === 'MUSICO' && (
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

      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={loading} 
          className="min-w-[140px]"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Salvando...
            </>
          ) : (
            'Salvar Alterações'
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProfileSettings;
