import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, User, Music, FileText, Trash2, Edit } from 'lucide-react';
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

  React.useEffect(() => {
    async function fetchSharedProgram() {
      if (!performance) return;
      if (performance.programa_arquivo_url) {
        setSharedProgramUrl(performance.programa_arquivo_url);
        return;
      }
      // Buscar entre as performances do mesmo local, data e horário
      const { data: groupPerformances, error } = await supabase
        .from('performances')
        .select('programa_arquivo_url')
        .eq('local', performance.local)
        .eq('data', performance.data)
        .eq('horario', performance.horario);
      if (!error && groupPerformances) {
        const found = groupPerformances.find((p: any) => p.programa_arquivo_url && p.programa_arquivo_url.trim() !== '');
        if (found && found.programa_arquivo_url) {
          setSharedProgramUrl(found.programa_arquivo_url);
        } else {
          setSharedProgramUrl(null);
        }
      } else {
        setSharedProgramUrl(null);
      }
    }
    if (isOpen) fetchSharedProgram();
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
            {sharedProgramUrl ? (
              <div className="bg-gray-50 rounded-lg p-3 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  {/* Link azul com texto customizado e modal PDF */}
                  <button
                    className="text-blue-700 font-medium hover:underline truncate focus:outline-none"
                    onClick={() => setShowProgram(true)}
                    type="button"
                  >
                    {`Programa dia ${formatDateBR(performance.data)}`}
                  </button>
                  {/* Ícone de lixeira para remover com confirmação */}
                  <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
                    <AlertDialogTrigger asChild>
                      <button
                        className="ml-2 text-red-600 hover:text-red-800 focus:outline-none"
                        title="Remover programa de concerto"
                        type="button"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover Programa de Concerto</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja remover o programa de concerto? Esta ação não poderá ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            setConfirmDeleteOpen(false);
                            handleDeleteProgram();
                          }}
                        >
                          Remover
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ) : (
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