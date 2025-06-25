import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Camera } from 'lucide-react';

const ProfileSettings: React.FC = () => {
  const { user, profile, loading, setProfile, fetchProfile } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  // Atualizar formData quando o perfil for carregado
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
      });
    }
  }, [profile]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      // Verificar se o usuário está autenticado
      if (!user?.id) {
        toast.error('Usuário não autenticado');
        return;
      }

      // Verificar tipo e tamanho do arquivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione uma imagem válida');
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error('A imagem deve ter no máximo 5MB');
        return;
      }

      const fileExt = file.name.split('.').pop();
      // Usar o ID do usuário como nome do arquivo para seguir as políticas RLS
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      console.log('Iniciando upload do avatar:', { filePath, userId: user.id });

      // Upload da imagem com upsert para sobrescrever se existir
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('Erro no upload do arquivo:', uploadError);
        throw uploadError;
      }

      console.log('Upload do arquivo concluído, obtendo URL pública');

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('URL pública obtida:', publicUrl);

      // Verificar se o perfil existe antes de tentar atualizar
      const { data: existingProfile, error: checkError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Erro ao verificar perfil existente:', checkError);
        throw checkError;
      }

      let updateError;
      if (existingProfile) {
        // Atualizar perfil existente
        const { error } = await supabase
        .from('user_profiles')
        .update({ avatar_url: publicUrl })
          .eq('id', user.id);
        updateError = error;
      } else {
        // Criar novo perfil se não existir
        const { error } = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
            email: user.email || '',
            avatar_url: publicUrl,
            role: 'user'
          });
        updateError = error;
      }

      if (updateError) {
        console.error('Erro ao atualizar o perfil com a URL do avatar:', updateError);
        throw updateError;
      }

      console.log('Perfil atualizado com a URL do avatar, buscando perfil atualizado');

      // Buscar o perfil atualizado
      await fetchProfile(user.id);

      toast.success('Avatar atualizado com sucesso!');
    } catch (error: any) {
      console.error('Erro detalhado ao fazer upload do avatar:', error);
      
      // Mensagens de erro mais específicas
      let errorMessage = 'Erro ao fazer upload do avatar';
      if (error.message) {
        if (error.message.includes('JWT')) {
          errorMessage = 'Sessão expirada. Por favor, faça login novamente.';
        } else if (error.message.includes('storage')) {
          errorMessage = 'Erro no armazenamento. Tente novamente.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar se o usuário está autenticado
    if (!user?.id) {
      toast.error('Usuário não autenticado');
      return;
    }
    
    // Validação dos campos
    if (!formData.name.trim()) {
      toast.error('O nome é obrigatório');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('O email é obrigatório');
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error('Email inválido');
      return;
    }

    setSaving(true);
    try {
      console.log('Iniciando atualização do perfil:', { 
        userId: user.id, 
        name: formData.name.trim(), 
        email: formData.email.trim() 
      });

      // Verificar se o perfil existe antes de tentar atualizar
      const { data: existingProfile, error: checkError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Erro ao verificar perfil existente:', checkError);
        throw checkError;
      }

      let updateError;
      if (existingProfile) {
        // Atualizar perfil existente
      const { error } = await supabase
        .from('user_profiles')
        .update({
          name: formData.name.trim(),
          email: formData.email.trim(),
        })
          .eq('id', user.id);
        updateError = error;
      } else {
        // Criar novo perfil se não existir
        const { error } = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            name: formData.name.trim(),
            email: formData.email.trim(),
            role: 'user'
          });
        updateError = error;
      }

      if (updateError) {
        console.error('Erro ao atualizar o perfil:', updateError);
        throw updateError;
      }

      console.log('Perfil atualizado, buscando perfil atualizado');

      // Buscar o perfil atualizado
      await fetchProfile(user.id);

      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      console.error('Erro detalhado ao atualizar perfil:', error);
      
      // Mensagens de erro mais específicas
      let errorMessage = 'Erro ao atualizar perfil';
      if (error.message) {
        if (error.message.includes('JWT')) {
          errorMessage = 'Sessão expirada. Por favor, faça login novamente.';
        } else if (error.message.includes('duplicate')) {
          errorMessage = 'Email já está em uso.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative group">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback>{getInitials(profile?.name || '')}</AvatarFallback>
          </Avatar>
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
          >
            <Camera className="h-4 w-4" />
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={uploading}
            />
          </label>
        </div>
        <p className="text-sm text-gray-500">
          {uploading ? 'Enviando...' : 'Clique no ícone da câmera para alterar sua foto'}
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Seu nome completo"
            disabled={saving}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="seu@email.com"
            disabled={saving}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={saving}>
        {saving ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Salvando...</span>
          </div>
        ) : (
          'Salvar Alterações'
        )}
      </Button>
    </form>
  );
};

export default ProfileSettings;
