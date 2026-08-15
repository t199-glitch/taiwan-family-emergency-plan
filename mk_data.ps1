$txt = [System.IO.File]::ReadAllText("shelters_parsed.json")
$out = "window.MOI_PARSED_SHELTERS = " + $txt + ";"
[System.IO.File]::WriteAllText("shelters_data.js", $out, [System.Text.Encoding]::UTF8)
Write-Host "Done writing shelters_data.js"
