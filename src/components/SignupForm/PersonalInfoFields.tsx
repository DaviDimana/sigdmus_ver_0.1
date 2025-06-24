import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { User, Mail, Lock } from 'lucide-react';

interface PersonalInfoFieldsProps {
  formData: {
    name: string;
    email: string;
    password?: string;
    confirmPassword?: string;
    telefone?: string;
  };
  setFormData: (updater: (prev: any) => any) => void;
  showPasswordFields?: boolean;
}

const PersonalInfoFields: React.FC<PersonalInfoFieldsProps> = ({ formData, setFormData, showPasswordFields = true }) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name" className="text-gray-700 font-medium">Nome Completo</Label>
        <div className="relative group">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          <Input
            id="name"
            type="text"
            placeholder="Seu nome completo"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
        <div className="relative group">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          <Input
            id="email"
            type="email"
            placeholder="seu.email@exemplo.com"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefone" className="text-gray-700 font-medium">Telefone</Label>
        <div className="relative group">
          <Input
            id="telefone"
            type="tel"
            placeholder="(99) 99999-9999"
            value={formData.telefone || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
            className="pl-4 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
          />
        </div>
      </div>

      {showPasswordFields && (
        <>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium">Senha</Label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirmar Senha</Label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirme sua senha"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                required
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PersonalInfoFields;
