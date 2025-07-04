#!/bin/bash

# Script para migrar dados do Supabase Cloud para VPS Self-Hosted
# Execute após configurar o Supabase no VPS

set -e

echo "🔄 Iniciando migração do Supabase Cloud para VPS..."

# Verificar se as variáveis de ambiente estão configuradas
if [ -z "$SUPABASE_CLOUD_URL" ] || [ -z "$SUPABASE_CLOUD_ANON_KEY" ] || [ -z "$SUPABASE_CLOUD_SERVICE_KEY" ]; then
    echo "❌ Erro: Configure as variáveis de ambiente do Supabase Cloud:"
    echo "   export SUPABASE_CLOUD_URL=your-cloud-project-url"
    echo "   export SUPABASE_CLOUD_ANON_KEY=your-cloud-anon-key"
    echo "   export SUPABASE_CLOUD_SERVICE_KEY=your-cloud-service-key"
    exit 1
fi

# 1. Fazer backup do banco de dados do Cloud
echo "📦 Fazendo backup do banco de dados..."
pg_dump "$SUPABASE_CLOUD_URL" > backup_cloud.sql

# 2. Restaurar no VPS
echo "🔄 Restaurando no VPS..."
psql "postgresql://postgres:$POSTGRES_PASSWORD@localhost:5432/postgres" < backup_cloud.sql

# 3. Migrar arquivos do Storage
echo "📁 Migrando arquivos do Storage..."

# Função para baixar arquivos de um bucket
download_bucket() {
    local bucket_name=$1
    local local_path=$2
    
    echo "   Baixando bucket: $bucket_name"
    mkdir -p "$local_path"
    
    # Listar arquivos no bucket
    files=$(curl -s -H "apikey: $SUPABASE_CLOUD_SERVICE_KEY" \
        -H "Authorization: Bearer $SUPABASE_CLOUD_SERVICE_KEY" \
        "$SUPABASE_CLOUD_URL/storage/v1/object/list/$bucket_name" | \
        jq -r '.data[].name')
    
    for file in $files; do
        if [ ! -z "$file" ]; then
            echo "     Baixando: $file"
            curl -s -H "apikey: $SUPABASE_CLOUD_SERVICE_KEY" \
                -H "Authorization: Bearer $SUPABASE_CLOUD_SERVICE_KEY" \
                "$SUPABASE_CLOUD_URL/storage/v1/object/public/$bucket_name/$file" \
                -o "$local_path/$file"
        fi
    done
}

# Baixar todos os buckets
download_bucket "avatars" "volumes/storage/avatars"
download_bucket "partituras" "volumes/storage/partituras"
download_bucket "programas-concerto" "volumes/storage/programas-concerto"
download_bucket "arquivos" "volumes/storage/arquivos"

# 4. Atualizar configurações do projeto
echo "⚙️ Atualizando configurações do projeto..."

# Criar arquivo de configuração para o projeto
cat > .env.local << EOF
# Supabase VPS Configuration
VITE_SUPABASE_URL=http://localhost:8000
VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_URL=http://localhost:8000
SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_SERVICE_KEY=$SERVICE_KEY
EOF

echo "✅ Migração concluída!"
echo ""
echo "📋 Próximos passos:"
echo "   1. Atualizar as variáveis de ambiente no seu projeto frontend"
echo "   2. Testar a conexão com o VPS"
echo "   3. Verificar se todos os arquivos foram migrados"
echo "   4. Configurar backup automático"
echo ""
echo "🔍 Verificações:"
echo "   - Studio: http://localhost:3000"
echo "   - API: http://localhost:8000"
echo "   - Storage: volumes/storage/"
echo ""
echo "🛠️ Comandos úteis:"
echo "   docker-compose logs storage    # Ver logs do storage"
echo "   ls -la volumes/storage/        # Listar arquivos migrados" 