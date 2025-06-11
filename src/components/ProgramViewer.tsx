
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';

interface ProgramViewerProps {
  isOpen: boolean;
  onClose: () => void;
  performance: {
    titulo_obra: string;
    programa_url?: string;
  };
  onDownload?: () => void;
}

const ProgramViewer: React.FC<ProgramViewerProps> = ({
  isOpen,
  onClose,
  performance,
  onDownload
}) => {
  if (!performance) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Programa do Concerto - {performance.titulo_obra}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium">Programa do Concerto</span>
            <div className="flex space-x-2">
              {onDownload && (
                <Button
                  size="sm"
                  onClick={onDownload}
                  className="flex items-center space-x-1"
                >
                  <Download className="h-3 w-3" />
                  <span>Download</span>
                </Button>
              )}
              {performance.programa_url && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(performance.programa_url, '_blank')}
                  className="flex items-center space-x-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Abrir</span>
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-auto">
            {performance.programa_url ? (
              <div className="w-full h-[70vh]">
                <iframe
                  src={performance.programa_url}
                  className="w-full h-full border rounded"
                  title={`Programa do Concerto - ${performance.titulo_obra}`}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <p className="text-lg mb-2">Programa não disponível</p>
                <p className="text-sm text-center">
                  O programa do concerto não foi encontrado ou ainda não foi carregado.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramViewer;
