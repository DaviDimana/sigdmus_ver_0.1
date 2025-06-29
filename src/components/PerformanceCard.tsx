import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, User, Eye } from 'lucide-react';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/hooks/useAuth';
import PerformanceDetailsDialog from './PerformanceDetailsDialog';

interface PerformanceCardProps {
  performance: any;
  onEdit?: (performance: any) => void;
  onDelete?: (performance: any) => void;
  allPerformances?: any[];
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({ performance, onEdit, onDelete, allPerformances = [] }) => {
  const { profile } = useAuth();
  const canEditOrDelete = true;
  const [showDetails, setShowDetails] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      return format(parse(dateString, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const getSharedProgramUrl = () => {
    if (performance.programa_arquivo_url && performance.programa_arquivo_url.trim() !== '') {
      return performance.programa_arquivo_url;
    }
    const found = allPerformances.find((p) =>
      p.id !== performance.id &&
      p.local === performance.local &&
      p.data === performance.data &&
      p.horario === performance.horario &&
      p.programa_arquivo_url &&
      p.programa_arquivo_url.trim() !== ''
    );
    return found ? found.programa_arquivo_url : '';
  };

  const sharedProgramUrl = getSharedProgramUrl();
  const hasProgram = Boolean(sharedProgramUrl);

  if (profile === null) {
    return null; // Ou um skeleton, se preferir
  }

  return (
    <>
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {performance.titulo_obra}
          </CardTitle>
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Performance
          </Badge>
        </div>
        <CardDescription>
          <User className="h-4 w-4 mr-1 inline" />
          <span>{performance.nome_compositor}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">{performance.local}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span>{formatDate(performance.data)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <Badge variant="outline" className="text-xs">
              {performance.horario}
            </Badge>
          </div>
            <div className="flex gap-2 pt-3">
            <Button
              variant="outline"
              size="sm"
                onClick={() => setShowDetails(true)}
              className="flex-1"
            >
                <Eye className="h-4 w-4" />
                <span>Ver</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
      <PerformanceDetailsDialog
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        performance={performance}
        onEdit={canEditOrDelete ? onEdit : undefined}
        onDelete={canEditOrDelete ? onDelete : undefined}
      />
    </>
  );
};

export default PerformanceCard;
