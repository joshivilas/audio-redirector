# pack.ps1 — Creates a ZIP ready for upload to the Edge Add-ons Partner Center.
# Run: powershell -File pack.ps1

$ExtDir  = Split-Path -Parent $MyInvocation.MyCommand.Path
$OutFile = Join-Path $ExtDir "audio-redirector.zip"

# Files to include (no dev files, no pack script itself)
$Include = @(
    "manifest.json",
    "background.js",
    "content.js",
    "popup\popup.html",
    "popup\popup.css",
    "popup\popup.js",
    "icons\icon16.png",
    "icons\icon48.png",
    "icons\icon128.png"
)

if (Test-Path $OutFile) { Remove-Item $OutFile }

$TempDir = Join-Path $env:TEMP "audio-redirector-pack"
if (Test-Path $TempDir) { Remove-Item $TempDir -Recurse -Force }
New-Item -ItemType Directory -Path $TempDir | Out-Null

foreach ($file in $Include) {
    $src  = Join-Path $ExtDir $file
    $dest = Join-Path $TempDir $file
    $destDir = Split-Path $dest -Parent
    if (!(Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }
    Copy-Item $src $dest
}

Compress-Archive -Path "$TempDir\*" -DestinationPath $OutFile -Force
Remove-Item $TempDir -Recurse -Force

Write-Host "Packaged: $OutFile" -ForegroundColor Green
