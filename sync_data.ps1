$utf8 = [System.Text.Encoding]::UTF8
$json = [System.IO.File]::ReadAllText("shelters_parsed.json", $utf8)
$jsContent = "window.MOI_PARSED_SHELTERS = " + $json + ";"
[System.IO.File]::WriteAllText("shelters_data.js", $jsContent, $utf8)
[System.IO.File]::WriteAllText("dist/shelters_data.js", $jsContent, $utf8)
Write-Host "Successfully synced shelters_data.js and dist/shelters_data.js!"
