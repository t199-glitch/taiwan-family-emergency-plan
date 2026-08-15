$utf8 = [System.Text.Encoding]::UTF8
$json = [System.IO.File]::ReadAllText("shelters_parsed.json", $utf8)
$list = $json | ConvertFrom-Json

$count = 0
foreach ($item in $list) {
    if ($item.lat -gt 24.0 -and $item.lat -lt 24.6 -and $item.lng -lt 120.4) {
        $count++
        Write-Host ("Sea marker [{0}]: County={1} | Name={2} | Address={3} | Lat={4} | Lng={5}" -f $count, $item.county, $item.name, $item.address, $item.lat, $item.lng)
    }
}

Write-Host "Total sea markers in Taichung latitude range:" $count
