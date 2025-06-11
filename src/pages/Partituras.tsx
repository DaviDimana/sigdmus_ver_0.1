
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePartituras } from '@/hooks/usePartituras';
import { useArquivos } from '@/hooks/useArquivos';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import PartituraViewer from '@/components/PartituraViewer';
import UploadDialog from '@/components/UploadDialog';
import PartituraCard from '@/components/PartituraCard';
import PartiuraPageHeader from '@/components/PartituraPageHeader';
import PartituraEmptyState from '@/components/PartituraEmptyState';

const Partituras = () => {
  const navigate = useNavigate();
  const { partituras, isLoading } = usePartituras();
  const { arquivos, downloadArquivo } = useArquivos();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPartitura, setSelectedPartitura] = useState<any>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedPartituraForUpload, setSelectedPartituraForUpload] = useState<any>(null);

  const filteredPartituras = partituras?.filter(partitura =>
    partitura.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partitura.compositor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (partitura.genero && partitura.genero.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const handleDownload = async (arquivo: any) => {
    try {
      await downloadArquivo.mutateAsync(arquivo);
      toast.success('Download iniciado com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer download:', error);
      toast.error('Erro ao fazer download do arquivo');
    }
  };

  const handleView = (partitura: any) => {
    setSelectedPartitura(partitura);
    setViewerOpen(true);
  };

  const handleUpload = (partitura: any) => {
    setSelectedPartituraForUpload(partitura);
    setUploadDialogOpen(true);
  };

  const canUpload = user && (
    user.role === 'ADMIN' || 
    user.role === 'GERENTE' || 
    user.role === 'ARQUIVISTA'
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const selectedPartituraArquivos = selectedPartitura 
    ? arquivos?.filter(arquivo => arquivo.partitura_id === selectedPartitura.id) || []
    : [];

  return (
    <div className="space-y-6">
      <PartiuraPageHeader onNewPartitura={() => navigate('/nova-partitura')} />
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por título, compositor ou gênero..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartituras.map((partitura) => {
          const relatedArquivos = arquivos?.filter(arquivo => arquivo.partitura_id === partitura.id) || [];
          
          return (
            <PartituraCard
              key={partitura.id}
              partitura={partitura}
              relatedArquivos={relatedArquivos}
              canUpload={canUpload}
              onView={handleView}
              onDownload={handleDownload}
              onUpload={handleUpload}
            />
          );
        })}
      </div>

      {filteredPartituras.length === 0 && !isLoading && (
        <PartituraEmptyState 
          searchTerm={searchTerm}
          onAddPartitura={() => navigate('/nova-partitura')}
        />
      )}

      {/* Dialogs */}
      {selectedPartitura && (
        <PartituraViewer
          isOpen={viewerOpen}
          onClose={() => setViewerOpen(false)}
          arquivo={selectedPartituraArquivos.length > 0 ? selectedPartituraArquivos[0] : null}
          onDownload={() => selectedPartituraArquivos.length > 0 && handleDownload(selectedPartituraArquivos[0])}
        />
      )}

      <UploadDialog
        isOpen={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        partituraId={selectedPartituraForUpload?.id}
        partituraTitle={selectedPartituraForUpload?.titulo}
      />
    </div>
  );
};

export default Partituras;
