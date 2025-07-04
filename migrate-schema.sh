#!/bin/bash

# Script para migrar estrutura do banco do Supabase Cloud para VPS
# Funciona com conta FREE do Supabase

set -e

echo "🔄 Migrando estrutura do banco do Supabase Cloud para VPS..."

# Verificar se Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    echo "📦 Instalando Supabase CLI..."
    npm install -g supabase
fi

# 1. Configurar projeto local
echo "⚙️ Configurando projeto local..."
supabase init

# 2. Linkar com projeto Cloud
echo "🔗 Linkando com projeto Cloud..."
supabase link --project-ref your-project-ref

# 3. Fazer pull da estrutura atual
echo "📥 Fazendo pull da estrutura do Cloud..."
supabase db pull

# 4. Verificar arquivos gerados
echo "📋 Verificando arquivos migrados..."
ls -la supabase/migrations/
ls -la supabase/seed.sql

echo "✅ Estrutura migrada com sucesso!"
echo ""
echo "📁 Arquivos gerados:"
echo "   - supabase/migrations/ (todas as migrações)"
echo "   - supabase/seed.sql (dados iniciais)"
echo "   - supabase/config.toml (configurações)"
echo ""
echo "🔄 Próximos passos:"
echo "   1. Copiar supabase/migrations/ para o VPS"
echo "   2. Executar migrações no VPS"
echo "   3. Verificar se tudo foi migrado corretamente" 