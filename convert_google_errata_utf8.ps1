$big5 = [System.Text.Encoding]::GetEncoding(950)
$utf8 = [System.Text.Encoding]::UTF8
$bytes = [System.IO.File]::ReadAllBytes("google_errata.csv")
$str = $big5.GetString($bytes)
[System.IO.File]::WriteAllText("google_errata_utf8.csv", $str, $utf8)
Write-Host "Successfully converted google_errata.csv to google_errata_utf8.csv!"
