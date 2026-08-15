$utf8 = [System.Text.Encoding]::UTF8
$lines = [System.IO.File]::ReadAllLines("google_errata.csv", $utf8)

Write-Host "Total lines in google_errata.csv:" $lines.Count
for ($i = 0; $i -lt [Math]::Min(30, $lines.Count); $i++) {
    Write-Host ("Line [{0}]: {1}" -f $i, $lines[$i])
}
