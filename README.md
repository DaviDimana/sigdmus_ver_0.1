# SIGDMUS v0.1

Sistema Integrado de Gerenciamento de Documentos Musicais - Versão 0.1

Uma aplicação moderna para gerenciamento de partituras, performances e acervo musical, construída com React, TypeScript e Supabase.

## 🚀 Tecnologias

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- React Query
- React Router DOM
- Shadcn/ui

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Supabase

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/sigdmus_ver_0.1.git
cd sigdmus_ver_0.1
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

## 🏗️ Estrutura do Projeto

```
src/
├── assets/         # Recursos estáticos
├── components/     # Componentes reutilizáveis
├── hooks/         # Custom hooks
├── lib/           # Configurações e utilitários
├── pages/         # Páginas da aplicação
├── services/      # Serviços de API
├── store/         # Gerenciamento de estado
├── types/         # Definições de tipos
└── utils/         # Funções utilitárias
```

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run lint` - Executa o linter
- `npm run preview` - Visualiza a build de produção localmente

## 📝 Convenções de Código

- Utilizamos ESLint e Prettier para padronização
- Seguimos o padrão de commits convencionais
- Componentes são escritos em PascalCase
- Funções utilitárias são escritas em camelCase

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📧 Suporte

Para suporte, envie um email para seu-email@exemplo.com ou abra uma issue no GitHub.
