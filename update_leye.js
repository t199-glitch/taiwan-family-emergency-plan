const fs = require('fs');

const leye = {
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

const raw = fs.readFileSync('shelters_parsed.json', 'utf8');
const list = JSON.parse(raw);

// Check if already exists, if so update, else prepend
const idx = list.findIndex(item => item.name && item.name.includes('樂業'));
if (idx >= 0) {
  list[idx].lat = 24.138048674795467;
  list[idx].lng = 120.6949602390905;
} else {
  list.unshift(leye);
}

fs.writeFileSync('shelters_parsed.json', JSON.stringify(list, null, 2), 'utf8');

const jsOut = 'window.MOI_PARSED_SHELTERS = ' + JSON.stringify(list) + ';';
fs.writeFileSync('shelters_data.js', jsOut, 'utf8');
fs.writeFileSync('dist/shelters_data.js', jsOut, 'utf8');

console.log('Successfully updated 台中市東區樂業國小 coordinates to 24.138048674795467, 120.6949602390905');
