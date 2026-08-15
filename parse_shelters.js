const fs = require('fs');

try {
  let content;
  try {
    content = fs.readFileSync('shelters.json', 'utf8');
    if (content.includes('')) {
      const iconv = require('iconv-lite');
      const buf = fs.readFileSync('shelters.json');
      content = iconv.decode(buf, 'big5');
    }
  } catch (e) {
    content = fs.readFileSync('shelters.json', 'utf8');
  }

  const lines = content.split(/\r?\n/);
  console.log("Total CSV lines:", lines.length);
  console.log("Header:", lines[0]);
  
  const parsed = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // CSV split handling quotes
    const cols = line.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/).map(c => c.replace(/^"|"$/g, '').trim());
    if (cols.length >= 7) {
      const county = cols[1] || cols[0];
      const district = cols[2] || '';
      const lng = parseFloat(cols[4] || cols[5]);
      const lat = parseFloat(cols[5] || cols[4]);
      const name = cols[6] || cols[3] || '避難收容處所';
      const address = cols[3] || cols[7] || '';
      const cap = cols[7] || cols[8] || '200人';

      if (!isNaN(lat) && !isNaN(lng) && lat > 15 && lat < 30 && lng > 115 && lng < 125) {
        parsed.push({
          county: county,
          district: district,
          name: name + ' 🏫',
          address: address,
          cap: (cap.includes('人') ? cap : cap + '人'),
          type: 'shelter',
          lat: lat,
          lng: lng,
          source: '內政部 MOI 避難收容處所官方點位檔 (正本點位)'
        });
      }
    }
  }

  console.log("Successfully parsed valid shelter points:", parsed.length);
  if (parsed.length > 0) {
    console.log("Sample point 0:", parsed[0]);
    fs.writeFileSync('shelters_parsed.json', JSON.stringify(parsed, null, 2), 'utf8');
  }
} catch (err) {
  console.error("Parse error:", err);
}
