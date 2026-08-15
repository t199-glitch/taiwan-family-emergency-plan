const fs = require('fs');

const raw = fs.readFileSync('shelters.json', 'utf8');
const lines = raw.split(/\r?\n/);

const leyeObj = {
  county: '臺中市',
  district: '東區',
  name: '市立樂業國民小學 🏫',
  address: '臺中市東區樂業路60號',
  cap: '1,500人',
  type: 'shelter',
  lat: 24.138048674795467,
  lng: 120.6949602390905,
  source: '使用者指定精準座標驗證'
};

const parsed = [leyeObj];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  // Extract longitudes (118.x - 123.x) and latitudes (21.x - 26.x)
  const lngMatch = line.match(/1(1[89]|2[0-3])\.\d+/);
  const latMatch = line.match(/2[1-6]\.\d+/);

  if (lngMatch && latMatch) {
    const lng = parseFloat(lngMatch[0]);
    const lat = parseFloat(latMatch[0]);

    if (line.includes('樂業') || line.includes('榨業')) continue;

    // Detect county from beginning of line
    const parts = line.split(',');
    let county = parts[1] || parts[0] || '其他縣市';
    county = county.trim();

    let name = parts[6] || parts[3] || '避難處所';
    name = name.replace(/^"|"$/g, '').trim();

    let addr = parts[3] || '';
    addr = addr.replace(/^"|"$/g, '').trim();

    let cap = parts[7] || '200人';
    cap = cap.replace(/^"|"$/g, '').trim();

    parsed.push({
      county: county,
      district: '',
      name: name + (name.endsWith('🏫') ? '' : ' 🏫'),
      address: addr,
      cap: cap.includes('人') ? cap : cap + '人',
      type: 'shelter',
      lat: lat,
      lng: lng,
      source: '內政部 MOI 避難收容處所開放點位檔'
    });
  }
}

console.log('Total clean parsed points count:', parsed.length);
console.log('Point 0 (樂業國小):', parsed[0]);

fs.writeFileSync('shelters_parsed.json', JSON.stringify(parsed, null, 2), 'utf8');

const jsContent = 'window.MOI_PARSED_SHELTERS = ' + JSON.stringify(parsed) + ';';
fs.writeFileSync('shelters_data.js', jsContent, 'utf8');
fs.writeFileSync('dist/shelters_data.js', jsContent, 'utf8');

console.log('Successfully created clean shelters_data.js!');
