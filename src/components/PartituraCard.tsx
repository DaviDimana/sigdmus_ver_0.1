
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, Upload, User } from 'lucide-react';

interface PartituraCardProps {
  partitura: any;
  relatedArquivos: any[];
  canUpload: boolean;
  onView: (partitura: any) => void;
  onDownload: (arquivo: any) => void;
  onUpload: (partitura: any) => void;
}

const PartituraCard: React.FC<PartituraCardProps> = ({
  partitura,
  relatedArquivos,
  canUpload,
  onView,
  onDownload,
  onUpload
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
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {partitura.titulo}
          </CardTitle>
          <Badge className="bg-green-100 text-green-800">
            ATIVO
          </Badge>
        </div>
        <CardDescription className="space-y-1">
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-1" />
            {partitura.compositor}
          </div>
          <div className="flex items-center justify-between">
            {partitura.genero && (
              <Badge variant="outline" className={getGenreColor(partitura.genero)}>
                {partitura.genero}
              </Badge>
            )}
            {partitura.ano_edicao && (
              <span className="text-xs text-gray-500">
                {partitura.ano_edicao}
              </span>
            )}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Instrumentação:</span>
            <span className="font-medium">{partitura.instrumentacao}</span>
          </div>
          
          {partitura.edicao && (
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Edição:</span>
              <span className="font-medium">{partitura.edicao}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Arquivos:</span>
            <span className="font-medium">{relatedArquivos.length}</span>
          </div>

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
            
            {relatedArquivos.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDownload(relatedArquivos[0])}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            )}
            
            {canUpload && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpload(partitura)}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-1" />
                Upload
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PartituraCard;
