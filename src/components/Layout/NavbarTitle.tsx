
import React from 'react';

const NavbarTitle: React.FC = () => {
  return (
    <div className="flex items-center space-x-4">
      {/* Logo e conteúdo versão desktop */}
      <div className="hidden md:flex items-center space-x-4">
        <img 
          src="/lovable-uploads/81009293-f25e-4f72-a80a-e150f7665dc2.png" 
          alt="SIGMus Logo" 
          className="h-12 w-auto"
        />
        <div className="flex flex-col">
          <div className="text-2xl font-bold text-blue-700 tracking-wide">
            SiGMus
          </div>
          <div className="text-sm text-gray-600 leading-tight max-w-[200px]">
            Sistema de Gestão e
            <br />
            Documentação Musical
          </div>
        </div>
      </div>

      {/* Logo e conteúdo versão mobile */}
      <div className="flex md:hidden items-center space-x-3">
        <img 
          src="/lovable-uploads/81009293-f25e-4f72-a80a-e150f7665dc2.png" 
          alt="SIGMus Logo" 
          className="h-8 w-auto"
        />
        <div className="flex flex-col">
          <div className="text-lg font-bold text-blue-700 tracking-wide">
            SiGMus
          </div>
          <div className="text-xs text-gray-600 leading-tight max-w-[140px]">
            Sistema de Gestão e
            <br />
            Documentação Musical
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarTitle;
