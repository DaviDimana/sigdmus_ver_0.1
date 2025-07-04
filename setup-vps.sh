#!/bin/bash

# Script para configurar Supabase Self-Hosted no VPS
# Execute como root ou com sudo

set -e

echo "🚀 Configurando Supabase Self-Hosted no VPS..."

# 1. Instalar Docker e Docker Compose
echo "📦 Instalando Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 2. Criar diretórios necessários
echo "📁 Criando diretórios..."
mkdir -p volumes/db
mkdir -p volumes/storage
mkdir -p volumes/api

# 3. Gerar chaves secretas
echo "🔑 Gerando chaves secretas..."
ANON_KEY=$(openssl rand -base64 32)
SERVICE_KEY=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
POSTGRES_PASSWORD=$(openssl rand -base64 32)

# 4. Atualizar arquivos de configuração
echo "⚙️ Atualizando configurações..."

# Atualizar docker-compose.yml
sed -i "s/your-anon-key/$ANON_KEY/g" docker-compose.yml
sed -i "s/your-service-key/$SERVICE_KEY/g" docker-compose.yml
sed -i "s/your-super-secret-jwt-token-with-at-least-32-characters-long/$JWT_SECRET/g" docker-compose.yml
sed -i "s/your-super-secret-and-long-postgres-password/$POSTGRES_PASSWORD/g" docker-compose.yml

# Atualizar kong.yml
sed -i "s/your-anon-key/$ANON_KEY/g" volumes/api/kong.yml
sed -i "s/your-service-key/$SERVICE_KEY/g" volumes/api/kong.yml

# 5. Configurar permissões
echo "🔒 Configurando permissões..."
chmod 755 volumes/db
chmod 755 volumes/storage
chmod 755 volumes/api

# 6. Iniciar serviços
echo "🚀 Iniciando Supabase..."
docker-compose up -d

# 7. Aguardar inicialização
echo "⏳ Aguardando inicialização dos serviços..."
sleep 30

# 8. Verificar status
echo "✅ Verificando status dos serviços..."
docker-compose ps

# 9. Salvar configurações
echo "💾 Salvando configurações..."
cat > .env << EOF
# Supabase Configuration
SUPABASE_URL=http://localhost:8000
SUPABASE_ANON_KEY=$ANON_KEY
SUPABASE_SERVICE_KEY=$SERVICE_KEY
JWT_SECRET=$JWT_SECRET
POSTGRES_PASSWORD=$POSTGRES_PASSWORD

# URLs dos serviços
STUDIO_URL=http://localhost:3000
API_URL=http://localhost:8000
DB_URL=postgresql://postgres:$POSTGRES_PASSWORD@localhost:5432/postgres
EOF

echo "🎉 Supabase configurado com sucesso!"
echo ""
echo "📋 Informações importantes:"
echo "   Studio: http://localhost:3000"
echo "   API: http://localhost:8000"
echo "   Database: localhost:5432"
echo ""
echo "🔑 Chaves geradas:"
echo "   ANON_KEY: $ANON_KEY"
echo "   SERVICE_KEY: $SERVICE_KEY"
echo ""
echo "📝 Próximos passos:"
echo "   1. Atualizar as variáveis de ambiente no seu projeto"
echo "   2. Executar as migrações: docker-compose exec db psql -U postgres -d postgres -f /docker-entrypoint-initdb.d/migrations.sql"
echo "   3. Configurar backup dos volumes"
echo ""
echo "🛠️ Comandos úteis:"
echo "   docker-compose logs -f    # Ver logs"
echo "   docker-compose down       # Parar serviços"
echo "   docker-compose up -d      # Iniciar serviços" 