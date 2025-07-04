#!/bin/bash

# Script de backup automático para Supabase Self-Hosted
# Execute via cron: 0 2 * * * /path/to/backup-supabase.sh

set -e

# Configurações
BACKUP_DIR="/backup/supabase"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Criar diretório de backup se não existir
mkdir -p "$BACKUP_DIR"

echo "🔄 Iniciando backup do Supabase - $(date)"

# 1. Backup do banco de dados
echo "📦 Fazendo backup do banco de dados..."
docker-compose exec -T db pg_dump -U postgres postgres > "$BACKUP_DIR/db_backup_$DATE.sql"

# 2. Backup dos arquivos do storage
echo "📁 Fazendo backup dos arquivos..."
tar -czf "$BACKUP_DIR/storage_backup_$DATE.tar.gz" -C volumes storage/

# 3. Backup das configurações
echo "⚙️ Fazendo backup das configurações..."
tar -czf "$BACKUP_DIR/config_backup_$DATE.tar.gz" \
    docker-compose.yml \
    volumes/api/kong.yml \
    .env

# 4. Criar arquivo de metadados
cat > "$BACKUP_DIR/backup_metadata_$DATE.txt" << EOF
Backup realizado em: $(date)
Versão do Supabase: $(docker-compose exec -T db psql -U postgres -t -c "SELECT version();")
Tamanho do backup DB: $(du -h "$BACKUP_DIR/db_backup_$DATE.sql" | cut -f1)
Tamanho do backup Storage: $(du -h "$BACKUP_DIR/storage_backup_$DATE.tar.gz" | cut -f1)
Tamanho do backup Config: $(du -h "$BACKUP_DIR/config_backup_$DATE.tar.gz" | cut -f1)
EOF

# 5. Limpar backups antigos
echo "🧹 Limpando backups antigos..."
find "$BACKUP_DIR" -name "*.sql" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "*.txt" -mtime +$RETENTION_DAYS -delete

# 6. Verificar integridade do backup
echo "✅ Verificando integridade do backup..."
if [ -f "$BACKUP_DIR/db_backup_$DATE.sql" ] && [ -f "$BACKUP_DIR/storage_backup_$DATE.tar.gz" ]; then
    echo "✅ Backup concluído com sucesso!"
    
    # Enviar notificação (opcional)
    # curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/sendMessage" \
    #     -d "chat_id=<CHAT_ID>&text=✅ Backup Supabase concluído: $DATE"
else
    echo "❌ Erro no backup!"
    exit 1
fi

echo "📊 Estatísticas do backup:"
echo "   Total de arquivos: $(ls -1 "$BACKUP_DIR" | wc -l)"
echo "   Espaço utilizado: $(du -sh "$BACKUP_DIR" | cut -f1)"
echo "   Próximo backup: $(date -d '+1 day' '+%Y-%m-%d %H:%M')" 