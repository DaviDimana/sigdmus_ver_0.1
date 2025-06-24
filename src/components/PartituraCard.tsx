import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, User, Building2, Library, Folder, Archive, FileText, Music, CheckCircle2, XCircle, Info } from 'lucide-react';

interface PartituraCardProps {
  partitura: any;
  relatedArquivos: any[];
  onView: (partitura: any) => void;
  onDownload: (arquivo: any) => void;
}

const PartituraCard: React.FC<PartituraCardProps> = ({
  partitura,
  relatedArquivos,
  onView,
  onDownload,
}) => {
  const getGenreColor = (genre: string) => {
    const colors = {
      'CLASSICO': 'bg-blue-100 text-blue-800',
      'BARROCO': 'bg-purple-100 text-purple-800',
      'ROMANTICO': 'bg-pink-100 text-pink-800',
      'MODERNO': 'bg-green-100 text-green-800',
      'CONTEMPORANEO': 'bg-orange-100 text-orange-800',
      'POPULAR': 'bg-yellow-100 text-yellow-800',
    };
    return colors[genre as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          {/* 1. Título da obra */}
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {partitura.titulo}
          </CardTitle>
          <Badge className="bg-green-100 text-green-800">
            ATIVO
          </Badge>
        </div>
        <CardDescription className="space-y-1">
          {/* 2. Compositor */}
          {partitura.compositor && (
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-1" />
            {partitura.compositor}
          </div>
          )}
          {/* 3. Instituição */}
          {partitura.instituicao && (
            <div className="flex items-center text-sm text-gray-600">
              <Library className="h-4 w-4 mr-1" />
              {partitura.instituicao}
            </div>
          )}
          {/* 4. Setor */}
          {partitura.setor && (
            <div className="flex items-center text-sm text-gray-600">
              <Building2 className="h-4 w-4 mr-1" />
              {partitura.setor}
            </div>
          )}
          {/* 5. Instrumentação */}
          {partitura.instrumentacao && (
            <div className="flex items-center text-sm text-gray-600">
              <Music className="h-4 w-4 mr-1" />
              {partitura.instrumentacao}
            </div>
          )}
          {/* 6. Edição */}
          {partitura.edicao && (
            <div className="flex items-center text-sm text-gray-600">
              <FileText className="h-4 w-4 mr-1" />
              Edição: {partitura.edicao}
            </div>
          )}
          {/* 7. Ano de edição */}
          {partitura.ano_edicao && (
            <div className="flex items-center text-sm text-gray-600">
              <FileText className="h-4 w-4 mr-1" />
              Ano: {partitura.ano_edicao}
            </div>
          )}
          {/* 8,9,10. Nº Armário, Prateleira, Pasta */}
          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
            {partitura.numero_armario && (
              <span className="flex items-center"><Folder className="h-4 w-4 mr-1" />Armário: {partitura.numero_armario}</span>
            )}
            {partitura.numero_prateleira && (
              <span className="flex items-center"><Archive className="h-4 w-4 mr-1" />Prateleira: {partitura.numero_prateleira}</span>
            )}
            {partitura.numero_pasta && (
              <span className="flex items-center"><Folder className="h-4 w-4 mr-1" />Pasta: {partitura.numero_pasta}</span>
            )}
          </div>
          {/* 11. Tonalidade */}
          {partitura.tonalidade && (
            <div className="flex items-center text-sm text-gray-600">
              <Music className="h-4 w-4 mr-1" />
              Tonalidade: {partitura.tonalidade}
            </div>
          )}
          {/* 12. Gênero */}
            {partitura.genero && (
            <div className="flex items-center text-sm text-gray-600">
              <Badge variant="outline" className={getGenreColor(partitura.genero)}>
                {partitura.genero}
              </Badge>
            </div>
            )}
          {/* 13. Digitalizado */}
          <div className="flex items-center text-sm text-gray-600">
            {partitura.digitalizado ? (
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500 mr-1" />
            )}
            Digitalizado: {partitura.digitalizado ? 'Sim' : 'Não'}
          </div>
          {/* 14. Observações */}
          {partitura.observacoes && (
            <div className="flex items-center text-sm text-gray-600">
              <Info className="h-4 w-4 mr-1" />
              <span className="line-clamp-2">{partitura.observacoes}</span>
            </div>
            )}
          {/* Arquivos */}
          <div className="flex items-center text-sm text-gray-600">
            <FileText className="h-4 w-4 mr-1" />Arquivos: {relatedArquivos.length}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(partitura)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-1" />
              Ver
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PartituraCard;
