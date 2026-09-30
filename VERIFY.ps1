$ErrorActionPreference='Stop'
Write-Host 'NutriCloud AI verification' -ForegroundColor Cyan
node --version; npm --version
if (!(Test-Path .env)) { Copy-Item .env.example .env }
npm install
npm test
npm run check
npm run build
Write-Host 'LOCAL VERIFICATION PASSED' -ForegroundColor Green
