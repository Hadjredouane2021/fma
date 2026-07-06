# Sauvegarde MySQL — lit DATABASE_URL depuis .env à la racine du projet
$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$envFile = Join-Path $root ".env"

if (-not (Test-Path $envFile)) {
  Write-Error "Fichier .env introuvable : $envFile"
}

$line = Get-Content $envFile | Where-Object { $_ -match '^\s*DATABASE_URL\s*=\s*"' } | Select-Object -First 1
if (-not $line) {
  Write-Error "DATABASE_URL non trouvé dans .env"
}

$url = ($line -replace '^\s*DATABASE_URL\s*=\s*"([^"]+)".*', '$1').Trim()
if ($url -notmatch '^mysql://([^:@]*)(?::([^@]*))?@([^:/]+)(?::(\d+))?/([^?]+)') {
  Write-Error "DATABASE_URL invalide : $url"
}

$user = $Matches[1]
$pass = $Matches[2]
$dbHost = $Matches[3]
$port = if ($Matches[4]) { $Matches[4] } else { "3306" }
$db = $Matches[5]

$mysqldump = @(
  "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe",
  "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqldump.exe",
  "C:\Program Files\MySQL\MySQL Workbench 8.0 CE\mysqldump.exe",
  "C:\xampp\mysql\bin\mysqldump.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $mysqldump) {
  $found = Get-Command mysqldump -ErrorAction SilentlyContinue
  if ($found) { $mysqldump = $found.Source }
}
if (-not $mysqldump) {
  Write-Error "mysqldump introuvable. Installez MySQL Client ou ajoutez mysqldump au PATH."
}

$outDir = Join-Path $root "backups"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
$stamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$outFile = Join-Path $outDir "${db}_${stamp}.sql"

$args = @(
  "-h", $dbHost,
  "-P", $port,
  "-u", $user,
  "--single-transaction",
  "--routines",
  "--triggers",
  "--default-character-set=utf8mb4",
  "--column-statistics=0",
  $db,
  "--result-file=$outFile"
)
if ($pass) { $args = @("-p$pass") + $args }

& $mysqldump @args
if ($LASTEXITCODE -ne 0) {
  if (Test-Path $outFile) { Remove-Item $outFile -Force }
  Write-Error "mysqldump a échoué (code $LASTEXITCODE)"
}

$item = Get-Item $outFile
Write-Host "Sauvegarde OK : $($item.FullName) ($([math]::Round($item.Length / 1KB, 1)) Ko)"
