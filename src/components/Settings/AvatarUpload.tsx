import React, { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, User, Camera } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  userName: string;
  userId: string;
  onAvatarUpdate: (url: string) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatarUrl,
  userName,
  userId,
  onAvatarUpdate
}) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive",
      });
      return;
    }

    // Validar tamanho (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 2MB.",
        variant: "destructive",
      });
      return;
    }

    await uploadAvatar(file);
  };

  const uploadAvatar = async (file: File) => {
    setUploading(true);

    try {
      console.log('Iniciando upload do avatar:', file.name, 'para usuário:', userId);
      
      // Obter usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Gerar nome único para o arquivo
      const fileExtension = file.name.split('.').pop();
      const filePath = `${userId}/${userId}.${fileExtension}`;

      console.log('Uploading avatar to path:', filePath);

      // Upload direto para o Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
      });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }

      console.log('Avatar uploaded successfully:', uploadData);

      // Obter URL pública do arquivo
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        throw new Error('Não foi possível obter a URL pública do avatar');
      }

      console.log('Public URL obtained:', urlData.publicUrl);
      onAvatarUpdate(urlData.publicUrl);

      toast({
        title: "Sucesso!",
        description: "Avatar atualizado com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao fazer upload do avatar:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer upload do avatar. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center space-x-6">
      <div className="relative">
        <Avatar className="h-20 w-20 border-2 border-blue-600 rounded-full">
          <AvatarImage src={currentAvatarUrl} alt={userName} className="rounded-full object-cover" />
          <AvatarFallback className="text-lg bg-blue-100 text-blue-600 rounded-full">
            {userName ? getInitials(userName) : <User className="h-8 w-8" />}
          </AvatarFallback>
        </Avatar>
        
        {/* Overlay com ícone de câmera */}
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
             onClick={() => fileInputRef.current?.click()}>
          <Camera className="h-6 w-6 text-white" />
        </div>
      </div>
      
      <div>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="h-4 w-4" />
          {uploading ? 'Enviando...' : 'Alterar Foto'}
        </Button>
        <p className="text-sm text-gray-500 mt-1">
          JPG, PNG até 2MB
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default AvatarUpload;
