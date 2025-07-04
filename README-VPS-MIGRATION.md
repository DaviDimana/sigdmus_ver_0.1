# 🚀 Migração do Supabase para VPS Self-Hosted

Este guia explica como migrar seu projeto do Supabase Cloud para um VPS self-hosted usando Docker.

## 📋 Pré-requisitos

- VPS com Ubuntu 20.04+ ou Debian 11+
- Mínimo 4GB RAM, 2 vCPUs, 50GB SSD
- Domínio configurado (opcional, mas recomendado)
- Acesso root ou sudo

## 🎯 Vantagens da Migração

### ✅ **Benefícios:**
- **Controle total** dos dados e infraestrutura
- **Custo reduzido** para projetos com alto volume
- **Sem limites** de storage ou bandwidth
- **Customização completa** das configurações
- **Backup local** dos dados
- **Compliance** com regulamentações locais

### ⚠️ **Considerações:**
- **Manutenção** da infraestrutura
- **Backup** e recuperação de desastres
- **Monitoramento** e logs
- **Atualizações** de segurança
- **Escalabilidade** manual

## 🛠️ Instalação

### 1. **Preparar o VPS**

```bash
# Conectar ao VPS
ssh root@your-vps-ip

# Atualizar sistema
apt update && apt upgrade -y

# Instalar dependências
apt install -y curl wget git jq postgresql-client
```

### 2. **Configurar Supabase**

```bash
# Clonar ou copiar os arquivos de configuração
git clone <seu-repositorio> /opt/supabase
cd /opt/supabase

# Executar script de setup
chmod +x setup-vps.sh
./setup-vps.sh
```

### 3. **Configurar Nginx (Opcional)**

```bash
# Instalar Nginx
apt install -y nginx certbot python3-certbot-nginx

# Copiar configuração
cp nginx-supabase.conf /etc/nginx/sites-available/supabase
ln -s /etc/nginx/sites-available/supabase /etc/nginx/sites-enabled/

# Configurar SSL
certbot --nginx -d your-domain.com

# Reiniciar Nginx
systemctl restart nginx
```

## 🔄 Migração dos Dados

### 1. **Preparar Variáveis de Ambiente**

```bash
# Configurar credenciais do Supabase Cloud
export SUPABASE_CLOUD_URL="https://your-project.supabase.co"
export SUPABASE_CLOUD_ANON_KEY="your-cloud-anon-key"
export SUPABASE_CLOUD_SERVICE_KEY="your-cloud-service-key"
```

### 2. **Executar Migração**

```bash
# Executar script de migração
chmod +x migrate-to-vps.sh
./migrate-to-vps.sh
```

### 3. **Verificar Migração**

```bash
# Verificar status dos serviços
docker-compose ps

# Verificar logs
docker-compose logs -f

# Testar conexão
curl http://localhost:8000/rest/v1/
```

## 🔧 Configuração do Projeto

### 1. **Atualizar Variáveis de Ambiente**

No seu projeto frontend, atualize o arquivo `.env`:

```env
# Antes (Supabase Cloud)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-cloud-anon-key

# Depois (VPS)
VITE_SUPABASE_URL=http://your-domain.com
VITE_SUPABASE_ANON_KEY=your-vps-anon-key
```

### 2. **Testar Conexão**

```bash
# Testar API
curl -H "apikey: your-vps-anon-key" \
     -H "Authorization: Bearer your-vps-anon-key" \
     http://your-domain.com/rest/v1/

# Testar Storage
curl -H "apikey: your-vps-anon-key" \
     -H "Authorization: Bearer your-vps-anon-key" \
     http://your-domain.com/storage/v1/bucket/list
```

## 📊 Monitoramento e Manutenção

### 1. **Backup Automático**

```bash
# Configurar cron job para backup diário
crontab -e

# Adicionar linha:
0 2 * * * /opt/supabase/backup-supabase.sh
```

### 2. **Monitoramento de Recursos**

```bash
# Instalar htop para monitoramento
apt install -y htop

# Verificar uso de recursos
htop
df -h
docker system df
```

### 3. **Logs e Debugging**

```bash
# Ver logs em tempo real
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f storage
docker-compose logs -f db
```

## 🔒 Segurança

### 1. **Firewall**

```bash
# Configurar UFW
ufw allow ssh
ufw allow 80
ufw allow 443
ufw enable
```

### 2. **SSL/TLS**

```bash
# Renovar certificados automaticamente
crontab -e

# Adicionar linha:
0 12 * * * /usr/bin/certbot renew --quiet
```

### 3. **Atualizações**

```bash
# Script de atualização
cat > update-supabase.sh << 'EOF'
#!/bin/bash
cd /opt/supabase
docker-compose pull
docker-compose up -d
docker system prune -f
EOF

chmod +x update-supabase.sh
```

## 🚨 Troubleshooting

### **Problemas Comuns:**

1. **Serviços não iniciam:**
   ```bash
   docker-compose logs
   docker-compose down
   docker-compose up -d
   ```

2. **Erro de permissão:**
   ```bash
   chmod -R 755 volumes/
   chown -R 1000:1000 volumes/
   ```

3. **Storage não funciona:**
   ```bash
   docker-compose restart storage
   docker-compose logs storage
   ```

4. **Banco de dados não conecta:**
   ```bash
   docker-compose restart db
   docker-compose exec db psql -U postgres -c "SELECT version();"
   ```

## 📈 Escalabilidade

### **Para Alto Volume:**

1. **Separar serviços:**
   ```yaml
   # docker-compose.prod.yml
   services:
     db:
       deploy:
         resources:
           limits:
             memory: 4G
             cpus: '2'
   ```

2. **Usar volumes externos:**
   ```yaml
   volumes:
     - /mnt/data/postgres:/var/lib/postgresql/data
     - /mnt/data/storage:/var/lib/storage
   ```

3. **Load Balancer:**
   ```yaml
   # Adicionar Traefik ou HAProxy
   ```

## 💰 Custos Estimados

| Componente | VPS 4GB | VPS 8GB | VPS 16GB |
|------------|---------|---------|----------|
| **Hospedagem** | $20/mês | $40/mês | $80/mês |
| **Storage** | $10/mês | $20/mês | $40/mês |
| **Backup** | $5/mês | $10/mês | $20/mês |
| **Total** | $35/mês | $70/mês | $140/mês |

*Comparado ao Supabase Pro: $25/mês (com limitações)*

## 🎉 Conclusão

A migração para VPS self-hosted é **viável e recomendada** para projetos que:
- Precisam de controle total dos dados
- Têm alto volume de arquivos
- Querem reduzir custos a longo prazo
- Precisam de customizações específicas

### **Próximos Passos:**
1. ✅ Configurar VPS
2. ✅ Migrar dados
3. ✅ Testar funcionalidades
4. ✅ Configurar backup
5. ✅ Monitorar performance
6. ✅ Documentar procedimentos

---

**📞 Suporte:** Em caso de problemas, verifique os logs e consulte a documentação oficial do Supabase. 