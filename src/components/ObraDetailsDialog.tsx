import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { FileText, Music, Calendar, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface ObraDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  obra: string;
  arquivos: any[];
  formatFileSize: (bytes: number) => string;
  onDeleteAllArquivos?: () => void;
}

const ObraDetailsDialog: React.FC<ObraDetailsDialogProps> = ({
  isOpen,
  onClose,
  obra,
  arquivos,
  formatFileSize,
  onDeleteAllArquivos,
}) => {
  console.log('ObraDetailsDialog - arquivos prop:', arquivos.map(a => a.nome));
  const { profile } = useAuth();
  // Removendo verificação de role - qualquer usuário pode editar/deletar
  const canEditOrDelete = true;
  console.log('ObraDetailsDialog.tsx - profile:', profile, 'canEditOrDelete:', canEditOrDelete);
  // Removendo verificação de role - qualquer usuário vê todos os arquivos
  const isMusico = false;
  const userInstrument = profile?.instrumento;

  // Função para normalizar nomes de instrumento
  const normalize = (str: string) => str?.toLowerCase().replace(/[^a-z0-9]/gi, '');

  // Mapeamento de instrumentos e sinônimos/abreviações
  const instrumentOrder = [
    'Flautim', 'Piccolo', 'Flauta', 'Flauta 1', 'Flauta 2', 'Flauta 3',
    'Oboé', 'Oboé 1', 'Oboé 2', 'Clarinete', 'Clarinete 1', 'Clarinete 2', 'Fagote', 'Trompa', 'Trompete', 'Trombone', 'Tímpanos', 'Percussão',
    'Violino 1', 'Violino 2', 'Viola', 'Violoncelo', 'Contrabaixo', 'Piano', 'Harpa'
  ];
  const instrumentSynonyms: Record<string, string[]> = {
    'Flautim': ['flautim', 'picc', 'piccolo', 'fl picc'],
    'Piccolo': ['piccolo', 'picc', 'flautim'],
    'Flauta': ['flauta', 'fl'],
    'Oboé': ['oboé', 'oboe', 'ob'],
    'Clarinete': ['clarinete', 'cl', 'clarinet'],
    'Fagote': ['fagote', 'fg'],
    'Trompa': ['trompa', 'tpa'],
    'Trompete': ['trompete', 'tpe'],
    'Trombone': ['trombone', 'tbn'],
    'Tímpanos': ['tímpanos', 'tim', 'timpani'],
    'Percussão': ['percussão', 'perc'],
    'Violino 1': ['violino 1', 'v1', 'vl1'],
    'Violino 2': ['violino 2', 'v2', 'vl2'],
    'Viola': ['viola', 'vla'],
    'Violoncelo': ['violoncelo', 'vc', 'cello'],
    'Contrabaixo': ['contrabaixo', 'cb'],
    'Piano': ['piano', 'pno'],
    'Harpa': ['harpa', 'hpa'],
  };

  function ordenarArquivosPorInstrumento(arquivos: any[]): any[] {
    console.log('Função ordenarArquivosPorInstrumento chamada com:', arquivos.map(a => a.nome));
    const arquivosRestantes = [...arquivos];
    const ordenados: any[] = [];
    for (const instrumento of instrumentOrder) {
      const sinos = instrumentSynonyms[instrumento] || [instrumento.toLowerCase()];
      for (let i = 0; i < arquivosRestantes.length; ) {
        const nomeArquivo = arquivosRestantes[i].nome?.toLowerCase() || '';
        if (sinos.some(s => nomeArquivo.includes(s))) {
          ordenados.push(arquivosRestantes[i]);
          arquivosRestantes.splice(i, 1);
        } else {
          i++;
        }
      }
    }
    // Adiciona os que não foram identificados ao final
    return [...ordenados, ...arquivosRestantes];
  }

  // Removendo filtro por instrumento - qualquer usuário vê todos os arquivos
  const arquivosFiltrados = ordenarArquivosPorInstrumento(arquivos);
  console.log('Arquivos recebidos:', arquivos.map(a => a.nome));
  console.log('Arquivos ordenados:', arquivosFiltrados.map(a => a.nome));

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

  const [isArquivosOpen, setIsArquivosOpen] = React.useState(true);

  // Função de download com tratamento de erro amigável
  const handleDownload = async (arquivo: any) => {
    try {
      if (!arquivo.arquivo_url) {
        toast.error('Arquivo não disponível para download.');
        return;
      }
      const response = await fetch(arquivo.arquivo_url);
      if (!response.ok) {
        toast.error('Arquivo não encontrado ou acesso não autorizado.');
        return;
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = arquivo.nome;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Erro ao baixar arquivo. Tente novamente ou contate o administrador.');
    }
  };

  if (profile === null) {
    return <div className="p-8 text-center text-gray-500">Carregando perfil...</div>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" aria-describedby="obra-details-description">
        <DialogHeader>
          <DialogTitle>Detalhes da Obra</DialogTitle>
          <DialogDescription id="obra-details-description">
            Veja as informações completas da obra selecionada, incluindo arquivos disponíveis, partituras cadastradas e estatísticas de uso.
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

          {/* Lista de Arquivos com Collapse */}
          <Collapsible open={isArquivosOpen} onOpenChange={setIsArquivosOpen}>
            <div className="flex items-center gap-2 mb-3">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 p-0">
                  {isArquivosOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>
              </CollapsibleTrigger>
              <h3 className="text-lg font-semibold">Arquivos PDF digitalizados</h3>
              <span className="text-xs text-gray-500">({arquivosFiltrados.length})</span>
            </div>
            <CollapsibleContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {arquivosFiltrados.length === 0 && (
                  <div className="text-sm text-gray-500 italic">Nenhum arquivo digitalizado.</div>
                )}
                {arquivosFiltrados.map((arquivo) => (
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
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Download className="h-3 w-3" />
                        <span>{arquivo.downloads || 0}</span>
                      </div>
                      {/* Botões de ação: só para ADMIN e GERENTE */}
                      {canEditOrDelete && (
                        <>
                          {arquivo.instrumentoSelect}
                          {arquivo.deleteButton}
                          {arquivo.editButton}
                        </>
                      )}
                      {/* Botão de download para músicos e usuários comuns (se autorizado) */}
                      {!canEditOrDelete && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(arquivo)}
                          className="h-8 w-8 p-0 flex-shrink-0"
                          title="Download"
                          disabled={arquivo.restricao_download && !arquivo.autorizado}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {/* Botão Apagar todos: só para ADMIN e GERENTE */}
              {canEditOrDelete && onDeleteAllArquivos && arquivosFiltrados.length > 0 && (
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={onDeleteAllArquivos}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Apagar todos os arquivos
                  </Button>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>

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
