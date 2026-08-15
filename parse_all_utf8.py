import csv, json

leyeObj = {
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

parsed = [leyeObj]

with open("shelters_utf8.csv", "r", encoding="utf-8", errors="ignore") as f:
  reader = csv.reader(f)
  header = next(reader, None)
  for row in reader:
    if len(row) >= 7:
      county = row[1].strip() or row[0].strip()
      district = row[2].strip() if len(row) > 2 else ""
      addr = row[3].strip() if len(row) > 3 else ""
      name = row[6].strip() if len(row) > 6 else (row[3].strip() if len(row) > 3 else "")
      cap = row[7].strip() if len(row) > 7 else "200人"
      
      try:
        lng = float(row[4])
        lat = float(row[5])
      except:
        try:
          lng = float(row[5])
          lat = float(row[4])
        except:
          continue

      if "樂業" in name or "樂業" in addr or "榨業" in name:
        continue

      if 18 < lat < 27 and 118 < lng < 123:
        parsed.append({
          "county": county,
          "district": district,
          "name": name + (" 🏫" if not name.endswith("🏫") else ""),
          "address": addr,
          "cap": cap if "人" in cap else cap + "人",
          "type": "shelter",
          "lat": lat,
          "lng": lng,
          "source": "內政部 MOI 避難收容處所開放點位檔"
        })

print(f"Total parsed clean points count: {len(parsed)}")

with open("shelters_parsed.json", "w", encoding="utf-8") as f:
  json.dump(parsed, f, ensure_ascii=False, indent=2)

js_content = "window.MOI_PARSED_SHELTERS = " + json.dumps(parsed, ensure_ascii=False) + ";"

with open("shelters_data.js", "w", encoding="utf-8") as f:
  f.write(js_content)

with open("dist/shelters_data.js", "w", encoding="utf-8") as f:
  f.write(js_content)

print("Successfully written clean shelters_data.js and dist/shelters_data.js with exact 樂業國小 coordinates!")
