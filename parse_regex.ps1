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

# Known Taiwan counties
$counties = @("臺北市", "新北市", "桃園市", "臺中市", "臺南市", "高雄市", "基隆市", "新竹市", "嘉義市", "新竹縣", "苗栗縣", "彰化縣", "南投縣", "雲林縣", "嘉義縣", "屏東縣", "宜蘭縣", "花蓮縣", "臺東縣", "澎湖縣", "金門縣", "連江縣")

for ($i = 1; $i -lt $lines.Count; $i++) {
    $line = $lines[$i].Trim()
    if ([string]::IsNullOrWhiteSpace($line)) { continue }
    if ($line.Contains($leyeKw)) { continue }

    # Match longitude (118.x - 123.x) and latitude (21.x - 26.x)
    $lngMatch = [regex]::Match($line, "1(1[89]|2[0-3])\.\d+")
    $latMatch = [regex]::Match($line, "2[1-6]\.\d+")

    if ($lngMatch.Success -and $latMatch.Success) {
        $lng = [double]::Parse($lngMatch.Value, [System.Globalization.CultureInfo]::InvariantCulture)
        $lat = [double]::Parse($latMatch.Value, [System.Globalization.CultureInfo]::InvariantCulture)

        # Detect county
        $foundCounty = "其他縣市"
        foreach ($c in $counties) {
            if ($line.Contains($c)) {
                $foundCounty = $c
                break
            }
        }

        # Extract name (cols split or line segment)
        $parts = $line.Split(",")
        $name = "避難收容處所"
        $addr = ""
        $cap = "200人"

        if ($parts.Count -ge 7) {
            $name = $parts[6].Replace('"', '').Trim()
            $addr = $parts[3].Replace('"', '').Trim()
            if ($parts.Count -gt 7) { $cap = $parts[7].Replace('"', '').Trim() }
        } elseif ($parts.Count -ge 4) {
            $name = $parts[3].Replace('"', '').Trim()
        }

        if ([string]::IsNullOrWhiteSpace($name)) { $name = "避難處所" }

        $obj = [PSCustomObject]@{
            county = $foundCounty
            district = ""
            name = ($name + " 🏫")
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

Write-Host "Total extracted clean points:" $list.Count

$json = $list | ConvertTo-Json -Depth 4
[System.IO.File]::WriteAllText("shelters_parsed.json", $json, $utf8)

$jsContent = "window.MOI_PARSED_SHELTERS = " + $json + ";"
[System.IO.File]::WriteAllText("shelters_data.js", $jsContent, $utf8)
[System.IO.File]::WriteAllText("dist/shelters_data.js", $jsContent, $utf8)

Write-Host "Successfully parsed shelters_utf8.csv with regex!"
