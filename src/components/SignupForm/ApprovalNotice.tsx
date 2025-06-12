
import React from 'react';
import { AlertCircle } from 'lucide-react';

const ApprovalNotice: React.FC = () => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <div className="flex items-start space-x-2">
        <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
        <div className="text-sm text-amber-800">
          <p className="font-medium">Processo de Aprovação:</p>
          <p>
            Sua solicitação será enviada para análise. Você receberá um email de confirmação 
            quando sua conta for aprovada pelo administrador.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApprovalNotice;
