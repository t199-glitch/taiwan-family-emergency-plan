const fs = require('fs');

const data = JSON.parse(fs.readFileSync('shelters_parsed.json', 'utf8'));

const matches = [];
data.forEach((item, index) => {
  const str = JSON.stringify(item);
  if (str.includes('樂業') || str.includes('60號') || (item.lat && Math.abs(item.lat - 24.138048) < 0.005)) {
    matches.push({ index, item });
  }
});

console.log('Total matching items in shelters_parsed.json:', matches.length);
matches.forEach(m => console.log(`Index ${m.index}:`, m.item));
