import json

with open('shelters_parsed.json', 'r', encoding='utf-8', errors='ignore') as f:
  data = json.load(f)

matches = []
for i, item in enumerate(data):
  item_str = json.dumps(item, ensure_ascii=False)
  if '樂業' in item_str or '60號' in item_str or '24.138' in item_str:
    matches.append((i, item))

print(f"Total matching items in shelters_parsed.json: {len(matches)}")
for i, m in matches:
  print(f"Index {i}: {m}")
