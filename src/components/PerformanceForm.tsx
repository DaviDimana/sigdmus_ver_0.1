import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import FormFieldInput from './FormFieldInput';
import ProgramFileUpload from './ProgramFileUpload';

interface PerformanceFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const PerformanceForm: React.FC<PerformanceFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false
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

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      programFile
    });
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
          type="time"
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
      />

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
          {isSubmitting ? 'Cadastrando...' : 'Cadastrar Performance'}
        </Button>
      </div>
    </form>
  );
};

export default PerformanceForm;
