
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
  tituloObra: z.string().min(1, 'Título da obra é obrigatório'),
  nomeCompositor: z.string().min(1, 'Nome do compositor é obrigatório'),
  local: z.string().min(1, 'Local é obrigatório'),
  data: z.string().min(1, 'Data é obrigatória'),
  horario: z.string().min(1, 'Horário é obrigatório'),
  maestros: z.string().min(1, 'Maestro(s) é obrigatório'),
  interpretes: z.string().min(1, 'Intérprete(s) é obrigatório'),
  release: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const NovaPerformance = () => {
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tituloObra: '',
      nomeCompositor: '',
      local: '',
      data: '',
      horario: '',
      maestros: '',
      interpretes: '',
      release: '',
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Dados da performance:', data);
    // Aqui será implementada a lógica para salvar a performance
    // Por enquanto, apenas mostrar os dados no console
    alert('Performance cadastrada com sucesso!');
    navigate('/performances');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/performances')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar</span>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nova Performance</h1>
          <p className="text-gray-600 mt-2">
            Cadastre uma nova performance no sistema
          </p>
        </div>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Informações da Performance</CardTitle>
          <CardDescription>
            Preencha todos os campos obrigatórios para cadastrar a performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="tituloObra"
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
                  name="nomeCompositor"
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
                  onClick={() => navigate('/performances')}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>Salvar Performance</span>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NovaPerformance;
