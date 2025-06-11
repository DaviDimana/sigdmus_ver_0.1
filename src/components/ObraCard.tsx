
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Download, Eye, Trash2, Info, Calendar } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ObraCardProps {
  obra: string;
  arquivos: any[];
  onDownload: (arquivo: any) => void;
  onView: (arquivo: any) => void;
  onDelete: (arquivo: any) => void;
  getFileIcon: (tipo: string) => React.ReactNode;
  formatFileSize: (bytes: number) => string;
  downloadArquivo: any;
  deleteArquivo: any;
  onViewDetails?: (obra: string) => void;
  onViewPerformances?: (obra: string) => void;
}

const ObraCard: React.FC<ObraCardProps> = ({
  obra,
  arquivos,
  onDownload,
  onView,
  onDelete,
  getFileIcon,
  formatFileSize,
  downloadArquivo,
  deleteArquivo,
  onViewDetails,
  onViewPerformances
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const totalSize = arquivos.reduce((sum, arquivo) => sum + arquivo.tamanho, 0);
  const totalDownloads = arquivos.reduce((sum, arquivo) => sum + (arquivo.downloads || 0), 0);
  const hasRestrictedFiles = arquivos.some(arquivo => arquivo.restricao_download);

  return (
    <Card className="hover:shadow-xl hover:shadow-blue-300/50 transition-shadow w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {hasRestrictedFiles && (
                <Badge variant="outline" className="text-xs">
                  Partes Restritas
                </Badge>
              )}
            </div>
          </div>
          <CardTitle className="text-base sm:text-lg leading-tight">{obra}</CardTitle>
          <CardDescription className="text-sm">
            Conjunto de partituras da obra
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-0 p-4 sm:p-6">
          <div className="space-y-2 text-xs sm:text-sm mb-4">
            <div className="flex flex-wrap gap-2">
              <span className="font-medium">Tamanho:</span> 
              <span>{formatFileSize(totalSize)}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="font-medium">Downloads:</span> 
              <span>{totalDownloads}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="font-medium">Categorias:</span> 
              <span className="break-words">{[...new Set(arquivos.map(a => a.categoria))].join(', ')}</span>
            </div>
          </div>

          {/* Botões de ação da obra */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails?.(obra)}
              className="flex-1"
            >
              <Info className="h-3 w-3 mr-2" />
              <span>Detalhes da Obra</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewPerformances?.(obra)}
              className="flex-1"
            >
              <Calendar className="h-3 w-3 mr-2" />
              <span>Ver Performances</span>
            </Button>
          </div>

          <CollapsibleContent>
            <div className="space-y-3 mt-4 border-t pt-4">
              <h4 className="font-medium text-sm text-gray-700">Partes da obra:</h4>
              {arquivos.map((arquivo) => (
                <div key={arquivo.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {getFileIcon(arquivo.tipo)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {arquivo.nome}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {arquivo.categoria}
                        </Badge>
                        {arquivo.restricao_download && (
                          <Badge variant="outline" className="text-xs text-orange-600">
                            Restrito
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500">
                          {formatFileSize(arquivo.tamanho)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 sm:space-x-1 justify-end">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onView(arquivo)}
                      className="h-8 w-8 p-0 flex-shrink-0"
                      title="Visualizar"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => onDownload(arquivo)}
                      disabled={downloadArquivo.isPending}
                      className="h-8 w-8 p-0 flex-shrink-0"
                      title="Download"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onDelete(arquivo)}
                      disabled={deleteArquivo.isPending}
                      className="h-8 w-8 p-0 flex-shrink-0 hover:bg-red-50 hover:text-red-600 hover:border-red-300 hover:shadow-red-200/50"
                      title="Excluir"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleContent>

          {/* Badge de arquivos e seta de collapse centralizados na parte inferior */}
          <div className="flex justify-center items-center space-x-2 mt-4 pt-2 border-t">
            <Badge variant="secondary" className="text-xs">{arquivos.length} arquivo(s)</Badge>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardContent>
      </Collapsible>
    </Card>
  );
};

export default ObraCard;
