import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import FormFieldInput from './FormFieldInput';
import ProgramFileUpload from './ProgramFileUpload';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

interface PerformanceFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  initialData?: any;
  isEdit?: boolean;
}

const PerformanceForm: React.FC<PerformanceFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  initialData,
  isEdit = false
}) => {
  const [formData, setFormData] = useState({
    titulo_obra: '',
    nome_compositor: '',
    local: '',
    data: '',
    horario: '',
    maestros: '',
    interpretes: '',
    release: ''
  });
  const [programFile, setProgramFile] = useState<File | null>(null);
  const [existingFileRemoved, setExistingFileRemoved] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  // Carregar dados iniciais quando disponíveis (para edição)
  useEffect(() => {
    if (initialData) {
      setFormData({
        titulo_obra: initialData.titulo_obra || '',
        nome_compositor: initialData.nome_compositor || '',
        local: initialData.local || '',
        data: initialData.data || '',
        horario: initialData.horario || '',
        maestros: initialData.maestros || '',
        interpretes: initialData.interpretes || '',
        release: initialData.release || ''
      });
    }
  }, [initialData]);

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRemoveExistingFile = () => {
    setShowRemoveDialog(true);
  };

  const confirmRemoveExistingFile = () => {
    setExistingFileRemoved(true);
    setShowRemoveDialog(false);
  };

  const cancelRemoveExistingFile = () => {
    setShowRemoveDialog(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      programFile,
      removeExistingFile: existingFileRemoved
    });
  };

  // Extrair nome do arquivo da URL existente
  const getExistingFileName = (url: string) => {
    if (!url) return '';
    const fileName = url.split('/').pop();
    if (!fileName) return 'programa.pdf';
    
    // Se o nome for muito genérico, criar um nome mais descritivo
    if (fileName === 'programa.pdf' || fileName === 'programa.doc' || fileName === 'programa.docx') {
      const extension = fileName.split('.').pop();
      return `Programa do Concerto.${extension}`;
    }
    
    return fileName;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormFieldInput
          id="titulo_obra"
          label="Título da Obra"
          value={formData.titulo_obra}
          onChange={(value) => handleFieldChange('titulo_obra', value)}
          placeholder="Digite o título da obra musical"
          required
        />

        <FormFieldInput
          id="nome_compositor"
          label="Nome do Compositor"
          value={formData.nome_compositor}
          onChange={(value) => handleFieldChange('nome_compositor', value)}
          placeholder="Digite o nome do compositor"
          required
        />

        <FormFieldInput
          id="local"
          label="Local da Performance"
          value={formData.local}
          onChange={(value) => handleFieldChange('local', value)}
          placeholder="Digite o local onde ocorreu a performance"
          required
        />

        <FormFieldInput
          id="data"
          label="Data da Performance"
          type="date"
          value={formData.data}
          onChange={(value) => handleFieldChange('data', value)}
          required
        />

        <FormFieldInput
          id="horario"
          label="Horário"
          type="time-select"
          value={formData.horario}
          onChange={(value) => handleFieldChange('horario', value)}
          required
        />

        <FormFieldInput
          id="maestros"
          label="Maestros"
          value={formData.maestros}
          onChange={(value) => handleFieldChange('maestros', value)}
          placeholder="Digite os nomes dos maestros"
          required
        />
      </div>

      <FormFieldInput
        id="interpretes"
        label="Intérpretes"
        value={formData.interpretes}
        onChange={(value) => handleFieldChange('interpretes', value)}
        placeholder="Digite os nomes dos intérpretes"
      />

      <FormFieldInput
        id="release"
        label="Release"
        type="textarea"
        value={formData.release}
        onChange={(value) => handleFieldChange('release', value)}
        placeholder="Digite o release da performance..."
        rows={4}
      />

      <ProgramFileUpload
        file={programFile}
        onFileChange={setProgramFile}
        existingFileUrl={isEdit && !existingFileRemoved ? initialData?.programa_arquivo_url : undefined}
        existingFileName={isEdit && !existingFileRemoved ? getExistingFileName(initialData?.programa_arquivo_url) : undefined}
        onRemoveExisting={handleRemoveExistingFile}
      />

      {/* Modal de confirmação para remoção do programa */}
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Programa de Concerto?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o Programa de Concerto? <br />
              <b>Esta ação irá remover o arquivo de todas as performances com o mesmo local, data e horário.</b>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelRemoveExistingFile}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveExistingFile}>Remover</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex justify-end space-x-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (isEdit ? 'Atualizando...' : 'Cadastrando...') : (isEdit ? 'Atualizar Performance' : 'Cadastrar Performance')}
        </Button>
      </div>
    </form>
  );
};

export default PerformanceForm;
