
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
  setor: z.string().min(1, 'Setor é obrigatório'),
  titulo: z.string().min(1, 'Título da obra é obrigatório'),
  compositor: z.string().min(1, 'Nome do compositor é obrigatório'),
  instrumentacao: z.string().min(1, 'Instrumentação é obrigatória'),
  tonalidade: z.string().optional(),
  genero: z.string().optional(),
  edicao: z.string().optional(),
  anoEdicao: z.string().optional(),
  digitalizado: z.string().min(1, 'Campo obrigatório'),
  numeroArmario: z.string().optional(),
  numeroPrateleira: z.string().optional(),
  numeroPasta: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const NovaPartitura = () => {
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      setor: '',
      titulo: '',
      compositor: '',
      instrumentacao: '',
      tonalidade: '',
      genero: '',
      edicao: '',
      anoEdicao: '',
      digitalizado: '',
      numeroArmario: '',
      numeroPrateleira: '',
      numeroPasta: '',
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Dados da partitura:', data);
    // Aqui será implementada a lógica para salvar a partitura
    // Por enquanto, apenas mostrar os dados no console
    alert('Partitura cadastrada com sucesso!');
    navigate('/partituras');
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
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/partituras')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar</span>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nova Partitura</h1>
          <p className="text-gray-600 mt-2">
            Cadastre uma nova partitura no sistema
          </p>
        </div>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Informações da Partitura</CardTitle>
          <CardDescription>
            Preencha todos os campos obrigatórios para cadastrar a partitura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="setor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Setor *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
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
                      <FormLabel>Digitalizado? *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma opção" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sim">Sim</SelectItem>
                          <SelectItem value="nao">Não</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="titulo"
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
                  name="compositor"
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

              <FormField
                control={form.control}
                name="instrumentacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instrumentação *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva a instrumentação da obra"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="tonalidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tonalidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Dó maior" {...field} />
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
                      <FormLabel>Gênero/Forma</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Sinfonia, Sonata" {...field} />
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
                      <FormLabel>Edição</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Primeira edição" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <FormField
                  control={form.control}
                  name="anoEdicao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ano da Edição</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 2024" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numeroArmario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>N° Armário</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: A01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numeroPrateleira"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>N° Prateleira</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: P01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numeroPasta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>N° Pasta</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: PA001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/partituras')}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>Salvar Partitura</span>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NovaPartitura;
