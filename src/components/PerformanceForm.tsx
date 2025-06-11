
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Save, Upload, FileText, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import type { Performance, PerformanceInsert } from '@/hooks/usePerformances';

const formSchema = z.object({
  titulo_obra: z.string().min(1, 'Título da obra é obrigatório'),
  nome_compositor: z.string().min(1, 'Nome do compositor é obrigatório'),
  local: z.string().min(1, 'Local é obrigatório'),
  data: z.string().min(1, 'Data é obrigatória'),
  horario: z.string().min(1, 'Horário é obrigatório'),
  maestros: z.string().min(1, 'Maestro(s) é obrigatório'),
  interpretes: z.string().min(1, 'Intérprete(s) é obrigatório'),
  release: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface PerformanceFormProps {
  performance?: Performance;
  onSubmit: (data: PerformanceInsert & { programaPdf?: File }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const PerformanceForm: React.FC<PerformanceFormProps> = ({ 
  performance, 
  onSubmit, 
  onCancel, 
  isSubmitting = false 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo_obra: performance?.titulo_obra || '',
      nome_compositor: performance?.nome_compositor || '',
      local: performance?.local || '',
      data: performance?.data || '',
      horario: performance?.horario || '',
      maestros: performance?.maestros || '',
      interpretes: performance?.interpretes || '',
      release: performance?.release || '',
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const handleSubmit = (data: FormData) => {
    onSubmit({ ...data, programaPdf: selectedFile || undefined } as PerformanceInsert & { programaPdf?: File });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <FormField
            control={form.control}
            name="titulo_obra"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">Título da Obra *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Digite o título da obra" 
                    className="text-sm sm:text-base h-9 sm:h-10"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nome_compositor"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">Nome do Compositor *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Digite o nome do compositor" 
                    className="text-sm sm:text-base h-9 sm:h-10"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <FormField
            control={form.control}
            name="local"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">Local *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Digite o local da performance" 
                    className="text-sm sm:text-base h-9 sm:h-10"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="data"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">Data *</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    className="text-sm sm:text-base h-9 sm:h-10"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="horario"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">Horário *</FormLabel>
                <FormControl>
                  <Input 
                    type="time" 
                    className="text-sm sm:text-base h-9 sm:h-10"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <FormField
            control={form.control}
            name="maestros"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">Maestro(s) *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Digite o(s) nome(s) do(s) maestro(s)"
                    className="resize-none text-sm sm:text-base min-h-[80px] sm:min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interpretes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">Intérprete(s) *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Digite o(s) nome(s) do(s) intérprete(s)"
                    className="resize-none text-sm sm:text-base min-h-[80px] sm:min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="release"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm sm:text-base">Release</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Digite informações adicionais sobre a performance"
                  className="resize-none min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Seção de Upload do Programa */}
        <div className="space-y-2">
          <Label className="text-sm sm:text-base font-medium">Programa do Concerto (PDF)</Label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragOver 
                ? 'border-blue-500 bg-blue-50' 
                : selectedFile 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {selectedFile ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-6 w-6 text-red-500" />
                  <span className="text-sm font-medium">{selectedFile.name}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="hover:bg-red-50 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div>
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Arraste um arquivo PDF aqui ou clique para selecionar
                </p>
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="programa-upload"
                />
                <Label
                  htmlFor="programa-upload"
                  className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all duration-200"
                >
                  Selecionar Programa
                </Label>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Opcional: Faça upload do programa do concerto em formato PDF
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full sm:w-auto text-sm sm:text-base h-9 sm:h-10"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="flex items-center justify-center space-x-2 w-full sm:w-auto text-sm sm:text-base h-9 sm:h-10"
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4" />
            <span>{performance ? 'Atualizar' : 'Salvar'} Performance</span>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PerformanceForm;
