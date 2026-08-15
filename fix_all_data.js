const fs = require('fs');

// Read shelters.json raw lines
let content = fs.readFileSync('shelters.json', 'utf8');

// Parse lines
const lines = content.split(/\r?\n/);
const parsed = [
  {
    county: '臺中市',
    district: '東區',
    name: '市立樂業國民小學 🏫',
    address: '臺中市東區樂業路60號',
    cap: '1,500人',
    type: 'shelter',
    lat: 24.138048674795467,
    lng: 120.6949602390905,
    source: '使用者指定精準座標驗證'
  }
];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  const cols = line.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/).map(c => c.replace(/^"|"$/g, '').trim());
  if (cols.length >= 7) {
    const county = cols[1] || cols[0];
    const district = cols[2] || '';
    const lng = parseFloat(cols[4] || cols[5]);
    const lat = parseFloat(cols[5] || cols[4]);
    const name = cols[6] || cols[3] || '避難收容處所';
    const address = cols[3] || cols[7] || '';
    const cap = cols[7] || cols[8] || '200人';

    if (!isNaN(lat) && !isNaN(lng) && lat > 18 && lat < 27 && lng > 118 && lng < 123) {
      // Skip duplicate/garbled樂業
      if (name.includes('樂業') || name.includes('榨業')) continue;

      parsed.push({
        county: county,
        district: district,
        name: name + ' 🏫',
        address: address,
        cap: (cap.includes('人') ? cap : cap + '人'),
        type: 'shelter',
        lat: lat,
        lng: lng,
        source: '內政部 MOI 避難收容處所點位檔'
      });
    }
  }
}

console.log('Total clean shelter points count:', parsed.length);
console.log('Point 0 (樂業國小):', parsed[0]);

fs.writeFileSync('shelters_parsed.json', JSON.stringify(parsed, null, 2), 'utf8');

const jsOut = 'window.MOI_PARSED_SHELTERS = ' + JSON.stringify(parsed) + ';';
fs.writeFileSync('shelters_data.js', jsOut, 'utf8');
fs.writeFileSync('dist/shelters_data.js', jsOut, 'utf8');

console.log('Successfully written shelters_data.js and dist/shelters_data.js with exact 樂業國小 coordinates!');
