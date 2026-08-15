$utf8 = [System.Text.Encoding]::UTF8
$json = [System.IO.File]::ReadAllText("shelters_parsed.json", $utf8)
$list = $json | ConvertFrom-Json

$count = 0
foreach ($item in $list) {
    if ($item.county -like "*中*" -or $item.name -like "*樂業*") {
        $count++
        Write-Host ("[{0}] Name: {1} | Address: {2} | Lat: {3} | Lng: {4}" -f $count, $item.name, $item.address, $item.lat, $item.lng)
    }
}
Write-Host "Total Taichung / Leye items found:" $count
