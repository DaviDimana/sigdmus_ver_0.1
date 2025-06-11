
import * as z from 'zod';

// Schema da Nova Partitura (extraído do formulário)
const partituraSchema = z.object({
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
  instituicao: z.string().optional(),
  observacoes: z.string().optional(),
});

// Schema da Nova Performance (extraído do formulário)
const performanceSchema = z.object({
  tituloObra: z.string().min(1, 'Título da obra é obrigatório'),
  nomeCompositor: z.string().min(1, 'Nome do compositor é obrigatório'),
  local: z.string().min(1, 'Local é obrigatório'),
  data: z.string().min(1, 'Data é obrigatória'),
  horario: z.string().min(1, 'Horário é obrigatório'),
  maestros: z.string().min(1, 'Maestro(s) é obrigatório'),
  interpretes: z.string().min(1, 'Intérprete(s) é obrigatório'),
  release: z.string().optional(),
});

// Mapeamento dos campos com seus labels em português
export const partiturasFields = [
  { id: 'setor', label: 'Setor' },
  { id: 'titulo', label: 'Título da Obra' },
  { id: 'compositor', label: 'Nome do Compositor' },
  { id: 'instrumentacao', label: 'Instrumentação' },
  { id: 'tonalidade', label: 'Tonalidade' },
  { id: 'genero', label: 'Gênero/Forma' },
  { id: 'edicao', label: 'Edição' },
  { id: 'anoEdicao', label: 'Ano da Edição' },
  { id: 'digitalizado', label: 'Digitalizado?' },
  { id: 'numeroArmario', label: 'N° Armário' },
  { id: 'numeroPrateleira', label: 'N° Prateleira' },
  { id: 'numeroPasta', label: 'N° Pasta' },
  { id: 'instituicao', label: 'Instituição' },
  { id: 'observacoes', label: 'Observações' },
];

export const performancesFields = [
  { id: 'tituloObra', label: 'Título da Obra' },
  { id: 'nomeCompositor', label: 'Nome do Compositor' },
  { id: 'local', label: 'Local' },
  { id: 'data', label: 'Data' },
  { id: 'horario', label: 'Horário' },
  { id: 'maestros', label: 'Maestro(s)' },
  { id: 'interpretes', label: 'Intérprete(s)' },
  { id: 'release', label: 'Release' },
];

// Função para obter os labels dos campos
export const getFieldLabels = (type: 'partituras' | 'performances') => {
  const fields = type === 'partituras' ? partiturasFields : performancesFields;
  return fields.reduce((acc, field) => {
    acc[field.id] = field.label;
    return acc;
  }, {} as Record<string, string>);
};
