import React, { useState, useEffect } from 'react';
import { usePartituras } from '@/hooks/usePartituras';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, Download, Upload, Trash2, ChevronDown, ChevronRight, FileText, Plus, Minus, Music } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import PartituraPageHeader from '@/components/PartituraPageHeader';
import PartituraCard from '@/components/PartituraCard';
import PartituraEmptyState from '@/components/PartituraEmptyState';
import PartituraViewer from '@/components/PartituraViewer';
import UploadDialog from '@/components/UploadDialog';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { instrumentList } from '@/utils/instrumentList';
import { useQuery } from '@tanstack/react-query';
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from '@/components/ui/command';

const Partituras = () => {
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();
  const canEditOrDelete = true;
  console.log('Partituras.tsx - profile:', profile, 'canEditOrDelete:', canEditOrDelete);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSetor, setSelectedSetor] = useState<string>('');
  const [selectedCompositor, setSelectedCompositor] = useState<string>('');
  const [selectedGenero, setSelectedGenero] = useState<string>('');
  const [showDigitalizado, setShowDigitalizado] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPartitura, setSelectedPartitura] = useState<any>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const [selectedPdfFile, setSelectedPdfFile] = useState<any | null>(null);
  const [isSetOpen, setIsSetOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { partituras, isLoading, error, updateFileInstrument, deletePartitura } = usePartituras();

  // Função para forçar refresh
  const handleForceRefresh = () => {
    setRefreshKey(prev => prev + 1);
    window.location.reload();
  };

  // Buscar arquivos da partitura selecionada
  const { data: arquivosPartitura = [], isLoading: isLoadingArquivos, refetch: refetchArquivosPartitura } = useQuery({
    queryKey: ['arquivos-partitura', selectedPartitura?.id, refreshKey],
    queryFn: async () => {
      if (!selectedPartitura?.id) return [];
      const { data, error } = await supabase
        .from('arquivos')
        .select('*')
        .eq('partitura_id', selectedPartitura.id);
      if (error) {
        console.error('Erro ao buscar arquivos da partitura:', error);
        return [];
      }
      return data;
    },
    enabled: !!selectedPartitura?.id,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    console.log('arquivosPartitura atualizados:', arquivosPartitura);
  }, [arquivosPartitura]);

  useEffect(() => {
    if (error?.message === 'JWT expired') {
      toast.error('Sua sessão expirou. Por favor, faça login novamente.');
      signOut();
      navigate('/auth');
    }
  }, [error, signOut, navigate]);

  useEffect(() => {
    // Limpa o estado do modal ao navegar para a lista
    if (window.location.pathname === '/partituras') {
      setSelectedPartitura(null);
    }
  }, [window.location.pathname]);

  const filterOptions = [
    { label: 'Setor', value: 'Setor' },
    { label: 'Compositor', value: 'Compositor' },
    { label: 'Gênero', value: 'Gênero' },
    { label: 'Digitalizado', value: 'Digitalizado' },
  ];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSetorChange = (setor: string) => {
    setSelectedSetor(setor);
  };

  const handleCompositorChange = (compositor: string) => {
    setSelectedCompositor(compositor);
  };

  const handleGeneroChange = (genero: string) => {
    setSelectedGenero(genero);
  };

  const handleDigitalizadoChange = (value: string) => {
    setShowDigitalizado(value);
  };

  const handleFilterToggle = (value: string) => {
    setSelectedFilters((prev) =>
      prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]
    );
  };

  const handleClearFilters = () => {
    setSelectedSetor('');
    setSelectedCompositor('');
    setSelectedGenero('');
    setShowDigitalizado('');
    setSearchTerm('');
    setSelectedFilters([]);
  };

  const handleNewPartitura = () => {
    navigate('/partituras/nova');
  };

  const handleViewDetails = (partitura: any) => {
    setSelectedPartitura(partitura);
  };

  const handleInstrumentChange = (partituraId: string, fileName: string, newInstrument: string) => {
    toast.info(`Atualizando instrumento para ${newInstrument}...`);
    updateFileInstrument.mutate({
      partituraId,
      fileName,
      instrument: newInstrument,
    }, {
      onSuccess: () => {
        toast.success("Instrumento atualizado com sucesso!");
        refetchArquivosPartitura(); // Apenas refetch, sem sobrescrever selectedPartitura
      }
    });
  };

  const handleDownloadSecurely = async (partituraId: string, fileName: string) => {
    setDownloadingFile(fileName);
    toast.info(`Baixando ${fileName}...`, { id: `download-${fileName}` });

    try {
      const { data, error } = await supabase.functions.invoke('download-arquivo', {
        body: { filePath: `${partituraId}/${fileName}` },
      });

      if (error) {
        throw new Error(error.message);
      }
      
      if (!(data instanceof Blob)) {
        // Se a função retornou um erro JSON, o 'data' pode não ser um Blob.
        const errorText = await new Response(data).text();
        const parsedError = JSON.parse(errorText);
        throw new Error(parsedError.error || 'Falha ao processar o arquivo.');
      }

      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      
      toast.success(`${fileName} baixado com sucesso!`, { id: `download-${fileName}` });
      
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err: any) {
      console.error("Erro no download seguro:", err);
      toast.error(`Erro ao baixar: ${err.message}`, { id: `download-${fileName}` });
    } finally {
      setDownloadingFile(null);
    }
  };

  const filteredPartituras = partituras?.filter((partitura) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      partitura.titulo.toLowerCase().includes(searchTermLower) ||
      partitura.compositor.toLowerCase().includes(searchTermLower) ||
      partitura.instrumentacao.toLowerCase().includes(searchTermLower) ||
      (partitura.genero?.toLowerCase().includes(searchTermLower) ?? false);

    const matchesSetor = selectedSetor && selectedSetor !== 'all' ? partitura.setor === selectedSetor : true;
    const matchesCompositor = selectedCompositor ? partitura.compositor === selectedCompositor : true;
    const matchesGenero = selectedGenero ? partitura.genero === selectedGenero : true;
    const matchesDigitalizado = showDigitalizado && showDigitalizado !== 'all' ? String(partitura.digitalizado) === showDigitalizado : true;

    return matchesSearch && matchesSetor && matchesCompositor && matchesGenero && matchesDigitalizado;
  });

  function sortByInstrumentOrder(files: { nome?: string; fileName?: string; instrument?: string | null }[]) {
    function getInitialNumber(file: any): number | null {
      const name = file.nome || file.fileName || '';
      const match = name.match(/^\d{1,3}[.\-_ ]/);
      return match ? parseInt(match[0], 10) : null;
    }
    // Ordem tradicional dos instrumentos (de cima para baixo)
    const instrumentOrder = [
      'Grade', 'Partitura', 'Maestro',
      // Madeiras
      'Piccolo', 'Píccolo', 'Flautim', 'Flauta', 'Flute1', 'Flute2', 'Flute', 'Oboé', 'Oboe1', 'Oboe2', 'Oboe', 'Corne Inglês', 'English Horn',
      'Clarinete', 'Clarinet1', 'Clarinet2', 'Clarinet', 'Clarone', 'Bass Clarinet', 'Fagote', 'Bassoon1', 'Bassoon2', 'Bassoon', 'Contrafagote', 'Contrabassoon',
      // Metais
      'Trompa', 'Horn1', 'Horn2', 'Horn3', 'Horn4', 'Horn', 'Trompete', 'Trumpet1', 'Trumpet2', 'Trumpet', 'Trombone', 'AltoTrombone', 'TenorTrombone', 'BassTrombone', 'Tuba',
      // Percussão
      'Tímpanos', 'Timpani', 'Percussão', 'Percussion',
      // Outros
      'Harpa', 'Harp', 'Piano',
      // Cordas
      'Violino 1', 'Violin1', 'Violino 2', 'Violin2', 'Violino', 'Violin', 'Viola', 'Violoncelo', 'Cello', 'Contrabaixo', 'Bass'
    ];
    // Ordenação
    return [...files].sort((a, b) => {
      const numA = getInitialNumber(a);
      const numB = getInitialNumber(b);
      if (numA !== null && numB !== null) {
        if (numA !== numB) return numA - numB;
      } else if (numA !== null) {
        return -1;
      } else if (numB !== null) {
        return 1;
      }
      // Se nenhum dos dois tem número inicial, ordenar pelo instrumento
      const getIndex = (inst: string | null) => {
        if (!inst) return 999;
        let idx = instrumentOrder.findIndex(i => i.toLowerCase() === inst.toLowerCase());
        if (idx !== -1) return idx;
        idx = instrumentOrder.findIndex(i => inst.toLowerCase().startsWith(i.toLowerCase()));
        return idx !== -1 ? idx : 999;
      };
      const idxA = getIndex(a.instrument);
      const idxB = getIndex(b.instrument);
      if (idxA === idxB) return 0;
      return idxA - idxB;
    });
  }

  // Função para deletar um arquivo PDF individual
  async function handleDeletePdf(partituraId: string, fileInfo: { url: string; fileName: string; instrument: string | null }) {
    if (!window.confirm(`Tem certeza que deseja deletar o arquivo "${fileInfo.fileName}"?`)) return;
    try {
      // Remove do Storage
      const { error: storageError } = await supabase.storage.from('partituras').remove([`${partituraId}/${fileInfo.fileName}`]);
      if (storageError) {
        toast.error('Erro ao remover do Storage: ' + storageError.message);
        return;
      }
      // Remove do array pdf_urls
      const { data: partitura, error: fetchError } = await supabase
        .from('partituras')
        .select('pdf_urls')
        .eq('id', partituraId)
        .single();
      if (fetchError) {
        toast.error('Erro ao buscar partitura: ' + fetchError.message);
        return;
      }
      const newPdfUrls = (partitura.pdf_urls || []).filter((f: any) => f.fileName !== fileInfo.fileName);
      const { error: updateError } = await supabase
        .from('partituras')
        .update({ pdf_urls: newPdfUrls })
        .eq('id', partituraId);
      if (updateError) {
        toast.error('Erro ao atualizar partitura: ' + updateError.message);
        return;
      }
      // Atualiza a interface
      setSelectedPartitura((prev: any) => ({ ...prev, pdf_urls: newPdfUrls }));
      toast.success(`Arquivo "${fileInfo.fileName}" deletado com sucesso.`);
    } catch (err: any) {
      toast.error('Erro inesperado: ' + err.message);
    }
  }

  // Função para deletar todos os arquivos PDF de uma partitura
  async function handleDeleteAllPdfs(partituraId: string, pdfUrls: { url: string; fileName: string; instrument: string | null }[]) {
    if (!window.confirm('Tem certeza que deseja apagar TODOS os arquivos digitalizados desta partitura?')) return;
    try {
      // Remove todos do Storage
      const filePaths = pdfUrls.map(f => `${partituraId}/${f.fileName}`);
      if (filePaths.length > 0) {
        const { error: storageError } = await supabase.storage.from('partituras').remove(filePaths);
        if (storageError) {
          toast.error('Erro ao remover do Storage: ' + storageError.message);
          return;
        }
      }
      // Remove todos os registros da tabela arquivos
      const { error: dbError } = await supabase
        .from('arquivos')
        .delete()
        .eq('partitura_id', partituraId);
      if (dbError) {
        toast.error('Erro ao remover registros da tabela arquivos: ' + dbError.message);
        return;
      }
      // Limpa o array pdf_urls (se ainda usar)
      const { error: updateError } = await supabase
        .from('partituras')
        .update({ pdf_urls: [] })
        .eq('id', partituraId);
      if (updateError) {
        toast.error('Erro ao atualizar partitura: ' + updateError.message);
        return;
      }
      // Atualiza a interface
      setSelectedPartitura((prev: any) => ({ ...prev, pdf_urls: [] }));
      refetchArquivosPartitura(); // <-- Garante atualização da lista!
      toast.success('Todos os arquivos foram deletados.');
    } catch (err: any) {
      toast.error('Erro inesperado: ' + err.message);
    }
  }

  // Função de ordenação por instrumento com sinônimos/abreviações
  function ordenarArquivosPorInstrumento(arquivos: any[]): any[] {
    function getInitialNumber(file: any): number | null {
      const name = file.nome || file.fileName || '';
      const match = name.match(/^\d{1,3}[.\-_ ]/);
      return match ? parseInt(match[0], 10) : null;
    }
    // Ordem tradicional dos instrumentos (de cima para baixo)
    const instrumentOrder = [
      'Grade', 'Partitura', 'Maestro',
      // Madeiras
      'Piccolo', 'Píccolo', 'Flautim', 'Flauta', 'Flute1', 'Flute2', 'Flute', 'Oboé', 'Oboe1', 'Oboe2', 'Oboe', 'Corne Inglês', 'English Horn',
      'Clarinete', 'Clarinet1', 'Clarinet2', 'Clarinet', 'Clarone', 'Bass Clarinet', 'Fagote', 'Bassoon1', 'Bassoon2', 'Bassoon', 'Contrafagote', 'Contrabassoon',
      // Metais
      'Trompa', 'Horn1', 'Horn2', 'Horn3', 'Horn4', 'Horn', 'Trompete', 'Trumpet1', 'Trumpet2', 'Trumpet', 'Trombone', 'AltoTrombone', 'TenorTrombone', 'BassTrombone', 'Tuba',
      // Percussão
      'Tímpanos', 'Timpani', 'Percussão', 'Percussion',
      // Outros
      'Harpa', 'Harp', 'Piano',
      // Cordas
      'Violino 1', 'Violin1', 'Violino 2', 'Violin2', 'Violino', 'Violin', 'Viola', 'Violoncelo', 'Cello', 'Contrabaixo', 'Bass'
    ];
    const instrumentSynonyms: Record<string, string[]> = {
      'Flautim': ['flautim', 'picc', 'piccolo', 'fl picc'],
      'Piccolo': ['piccolo', 'picc', 'flautim'],
      'Flauta': ['flauta', 'fl'],
      'Oboé': ['oboé', 'oboe', 'ob'],
      'Clarinete': ['clarinete', 'cl', 'clarinet'],
      'Fagote': ['fagote', 'fg', 'bassoon', 'bassoon 1', 'bassoon 2'],
      'Trompa': ['trompa', 'tpa', 'horn', 'horns', 'cors', 'cor', 'horn 1', 'horn 2', 'horn 3', 'horn 4', 'cor 1', 'cor 2', 'cor 3', 'cor 4'],
      'Trompete': ['trompete', 'tpe', 'trumpet', 'tpt', 'trumpet 1', 'trumpet 2', 'trumpet 3', 'tpt 1', 'tpt 2', 'tpt 3'],
      'Trombone': ['trombone', 'tbn'],
      'Tímpanos': ['tímpanos', 'tim', 'timpani'],
      'Percussão': ['percussão', 'perc'],
      'Violino 1': ['violino 1', 'v1', 'vl1'],
      'Violino 2': ['violino 2', 'v2', 'vl2'],
      'Viola': ['viola', 'vla'],
      'Violoncelo': ['violoncelo', 'vc', 'cello'],
      'Contrabaixo': ['contrabaixo', 'cb'],
      'Piano': ['piano', 'pno'],
      'Harpa': ['harpa', 'hpa'],
    };
    const arquivosRestantes = [...arquivos];
    const ordenados: any[] = [];
    for (const instrumento of instrumentOrder) {
      const sinos = instrumentSynonyms[instrumento] || [instrumento.toLowerCase()];
      for (let i = 0; i < arquivosRestantes.length; ) {
        const nomeArquivo = (arquivosRestantes[i].nome || '').toLowerCase();
        if (sinos.some(s => nomeArquivo.includes(s))) {
          ordenados.push(arquivosRestantes[i]);
          arquivosRestantes.splice(i, 1);
        } else {
          i++;
        }
      }
    }
    // Adiciona os que não foram identificados ao final
    return [...ordenados, ...arquivosRestantes];
  }

  if (profile === null) {
    return <div className="p-8 text-center text-gray-500">Carregando perfil...</div>;
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <PartituraPageHeader onNewPartitura={handleNewPartitura} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error && error.message !== 'JWT expired') {
    return (
      <div className="space-y-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <PartituraPageHeader onNewPartitura={handleNewPartitura} />
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-red-600 mb-4">Erro ao carregar partituras: {error.message}</p>
            <Button onClick={handleForceRefresh} variant="outline">
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <PartituraPageHeader onNewPartitura={() => navigate('/partituras/nova')} />
      </div>

      {/* Barra de pesquisa e filtros */}
      <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
        {/* Campo de busca aprimorado */}
        <div className="relative flex items-center w-full md:w-96 min-w-[320px]">
          <span className="absolute left-3 text-gray-400">
            <Search className="h-5 w-5" />
          </span>
          <Input
            type="search"
            placeholder="Buscar por título, compositor, instrumentação..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="h-12 pl-10 pr-20 text-base shadow-sm border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            style={{ minWidth: 0 }}
          />
          {searchTerm && (
            <Button variant="ghost" size="sm" onClick={() => handleSearch('')} className="absolute right-2">
              Limpar
            </Button>
          )}
        </div>

        {/* Dropdown multi-select de filtros */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-center md:w-auto min-w-[120px]">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4 space-y-2">
            <div className="font-medium mb-2">Escolha os critérios:</div>
            {filterOptions.map((opt) => (
              <div key={opt.value} className="flex items-center space-x-2 mb-1">
                <Checkbox
                  checked={selectedFilters.includes(opt.value)}
                  onCheckedChange={() => handleFilterToggle(opt.value)}
                  id={`filter-${opt.value}`}
                />
                <label htmlFor={`filter-${opt.value}`} className="text-sm cursor-pointer">{opt.label}</label>
              </div>
            ))}
            <Button variant="secondary" onClick={handleClearFilters} className="w-full mt-2">
              Limpar Filtros
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      {/* Campos de filtro dinâmicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {selectedFilters.includes('Setor') && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Setor</h4>
                    <Select value={selectedSetor} onValueChange={handleSetorChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Todos os setores" />
                      </SelectTrigger>
                      <SelectContent>
                <SelectItem value="all">Todos os setores</SelectItem>
                        <SelectItem value="Acervo OSUFBA">Acervo OSUFBA</SelectItem>
                        <SelectItem value="Acervo Schuwebel">Acervo Schuwebel</SelectItem>
                        <SelectItem value="Acervo Pino">Acervo Pino</SelectItem>
                        <SelectItem value="Acervo Piero">Acervo Piero</SelectItem>
                        <SelectItem value="Memorial Lindenberg Cardoso">Memorial Lindenberg Cardoso</SelectItem>
                        <SelectItem value="Biblioteca EMUS">Biblioteca EMUS</SelectItem>
                        <SelectItem value="Compositores da Bahia">Compositores da Bahia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
        )}
        {selectedFilters.includes('Compositor') && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Compositor</h4>
                    <Input
                      type="text"
                      placeholder="Filtrar por compositor"
                      value={selectedCompositor}
                      onChange={(e) => handleCompositorChange(e.target.value)}
              className="h-10"
                    />
                  </div>
        )}
        {selectedFilters.includes('Gênero') && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Gênero</h4>
                    <Input
                      type="text"
                      placeholder="Filtrar por gênero"
                      value={selectedGenero}
                      onChange={(e) => handleGeneroChange(e.target.value)}
              className="h-10"
                    />
                  </div>
        )}
        {selectedFilters.includes('Digitalizado') && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Digitalizado</h4>
                    <Select value={showDigitalizado} onValueChange={handleDigitalizadoChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="true">Sim</SelectItem>
                        <SelectItem value="false">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
        )}
      </div>

      {/* Resultados */}
      {filteredPartituras && filteredPartituras.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPartituras.map((partitura) => (
            <PartituraCard
              key={partitura.id}
              partitura={partitura}
              relatedArquivos={partitura.pdf_urls || []}
              onView={handleViewDetails}
              onDownload={() => {}}
            />
          ))}
        </div>
      ) : (
        <PartituraEmptyState 
          searchTerm={searchTerm}
          onAddPartitura={() => navigate('/partituras/nova')}
        />
      )}

      {/* Dialog de Detalhes */}
      <Dialog open={!!selectedPartitura} onOpenChange={(open) => !open && setSelectedPartitura(null)}>
        <DialogContent className="w-full p-2 md:max-w-4xl md:p-8 max-h-[90vh] overflow-y-auto" aria-describedby="partitura-details-description">
          <DialogHeader>
            <DialogTitle>{selectedPartitura?.titulo}</DialogTitle>
            <DialogDescription id="partitura-details-description">
              Detalhes completos da partitura, incluindo informações de catalogação e arquivos digitais disponíveis.
            </DialogDescription>
          </DialogHeader>
          {selectedPartitura && (
            <div className="space-y-4">
              {/* Detalhes da partitura em 2 colunas */}
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 text-sm md:text-base px-1 md:px-0">
                <div>
                  <strong>Compositor:</strong> {selectedPartitura.compositor}
                </div>
                <div>
                  <strong>Setor:</strong> {selectedPartitura.setor}
                </div>
                <div>
                  <strong>Instrumentação:</strong> {selectedPartitura.instrumentacao}
                </div>
                <div>
                  <strong>Edição:</strong> {selectedPartitura.edicao}
                </div>
                <div>
                  <strong>Ano de Edição:</strong> {selectedPartitura.ano_edicao}
                </div>
                <div>
                  <strong>Nº Armário:</strong> {selectedPartitura.numero_armario}
                </div>
                <div>
                  <strong>Nº Prateleira:</strong> {selectedPartitura.numero_prateleira}
                </div>
                <div>
                  <strong>Nº Pasta:</strong> {selectedPartitura.numero_pasta}
                </div>
                <div>
                  <strong>Tonalidade:</strong> {selectedPartitura.tonalidade}
                </div>
                <div>
                  <strong>Gênero:</strong> {selectedPartitura.genero}
                </div>
                <div>
                  <strong>Digitalizado:</strong> {selectedPartitura.digitalizado ? 'Sim' : 'Não'}
                </div>
                <div className="md:col-span-2">
                  <strong>Observações:</strong> {selectedPartitura.observacoes}
                </div>
              </div>

              {/* Set de partituras sempre em 1 coluna */}
              {arquivosPartitura && arquivosPartitura.length > 0 && (
                <div className="w-full max-w-2xl mx-auto">
                  <Collapsible open={isSetOpen} onOpenChange={setIsSetOpen}>
                    <CollapsibleTrigger asChild>
                      <button
                        className="flex items-center gap-2 px-2 py-2 rounded font-bold text-sm md:text-base bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 w-full justify-center mt-4"
                        type="button"
                      >
                        {isSetOpen ? (
                          <>
                            <Minus className="h-5 w-5" />
                            Ocultar set de partituras
                          </>
                        ) : (
                          <>
                            <Plus className="h-5 w-5" />
                            Mostrar set de partituras
                          </>
                        )}
                        <span className="ml-2 text-xs font-normal">({arquivosPartitura.length})</span>
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="w-full flex flex-col gap-2 mt-2">
                        {/* Ajuste para responsividade mobile */}
                        <div className="md:hidden text-xs text-gray-500 mb-2">Arraste para o lado para ver mais informações</div>
                        {/* Botão de exclusão de todos os arquivos */}
                        <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-red-50">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-red-700">Excluir todos os arquivos</span>
                            <span className="text-xs text-red-500">Este botão exclui <b>todos</b> os arquivos da lista de uma só vez.</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteAllPdfs(selectedPartitura.id, arquivosPartitura)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                        {/* Lista de arquivos individuais */}
                        {ordenarArquivosPorInstrumento(arquivosPartitura).map((file: any, index: number) => (
                          <div key={index} className="flex items-center justify-between py-2 px-1 md:px-3 rounded-lg hover:bg-gray-50 text-xs md:text-base">
                            <div className="flex items-center space-x-4">
                              <Music className="h-6 w-6 text-blue-400" />
                              <div>
                                <button 
                                  type="button"
                                  className="font-medium text-blue-600 hover:underline disabled:text-gray-400 disabled:no-underline bg-transparent border-0 p-0 cursor-pointer break-all text-xs md:text-base"
                                  onClick={() => setSelectedPdfFile(file)}
                                  disabled={downloadingFile === file.nome}
                                >
                                  {downloadingFile === file.nome ? 'Baixando...' : file.nome}
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {canEditOrDelete && (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="outline" className="w-32 md:w-48 text-xs md:text-base justify-start">
                                    {file.instrument
                                      ? instrumentList.find(i => i.value === file.instrument)?.label || file.instrument
                                      : 'Classificar...'}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 w-64">
                                  <Command>
                                    <CommandInput placeholder="Buscar instrumento..." />
                                    <CommandList>
                                      <CommandEmpty>Nenhum instrumento encontrado.</CommandEmpty>
                                      {instrumentList.map(instrument => (
                                        <CommandItem
                                          key={instrument.value}
                                          value={instrument.value}
                                          onSelect={() => {
                                            handleInstrumentChange(selectedPartitura.id, file.nome, instrument.value);
                                          }}
                                        >
                                          {instrument.label}
                                        </CommandItem>
                                      ))}
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                              )}
                              {canEditOrDelete && (
                              <Button variant="ghost" size="icon" onClick={() => handleDeletePdf(selectedPartitura.id, file)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                {canEditOrDelete && (
                <Button variant="outline" onClick={() => navigate(`/partituras/nova?id=${selectedPartitura.id}`)}>
                  Editar
                </Button>
                )}
                {canEditOrDelete && (
                <Button variant="destructive" onClick={async () => {
                  if (window.confirm('Tem certeza que deseja deletar esta partitura?')) {
                    try {
                      await deletePartitura.mutateAsync(selectedPartitura.id);
                      setSelectedPartitura(null);
                    } catch (error: any) {
                      console.error('Error deleting partitura:', error);
                    }
                  }
                }}>
                  Deletar
                </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de visualização de PDF */}
      <Dialog open={!!selectedPdfFile} onOpenChange={(open) => !open && setSelectedPdfFile(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" aria-describedby="pdf-viewer-description">
          <DialogHeader>
            <DialogTitle>Visualização de Arquivo</DialogTitle>
            <DialogDescription id="pdf-viewer-description">
              Visualize ou baixe o arquivo PDF da partitura selecionada.
            </DialogDescription>
          </DialogHeader>
          {selectedPdfFile && (
            <PartituraViewer
              isOpen={!!selectedPdfFile}
              onClose={() => setSelectedPdfFile(null)}
              arquivo={{
                nome: selectedPdfFile.nome,
                tipo: selectedPdfFile.type || 'application/pdf',
                arquivo_url: selectedPdfFile.url,
              }}
              onDownload={() => handleDownloadSecurely(selectedPartitura.id, selectedPdfFile.nome)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Upload */}
      <UploadDialog>
        <div></div>
      </UploadDialog>
    </div>
  );
};

export default Partituras;
