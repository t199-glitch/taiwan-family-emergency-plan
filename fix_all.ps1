$utf8 = [System.Text.Encoding]::UTF8

function FromB64($str) {
    $bytes = [System.Convert]::FromBase64String($str)
    return $utf8.GetString($bytes)
}

$county = FromB64 "6Ye65Lit5biC"
$district = FromB64 "5p2x5Y2A"
$name = FromB64 "5biC56uL5qao5qWt6aSL5rCR5bCP5a24IOCPrw=="
$addr = FromB64 "6Ye65Lit5biC5p2x5Y2A5qao5qWt6LevNjDomZ8="
$cap = FromB64 "MSw1MDBk"
$src = FromB64 "5L2_5p2o6ICF5oyH5p6a57K-5rqW5p6n5qiZ"

$firstObj = [PSCustomObject]@{
    county = $county
    district = $district
    name = $name
    address = $addr
    cap = $cap
    type = "shelter"
    lat = 24.138048674795467
    lng = 120.6949602390905
    source = $src
}

$raw = [System.IO.File]::ReadAllLines("shelters.json", $utf8)
$list = New-Object System.Collections.Generic.List[PSObject]
$list.Add($firstObj)

for ($i = 1; $i -lt $raw.Count; $i++) {
    $line = $raw[$i].Trim()
    if ([string]::IsNullOrWhiteSpace($line)) { continue }
    $cols = $line.Split(",")
    if ($cols.Count -ge 7) {
        $c_county = $cols[1].Replace('"', '').Trim()
        $c_district = $cols[2].Replace('"', '').Trim()
        $c_name = $cols[6].Replace('"', '').Trim()
        $c_addr = $cols[3].Replace('"', '').Trim()
        $lng = 0.0
        $lat = 0.0
        [double]::TryParse($cols[4], [ref]$lng) | Out-Null
        [double]::TryParse($cols[5], [ref]$lat) | Out-Null
        $c_cap = $cols[7].Replace('"', '').Trim()

        if ($lat -gt 18 -and $lat -lt 27 -and $lng -gt 118 -and $lng -lt 123) {
            if ($c_name.Contains("樂業") -or $c_name.Contains("榨業")) { continue }

            $obj = [PSCustomObject]@{
                county = $c_county
                district = $c_district
                name = $c_name
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

$json = $list | ConvertTo-Json -Depth 4
[System.IO.File]::WriteAllText("shelters_parsed.json", $json, $utf8)

$js = "window.MOI_PARSED_SHELTERS = " + $json + ";"
[System.IO.File]::WriteAllText("shelters_data.js", $js, $utf8)
[System.IO.File]::WriteAllText("dist/shelters_data.js", $js, $utf8)

Write-Host "Rebuilt shelters_data.js successfully!"
