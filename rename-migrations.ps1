# Script para renomear migrações do Supabase
$migrations = @(
    @{old="20240707_create_partituras.sql"; new="20240707000000_create_partituras.sql"},
    @{old="20240708a_create_instituicoes.sql"; new="20240708000001_create_instituicoes.sql"},
    @{old="20240708b_create_performances.sql"; new="20240708000002_create_performances.sql"},
    @{old="20240708b1_create_arquivos.sql"; new="20240708000003_create_arquivos.sql"},
    @{old="20240708c_create_profiles.sql"; new="20240708000004_create_profiles.sql"},
    @{old="20240708d_create_setores.sql"; new="20240708000005_create_setores.sql"},
    @{old="20240708e_create_user_profiles.sql"; new="20240708000006_create_user_profiles.sql"},
    @{old="20240709_create_anotacoes_partitura.sql"; new="20240709000000_create_anotacoes_partitura.sql"},
    @{old="20240710_create_solicitacoes_download.sql"; new="20240710000000_create_solicitacoes_download.sql"}
)

foreach ($migration in $migrations) {
    if (Test-Path $migration.old) {
        Rename-Item $migration.old $migration.new
        Write-Host "Renamed: $($migration.old) -> $($migration.new)"
    } else {
        Write-Host "File not found: $($migration.old)"
    }
}

Write-Host "Migration renaming completed!" 