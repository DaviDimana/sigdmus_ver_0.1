import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, User, Music, FileText, Trash2, Edit, Info } from 'lucide-react';
import ProgramViewer from './ProgramViewer';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

interface PerformanceDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  performance: any;
  onEdit?: (performance: any) => void;
  onDelete?: (performance: any) => void;
}

const PerformanceDetailsDialog: React.FC<PerformanceDetailsDialogProps> = ({
  isOpen,
  onClose,
  performance,
  onEdit,
  onDelete,
}) => {
  const [showProgram, setShowProgram] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [sharedProgramUrl, setSharedProgramUrl] = React.useState<string | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [arquivos, setArquivos] = useState<any[]>([]);
  const [sharedProgramFile, setSharedProgramFile] = useState<any | null>(null);

  useEffect(() => {
    async function fetchArquivos() {
      if (performance?.id) {
        const { data } = await supabase
          .from('arquivos')
          .select('*')
          .eq('performance_id', performance.id);
        setArquivos(data || []);
      }
    }
    if (isOpen && performance?.id) fetchArquivos();
  }, [isOpen, performance?.id]);

  React.useEffect(() => {
    async function fetchSharedProgramFile() {
      if (!performance) return;
      // Buscar todas as performances do mesmo grupo
      const { data: groupPerformances, error: perfError } = await supabase
        .from('performances')
        .select('id')
        .eq('local', performance.local)
        .eq('data', performance.data)
        .eq('horario', performance.horario);
      if (perfError || !groupPerformances || groupPerformances.length === 0) {
        setSharedProgramFile(null);
        return;
      }
      const perfIds = groupPerformances.map((p: any) => p.id);
      // Buscar arquivos do tipo programa para qualquer uma dessas performances
      const { data: arquivos, error: arqError } = await supabase
        .from('arquivos')
        .select('*')
        .in('performance_id', perfIds);
      if (!arqError && arquivos && arquivos.length > 0) {
        setSharedProgramFile(arquivos[0]); // Pega o primeiro encontrado
      } else {
        setSharedProgramFile(null);
      }
    }
    if (isOpen) fetchSharedProgramFile();
  }, [isOpen, performance]);

  if (!performance) return null;

  // Função para deletar o arquivo (chama onEdit com flag especial ou onDelete, conforme lógica do app)
  const handleDeleteProgram = async () => {
    if (!onEdit) return;
    setIsDeleting(true);
    try {
      await onEdit({ ...performance, removeProgramFile: true });
      toast.success('Programa de Concerto removido com sucesso!');
      setShowProgram(false);
    } catch (e) {
      toast.error('Erro ao remover o programa.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Função utilitária para formatar data DD-MM-AAAA
  function formatDateBR(dateStr: string) {
    if (!dateStr) return '';
    const [ano, mes, dia] = dateStr.split('-');
    return `${dia}-${mes}-${ano}`;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Performance</DialogTitle>
          <div className="mt-2">
            <span className="block text-xl font-bold text-blue-900">{performance.partitura?.titulo || 'Sem título'}</span>
            <span className="block text-md text-gray-700 font-medium">{performance.partitura?.compositor || 'Sem compositor'}</span>
          </div>
          <DialogDescription>Veja as informações completas da performance selecionada.</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Informações principais em duas colunas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div><span className="font-semibold">Compositor:</span> {performance.nome_compositor}</div>
              <div><span className="font-semibold">Local:</span> {performance.local}</div>
              <div><span className="font-semibold">Data:</span> {performance.data}</div>
              <div><span className="font-semibold">Horário:</span> {performance.horario}</div>
              <div><span className="font-semibold">Maestros:</span> {performance.maestros}</div>
              {performance.interpretes && (
                <div><span className="font-semibold">Intérpretes:</span> {performance.interpretes}</div>
              )}
            </div>
            <div className="space-y-2">
              <div><span className="font-semibold">Release:</span> {performance.release || <span className="text-gray-400">-</span>}</div>
              <div><span className="font-semibold">Status:</span> <Badge variant="outline" className="bg-blue-100 text-blue-800">Performance</Badge></div>
            </div>
          </div>

          {/* Seção do Programa de Concerto */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Programa de Concerto</h3>
            {(arquivos.length > 0 ? arquivos : sharedProgramFile ? [sharedProgramFile] : []).map(arquivo => (
              <div key={arquivo.id} className="bg-gray-50 rounded-lg p-3 flex flex-col gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <a
                    href={arquivo.url}
                    className="text-blue-700 font-medium hover:underline truncate focus:outline-none"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {arquivo.nome || `Programa dia ${formatDateBR(performance.data)}`}
                  </a>
                </div>
              </div>
            ))}
            {arquivos.length === 0 && !sharedProgramFile && (
              <div className="text-gray-500 italic">Nenhum programa de concerto carregado.</div>
            )}
          </div>

          {/* Botões de ação */}
          <div className="flex gap-2 justify-end pt-4">
            {onEdit && (
              <Button variant="outline" onClick={() => onEdit(performance)}>
                <Edit className="h-4 w-4 mr-1" /> Editar
              </Button>
            )}
            {onDelete && (
              <Button variant="destructive" onClick={() => onDelete(performance)}>
                <Trash2 className="h-4 w-4 mr-1" /> Deletar
              </Button>
            )}
          </div>
        </div>
        {/* Modal para visualizar o programa de concerto */}
        {sharedProgramUrl && (
          <ProgramViewer
            isOpen={showProgram}
            onClose={() => setShowProgram(false)}
            performance={{ ...performance, programa_arquivo_url: sharedProgramUrl }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PerformanceDetailsDialog; 