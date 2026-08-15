import json, re

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

parsed = [leye]

with open("shelters.json", "r", encoding="utf-8", errors="ignore") as f:
  lines = f.readlines()

for line in lines[1:]:
  line = line.strip()
  if not line:
    continue
  cols = [c.strip('" ') for c in re.split(r',(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)', line)]
  if len(cols) >= 7:
    county = cols[1] or cols[0]
    district = cols[2] if len(cols) > 2 else ""
    try:
      lng = float(cols[4])
      lat = float(cols[5])
    except:
      try:
        lng = float(cols[5])
        lat = float(cols[4])
      except:
        continue
    
    name = cols[6] if len(cols) > 6 else "避難收容處所"
    address = cols[3] if len(cols) > 3 else ""
    cap = cols[7] if len(cols) > 7 else "200人"

    if 18 < lat < 27 and 118 < lng < 123:
      if "樂業" in name or "榨業" in name:
        continue
      parsed.append({
        "county": county,
        "district": district,
        "name": name + " 🏫",
        "address": address,
        "cap": cap if "人" in cap else cap + "人",
        "type": "shelter",
        "lat": lat,
        "lng": lng,
        "source": "內政部 MOI 避難收容處所點位檔"
      })

print(f"Total parsed points: {len(parsed)}")
print(f"First point: {parsed[0]}")

with open("shelters_parsed.json", "w", encoding="utf-8") as f:
  json.dump(parsed, f, ensure_ascii=False, indent=2)

js_out = "window.MOI_PARSED_SHELTERS = " + json.dumps(parsed, ensure_ascii=False) + ";"
with open("shelters_data.js", "w", encoding="utf-8") as f:
  f.write(js_out)

with open("dist/shelters_data.js", "w", encoding="utf-8") as f:
  f.write(js_out)

print("Done rebuilding shelters_data.js and dist/shelters_data.js!")
