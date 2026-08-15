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

$lines = [System.IO.File]::ReadAllLines("shelters.json", $utf8)

for ($i = 1; $i -lt $lines.Count; $i++) {
    $line = $lines[$i].Trim()
    if ([string]::IsNullOrWhiteSpace($line)) { continue }
    if ($line.Contains($leyeKw)) { continue }

    $lngMatch = [regex]::Match($line, "1(1[89]|2[0-3])\.\d+")
    $latMatch = [regex]::Match($line, "2[1-6]\.\d+")

    if ($lngMatch.Success -and $latMatch.Success) {
        $lng = [double]::Parse($lngMatch.Value, [System.Globalization.CultureInfo]::InvariantCulture)
        $lat = [double]::Parse($latMatch.Value, [System.Globalization.CultureInfo]::InvariantCulture)

        $parts = $line.Split(",")
        $countyStr = "其他縣市"
        $name = "Shelter"
        $addr = ""
        $cap = "200"

        if ($parts.Count -ge 2) { $countyStr = $parts[1].Trim() }
        if ($parts.Count -ge 4) { $addr = $parts[3].Trim() }
        if ($parts.Count -ge 7) { $name = $parts[6].Trim() }
        if ($parts.Count -gt 7) { $cap = $parts[7].Trim() }

        $obj = [PSCustomObject]@{
            county = $countyStr
            district = ""
            name = $name
            address = $addr
            cap = $cap
            type = "shelter"
            lat = $lat
            lng = $lng
            source = "MOI"
        }
        $list.Add($obj)
    }
}

Write-Host "Total extracted clean points count:" $list.Count

$json = $list | ConvertTo-Json -Depth 4
[System.IO.File]::WriteAllText("shelters_parsed.json", $json, $utf8)

$jsContent = "window.MOI_PARSED_SHELTERS = " + $json + ";"
[System.IO.File]::WriteAllText("shelters_data.js", $jsContent, $utf8)
[System.IO.File]::WriteAllText("dist/shelters_data.js", $jsContent, $utf8)

Write-Host "Successfully built clean shelters_data.js!"
