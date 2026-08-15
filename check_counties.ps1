$utf8 = [System.Text.Encoding]::UTF8
$json = [System.IO.File]::ReadAllText("shelters_parsed.json", $utf8)
$list = $json | ConvertFrom-Json

$counties = $list | ForEach-Object { $_.county } | Select-Object -Unique
Write-Host "Unique counties in shelters_parsed.json:"
$counties | ForEach-Object { Write-Host "County:" $_ }
