
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Save } from 'lucide-react';
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
  onSubmit: (data: PerformanceInsert) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const PerformanceForm: React.FC<PerformanceFormProps> = ({ 
  performance, 
  onSubmit, 
  onCancel, 
  isSubmitting = false 
}) => {
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

  const handleSubmit = (data: FormData) => {
    onSubmit(data as PerformanceInsert);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="titulo_obra"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título da Obra *</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o título da obra" {...field} />
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
                <FormLabel>Nome do Compositor *</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome do compositor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="local"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Local *</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o local da performance" {...field} />
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
                <FormLabel>Data *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
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
                <FormLabel>Horário *</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="maestros"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maestro(s) *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Digite o(s) nome(s) do(s) maestro(s)"
                    className="resize-none"
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
                <FormLabel>Intérprete(s) *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Digite o(s) nome(s) do(s) intérprete(s)"
                    className="resize-none"
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
              <FormLabel>Release</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Digite informações adicionais sobre a performance"
                  className="resize-none min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4 pt-6">
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
            className="flex items-center space-x-2"
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
