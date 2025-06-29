import React, { useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, FileText, X, Eye } from 'lucide-react';

interface ProgramFileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  existingFileUrl?: string;
  existingFileName?: string;
  onRemoveExisting?: () => void;
}

const ProgramFileUpload: React.FC<ProgramFileUploadProps> = ({ 
  file, 
  onFileChange, 
  existingFileUrl, 
  existingFileName,
  onRemoveExisting 
}) => {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      const file = droppedFiles[0];
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png'
      ];
      
      if (validTypes.includes(file.type)) {
        onFileChange(file);
      } else {
        alert('Por favor, selecione um arquivo PDF, DOC, DOCX, JPG ou PNG.');
      }
    }
  }, [onFileChange]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileChange(selectedFile);
    }
  }, [onFileChange]);

  const removeFile = useCallback(() => {
    onFileChange(null);
  }, [onFileChange]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileType = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    return extension || '';
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-600" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FileText className="h-8 w-8 text-blue-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-8 w-8 text-blue-600" />;
      default:
        return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  const handleViewExisting = () => {
    if (existingFileUrl) {
      window.open(existingFileUrl, '_blank');
    }
  };

  // Se há um arquivo novo selecionado, mostrar ele
  if (file) {
    return (
      <div className="space-y-2">
        <Label htmlFor="programa-file">Programa do Concerto</Label>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  <p className="text-xs text-green-600">Novo arquivo selecionado</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Se há um arquivo existente, mostrar ele com opções
  if (existingFileUrl && existingFileName) {
    const fileType = getFileType(existingFileUrl);
    
    return (
      <div className="space-y-2">
        <Label htmlFor="programa-file">Programa do Concerto</Label>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getFileIcon(fileType)}
                <div>
                  <p className="font-medium text-sm">{existingFileName}</p>
                  <p className="text-xs text-gray-500">Arquivo existente</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleViewExisting}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onRemoveExisting}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-sm text-gray-600">
          <p>Para trocar o arquivo, remova o atual e selecione um novo.</p>
        </div>
      </div>
    );
  }

  // Se não há arquivo, mostrar área de upload
  return (
    <div className="space-y-2">
      <Label htmlFor="programa-file">Programa do Concerto (opcional)</Label>
      
      <Card
        className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer"
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Upload className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 text-center mb-2">
            Arraste e solte o arquivo do programa aqui
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Ou clique para selecionar (PDF, DOC, DOCX, JPG, PNG)
          </p>
          <input
            id="programa-file"
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileInputChange}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('programa-file')?.click()}
          >
            Selecionar Arquivo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgramFileUpload;
