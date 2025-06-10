
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { FileText, Music, Calendar, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ObraDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  obra: string;
  arquivos: any[];
  formatFileSize: (bytes: number) => string;
}

const ObraDetailsDialog: React.FC<ObraDetailsDialogProps> = ({
  isOpen,
  onClose,
  obra,
  arquivos,
  formatFileSize
}) => {
  // Buscar partituras relacionadas à obra
  const { data: partituras = [] } = useQuery({
    queryKey: ['partituras-obra', obra],
    queryFn: async () => {
      console.log('Fetching partituras for obra:', obra);
      const { data, error } = await supabase
        .from('partituras')
        .select('*')
        .eq('titulo', obra);
      
      if (error) {
        console.error('Error fetching partituras:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: isOpen && !!obra,
  });

  const totalSize = arquivos.reduce((sum, arquivo) => sum + arquivo.tamanho, 0);
  const totalDownloads = arquivos.reduce((sum, arquivo) => sum + (arquivo.downloads || 0), 0);
  const categorias = [...new Set(arquivos.map(a => a.categoria))];
  const hasRestrictedFiles = arquivos.some(arquivo => arquivo.restricao_download);

  const getFileIcon = (tipo: string) => {
    if (tipo.includes('pdf')) return <FileText className="h-4 w-4 text-red-500" />;
    if (tipo.includes('audio') || tipo.includes('midi')) return <Music className="h-4 w-4 text-purple-500" />;
    return <FileText className="h-4 w-4 text-gray-500" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{obra}</DialogTitle>
          <DialogDescription>
            Informações detalhadas sobre a obra musical
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Estatísticas Gerais */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">{arquivos.length}</div>
              <div className="text-sm text-blue-600">Arquivos</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">{formatFileSize(totalSize)}</div>
              <div className="text-sm text-green-600">Tamanho Total</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">{totalDownloads}</div>
              <div className="text-sm text-purple-600">Downloads</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-700">{categorias.length}</div>
              <div className="text-sm text-orange-600">Categorias</div>
            </div>
          </div>

          {/* Informações das Partituras Cadastradas */}
          {partituras.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Partituras Cadastradas</h3>
              <div className="space-y-4">
                {partituras.map((partitura) => (
                  <div key={partitura.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary">{partitura.setor}</Badge>
                      {partitura.digitalizado && (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Digital
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-semibold text-lg">{partitura.titulo}</h4>
                    <p className="text-gray-600 mb-3">{partitura.compositor}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium">Instrumentação:</span> {partitura.instrumentacao}
                      </div>
                      {partitura.tonalidade && (
                        <div>
                          <span className="font-medium">Tonalidade:</span> {partitura.tonalidade}
                        </div>
                      )}
                      {partitura.genero && (
                        <div>
                          <span className="font-medium">Gênero:</span> {partitura.genero}
                        </div>
                      )}
                      {partitura.edicao && (
                        <div>
                          <span className="font-medium">Edição:</span> {partitura.edicao}
                        </div>
                      )}
                      {partitura.ano_edicao && (
                        <div>
                          <span className="font-medium">Ano da Edição:</span> {partitura.ano_edicao}
                        </div>
                      )}
                      {partitura.numero_armario && (
                        <div>
                          <span className="font-medium">Armário:</span> {partitura.numero_armario}
                        </div>
                      )}
                      {partitura.numero_prateleira && (
                        <div>
                          <span className="font-medium">Prateleira:</span> {partitura.numero_prateleira}
                        </div>
                      )}
                      {partitura.numero_pasta && (
                        <div>
                          <span className="font-medium">Pasta:</span> {partitura.numero_pasta}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categorias */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Categorias Disponíveis</h3>
            <div className="flex flex-wrap gap-2">
              {categorias.map((categoria, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {categoria}
                </Badge>
              ))}
            </div>
          </div>

          {/* Informações de Acesso */}
          {hasRestrictedFiles && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                  Atenção
                </Badge>
                <span className="text-sm text-yellow-800">
                  Esta obra contém arquivos com restrição de download
                </span>
              </div>
            </div>
          )}

          {/* Lista de Arquivos */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Arquivos da Obra</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {arquivos.map((arquivo) => (
                <div key={arquivo.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {getFileIcon(arquivo.tipo)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {arquivo.nome}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {arquivo.categoria}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatFileSize(arquivo.tamanho)}
                        </span>
                        {arquivo.restricao_download && (
                          <Badge variant="outline" className="text-xs text-orange-600">
                            Restrito
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Download className="h-3 w-3" />
                    <span>{arquivo.downloads || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metadados Adicionais */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Informações Adicionais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Data de Criação:</span>
                <p className="text-gray-600">
                  {new Date(Math.min(...arquivos.map(a => new Date(a.created_at).getTime()))).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Última Atualização:</span>
                <p className="text-gray-600">
                  {new Date(Math.max(...arquivos.map(a => new Date(a.created_at).getTime()))).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Total de Downloads:</span>
                <p className="text-gray-600">{totalDownloads}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Arquivos Restritos:</span>
                <p className="text-gray-600">
                  {arquivos.filter(a => a.restricao_download).length} de {arquivos.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ObraDetailsDialog;
