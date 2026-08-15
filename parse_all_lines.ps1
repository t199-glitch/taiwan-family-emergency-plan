$utf8 = [System.Text.Encoding]::UTF8

function FromB64($str) {
    $bytes = [System.Convert]::FromBase64String($str)
    return $utf8.GetString($bytes)
}

$leyeCounty = FromB64 "6Ye65Lit5biC"
$leyeDistrict = FromB64 "5p2x5Y2A"
$leyeName = FromB64 "5biC56uL5qao5qWt6aSL5rCR5bCP5a24IOCPrw=="
$leyeAddr = FromB64 "6Ye65Lit5biC5p2x5Y2A5qao5qWt6LevNjDomZ8="
$leyeCap = FromB64 "MSw1MDBk"
$leyeKw = FromB64 "5oao5qWt"

$leyeObj = [PSCustomObject]@{
    county = $leyeCounty
    district = $leyeDistrict
    name = $leyeName
    address = $leyeAddr
    cap = $leyeCap
    type = "shelter"
    lat = 24.138048674795467
    lng = 120.6949602390905
    source = "MOI_USER"
}

$list = New-Object System.Collections.Generic.List[PSObject]
$list.Add($leyeObj)

$lines = [System.IO.File]::ReadAllLines("shelters_utf8.csv", $utf8)

for ($i = 1; $i -lt $lines.Count; $i++) {
    $line = $lines[$i].Trim()
    if ([string]::IsNullOrWhiteSpace($line)) { continue }

    $cols = $line.Split(",")
    if ($cols.Count -ge 7) {
        $c_county = $cols[1].Replace('"', '').Trim()
        if ([string]::IsNullOrWhiteSpace($c_county)) { $c_county = $cols[0].Replace('"', '').Trim() }

        $c_district = $cols[2].Replace('"', '').Trim()
        $c_addr = $cols[3].Replace('"', '').Trim()
        $lngStr = $cols[4].Replace('"', '').Trim()
        $latStr = $cols[5].Replace('"', '').Trim()
        $c_name = $cols[6].Replace('"', '').Trim()
        $c_cap = if ($cols.Count -gt 7) { $cols[7].Replace('"', '').Trim() } else { "200" }

        $lng = 0.0
        $lat = 0.0
        [double]::TryParse($lngStr, [ref]$lng) | Out-Null
        [double]::TryParse($latStr, [ref]$lat) | Out-Null

        if ([string]::IsNullOrWhiteSpace($c_name)) { continue }
        if ($c_name.Contains($leyeKw) -or $c_addr.Contains($leyeKw)) { continue }

        if ($lat -gt 18 -and $lat -lt 27 -and $lng -gt 118 -and $lng -lt 123) {
            $obj = [PSCustomObject]@{
                county = $c_county
                district = $c_district
                name = ($c_name + " 🏫")
                address = $c_addr
                cap = $c_cap
                type = "shelter"
                lat = $lat
                lng = $lng
                source = "MOI"
            }
            $list.Add($obj)
        }
    }
}

Write-Host "Total clean parsed lines:" $list.Count

$json = $list | ConvertTo-Json -Depth 4
[System.IO.File]::WriteAllText("shelters_parsed.json", $json, $utf8)

$jsContent = "window.MOI_PARSED_SHELTERS = " + $json + ";"
[System.IO.File]::WriteAllText("shelters_data.js", $jsContent, $utf8)
[System.IO.File]::WriteAllText("dist/shelters_data.js", $jsContent, $utf8)

Write-Host "Successfully generated clean shelters_data.js with full points!"
