
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Edit2, Search } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type UserProfile = Tables<'user_profiles'>;

const UserManagement: React.FC = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const roles = ['ADMIN', 'GERENTE', 'ARQUIVISTA', 'MUSICO'];
  const setores = [
    'ACERVO_OSUFBA', 'ACERVO_SCHWEBEL', 'ACERVO_PIERO', 'ACERVO_PINO',
    'ACERVO_WIDMER', 'MEMORIAL_LINDENBERG_CARDOSO', 'COMPOSITORES_DA_BAHIA', 'ACERVO_OSBA'
  ];
  const instrumentos = [
    'FLAUTA', 'OBOÉ', 'CLARINETE', 'FAGOTE', 'TROMPA', 'TROMPETE',
    'TROMBONE', 'TUBA', 'VIOLINO_I', 'VIOLINO_II', 'VIOLA',
    'VIOLONCELO', 'CONTRABAIXO', 'HARPA', 'PIANO', 'PERCUSSAO',
    'SOPRANO', 'CONTRALTO', 'TENOR', 'BAIXO'
  ];

  useEffect(() => {
    if (profile?.role === 'ADMIN') {
      fetchUsers();
    }
  }, [profile]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('name');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar usuários.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (updates: Partial<UserProfile>) => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', selectedUser.id);

      if (error) throw error;

      await fetchUsers();
      setIsDialogOpen(false);
      setSelectedUser(null);

      toast({
        title: "Usuário atualizado",
        description: "As informações do usuário foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar usuário. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (profile?.role !== 'ADMIN') {
    return <div>Acesso negado.</div>;
  }

  if (loading) {
    return <div>Carregando usuários...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Setor</TableHead>
              <TableHead>Instrumento</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.setor || '-'}</TableCell>
                <TableCell>{user.instrumento || '-'}</TableCell>
                <TableCell>
                  <Dialog open={isDialogOpen && selectedUser?.id === user.id} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Editar Usuário</DialogTitle>
                      </DialogHeader>
                      {selectedUser && (
                        <UserEditForm
                          user={selectedUser}
                          roles={roles}
                          setores={setores}
                          instrumentos={instrumentos}
                          onSave={handleUpdateUser}
                          onCancel={() => {
                            setIsDialogOpen(false);
                            setSelectedUser(null);
                          }}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

interface UserEditFormProps {
  user: UserProfile;
  roles: string[];
  setores: string[];
  instrumentos: string[];
  onSave: (updates: Partial<UserProfile>) => void;
  onCancel: () => void;
}

const UserEditForm: React.FC<UserEditFormProps> = ({
  user,
  roles,
  setores,
  instrumentos,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: user.name,
    role: user.role,
    setor: user.setor || '',
    instrumento: user.instrumento || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-name">Nome</Label>
        <Input
          id="edit-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-role">Role</Label>
        <Select
          value={formData.role}
          onValueChange={(value) => setFormData({ ...formData, role: value as any })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {(formData.role === 'GERENTE' || formData.role === 'ADMIN') && (
        <div className="space-y-2">
          <Label htmlFor="edit-setor">Setor</Label>
          <Select
            value={formData.setor}
            onValueChange={(value) => setFormData({ ...formData, setor: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um setor" />
            </SelectTrigger>
            <SelectContent>
              {setores.map((setor) => (
                <SelectItem key={setor} value={setor}>
                  {setor.replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {formData.role === 'MUSICO' && (
        <div className="space-y-2">
          <Label htmlFor="edit-instrumento">Instrumento</Label>
          <Select
            value={formData.instrumento}
            onValueChange={(value) => setFormData({ ...formData, instrumento: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um instrumento" />
            </SelectTrigger>
            <SelectContent>
              {instrumentos.map((instrumento) => (
                <SelectItem key={instrumento} value={instrumento}>
                  {instrumento}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Salvar
        </Button>
      </div>
    </form>
  );
};

export default UserManagement;
