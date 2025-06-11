import React, { useState } from 'react';
import { usePartituras } from '@/hooks/usePartituras';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, Download, Upload } from 'lucide-react';
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

const Partituras = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSetor, setSelectedSetor] = useState<string>('');
  const [selectedCompositor, setSelectedCompositor] = useState<string>('');
  const [selectedGenero, setSelectedGenero] = useState<string>('');
  const [showDigitalizado, setShowDigitalizado] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPartitura, setSelectedPartitura] = useState<any>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadPartituraId, setUploadPartituraId] = useState<string>('');
  const [uploadPartituraTitle, setUploadPartituraTitle] = useState<string>('');

  const { partituras, isLoading, error } = usePartituras();

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

  const handleToggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleClearFilters = () => {
    setSelectedSetor('');
    setSelectedCompositor('');
    setSelectedGenero('');
    setShowDigitalizado('');
    setSearchTerm('');
  };

  const handleNewPartitura = () => {
    navigate('/nova-partitura');
  };

  const handleViewDetails = (partitura: any) => {
    setSelectedPartitura(partitura);
  };

  const handleUpload = (partitura: any) => {
    setUploadPartituraId(partitura.id);
    setUploadPartituraTitle(partitura.titulo);
    setIsUploadOpen(true);
  };

  const handleUploadClose = () => {
    setIsUploadOpen(false);
    setUploadPartituraId('');
    setUploadPartituraTitle('');
  };

  const filteredPartituras = partituras?.filter((partitura) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      partitura.titulo.toLowerCase().includes(searchTermLower) ||
      partitura.compositor.toLowerCase().includes(searchTermLower) ||
      partitura.instrumentacao.toLowerCase().includes(searchTermLower) ||
      (partitura.genero?.toLowerCase().includes(searchTermLower) ?? false);

    const matchesSetor = selectedSetor ? partitura.setor === selectedSetor : true;
    const matchesCompositor = selectedCompositor ? partitura.compositor === selectedCompositor : true;
    const matchesGenero = selectedGenero ? partitura.genero === selectedGenero : true;
    const matchesDigitalizado = showDigitalizado !== '' ? String(partitura.digitalizado) === showDigitalizado : true;

    return matchesSearch && matchesSetor && matchesCompositor && matchesGenero && matchesDigitalizado;
  });

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

  if (error) {
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
      <PartituraPageHeader onNewPartitura={() => navigate('/nova-partitura')} />

      {/* Barra de pesquisa e filtros */}
      <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Input
            type="search"
            placeholder="Buscar por título, compositor, instrumentação..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="h-10"
          />
          {searchTerm && (
            <Button variant="ghost" size="sm" onClick={() => handleSearch('')}>
              Limpar
            </Button>
          )}
        </div>

        <Collapsible className="w-full md:w-auto" open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-center md:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <Card>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Setor</h4>
                    <Select value={selectedSetor} onValueChange={handleSetorChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Todos os setores" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos os setores</SelectItem>
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

                  <div>
                    <h4 className="text-sm font-medium mb-2">Compositor</h4>
                    <Input
                      type="text"
                      placeholder="Filtrar por compositor"
                      value={selectedCompositor}
                      onChange={(e) => handleCompositorChange(e.target.value)}
                    />
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Gênero</h4>
                    <Input
                      type="text"
                      placeholder="Filtrar por gênero"
                      value={selectedGenero}
                      onChange={(e) => handleGeneroChange(e.target.value)}
                    />
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Digitalizado</h4>
                    <Select value={showDigitalizado} onValueChange={handleDigitalizadoChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="true">Sim</SelectItem>
                        <SelectItem value="false">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button variant="secondary" onClick={handleClearFilters} className="w-full">
                  Limpar Filtros
                </Button>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Resultados */}
      {filteredPartituras && filteredPartituras.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPartituras.map((partitura) => (
            <PartituraCard
              key={partitura.id}
              partitura={partitura}
              relatedArquivos={[]}
              canUpload={true}
              onView={handleViewDetails}
              onDownload={() => {}}
              onUpload={handleUpload}
            />
          ))}
        </div>
      ) : (
        <PartituraEmptyState 
          searchTerm={searchTerm}
          onAddPartitura={() => navigate('/nova-partitura')}
        />
      )}

      {/* Dialog de Detalhes */}
      <Dialog open={!!selectedPartitura} onOpenChange={(open) => !open && setSelectedPartitura(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPartitura?.titulo}</DialogTitle>
          </DialogHeader>
          {selectedPartitura && (
            <PartituraViewer 
              isOpen={!!selectedPartitura}
              onClose={() => setSelectedPartitura(null)}
              arquivo={{
                nome: selectedPartitura.titulo,
                tipo: 'application/pdf',
                arquivo_url: selectedPartitura.arquivo_url
              }}
              onDownload={() => {}}
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
