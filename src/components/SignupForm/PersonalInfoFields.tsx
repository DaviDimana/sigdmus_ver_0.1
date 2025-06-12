
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PersonalInfoFieldsProps {
  formData: {
    nome: string;
    email: string;
    telefone: string;
  };
  setFormData: (updater: (prev: any) => any) => void;
}

const PersonalInfoFields: React.FC<PersonalInfoFieldsProps> = ({ formData, setFormData }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome Completo *</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefone">Telefone *</Label>
        <Input
          id="telefone"
          type="tel"
          value={formData.telefone}
          onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
          placeholder="(xx) xxxxx-xxxx"
          required
        />
      </div>
    </>
  );
};

export default PersonalInfoFields;
