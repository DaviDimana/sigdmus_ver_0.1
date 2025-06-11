
import React from 'react';

const NavbarTitle: React.FC = () => {
  return (
    <div className="flex items-center space-x-4">
      {/* Título versão desktop com quebra de linha */}
      <div className="hidden md:block">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
          <div className="text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-wide font-sans leading-tight">
            <div>Sistema Integrado de Documentação</div>
            <div>e Consulta de Acervos Musicais</div>
          </div>
        </div>
      </div>

      {/* Título versão mobile com estilo melhorado e tamanho original */}
      <div className="block md:hidden">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent font-sans">
          <div className="text-[9px] leading-tight font-bold uppercase tracking-wide">
            <div>SISTEMA INTEGRADO DE</div>
            <div>DOCUMENTAÇÃO E CONSULTA</div>
            <div>DE ACERVOS MUSICAIS</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarTitle;
