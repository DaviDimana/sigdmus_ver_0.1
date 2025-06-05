
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageSquare } from 'lucide-react';

interface RequestAuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (mensagem: string) => void;
  arquivoNome: string;
}

const RequestAuthDialog: React.FC<RequestAuthDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  arquivoNome
}) => {
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = () => {
    onSubmit(mensagem);
    setMensagem('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Solicitar Autorização</span>
          </DialogTitle>
          <DialogDescription>
            Este arquivo requer autorização para download. Envie uma mensagem ao responsável.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Arquivo:</Label>
            <p className="text-sm text-gray-600 mt-1">{arquivoNome}</p>
          </div>
          
          <div>
            <Label htmlFor="mensagem">Mensagem (opcional)</Label>
            <Textarea
              id="mensagem"
              placeholder="Explique o motivo da solicitação..."
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            Enviar Solicitação
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestAuthDialog;
