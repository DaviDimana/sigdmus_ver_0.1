
import React from 'react';

const NavbarTitle: React.FC = () => {
  return (
    <div className="flex items-center space-x-4">
      {/* Logo versão desktop */}
      <div className="hidden md:flex items-center justify-center">
        <img 
          src="/lovable-uploads/90479277-6cda-44ac-9bfd-33ef2b18a715.png" 
          alt="SIGMus Logo" 
          className="h-10 w-auto"
        />
      </div>

      {/* Logo versão mobile */}
      <div className="flex md:hidden items-center justify-center">
        <img 
          src="/lovable-uploads/90479277-6cda-44ac-9bfd-33ef2b18a715.png" 
          alt="SIGMus Logo" 
          className="h-8 w-auto"
        />
      </div>
    </div>
  );
};

export default NavbarTitle;
