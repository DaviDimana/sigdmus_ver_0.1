import React, { useState, useEffect } from 'react';
import { usePartituras } from '@/hooks/usePartituras';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, Download, Upload, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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

const Partituras = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSetor, setSelectedSetor] = useState<string>('');
  const [selectedCompositor, setSelectedCompositor] = useState<string>('');
  const [selectedGenero, setSelectedGenero] = useState<string>('');
  const [showDigitalizado, setShowDigitalizado] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPartitura, setSelectedPartitura] = useState<any>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const { partituras, isLoading, error } = usePartituras();

  useEffect(() => {
    if (error?.message === 'JWT expired') {
      toast.error('Sua sessão expirou. Por favor, faça login novamente.');
      signOut();
      navigate('/auth');
    }
  }, [error, signOut, navigate]);

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

  function sortByInstrumentOrder(files: { fileName: string; instrument: string | null }[]) {
    // Função auxiliar para extrair número inicial do nome do arquivo
    function getInitialNumber(fileName: string): number | null {
      const match = fileName.match(/^(\d{1,3})[.\-_ ]/);
      return match ? parseInt(match[1], 10) : null;
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
      const numA = getInitialNumber(a.fileName);
      const numB = getInitialNumber(b.fileName);
      if (numA !== null && numB !== null) {
        if (numA !== numB) return numA - numB;
      } else if (numA !== null) {
        return -1; // a vem antes de b
      } else if (numB !== null) {
        return 1; // b vem antes de a
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
      const { error: storageError } = await supabase.storage.from('arquivos').remove([`${partituraId}/${fileInfo.fileName}`]);
      if (storageError) {
        alert('Erro ao remover do Storage: ' + storageError.message);
        return;
      }
      // Remove do array pdf_urls
      const { data: partitura, error: fetchError } = await supabase
        .from('partituras')
        .select('pdf_urls')
        .eq('id', partituraId)
        .single();
      if (fetchError) {
        alert('Erro ao buscar partitura: ' + fetchError.message);
        return;
      }
      const newPdfUrls = (partitura.pdf_urls || []).filter((f: any) => f.url !== fileInfo.url);
      const { error: updateError } = await supabase
        .from('partituras')
        .update({ pdf_urls: newPdfUrls })
        .eq('id', partituraId);
      if (updateError) {
        alert('Erro ao atualizar partitura: ' + updateError.message);
        return;
      }
      // Atualiza a interface
      setSelectedPartitura((prev: any) => ({ ...prev, pdf_urls: newPdfUrls }));
    } catch (err: any) {
      alert('Erro inesperado: ' + err.message);
    }
  }

  // Função para deletar todos os arquivos PDF de uma partitura
  async function handleDeleteAllPdfs(partituraId: string, pdfUrls: { url: string; fileName: string; instrument: string | null }[]) {
    if (!window.confirm('Tem certeza que deseja apagar TODOS os arquivos digitalizados desta partitura?')) return;
    try {
      // Remove todos do Storage
      const filePaths = pdfUrls.map(f => `${partituraId}/${f.fileName}`);
      if (filePaths.length > 0) {
        const { error: storageError } = await supabase.storage.from('arquivos').remove(filePaths);
        if (storageError) {
          alert('Erro ao remover do Storage: ' + storageError.message);
          return;
        }
      }
      // Limpa o array pdf_urls
      const { error: updateError } = await supabase
        .from('partituras')
        .update({ pdf_urls: [] })
        .eq('id', partituraId);
      if (updateError) {
        alert('Erro ao atualizar partitura: ' + updateError.message);
        return;
      }
      // Atualiza a interface
      setSelectedPartitura((prev: any) => ({ ...prev, pdf_urls: [] }));
    } catch (err: any) {
      alert('Erro inesperado: ' + err.message);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PartituraPageHeader onNewPartitura={handleNewPartitura} />
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
        <PartituraPageHeader onNewPartitura={handleNewPartitura} />
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-red-600">Erro ao carregar partituras: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PartituraPageHeader onNewPartitura={() => navigate('/partituras/nova')} />

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
              relatedArquivos={[]}
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPartitura?.titulo}</DialogTitle>
          </DialogHeader>
          {selectedPartitura && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {selectedPartitura.pdf_urls && selectedPartitura.pdf_urls.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1">
                    <strong>Arquivos PDF Digitalizados:</strong>
                    <button
                      className="text-red-500 hover:text-red-700 text-sm border border-red-200 rounded px-2 py-1 ml-2"
                      onClick={() => handleDeleteAllPdfs(selectedPartitura.id, selectedPartitura.pdf_urls)}
                      title="Apagar todos os arquivos"
                    >
                      Apagar todos
                    </button>
                  </div>
                  <ul className="list-disc ml-6 mt-1 space-y-1">
                    {sortByInstrumentOrder(selectedPartitura.pdf_urls).map((fileInfo: { url: string; fileName: string; instrument: string | null }, idx: number) => (
                      <li key={idx} className="flex items-center gap-2">
                        <a href={fileInfo.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                          {fileInfo.fileName}
                        </a>
                        {fileInfo.instrument && (
                          <span className="ml-2 text-gray-500">({fileInfo.instrument})</span>
                        )}
                        <button
                          className="ml-2 text-red-500 hover:text-red-700"
                          title="Deletar arquivo"
                          onClick={() => handleDeletePdf(selectedPartitura.id, fileInfo)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => navigate(`/partituras/nova?id=${selectedPartitura.id}`)}>
                  Editar
                </Button>
                <Button variant="destructive" onClick={async () => {
                  if (window.confirm('Tem certeza que deseja deletar esta partitura?')) {
                    // Chamar deleção
                    const { error } = await supabase
                      .from('partituras')
                      .delete()
                      .eq('id', selectedPartitura.id);
                    if (!error) {
                      setSelectedPartitura(null);
                      window.location.reload();
                    } else {
                      alert('Erro ao deletar partitura: ' + error.message);
                    }
                  }
                }}>
                  Deletar
                </Button>
              </div>
            </div>
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
