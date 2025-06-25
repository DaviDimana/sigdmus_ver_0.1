import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';

interface PartituraViewerProps {
  isOpen: boolean;
  onClose: () => void;
  arquivo: {
    nome: string;
    tipo?: string;
    arquivo_url?: string;
  };
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
    <div className="flex-1 overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <span className="font-medium">{arquivo.nome}</span>
      </div>
      
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
                'Este tipo de arquivo não pode ser visualizado inline. Use o botão Download.' :
                'URL do arquivo não disponível.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartituraViewer;
