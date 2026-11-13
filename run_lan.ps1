# Run ALAMAT on the same Wi-Fi / LAN using this computer's IPv4 address.
# Start from PowerShell: powershell -ExecutionPolicy Bypass -File .\run_lan.ps1
# This runs Django's DEVELOPMENT server. Do not port-forward it to the Internet.
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$python = Join-Path $PSScriptRoot '.venv\Scripts\python.exe'
if (-not (Test-Path $python)) { $python = 'python' }

try {
    $addresses = @(Get-NetIPAddress -AddressFamily IPv4 -ErrorAction Stop |
        Where-Object {
            $_.IPAddress -notmatch '^(127\.|169\.254\.)' -and
            $_.PrefixOrigin -ne 'WellKnown' -and
            $_.AddressState -eq 'Preferred' -and
            $_.InterfaceAlias -notmatch 'Loopback|vEthernet|WSL|Docker|VirtualBox|VMware|Tailscale'
        } | Sort-Object InterfaceMetric | Select-Object -ExpandProperty IPAddress -Unique)
} catch {
    Write-Error 'Could not detect a LAN IPv4 address. Check your Wi-Fi/Ethernet connection.'
    exit 1
}
if ($addresses.Count -eq 0) {
    Write-Error 'No active Wi-Fi/Ethernet IPv4 address found. Connect to a local network and retry.'
    exit 1
}

# Do not use ALLOWED_HOSTS=*; trust the real local interface IPs only.
$env:DJANGO_ALLOWED_HOSTS = (@('localhost','127.0.0.1') + $addresses) -join ','
$env:DJANGO_DEBUG = '1'
Write-Host ''
Write-Host 'ALAMAT — Local Network Play (development only)' -ForegroundColor Cyan
Write-Host "Allowed hosts: $env:DJANGO_ALLOWED_HOSTS"
Write-Host 'Open one of these links on a device connected to the same Wi-Fi/LAN:'
foreach ($ip in $addresses) { Write-Host "  http://${ip}:8000/play/" -ForegroundColor Green }
Write-Host 'On this PC: http://127.0.0.1:8000/play/'
Write-Host ''
Write-Host 'If another device cannot connect, allow inbound TCP port 8000 for PRIVATE networks in Windows Defender Firewall.'
Write-Host 'Do not use router port forwarding or expose the Django development server publicly.'
Write-Host 'Press Ctrl+C to stop the server.'
Write-Host ''
& $python manage.py runserver 0.0.0.0:8000
exit $LASTEXITCODE
