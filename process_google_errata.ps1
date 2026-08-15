$utf8 = [System.Text.Encoding]::UTF8

if (-not (Test-Path "google_errata.csv")) {
    Write-Host "File google_errata.csv not found!"
    exit 1
}

$raw = [System.IO.File]::ReadAllText("google_errata.csv", $utf8)
$lines = $raw -split "\r?\n"

Write-Host "Downloaded Google Errata CSV total lines:" $lines.Count

# Load existing shelters_parsed.json
$json = [System.IO.File]::ReadAllText("shelters_parsed.json", $utf8)
$shelters = $json | ConvertFrom-Json

$corrections = New-Object System.Collections.Generic.List[PSObject]

for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]
    if ($line.Contains("位置有誤")) {
        $block = ""
        for ($j = $i; $j -lt [Math]::Min($lines.Count, $i + 6); $j++) {
            $block += "`n" + $lines[$j]
        }

        $lat = 0.0
        $lng = 0.0
        $hasCoords = $false

        $m1 = [regex]::Match($block, "(2[1-5]\.\d+)\s*,\s*(11[89]\.\d+|12[0-2]\.\d+)")
        if ($m1.Success) {
            [double]::TryParse($m1.Groups[1].Value, [System.Globalization.NumberStyles]::Any, [System.Globalization.CultureInfo]::InvariantCulture, [ref]$lat) | Out-Null
            [double]::TryParse($m1.Groups[2].Value, [System.Globalization.NumberStyles]::Any, [System.Globalization.CultureInfo]::InvariantCulture, [ref]$lng) | Out-Null
            $hasCoords = $true
        } else {
            $m2 = [regex]::Match($block, "E\s*(11[89]\.\d+|12[0-2]\.\d+)\s*N\s*(2[1-5]\.\d+)")
            if ($m2.Success) {
                [double]::TryParse($m2.Groups[1].Value, [System.Globalization.NumberStyles]::Any, [System.Globalization.CultureInfo]::InvariantCulture, [ref]$lng) | Out-Null
                [double]::TryParse($m2.Groups[2].Value, [System.Globalization.NumberStyles]::Any, [System.Globalization.CultureInfo]::InvariantCulture, [ref]$lat) | Out-Null
                $hasCoords = $true
            }
        }

        $newAddr = ""
        $mAddr = [regex]::Match($block, "新址應為[：:\s]*([^\n\r]+)")
        if ($mAddr.Success) {
            $newAddr = $mAddr.Groups[1].Value.Trim()
        }

        $parts = $line -split ','
        $name = ""
        if ($parts.Count -ge 10) {
            $name = $parts[9].Replace('"', '').Trim()
        }

        if ($hasCoords) {
            $obj = [PSCustomObject]@{
                name = $name
                lat = $lat
                lng = $lng
                newAddr = $newAddr
                line = $i
            }
            $corrections.Add($obj)
            Write-Host ("Parsed errata item [{0}]: Name='{1}' -> Lat={2}, Lng={3}" -f $i, $name, $lat, $lng)
        }
    }
}

Write-Host "Total errata corrections found:" $corrections.Count

$applied = 0
foreach ($c in $corrections) {
    foreach ($s in $shelters) {
        $sName = [string]$s.name
        $cleanSName = $sName.Replace(" 🏫", "").Trim()

        if (-not [string]::IsNullOrWhiteSpace($c.name) -and ($sName.Contains($c.name) -or $c.name.Contains($cleanSName))) {
            Write-Host ("Updating [{0}] from ({1}, {2}) to ({3}, {4})" -f $s.name, $s.lat, $s.lng, $c.lat, $c.lng)
            $s.lat = $c.lat
            $s.lng = $c.lng
            if (-not [string]::IsNullOrWhiteSpace($c.newAddr)) {
                $s.address = $c.newAddr
            }
            $s.source = "勘誤校正點位"
            $applied++
            break
        }
    }
}

Write-Host "Applied corrections count:" $applied

$newJson = $shelters | ConvertTo-Json -Depth 4
[System.IO.File]::WriteAllText("shelters_parsed.json", $newJson, $utf8)

$jsContent = "window.MOI_PARSED_SHELTERS = " + $newJson + ";"
[System.IO.File]::WriteAllText("shelters_data.js", $jsContent, $utf8)
[System.IO.File]::WriteAllText("dist/shelters_data.js", $jsContent, $utf8)

Write-Host "Successfully updated shelters_data.js and dist/shelters_data.js with Google Sheet errata!"
