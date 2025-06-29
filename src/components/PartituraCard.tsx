import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, User, Building2, Library } from 'lucide-react';

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
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          {/* Título da obra */}
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {partitura.titulo}
          </CardTitle>
          <Badge className="bg-green-100 text-green-800">
            ATIVO
          </Badge>
        </div>
        <div className="space-y-1">
          {/* Compositor */}
          {partitura.compositor && (
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-1" />
              {partitura.compositor}
            </div>
          )}
          {/* Instituição ou Setor */}
          {partitura.instituicao && (
            <div className="flex items-center text-sm text-gray-600">
              <Library className="h-4 w-4 mr-1" />
              {partitura.instituicao}
            </div>
          )}
          {partitura.setor && !partitura.instituicao && (
            <div className="flex items-center text-sm text-gray-600">
              <Building2 className="h-4 w-4 mr-1" />
              {partitura.setor}
            </div>
          )}
        </div>
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
