import csv, json, re, sys

# Read the downloaded Google Sheet CSV content
csv_file_path = r"C:\Users\hp\.gemini\antigravity-ide\brain\667644e1-a7ac-4bb4-a0c0-effba50c1359\.system_generated\steps\1226\content.md"

# Load existing shelters_parsed.json
with open("shelters_parsed.json", "r", encoding="utf-8") as f:
    shelters = json.load(f)

print(f"Initial shelters count: {len(shelters)}")

# Dictionary of corrections: key = ID or Shelter Name, value = { 'lat': float, 'lng': float, 'new_address': str, 'name': str }
corrections = {}

with open(csv_file_path, "r", encoding="utf-8", errors="ignore") as f:
    # Skip preamble lines until header row starting with "Directory,勘誤"
    lines = f.readlines()

csv_start = 0
for i, l in enumerate(lines):
    if "Directory,勘誤" in l or "勘誤,勘誤備註說明" in l:
        csv_start = i
        break

csv_content = "".join(lines[csv_start:])
reader = csv.reader(csv_content.splitlines())

header = None
errata_col_idx = -1
notes_col_idx = -1
id_col_idx = -1
name_col_idx = -1
address_col_idx = -1
county_col_idx = -1

for row in reader:
    if not row:
        continue
    if "勘誤" in row:
        header = row
        errata_col_idx = row.index("勘誤") if "勘誤" in row else -1
        notes_col_idx = row.index("勘誤備註說明") if "勘誤備註說明" in row else -1
        id_col_idx = row.index("序號") if "序號" in row else -1
        name_col_idx = row.index("避難收容處所名稱") if "避難收容處所名稱" in row else -1
        address_col_idx = row.index("避難收容處所地址") if "避難收容處所地址" in row else -1
        county_col_idx = row.index("縣市及鄉鎮市區 County and Area") if "縣市及鄉鎮市區 County and Area" in row else (row.index("縣市 County") if "縣市 County" in row else -1)
        continue
    
    if not header or len(row) <= errata_col_idx:
        continue

    errata = row[errata_col_idx].strip()
    notes = row[notes_col_idx].strip() if notes_col_idx >= 0 and len(row) > notes_col_idx else ""
    shelter_id = row[id_col_idx].strip() if id_col_idx >= 0 and len(row) > id_col_idx else ""
    name = row[name_col_idx].strip() if name_col_idx >= 0 and len(row) > name_col_idx else ""
    address = row[address_col_idx].strip() if address_col_idx >= 0 and len(row) > address_col_idx else ""
    county = row[county_col_idx].strip() if county_col_idx >= 0 and len(row) > county_col_idx else ""

    if "位置有誤" in errata:
        # Extract coordinates from notes
        # Format 1: "24.81676698427944, 121.38402923679091" or "24.951155513165865, 121.01973300134"
        # Format 2: "E 121.1194 N 24.6320"
        new_lat = None
        new_lng = None

        m1 = re.search(r'(2[1-5]\.\d+)\s*,\s*(12[0-2]\.\d+)', notes)
        if m1:
            new_lat = float(m1.group(1))
            new_lng = float(m1.group(2))
        else:
            m2 = re.search(r'E\s*(12[0-2]\.\d+)\s*N\s*(2[1-5]\.\d+)', notes)
            if m2:
                new_lng = float(m2.group(1))
                new_lat = float(m2.group(2))
            else:
                m3 = re.search(r'N\s*(2[1-5]\.\d+)\s*E\s*(12[0-2]\.\d+)', notes)
                if m3:
                    new_lat = float(m3.group(1))
                    new_lng = float(m3.group(2))

        # Check if new address is mentioned in notes
        new_addr = None
        addr_match = re.search(r'新址應為[：:\s]*([^\n\r]+)', notes)
        if addr_match:
            new_addr = addr_match.group(1).strip()

        corrections[shelter_id] = {
            'id': shelter_id,
            'name': name,
            'address': address,
            'county': county,
            'new_lat': new_lat,
            'new_lng': new_lng,
            'new_addr': new_addr,
            'notes': notes
        }

print(f"Found {len(corrections)} items marked as '位置有誤':")
updated_count = 0
for sid, c in corrections.items():
    print(f"  ID {sid}: {c['name']} | Corrected Coords: ({c['new_lat']}, {c['new_lng']}) | Notes: {c['notes'][:40]}")

# Apply updates to shelters dataset
# Match shelters by name, id, or address
applied_updates = 0
for item in shelters:
    item_name = item.get("name", "").replace(" 🏫", "").strip()
    item_addr = item.get("address", "").strip()

    # Find matching correction
    matched = None
    for sid, c in corrections.items():
        c_name = c['name'].strip()
        if c_name and (c_name in item_name or item_name in c_name):
            matched = c
            break
        if c['address'] and c['address'] in item_addr:
            matched = c
            break

    if matched and matched['new_lat'] is not None and matched['new_lng'] is not None:
        print(f"Updating [{item.get('name')}] from ({item['lat']}, {item['lng']}) -> ({matched['new_lat']}, {matched['new_lng']})")
        item['lat'] = matched['new_lat']
        item['lng'] = matched['new_lng']
        if matched['new_addr']:
            item['address'] = matched['new_addr']
        item['source'] = '勘誤校正點位'
        applied_updates += 1

print(f"Successfully applied {applied_updates} coordinate corrections!")

# Write out shelters_parsed.json
with open("shelters_parsed.json", "w", encoding="utf-8") as f:
    json.dump(shelters, f, ensure_ascii=False, indent=2)

js_content = "window.MOI_PARSED_SHELTERS = " + json.dumps(shelters, ensure_ascii=False) + ";"
with open("shelters_data.js", "w", encoding="utf-8") as f:
    f.write(js_content)

with open("dist/shelters_data.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print("Saved updated shelters_parsed.json, shelters_data.js, and dist/shelters_data.js!")
