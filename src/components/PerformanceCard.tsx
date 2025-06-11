
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, User, Music } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PerformanceCardProps {
  performance: any;
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({ performance }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  return (
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
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-1" />
            {performance.nome_compositor}
          </div>
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

          <div className="space-y-2 pt-2">
            <div className="flex items-start space-x-2">
              <User className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 mb-1">Maestros:</p>
                <p className="text-sm text-gray-800 line-clamp-2">{performance.maestros}</p>
              </div>
            </div>
            
            {performance.interpretes && (
              <div className="flex items-start space-x-2">
                <Music className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 mb-1">Intérpretes:</p>
                  <p className="text-sm text-gray-800 line-clamp-2">{performance.interpretes}</p>
                </div>
              </div>
            )}
          </div>

          {performance.release && (
            <div className="pt-2 border-t">
              <p className="text-xs text-gray-600 mb-1">Release:</p>
              <p className="text-sm text-gray-700 line-clamp-3">{performance.release}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceCard;
