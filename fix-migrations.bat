@echo off
cd supabase\migrations

echo Renomeando migrações...

ren "20240708b_create_performances.sql" "20240708000002_create_performances.sql"
ren "20240708b1_create_arquivos.sql" "20240708000003_create_arquivos.sql"
ren "20240708c_create_profiles.sql" "20240708000004_create_profiles.sql"
ren "20240708d_create_setores.sql" "20240708000005_create_setores.sql"
ren "20240708e_create_user_profiles.sql" "20240708000006_create_user_profiles.sql"
ren "20240709_create_anotacoes_partitura.sql" "20240709000000_create_anotacoes_partitura.sql"
ren "20240710_create_solicitacoes_download.sql" "20240710000000_create_solicitacoes_download.sql"

echo Migrações renomeadas com sucesso!
pause 