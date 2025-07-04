#!/bin/bash

# Script para migrar estrutura usando pg_dump
# Alternativa ao Supabase CLI

set -e

echo "🔄 Migrando estrutura usando pg_dump..."

# Configurações
CLOUD_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
OUTPUT_DIR="schema_migration"

mkdir -p $OUTPUT_DIR

# 1. Dump apenas da estrutura (sem dados)
echo "📦 Fazendo dump da estrutura..."
pg_dump "$CLOUD_URL" \
  --schema-only \
  --no-owner \
  --no-privileges \
  --file="$OUTPUT_DIR/schema.sql"

# 2. Dump das políticas RLS
echo "🔒 Fazendo dump das políticas RLS..."
pg_dump "$CLOUD_URL" \
  --schema-only \
  --no-owner \
  --no-privileges \
  --include-all \
  --file="$OUTPUT_DIR/rls_policies.sql"

# 3. Dump das funções
echo "⚙️ Fazendo dump das funções..."
pg_dump "$CLOUD_URL" \
  --schema-only \
  --no-owner \
  --no-privileges \
  --functions \
  --file="$OUTPUT_DIR/functions.sql"

# 4. Dump das triggers
echo "🔔 Fazendo dump dos triggers..."
pg_dump "$CLOUD_URL" \
  --schema-only \
  --no-owner \
  --no-privileges \
  --triggers \
  --file="$OUTPUT_DIR/triggers.sql"

# 5. Criar script de aplicação
cat > "$OUTPUT_DIR/apply_schema.sql" << 'EOF'
-- Script para aplicar estrutura no VPS
BEGIN;

-- Aplicar schema
\i schema.sql

-- Aplicar políticas RLS
\i rls_policies.sql

-- Aplicar funções
\i functions.sql

-- Aplicar triggers
\i triggers.sql

COMMIT;
EOF

echo "✅ Estrutura migrada com sucesso!"
echo ""
echo "📁 Arquivos gerados em $OUTPUT_DIR/:"
echo "   - schema.sql (tabelas, índices, constraints)"
echo "   - rls_policies.sql (políticas RLS)"
echo "   - functions.sql (funções)"
echo "   - triggers.sql (triggers)"
echo "   - apply_schema.sql (script de aplicação)"
echo ""
echo "🔄 Para aplicar no VPS:"
echo "   psql -h localhost -U postgres -d postgres -f $OUTPUT_DIR/apply_schema.sql" 