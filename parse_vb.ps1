[Reflection.Assembly]::LoadWithPartialName("Microsoft.VisualBasic") | Out-Null
$utf8 = [System.Text.Encoding]::UTF8
$inv = [System.Globalization.CultureInfo]::InvariantCulture

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

$parser = New-Object Microsoft.VisualBasic.FileIO.TextFieldParser("shelters_utf8.csv", $utf8)
$parser.TextFieldType = [Microsoft.VisualBasic.FileIO.FieldType]::Delimited
$parser.SetDelimiters(",")
$parser.HasFieldsEnclosedInQuotes = $true

# Read header
if (-not $parser.EndOfData) { $null = $parser.ReadFields() }

while (-not $parser.EndOfData) {
    $cols = $null
    try {
        $cols = $parser.ReadFields()
    } catch {
        continue
    }

    if ($null -ne $cols -and $cols.Count -ge 7) {
        $c_county = $cols[1].Trim()
        if ([string]::IsNullOrWhiteSpace($c_county)) { $c_county = $cols[0].Trim() }

        $c_district = $cols[2].Trim()
        $c_addr = $cols[3].Trim()
        $lngStr = $cols[4].Trim()
        $latStr = $cols[5].Trim()
        $c_name = $cols[6].Trim()
        $c_cap = if ($cols.Count -gt 7) { $cols[7].Trim() } else { "200" }

        $lng = 0.0
        $lat = 0.0
        [double]::TryParse($lngStr, [System.Globalization.NumberStyles]::Any, $inv, [ref]$lng) | Out-Null
        [double]::TryParse($latStr, [System.Globalization.NumberStyles]::Any, $inv, [ref]$lat) | Out-Null

        if ([string]::IsNullOrWhiteSpace($c_name)) { continue }
        if ($c_name.Contains($leyeKw) -or $c_addr.Contains($leyeKw)) { continue }

        if ($lat -gt 18.0 -and $lat -lt 27.0 -and $lng -gt 118.0 -and $lng -lt 123.0) {
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
$parser.Close()

Write-Host "Total clean parsed points count:" $list.Count

$json = $list | ConvertTo-Json -Depth 4
[System.IO.File]::WriteAllText("shelters_parsed.json", $json, $utf8)

$jsContent = "window.MOI_PARSED_SHELTERS = " + $json + ";"
[System.IO.File]::WriteAllText("shelters_data.js", $jsContent, $utf8)
[System.IO.File]::WriteAllText("dist/shelters_data.js", $jsContent, $utf8)

Write-Host "Successfully generated clean shelters_data.js with full points!"
