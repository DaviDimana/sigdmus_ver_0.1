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
import { usePartituras } from '@/hooks/usePartituras';
import { usePerformances } from '@/hooks/usePerformances';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info } from 'lucide-react';

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
    titulo: '',
    compositor: '',
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
  const { partituras, isLoading: isLoadingPartituras } = usePartituras();
  const { performances } = usePerformances();

  // Extrair valores únicos para autocomplete
  const titulosUnicos = Array.from(new Set(partituras.map(p => p.titulo))).filter(Boolean);
  const compositoresUnicos = Array.from(new Set(partituras.map(p => p.compositor))).filter(Boolean);

  // Lógica para desabilitar upload de programa se já existir performance igual
  const hasOtherPerformanceWithSameDateTimeAndPlace = performances.some(
    (p) =>
      p.local === formData.local &&
      p.data === formData.data &&
      p.horario === formData.horario &&
      (!isEdit || (initialData && p.id !== initialData.id))
  );

  useEffect(() => {
    if (initialData) {
      setFormData({
        titulo: initialData.titulo || '',
        compositor: initialData.compositor || '',
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título da Obra</label>
          <input
            type="text"
            className="w-full border rounded px-2 py-1"
            placeholder="Digite ou selecione o título da obra"
            value={formData.titulo}
            onChange={e => handleFieldChange('titulo', e.target.value)}
            list="titulos-list"
          required
        />
          <datalist id="titulos-list">
            {titulosUnicos.map((titulo) => (
              <option key={titulo} value={titulo} />
            ))}
          </datalist>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Compositor</label>
          <input
            type="text"
            className="w-full border rounded px-2 py-1"
            placeholder="Digite ou selecione o nome do compositor"
            value={formData.compositor}
            onChange={e => handleFieldChange('compositor', e.target.value)}
            list="compositores-list"
          required
        />
          <datalist id="compositores-list">
            {compositoresUnicos.map((compositor) => (
              <option key={compositor} value={compositor} />
            ))}
          </datalist>
        </div>
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
        disabled={hasOtherPerformanceWithSameDateTimeAndPlace}
      />
      {hasOtherPerformanceWithSameDateTimeAndPlace && (
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded p-3 mt-2 text-blue-800">
          <Info className="h-5 w-5 text-blue-500" />
          <div>
            <div className="font-semibold">Programa de Concerto já cadastrado para este local, data e horário.</div>
            <div className="text-sm">O upload está desativado para evitar duplicidade. O programa será compartilhado automaticamente entre todas as performances deste concerto.</div>
            {/* Link para visualizar o programa existente, se houver */}
            {performances.find(p => p.local === formData.local && p.data === formData.data && p.horario === formData.horario && p.programa_arquivo_url) && (
              <a
                href={performances.find(p => p.local === formData.local && p.data === formData.data && p.horario === formData.horario && p.programa_arquivo_url)?.programa_arquivo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-1 text-blue-700 underline hover:text-blue-900"
              >
                Visualizar programa já cadastrado
              </a>
            )}
          </div>
        </div>
      )}

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
