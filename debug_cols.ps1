[Reflection.Assembly]::LoadWithPartialName("Microsoft.VisualBasic") | Out-Null
$utf8 = [System.Text.Encoding]::UTF8

$parser = New-Object Microsoft.VisualBasic.FileIO.TextFieldParser("shelters_utf8.csv", $utf8)
$parser.TextFieldType = [Microsoft.VisualBasic.FileIO.FieldType]::Delimited
$parser.SetDelimiters(",")
$parser.HasFieldsEnclosedInQuotes = $true

for ($i = 0; $i -lt 10; $i++) {
    if ($parser.EndOfData) { break }
    $cols = $parser.ReadFields()
    Write-Host ("Row {0}: Count={1}" -f $i, $cols.Count)
    for ($j = 0; $j -lt $cols.Count; $j++) {
        Write-Host ("  Col {0}: {1}" -f $j, $cols[$j])
    }
}
$parser.Close()
