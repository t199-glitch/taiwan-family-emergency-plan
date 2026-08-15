$raw = [System.IO.File]::ReadAllLines("shelters.json")
$list = New-Object System.Collections.Generic.List[PSObject]

for ($i = 1; $i -lt $raw.Count; $i++) {
    $line = $raw[$i].Trim()
    if ([string]::IsNullOrWhiteSpace($line)) { continue }
    $cols = $line.Split(",")
    if ($cols.Count -ge 7) {
        $county = $cols[1].Replace('"', '').Trim()
        $district = $cols[2].Replace('"', '').Trim()
        $name = $cols[6].Replace('"', '').Trim()
        $addr = $cols[3].Replace('"', '').Trim()
        $lng = 0.0
        $lat = 0.0
        [double]::TryParse($cols[4], [ref]$lng) | Out-Null
        [double]::TryParse($cols[5], [ref]$lat) | Out-Null
        $cap = $cols[7].Replace('"', '').Trim()

        if ($lat -gt 20 -and $lat -lt 27 -and $lng -gt 118 -and $lng -lt 123) {
            $obj = [PSCustomObject]@{
                county = $county
                district = $district
                name = $name
                address = $addr
                cap = $cap
                lat = $lat
                lng = $lng
            }
            $list.Add($obj)
        }
    }
}

Write-Host "Parsed count:" $list.Count
$json = $list | ConvertTo-Json -Depth 3
[System.IO.File]::WriteAllText("shelters_parsed.json", $json, [System.Text.Encoding]::UTF8)
