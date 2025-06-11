
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Save } from 'lucide-react';
import type { Partitura, PartituraInsert } from '@/hooks/usePartituras';

const formSchema = z.object({
  setor: z.string().min(1, 'Setor é obrigatório'),
  titulo: z.string().min(1, 'Título da obra é obrigatório'),
  compositor: z.string().min(1, 'Nome do compositor é obrigatório'),
  instrumentacao: z.string().min(1, 'Instrumentação é obrigatória'),
  tonalidade: z.string().optional(),
  genero: z.string().optional(),
  edicao: z.string().optional(),
  ano_edicao: z.string().optional(),
  digitalizado: z.boolean(),
  numero_armario: z.string().optional(),
  numero_prateleira: z.string().optional(),
  numero_pasta: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface PartituraFormProps {
  partitura?: Partitura;
  onSubmit: (data: PartituraInsert) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const PartituraForm: React.FC<PartituraFormProps> = ({ 
  partitura, 
  onSubmit, 
  onCancel, 
  isSubmitting = false 
}) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      setor: partitura?.setor || '',
      titulo: partitura?.titulo || '',
      compositor: partitura?.compositor || '',
      instrumentacao: partitura?.instrumentacao || '',
      tonalidade: partitura?.tonalidade || '',
      genero: partitura?.genero || '',
      edicao: partitura?.edicao || '',
      ano_edicao: partitura?.ano_edicao || '',
      digitalizado: partitura?.digitalizado || false,
      numero_armario: partitura?.numero_armario || '',
      numero_prateleira: partitura?.numero_prateleira || '',
      numero_pasta: partitura?.numero_pasta || '',
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit(data as PartituraInsert);
  };

  const setoresOptions = [
    'Acervo OSUFBA',
    'Acervo Schuwebel',
    'Acervo Pino',
    'Acervo Piero',
    'Memorial Lindenberg Cardoso',
    'Biblioteca EMUS',
    'Compositores da Bahia'
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <FormField
            control={form.control}
            name="setor"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">Setor *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="text-sm sm:text-base h-9 sm:h-10">
                      <SelectValue placeholder="Selecione o setor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {setoresOptions.map((setor) => (
                      <SelectItem key={setor} value={setor}>
                        {setor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="digitalizado"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">Digitalizado? *</FormLabel>
                <Select onValueChange={(value) => field.onChange(value === 'true')} value={field.value ? 'true' : 'false'}>
                  <FormControl>
                    <SelectTrigger className="text-sm sm:text-base h-9 sm:h-10">
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="true">Sim</SelectItem>
                    <SelectItem value="false">Não</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <FormField
            control={form.control}
            name="titulo"
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
            name="compositor"
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

        <FormField
          control={form.control}
          name="instrumentacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm sm:text-base">Instrumentação *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva a instrumentação da obra"
                  className="resize-none text-sm sm:text-base min-h-[80px] sm:min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <FormField
            control={form.control}
            name="tonalidade"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">Tonalidade</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: Dó maior" 
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
            name="genero"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">Gênero/Forma</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: Sinfonia, Sonata" 
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
            name="edicao"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">Edição</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: Primeira edição" 
                    className="text-sm sm:text-base h-9 sm:h-10"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          <FormField
            control={form.control}
            name="ano_edicao"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">Ano da Edição</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: 2024" 
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
            name="numero_armario"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">N° Armário</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: A01" 
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
            name="numero_prateleira"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">N° Prateleira</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: P01" 
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
            name="numero_pasta"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">N° Pasta</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: PA001" 
                    className="text-sm sm:text-base h-9 sm:h-10"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            <span>{partitura ? 'Atualizar' : 'Salvar'} Partitura</span>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PartituraForm;
