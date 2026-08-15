$utf8 = [System.Text.Encoding]::UTF8
$sheetPath = "C:\Users\hp\.gemini\antigravity-ide\brain\667644e1-a7ac-4bb4-a0c0-effba50c1359\.system_generated\steps\1226\content.md"

$lines = [System.IO.File]::ReadAllLines($sheetPath, $utf8)

$corrections = New-Object System.Collections.Generic.List[PSObject]

# Read line by line
for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]
    if ($line.Contains("位置有誤")) {
        # Look ahead for coordinates in the surrounding lines
        $context = ""
        for ($j = $i; $j -lt [Math]::Min($lines.Count, $i + 10); $j++) {
            $context += " " + $lines[$j]
        }

        # Extract lat/lng using Regex
        # e.g., 24.81676698427944, 121.38402923679091 or E 121.1194 N 24.6320
        $lat = 0.0
        $lng = 0.0
        $found = $false

        $m1 = [regex]::Match($context, "(2[1-5]\.\d+)\s*,\s*(12[0-2]\.\d+)")
        if ($m1.Success) {
            [double]::TryParse($m1.Groups[1].Value, [System.Globalization.NumberStyles]::Any, [System.Globalization.CultureInfo]::InvariantCulture, [ref]$lat) | Out-Null
            [double]::TryParse($m1.Groups[2].Value, [System.Globalization.NumberStyles]::Any, [System.Globalization.CultureInfo]::InvariantCulture, [ref]$lng) | Out-Null
            $found = $true
        } else {
            $m2 = [regex]::Match($context, "E\s*(12[0-2]\.\d+)\s*N\s*(2[1-5]\.\d+)")
            if ($m2.Success) {
                [double]::TryParse($m2.Groups[1].Value, [System.Globalization.NumberStyles]::Any, [System.Globalization.CultureInfo]::InvariantCulture, [ref]$lng) | Out-Null
                [double]::TryParse($m2.Groups[2].Value, [System.Globalization.NumberStyles]::Any, [System.Globalization.CultureInfo]::InvariantCulture, [ref]$lat) | Out-Null
                $found = $true
            }
        }

        # Extract shelter name from line
        $parts = $line.Split(",")
        $name = ""
        foreach ($p in $parts) {
            $pTrim = $p.Trim('" ')
            if ($pTrim.EndsWith("中心") -or $pTrim.EndsWith("國小") -or $pTrim.EndsWith("處所") -or $pTrim.EndsWith("聯隊") -or $pTrim.EndsWith("學校")) {
                $name = $pTrim
                break
            }
        }

        if ($found) {
            $obj = [PSCustomObject]@{
                line = $i
                name = $name
                lat = $lat
                lng = $lng
                context = $context.Substring(0, [Math]::Min(100, $context.Length))
            }
            $corrections.Add($obj)
            Write-Host ("Found correction: Name='{0}' -> Lat={1}, Lng={2}" -f $name, $lat, $lng)
        }
    }
}

Write-Host "Total coordinate corrections extracted from Google Sheet:" $corrections.Count

# Apply corrections to shelters_parsed.json
$json = [System.IO.File]::ReadAllText("shelters_parsed.json", $utf8)
$shelters = $json | ConvertFrom-Json

$applied = 0
foreach ($c in $corrections) {
    foreach ($s in $shelters) {
        $sName = [string]$s.name
        if (-not [string]::IsNullOrWhiteSpace($c.name) -and ($sName.Contains($c.name) -or $c.name.Contains($sName.Replace(" 🏫", "")))) {
            Write-Host ("Updating [{0}] from ({1}, {2}) to ({3}, {4})" -f $s.name, $s.lat, $s.lng, $c.lat, $c.lng)
            $s.lat = $c.lat
            $s.lng = $c.lng
            $s.source = "勘誤校正點位"
            $applied++
            break
        }
    }
}

Write-Host "Applied coordinate corrections count:" $applied

$newJson = $shelters | ConvertTo-Json -Depth 4
[System.IO.File]::WriteAllText("shelters_parsed.json", $newJson, $utf8)

$jsContent = "window.MOI_PARSED_SHELTERS = " + $newJson + ";"
[System.IO.File]::WriteAllText("shelters_data.js", $jsContent, $utf8)
[System.IO.File]::WriteAllText("dist/shelters_data.js", $jsContent, $utf8)

Write-Host "Successfully updated shelters_data.js and dist/shelters_data.js with Google Sheet errata!"
