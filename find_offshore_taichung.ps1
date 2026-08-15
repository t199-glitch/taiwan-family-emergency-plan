$utf8 = [System.Text.Encoding]::UTF8
$json = [System.IO.File]::ReadAllText("shelters_parsed.json", $utf8)
$list = $json | ConvertFrom-Json

$count = 0
foreach ($item in $list) {
    if ($item.county -like "*臺中*" -or $item.county -like "*台中*") {
        if ($item.lng -lt 120.5) {
            $count++
            Write-Host ("Offshore Taichung [{0}]: Name={1} | Address={2} | Lat={3} | Lng={4}" -f $count, $item.name, $item.address, $item.lat, $item.lng)
        }
    }
}

Write-Host "Total offshore Taichung points:" $count
