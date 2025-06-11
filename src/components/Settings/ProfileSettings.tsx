
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload, User } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

const ProfileSettings: React.FC = () => {
  const { profile, updateProfile, user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    setor: '',
    instrumento: ''
  });

  // Initialize form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        setor: profile.setor || '',
        instrumento: profile.instrumento || ''
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
      console.log('Iniciando atualização do perfil...');
      console.log('Dados do formulário:', formData);
      console.log('Profile atual:', profile);
      console.log('User ID:', user.id);
      
      const updates: Partial<Tables<'user_profiles'>> = {
        name: formData.name.trim(),
        updated_at: new Date().toISOString()
      };

      // Apenas gerentes e admins podem alterar setor
      if (profile?.role === 'GERENTE' || profile?.role === 'ADMIN') {
        if (formData.setor) {
          updates.setor = formData.setor as any;
        }
        console.log('Adicionando setor ao update:', formData.setor);
      }

      // Apenas músicos podem alterar instrumento
      if (profile?.role === 'MUSICO') {
        if (formData.instrumento) {
          updates.instrumento = formData.instrumento as any;
        }
        console.log('Adicionando instrumento ao update:', formData.instrumento);
      }

      console.log('Updates a serem aplicados:', updates);
      
      const result = await updateProfile(updates);
      console.log('Perfil atualizado com sucesso:', result);

      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso!",
      });
    } catch (error) {
      console.error('Erro detalhado ao atualizar perfil:', error);
      
      let errorMessage = "Erro ao atualizar perfil. Tente novamente.";
      
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        if (error.message.includes('JWT') || error.message.includes('auth')) {
          errorMessage = "Sessão expirada. Faça login novamente.";
        } else if (error.message.includes('RLS') || error.message.includes('policy')) {
          errorMessage = "Erro de permissão. Verifique se você tem acesso para editar este perfil.";
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
        } else if (error.message.includes('duplicate') || error.message.includes('unique')) {
          errorMessage = "Erro: dados duplicados. Verifique as informações inseridas.";
        }
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
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

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-gray-500">Carregando perfil...</p>
      </div>
    );
  }

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
            value={profile?.email}
            disabled
            className="bg-gray-50"
            placeholder="Email do usuário"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Função</Label>
          <Input
            id="role"
            value={profile?.role}
            disabled
            className="bg-gray-50"
            placeholder="Função do usuário"
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

      <div className="flex justify-end">
        <Button type="submit" disabled={loading} className="min-w-[140px]">
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  );
};

export default ProfileSettings;
