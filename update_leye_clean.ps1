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

$obj = [PSCustomObject]@{
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

$jsonStr = [System.IO.File]::ReadAllText("shelters_parsed.json", $utf8)
$list = $jsonStr | ConvertFrom-Json

$newList = New-Object System.Collections.Generic.List[PSObject]
$newList.Add($obj)

foreach ($item in $list) {
    if ($item.name -notlike "*樂業*") {
        $newList.Add($item)
    }
}

$outJson = $newList | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText("shelters_parsed.json", $outJson, $utf8)

$jsContent = "window.MOI_PARSED_SHELTERS = " + $outJson + ";"
[System.IO.File]::WriteAllText("shelters_data.js", $jsContent, $utf8)
[System.IO.File]::WriteAllText("dist/shelters_data.js", $jsContent, $utf8)

Write-Host "Successfully added/updated 台中市東區樂業國小 (24.138048674795467, 120.6949602390905)"
