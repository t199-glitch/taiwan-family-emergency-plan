[Reflection.Assembly]::LoadWithPartialName("Microsoft.VisualBasic") | Out-Null
$big5 = [System.Text.Encoding]::GetEncoding(950)
$utf8 = [System.Text.Encoding]::UTF8

$parser = New-Object Microsoft.VisualBasic.FileIO.TextFieldParser("google_errata.csv", $big5)
$parser.TextFieldType = [Microsoft.VisualBasic.FileIO.FieldType]::Delimited
$parser.SetDelimiters(",")
$parser.HasFieldsEnclosedInQuotes = $true

# Skip headers
if (-not $parser.EndOfData) { $null = $parser.ReadFields() }
if (-not $parser.EndOfData) { $null = $parser.ReadFields() }

$corrections = New-Object System.Collections.Generic.List[PSObject]

while (-not $parser.EndOfData) {
    $cols = $null
    try {
        $cols = $parser.ReadFields()
    } catch {
        continue
    }

    if ($null -ne $cols -and $cols.Count -ge 10) {
        $errata = $cols[1].Trim()
        $notes = $cols[2].Trim()
        $sid = $cols[3].Trim()
        $county = $cols[5].Trim()
        $address = $cols[8].Trim()
        $name = $cols[9].Trim()

        if ($errata.Contains("位置有誤")) {
            $lat = 0.0
            $lng = 0.0
            $hasNewCoords = $false

            # Format 1: 24.81676698427944, 121.38402923679091 or 24.9511..., 121.0197...
            $m1 = [regex]::Match($notes, "(2[1-5]\.\d+)\s*,\s*(11[89]\.\d+|12[0-2]\.\d+)")
            if ($m1.Success) {
                [double]::TryParse($m1.Groups[1].Value, [System.Globalization.NumberStyles]::Any, [System.Globalization.CultureInfo]::InvariantCulture, [ref]$lat) | Out-Null
                [double]::TryParse($m1.Groups[2].Value, [System.Globalization.NumberStyles]::Any, [System.Globalization.CultureInfo]::InvariantCulture, [ref]$lng) | Out-Null
                $hasNewCoords = $true
            } else {
                # Format 2: E 121.1194 N 24.6320
                $m2 = [regex]::Match($notes, "E\s*(11[89]\.\d+|12[0-2]\.\d+)\s*N\s*(2[1-5]\.\d+)")
                if ($m2.Success) {
                    [double]::TryParse($m2.Groups[1].Value, [System.Globalization.NumberStyles]::Any, [System.Globalization.CultureInfo]::InvariantCulture, [ref]$lng) | Out-Null
                    [double]::TryParse($m2.Groups[2].Value, [System.Globalization.NumberStyles]::Any, [System.Globalization.CultureInfo]::InvariantCulture, [ref]$lat) | Out-Null
                    $hasNewCoords = $true
                }
            }

            $newAddr = ""
            $mAddr = [regex]::Match($notes, "新址應為[：:\s]*([^\n\r]+)")
            if ($mAddr.Success) {
                $newAddr = $mAddr.Groups[1].Value.Trim()
            }

            $obj = [PSCustomObject]@{
                id = $sid
                county = $county
                name = $name
                address = $address
                hasNewCoords = $hasNewCoords
                lat = $lat
                lng = $lng
                newAddr = $newAddr
                notes = $notes
            }
            $corrections.Add($obj)

            if ($hasNewCoords) {
                Write-Host ("FOUND ERRATA [{0}]: Name='{1}' -> New Lat={2}, Lng={3}" -f $sid, $name, $lat, $lng)
            } else {
                Write-Host ("NO COORDS [{0}]: Name='{1}' -> Notes={2}" -f $sid, $name, $notes.Replace("`n", " "))
            }
        }
    }
}
$parser.Close()

Write-Host "Total items marked '位置有誤' in Google Sheet:" $corrections.Count

# Load existing shelters_parsed.json
$json = [System.IO.File]::ReadAllText("shelters_parsed.json", $utf8)
$shelters = $json | ConvertFrom-Json

$applied = 0
foreach ($c in $corrections) {
    if (-not $c.hasNewCoords) { continue }

    $cName = [string]$c.name
    $cleanCName = $cName.Trim()

    foreach ($s in $shelters) {
        $sName = [string]$s.name
        $cleanSName = $sName.Replace(" 🏫", "").Trim()

        if (-not [string]::IsNullOrWhiteSpace($cleanCName) -and ($cleanSName.Equals($cleanCName) -or $cleanSName.Contains($cleanCName) -or $cleanCName.Contains($cleanSName))) {
            Write-Host ("UPDATED [{0}] from ({1}, {2}) to ({3}, {4})" -f $s.name, $s.lat, $s.lng, $c.lat, $c.lng)
            $s.lat = $c.lat
            $s.lng = $c.lng
            if (-not [string]::IsNullOrWhiteSpace($c.newAddr)) {
                $s.address = $c.newAddr
            }
            $s.source = "GoogleSheet 勘誤點位校正"
            $applied++
            break
        }
    }
}

Write-Host "Total applied coordinate updates:" $applied

$newJson = $shelters | ConvertTo-Json -Depth 4
[System.IO.File]::WriteAllText("shelters_parsed.json", $newJson, $utf8)

$jsContent = "window.MOI_PARSED_SHELTERS = " + $newJson + ";"
[System.IO.File]::WriteAllText("shelters_data.js", $jsContent, $utf8)
[System.IO.File]::WriteAllText("dist/shelters_data.js", $jsContent, $utf8)

Write-Host "Successfully updated shelters_data.js and dist/shelters_data.js!"
