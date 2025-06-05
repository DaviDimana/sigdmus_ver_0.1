
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';

interface PartituraViewerProps {
  isOpen: boolean;
  onClose: () => void;
  arquivo: any;
  onDownload: () => void;
}

const PartituraViewer: React.FC<PartituraViewerProps> = ({
  isOpen,
  onClose,
  arquivo,
  onDownload
}) => {
  if (!arquivo) return null;

  const isPDF = arquivo.tipo?.includes('pdf');
  const isImage = arquivo.tipo?.includes('image');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{arquivo.nome}</span>
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={onDownload}
                className="flex items-center space-x-1"
              >
                <Download className="h-3 w-3" />
                <span>Download</span>
              </Button>
              {arquivo.arquivo_url && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(arquivo.arquivo_url, '_blank')}
                  className="flex items-center space-x-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Abrir</span>
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          {isPDF && arquivo.arquivo_url ? (
            <div className="w-full h-[70vh]">
              <iframe
                src={arquivo.arquivo_url}
                className="w-full h-full border rounded"
                title={`Visualizar ${arquivo.nome}`}
              />
            </div>
          ) : isImage && arquivo.arquivo_url ? (
            <div className="flex justify-center">
              <img
                src={arquivo.arquivo_url}
                alt={arquivo.nome}
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <p className="text-lg mb-2">Prévia não disponível</p>
              <p className="text-sm text-center">
                {arquivo.arquivo_url ? 
                  'Este tipo de arquivo não pode ser visualizado inline. Use o botão Download ou Abrir.' :
                  'URL do arquivo não disponível.'
                }
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PartituraViewer;
