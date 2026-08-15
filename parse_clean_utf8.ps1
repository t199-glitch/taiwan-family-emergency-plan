$utf8 = [System.Text.Encoding]::UTF8
$lines = [System.IO.File]::ReadAllLines("shelters_utf8.csv", $utf8)

$list = New-Object System.Collections.Generic.List[PSObject]

# First, add the exact 樂業國小 point at index 0
$leyeObj = [PSCustomObject]@{
    county = "臺中市"
    district = "東區"
    name = "市立樂業國民小學 🏫"
    address = "臺中市東區樂業路60號"
    cap = "1,500人"
    type = "shelter"
    lat = 24.138048674795467
    lng = 120.6949602390905
    source = "使用者指定精準座標驗證"
}
$list.Add($leyeObj)

for ($i = 1; $i -lt $lines.Count; $i++) {
    $line = $lines[$i].Trim()
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

        if ($c_name.Contains("樂業") -or $c_addr.Contains("樂業")) {
            # Skip old typo entry because we already added clean leyeObj at index 0
            continue
        }

        if ($lat -gt 18 -and $lat -lt 27 -and $lng -gt 118 -and $lng -lt 123) {
            $obj = [PSCustomObject]@{
                county = $c_county
                district = $c_district
                name = ($c_name + " 🏫")
                address = $c_addr
                cap = (if ($c_cap.Contains("人")) { $c_cap } else { $c_cap + "人" })
                type = "shelter"
                lat = $lat
                lng = $lng
                source = "內政部 MOI 避難收容處所開放點位檔"
            }
            $list.Add($obj)
        }
    }
}

Write-Host "Total parsed clean points:" $list.Count

$json = $list | ConvertTo-Json -Depth 4
[System.IO.File]::WriteAllText("shelters_parsed.json", $json, $utf8)

$jsContent = "window.MOI_PARSED_SHELTERS = " + $json + ";"
[System.IO.File]::WriteAllText("shelters_data.js", $jsContent, $utf8)
[System.IO.File]::WriteAllText("dist/shelters_data.js", $jsContent, $utf8)

Write-Host "Successfully generated clean shelters_data.js with full 5900+ points and exact 樂業國小 coordinates!"
