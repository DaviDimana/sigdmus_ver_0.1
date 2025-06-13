
import React from 'react';

const NavbarTitle: React.FC = () => {
  return (
    <div className="flex items-center space-x-4">
      {/* Logo e título versão desktop */}
      <div className="hidden md:flex items-center space-x-3">
        <img 
          src="/lovable-uploads/2cf08e31-af5e-4298-9056-85085fd37a0a.png" 
          alt="SIGMus Logo" 
          className="h-10 w-auto"
        />
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
          <div className="text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-wide font-sans leading-tight">
            <div>Sistema Integrado de Gestão</div>
            <div>e Documentação Musical</div>
          </div>
        </div>
      </div>

      {/* Logo e título versão mobile */}
      <div className="flex md:hidden items-center space-x-2">
        <img 
          src="/lovable-uploads/2cf08e31-af5e-4298-9056-85085fd37a0a.png" 
          alt="SIGMus Logo" 
          className="h-8 w-auto"
        />
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent font-sans">
          <div className="text-[9px] leading-tight font-bold uppercase tracking-wide">
            <div>SISTEMA INTEGRADO DE</div>
            <div>GESTÃO E DOCUMENTAÇÃO</div>
            <div>MUSICAL</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarTitle;
