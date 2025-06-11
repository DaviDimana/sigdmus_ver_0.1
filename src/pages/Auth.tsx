
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Music, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'MUSICO' as const,
    setor: '',
    instrumento: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        console.log('Auth: Tentando fazer login com:', formData.email);
        await signIn(formData.email, formData.password);
        console.log('Auth: Login realizado com sucesso');
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao sistema.",
        });
        // Force page reload for clean state
        window.location.href = '/';
      } else {
        console.log('Auth: Tentando cadastrar usuário:', formData.email);
        await signUp(formData.email, formData.password, formData.name);
        console.log('Auth: Cadastro realizado com sucesso');
        toast({
          title: "Conta criada com sucesso!",
          description: "Verifique seu email para confirmar a conta.",
        });
      }
    } catch (error: any) {
      console.error('Auth: Erro na autenticação:', error);
      toast({
        title: "Erro na autenticação",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Music className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Sistema Integrado de Documentação e Consulta de Acervos Musicais</h1>
          <p className="text-gray-600 mt-2">
            Sistema de Gerenciamento Musical
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{isLogin ? 'Entrar no Sistema' : 'Criar Conta'}</CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Acesse sua conta para gerenciar partituras e performances'
                : 'Crie uma nova conta no sistema'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Sua senha"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm"
              >
                {isLogin 
                  ? 'Não tem conta? Cadastre-se aqui' 
                  : 'Já tem conta? Faça login aqui'
                }
              </Button>
            </div>

            {!isLogin && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium">Nota importante:</p>
                    <p>Novas contas são criadas com perfil de "Músico" por padrão. Entre em contato com um administrador para alterar seu perfil de acesso.</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
