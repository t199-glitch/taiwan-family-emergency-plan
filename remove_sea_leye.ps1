$utf8 = [System.Text.Encoding]::UTF8
$json = [System.IO.File]::ReadAllText("shelters_parsed.json", $utf8)
$list = $json | ConvertFrom-Json

$cleanList = New-Object System.Collections.Generic.List[PSObject]

# Keep point 0 (the user's exact verified Leye Elementary School)
$cleanList.Add($list[0])

# Filter all remaining points
for ($i = 1; $i -lt $list.Count; $i++) {
    $item = $list[$i]
    $lng = [double]$item.lng
    $lat = [double]$item.lat
    $name = [string]$item.name
    $addr = [string]$item.address

    # Remove the old MOI typo point out in the sea (lng 120.194202 or lat 24.138354 or duplicate 樂業)
    if ($lng -lt 120.3 -and $lat -gt 24.1 -and $lat -lt 24.2) {
        Write-Host "Removing sea marker:" $name $addr $lat $lng
        continue
    }
    if ($name -like "*樂業*" -or $addr -like "*樂業*" -or $name -like "*榨業*") {
        Write-Host "Removing duplicate Leye marker:" $name $addr $lat $lng
        continue
    }

    $cleanList.Add($item)
}

Write-Host "Total clean shelters count:" $cleanList.Count

$cleanJson = $cleanList | ConvertTo-Json -Depth 4
[System.IO.File]::WriteAllText("shelters_parsed.json", $cleanJson, $utf8)

$jsContent = "window.MOI_PARSED_SHELTERS = " + $cleanJson + ";"
[System.IO.File]::WriteAllText("shelters_data.js", $jsContent, $utf8)
[System.IO.File]::WriteAllText("dist/shelters_data.js", $jsContent, $utf8)

Write-Host "Successfully removed sea marker off Taichung and updated shelters_data.js!"
