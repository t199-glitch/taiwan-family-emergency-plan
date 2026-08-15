$jsonText = [System.IO.File]::ReadAllText("shelters_parsed.json")
$list = [Newtonsoft.Json.JsonConvert]::DeserializeObject($jsonText, [System.Type]::GetType("System.Collections.Generic.List[PSObject]"))

if ($null -eq $list) {
    $list = New-Object System.Collections.Generic.List[PSObject]
}

# Add or update 台中市東區樂業國小
$leye = [PSCustomObject]@{
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

# Insert at top
$list.Insert(0, $leye)

$newJson = $list | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText("shelters_parsed.json", $newJson, [System.Text.Encoding]::UTF8)

$jsOut = "window.MOI_PARSED_SHELTERS = " + $newJson + ";"
[System.IO.File]::WriteAllText("shelters_data.js", $jsOut, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText("dist/shelters_data.js", $jsOut, [System.Text.Encoding]::UTF8)

Write-Host "Successfully updated 台中市東區樂業國小 coordinates to 24.138048674795467, 120.6949602390905"
