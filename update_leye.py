import json

leye = {
  "county": "臺中市",
  "district": "東區",
  "name": "市立樂業國民小學 🏫",
  "address": "臺中市東區樂業路60號",
  "cap": "1,500人",
  "type": "shelter",
  "lat": 24.138048674795467,
  "lng": 120.6949602390905,
  "source": "使用者指定精準座標驗證"
}

with open("shelters_parsed.json", "r", encoding="utf-8") as f:
  list_data = json.load(f)

# Insert or update
found = False
for item in list_data:
  if "樂業" in item.get("name", ""):
    item["lat"] = 24.138048674795467
    item["lng"] = 120.6949602390905
    found = True
    break

if not found:
  list_data.insert(0, leye)

with open("shelters_parsed.json", "w", encoding="utf-8") as f:
  json.dump(list_data, f, ensure_ascii=False, indent=2)

js_out = "window.MOI_PARSED_SHELTERS = " + json.dumps(list_data, ensure_ascii=False) + ";"
with open("shelters_data.js", "w", encoding="utf-8") as f:
  f.write(js_out)

with open("dist/shelters_data.js", "w", encoding="utf-8") as f:
  f.write(js_out)

print("Updated 台中市東區樂業國小 coordinates to 24.138048674795467, 120.6949602390905")
