[Reflection.Assembly]::LoadWithPartialName("Microsoft.VisualBasic") | Out-Null
$big5 = [System.Text.Encoding]::GetEncoding(950)
$utf8 = [System.Text.Encoding]::UTF8

$parser = New-Object Microsoft.VisualBasic.FileIO.TextFieldParser("google_errata.csv", $big5)
$parser.TextFieldType = [Microsoft.VisualBasic.FileIO.FieldType]::Delimited
$parser.SetDelimiters(",")
$parser.HasFieldsEnclosedInQuotes = $true

# Skip header rows
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
        $sidStr = $cols[3].Trim()
        $name = $cols[9].Trim()

        if ($errata.Contains("位置有誤")) {
            $sid = 0
            [int]::TryParse($sidStr, [ref]$sid) | Out-Null

            $lat = 0.0
            $lng = 0.0
            $hasNewCoords = $false

            # Format 1: 24.81676698427944, 121.38402923679091
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

            if ($hasNewCoords -and -not [string]::IsNullOrWhiteSpace($name)) {
                $obj = [PSCustomObject]@{
                    id = $sid
                    name = $name
                    lat = $lat
                    lng = $lng
                    notes = $notes
                }
                $corrections.Add($obj)
            }
        }
    }
}
$parser.Close()

Write-Host "Total errata items to correct by name:" $corrections.Count

# Load shelters_parsed.json
$json = [System.IO.File]::ReadAllText("shelters_parsed.json", $utf8)
$shelters = $json | ConvertFrom-Json

# Reset point 0 (樂業國小)
$shelters[0].lat = 24.138048674795467
$shelters[0].lng = 120.6949602390905

$applied = 0

foreach ($c in $corrections) {
    $cName = [string]$c.name
    $cleanCName = $cName.Trim()

    # Skip index 0 (樂業國小) when matching
    for ($i = 1; $i -lt $shelters.Count; $i++) {
        $s = $shelters[$i]
        $sName = [string]$s.name
        $cleanSName = $sName.Replace(" 🏫", "").Trim()

        if (-not [string]::IsNullOrWhiteSpace($cleanCName) -and ($cleanSName.Equals($cleanCName) -or $cleanSName.Contains($cleanCName) -or $cleanCName.Contains($cleanSName))) {
            Write-Host ("UPDATED [{0}] Coords: ({1}, {2}) -> ({3}, {4})" -f $s.name, $s.lat, $s.lng, $c.lat, $c.lng)
            $s.lat = $c.lat
            $s.lng = $c.lng
            $s.source = "GoogleSheet Errata"
            $applied++
            break
        }
    }
}

Write-Host "Successfully applied errata updates count:" $applied

$newJson = $shelters | ConvertTo-Json -Depth 4
[System.IO.File]::WriteAllText("shelters_parsed.json", $newJson, $utf8)

$jsContent = "window.MOI_PARSED_SHELTERS = " + $newJson + ";"
[System.IO.File]::WriteAllText("shelters_data.js", $jsContent, $utf8)
[System.IO.File]::WriteAllText("dist/shelters_data.js", $jsContent, $utf8)

Write-Host "Successfully generated updated shelters_data.js!"
