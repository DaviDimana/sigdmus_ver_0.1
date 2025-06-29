import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Edit2, Search } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';
import InstitutionSelector from '@/components/SignupForm/InstitutionSelector';
import { funcoes, instrumentos as instrumentosList } from '@/components/SignupForm/FunctionInstrumentFields';
import PersonalInfoFields from '@/components/SignupForm/PersonalInfoFields';
import SectorSelector from '@/components/SignupForm/SectorSelector';
import FunctionInstrumentFields from '@/components/SignupForm/FunctionInstrumentFields';

type UserProfile = Tables<'user_profiles'>;

const UserManagement: React.FC = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [instituicoes, setInstituicoes] = useState<{ id: string; nome: string }[]>([]);

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
      fetchUsers();
    // Buscar instituições para o seletor
    const fetchInstituicoes = async () => {
      const { data, error } = await supabase.from('instituicoes').select('*');
      if (!error && data) setInstituicoes(data);
    };
    fetchInstituicoes();
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

      {/* Grid de cards de usuários */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-2 border border-gray-100">
            <div className="flex items-center gap-4">
              {/* Avatar com iniciais */}
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg border-2 border-blue-200">
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg text-gray-900 truncate">{user.name}</span>
                  {/* Badge de role */}
                  {user.role_user_role && (
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${user.role_user_role === 'ADMIN' ? 'bg-red-100 text-red-600' : user.role_user_role === 'GERENTE' ? 'bg-blue-100 text-blue-700' : user.role_user_role === 'ARQUIVISTA' ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-700'}`}>
                      {user.role_user_role}
                    </span>
                  )}
                </div>
                <div className="text-gray-500 text-sm truncate">{user.email}</div>
                {user.telefone && (
                  <div className="text-gray-500 text-sm truncate">{user.telefone}</div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {/* Badge de status */}
              {user.status && (
                <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${user.status === 'ativo' ? 'bg-green-50 text-green-700 border-green-200' : user.status === 'bloqueado' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              )}
              {/* Setor e Instrumento */}
              {user.setor && <span className="text-xs text-gray-400">{user.setor.replace('ACERVO_', '')}</span>}
              {user.instrumento && <span className="text-xs text-gray-400">{user.instrumento}</span>}
            </div>
            <div className="flex justify-end mt-4">
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
                    <Edit2 className="h-4 w-4" /> Editar
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Gerenciamento de Usuário</DialogTitle>
                    <DialogDescription>Adicione, edite ou remova usuários do sistema.</DialogDescription>
                  </DialogHeader>
                  {selectedUser && (
                    <UserEditForm
                      user={selectedUser}
                      roles={roles}
                      setores={setores}
                      instrumentos={instrumentos}
                      instituicoes={instituicoes}
                      onSave={handleUpdateUser}
                      onCancel={() => {
                        setIsDialogOpen(false);
                        setSelectedUser(null);
                      }}
                    />
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const setoresFixos = [
  'ACERVO_OSUFBA',
  'ACERVO_SCHWEBEL',
  'ACERVO_PIERO',
  'ACERVO_PINO',
  'ACERVO_WIDMER',
  'MEMORIAL_LINDENBERG_CARDOSO',
  'COMPOSITORES_DA_BAHIA',
  'ACERVO_OSBA',
];

interface UserEditFormProps {
  user: UserProfile;
  roles: string[];
  setores: string[];
  instrumentos: string[];
  instituicoes: { id: string; nome: string }[];
  onSave: (updates: Partial<UserProfile>) => void;
  onCancel: () => void;
}

const UserEditForm: React.FC<UserEditFormProps> = ({
  user,
  roles,
  setores,
  instrumentos,
  instituicoes,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    telefone: user.telefone || '',
    instituicao: user.instituicao || '',
    setor: user.setor || '',
    instrumento: user.instrumento || '',
    status: user.status || '',
    funcao: user.role_user_role || '',
  });
  const [instituicoesState, setInstituicoesState] = useState<{ id: string; nome: string }[]>(instituicoes);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { setInstituicoesState(instituicoes); }, [instituicoes]);
  const handleInstitutionAdded = async () => {
    const { data, error } = await supabase.from('instituicoes').select('*');
    if (!error && data) setInstituicoesState(data);
  };
  const validate = () => {
    if (!formData.name.trim()) return 'Nome é obrigatório';
    if (!formData.email.trim()) return 'Email é obrigatório';
    if (!formData.telefone.trim()) return 'Telefone é obrigatório';
    if (!formData.instituicao.trim()) return 'Instituição é obrigatória';
    if (!formData.setor.trim()) return 'Setor é obrigatório';
    if (!formData.status.trim()) return 'Status é obrigatório';
    return null;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setSaving(true);
    try {
      const updates: Partial<UserProfile> = {
        name: formData.name,
        email: formData.email,
        telefone: formData.telefone,
        status: formData.status,
        role_user_role: (formData.funcao || 'MUSICO').toUpperCase(),
        updated_at: new Date().toISOString(),
      };
      // Filtrar campos undefined ou vazios
      const filteredUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, v]) => v !== undefined && v !== null && v !== '')
      );
      console.log('Enviando updates para Supabase:', filteredUpdates);
      await onSave(filteredUpdates);
    } catch (err) {
      setError('Erro ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PersonalInfoFields formData={formData} setFormData={updater => setFormData(prev => ({ ...prev, ...typeof updater === 'function' ? updater(prev) : updater }))} showPasswordFields={false} />
      <InstitutionSelector
        value={formData.instituicao}
        onChange={value => setFormData(prev => ({ ...prev, instituicao: value }))}
        instituicoes={instituicoesState}
        onInstitutionAdded={handleInstitutionAdded}
      />
      <SectorSelector
        value={formData.setor}
        onChange={value => setFormData(prev => ({ ...prev, setor: value }))}
        setores={setoresFixos.map(nome => ({ id: nome, nome }))}
        onSectorAdded={() => {}}
      />
      <FunctionInstrumentFields
        formData={formData}
        setFormData={updater => setFormData(prev => ({ ...prev, ...typeof updater === 'function' ? updater(prev) : updater }))}
      />
      <div className="space-y-2">
        <Label htmlFor="edit-status">Status</Label>
        <Select value={formData.status} onValueChange={value => setFormData(prev => ({ ...prev, status: value }))}>
          <SelectTrigger><SelectValue placeholder="Selecione o status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="bloqueado">Bloqueado</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {error && <div className="text-red-600 text-sm font-semibold">{error}</div>}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>Cancelar</Button>
        <Button type="submit" disabled={saving}>
          {saving ? (
            <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Salvando...</span>
          ) : (
            'Salvar'
          )}
        </Button>
      </div>
    </form>
  );
};

export default UserManagement;
