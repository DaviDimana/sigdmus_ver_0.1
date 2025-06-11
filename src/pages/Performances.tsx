
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Filter, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePerformances } from '@/hooks/usePerformances';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Performances = () => {
  const navigate = useNavigate();
  const { performances, isLoading } = usePerformances();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPerformances = performances?.filter(performance =>
    performance.titulo_obra?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    performance.nome_compositor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    performance.local?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    performance.maestros?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-3 sm:space-y-6 p-1 sm:p-0">
      <div className="flex flex-col space-y-3 sm:space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Performances</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base">
            Gerencie e consulte o histórico de performances
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar performances..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              <span className="text-sm">Filtros</span>
            </Button>
          </div>
          
          <Button onClick={() => navigate('/performances/nova')} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            <span className="text-sm">Nova Performance</span>
          </Button>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader className="p-3 sm:p-4 md:p-6">
          <CardTitle className="text-base sm:text-lg md:text-xl">Lista de Performances</CardTitle>
          <CardDescription className="text-xs sm:text-sm md:text-base">
            {filteredPerformances.length} performance(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-3 sm:p-4 md:p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Obra</TableHead>
                    <TableHead className="text-xs sm:text-sm">Compositor</TableHead>
                    <TableHead className="text-xs sm:text-sm">Local</TableHead>
                    <TableHead className="text-xs sm:text-sm">Data</TableHead>
                    <TableHead className="text-xs sm:text-sm">Horário</TableHead>
                    <TableHead className="text-xs sm:text-sm">Maestro(s)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPerformances.map((performance) => (
                    <TableRow key={performance.id}>
                      <TableCell className="font-medium text-xs sm:text-sm">
                        {performance.titulo_obra}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">{performance.nome_compositor}</TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span>{performance.local}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span>{formatDate(performance.data)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        <Badge variant="outline" className="text-xs">
                          {performance.horario}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">{performance.maestros}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Performances;
