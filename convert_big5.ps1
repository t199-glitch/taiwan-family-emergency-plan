$big5 = [System.Text.Encoding]::GetEncoding(950)
$utf8 = [System.Text.Encoding]::UTF8

$bytes = [System.IO.File]::ReadAllBytes("shelters.json")
$str = $big5.GetString($bytes)
[System.IO.File]::WriteAllText("shelters_utf8.csv", $str, $utf8)

Write-Host "Converted shelters.json from Big5 to shelters_utf8.csv successfully!"
