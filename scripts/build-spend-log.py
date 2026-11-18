#!/usr/bin/env python3
"""Build client/src/data/spendLog.generated.ts from VicPoint_Spend_Master.

Reads sheet Master of an xlsx export, or a csv with the same headers.
Mapping and the agreed per-line splits live in scripts/spend-log-map.json.

Usage:
  python3 scripts/build-spend-log.py path/to/VicPoint_Spend_Master.xlsx
  python3 scripts/build-spend-log.py path/to/Master.csv --out client/src/data/spendLog.generated.ts
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import json
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
MAP_PATH = Path(__file__).resolve().parent / "spend-log-map.json"
DEFAULT_OUT = ROOT / "client" / "src" / "data" / "spendLog.generated.ts"
NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

# Counted section rollup. Pool legacy ids roll up the same way as the tracker.
POOL_IDS = {"pool", "coping", "decking", "crazy-paving", "pool-fence"}
SECTION_ORDER = [
    ("exterior", "Street Presence"),
    ("entrance", "Entrance"),
    ("pool", "Pool & Outdoor Living"),
    ("back-patio", "Back Covered Patio"),
    ("back-yard", "Back Yard Area"),
    ("side-access", "Side Passage"),
    ("kitchen", "Kitchen"),
    ("laundry", "Laundry"),
    ("bathrooms", "Bathrooms"),
    ("living", "Living Room"),
    ("master", "Master Bedroom"),
    ("bedroom2", "Bedroom 2"),
    ("bedroom3", "Bedroom 3"),
    ("bedroom4", "Bedroom 4"),
    ("general", "General"),
]


def excel_date(value: str) -> str:
    serial = int(float(value))
    day = dt.date(1899, 12, 30) + dt.timedelta(days=serial)
    return day.isoformat()


def parse_date(value: str) -> str:
    value = value.strip()
    if not value:
        raise ValueError("blank date")
    if value.isdigit() or (value.replace(".", "", 1).isdigit() and "." in value):
        return excel_date(value)
    if len(value) >= 10 and value[4] == "-" and value[7] == "-":
        return value[:10]
    parts = value.replace(",", " ").split()
    if len(parts) == 3 and parts[1] in MONTHS:
        return f"{int(parts[2]):04d}-{MONTHS.index(parts[1]) + 1:02d}-{int(parts[0]):02d}"
    raise ValueError(f"unrecognised date {value!r}")


def display_date(iso: str) -> str:
    year, month, day = iso.split("-")
    return f"{int(day)} {MONTHS[int(month) - 1]} {year}"


def money(value) -> float:
    return round(float(value), 2)


def col_index(ref: str) -> int:
    n = 0
    for ch in ref:
        if ch.isalpha():
            n = n * 26 + ord(ch.upper()) - 64
        else:
            break
    return n


def cell_text(cell, strings) -> str | None:
    cell_type = cell.attrib.get("t")
    value = cell.find("m:v", NS)
    if value is None:
        inline = cell.find("m:is", NS)
        if inline is None:
            return None
        return "".join(
            node.text or ""
            for node in inline.iter("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t")
        )
    if cell_type == "s":
        return strings[int(value.text)]
    return value.text


def load_xlsx(path: Path) -> list[dict]:
    with zipfile.ZipFile(path) as book:
        workbook = ET.fromstring(book.read("xl/workbook.xml"))
        rels = ET.fromstring(book.read("xl/_rels/workbook.xml.rels"))
        rel_ns = {"r": "http://schemas.openxmlformats.org/package/2006/relationships"}
        rel_by_id = {rel.attrib["Id"]: rel.attrib["Target"] for rel in rels.findall("r:Relationship", rel_ns)}
        sheet_path = None
        for sheet in workbook.findall("m:sheets/m:sheet", NS):
            if sheet.attrib.get("name") == "Master":
                rel_id = sheet.attrib["{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"]
                target = rel_by_id[rel_id].lstrip("/")
                sheet_path = target if target.startswith("xl/") else "xl/" + target
                break
        if sheet_path is None:
            raise SystemExit(f"{path} has no sheet named Master")
        strings: list[str] = []
        if "xl/sharedStrings.xml" in book.namelist():
            shared = ET.fromstring(book.read("xl/sharedStrings.xml"))
            for item in shared.findall("m:si", NS):
                strings.append(
                    "".join(
                        node.text or ""
                        for node in item.iter("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t")
                    )
                )
        sheet = ET.fromstring(book.read(sheet_path))
    rows = []
    headers = None
    for row in sheet.findall("m:sheetData/m:row", NS):
        values = {}
        for cell in row.findall("m:c", NS):
            values[col_index(cell.attrib["r"])] = cell_text(cell, strings)
        if headers is None:
            headers = [values.get(i, "") or "" for i in range(1, max(values) + 1)]
            continue
        record = {headers[i - 1]: values.get(i) for i in range(1, len(headers) + 1)}
        if record.get("Date") and record.get("Amount") not in (None, ""):
            rows.append(normalise(record))
    return rows


def load_csv(path: Path) -> list[dict]:
    with path.open(newline="", encoding="utf-8-sig") as handle:
        rows = []
        for record in csv.DictReader(handle):
            if (record.get("Date") or "").strip() and (record.get("Amount") or "").strip():
                rows.append(normalise(record))
        return rows


def normalise(record: dict) -> dict:
    def text(key: str) -> str:
        value = record.get(key)
        return "" if value is None else str(value).strip()

    def optional_money(key: str):
        raw = text(key)
        return money(raw) if raw else None

    return {
        "date": parse_date(text("Date")),
        "amount": money(text("Amount")),
        "vendor": text("Vendor"),
        "description": text("Description"),
        "area": text("Area"),
        "category": text("Category"),
        "source": text("Source"),
        "source_refs": text("Source_Refs"),
        "match_status": text("Match_Status"),
        "notes": text("Notes"),
        "property": text("Property"),
        "master_phase": text("Phase"),
        "used_for": text("Used_For"),
        "zone": text("Project_Zone"),
        "zone_pool": optional_money("Zone_Pool_Amt"),
        "zone_side": optional_money("Zone_Side_Amt"),
    }


def matches(row: dict, rule: dict) -> bool:
    spec = rule["match"]
    if "date" in spec and row["date"] != spec["date"]:
        return False
    if "amount" in spec and abs(row["amount"] - float(spec["amount"])) > 0.001:
        return False
    if "vendor" in spec and row["vendor"] != spec["vendor"]:
        return False
    if "description" in spec and row["description"] != spec["description"]:
        return False
    if "descriptionContains" in spec and spec["descriptionContains"] not in row["description"]:
        return False
    if "sourceContains" in spec and spec["sourceContains"] not in row["source_refs"]:
        return False
    if "notes" in spec and row["notes"] != spec["notes"]:
        return False
    if "zone" in spec and row["zone"] != spec["zone"]:
        return False
    return True


def section_for(row: dict, mapping: dict) -> str:
    used = row["used_for"]
    if used == "Landscaping" and row["date"] < "2025-01-01":
        return mapping["landscapingBefore2025Section"]
    table = mapping["usedForToSection"]
    if used not in table:
        raise SystemExit(
            f"No section for Used_For {used!r} on {row['date']} {row['amount']} {row['description'][:80]}"
        )
    return table[used]


def receipt_for(row: dict, mapping: dict) -> str:
    return mapping["receiptWhenUsedFor"].get(row["used_for"], row["used_for"])


def area_for(row: dict, mapping: dict) -> str:
    return mapping["areaWhenUsedFor"].get(row["used_for"], row["area"])


def one_line(row: dict, mapping: dict, override: dict | None) -> dict:
    entry = {
        "date": display_date(row["date"]),
        "iso": row["date"],
        "description": row["description"],
        "supplier": row["vendor"],
        "amount": row["amount"],
        "phase": section_for(row, mapping),
        "area": area_for(row, mapping),
        "receipt": receipt_for(row, mapping),
    }
    if override:
        if "phase" in override:
            entry["phase"] = override["phase"]
        if "receipt" in override:
            entry["receipt"] = override["receipt"]
        if "area" in override:
            entry["area"] = override["area"]
        if override.get("excluded"):
            entry["excluded"] = True
    return entry


def build(rows: list[dict], mapping: dict) -> list[dict]:
    include = mapping["includeProperty"]
    skip_status = set(mapping["skipMatchStatus"])
    split = mapping["slabSplit"]
    entries = []
    for row in rows:
        if row["property"] != include or row["match_status"] in skip_status:
            continue
        overrides = [rule for rule in mapping["lineOverrides"] if matches(row, rule)]
        replacement = next((rule for rule in overrides if "replaceWith" in rule), None)
        if replacement:
            for line in replacement["replaceWith"]:
                entries.append(
                    {
                        "date": display_date(row["date"]),
                        "iso": row["date"],
                        "description": line["description"],
                        "supplier": row["vendor"],
                        "amount": money(line["amount"]),
                        "phase": line["phase"],
                        "area": line["area"],
                        "receipt": line["receipt"],
                    }
                )
            continue
        field = {}
        for rule in overrides:
            field.update({k: v for k, v in rule.items() if k in {"phase", "receipt", "area", "excluded", "poolAmount", "sideAmount"}})
        if row["zone"] == split["zone"]:
            pool_amount = money(field.get("poolAmount", row["zone_pool"]))
            side_amount = money(field.get("sideAmount", row["zone_side"]))
            if row["zone_pool"] is None or row["zone_side"] is None:
                raise SystemExit(f"Slab split row has no zone amounts: {row['date']} {row['description']}")
            if abs((pool_amount + side_amount) - row["amount"]) > 0.02:
                raise SystemExit(
                    f"Slab split does not add up on {row['date']} {row['description']}: {pool_amount} + {side_amount} != {row['amount']}"
                )
            base = {
                "date": display_date(row["date"]),
                "iso": row["date"],
                "description": row["description"],
                "supplier": row["vendor"],
                "amount": pool_amount,
                "phase": split["poolSection"],
                "area": area_for(row, mapping),
                "receipt": receipt_for(row, mapping),
            }
            entries.append(base)
            side = dict(base)
            side["phase"] = split["sideSection"]
            side["amount"] = side_amount
            side["description"] = row["description"] + split["sideDescriptionSuffix"]
            entries.append(side)
            continue
        entries.append(one_line(row, mapping, field or None))
    entries.sort(key=lambda entry: entry["iso"])
    return entries


def ts_string(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def ts_amount(value: float) -> str:
    rounded = money(value)
    if abs(rounded - round(rounded)) < 1e-9:
        return str(int(round(rounded)))
    return f"{rounded:.2f}"


def emit(entries: list[dict], source_name: str) -> str:
    lines = [
        "// Generated by scripts/build-spend-log.py from VicPoint_Spend_Master.",
        "// Do not edit by hand. Change the spreadsheet, the mapping, or a line override, then rerun the script.",
        f"// Source file: {source_name}",
        "",
        "export const SPEND_LOG = [",
    ]
    for entry in entries:
        lines.append("  {")
        lines.append(f"    date: {ts_string(entry['date'])},")
        lines.append(f"    description: {ts_string(entry['description'])},")
        lines.append(f"    supplier: {ts_string(entry['supplier'])},")
        lines.append(f"    amount: {ts_amount(entry['amount'])},")
        lines.append(f"    phase: {ts_string(entry['phase'])},")
        lines.append(f"    area: {ts_string(entry['area'])},")
        if entry.get("receipt"):
            lines.append(f"    receipt: {ts_string(entry['receipt'])},")
        if entry.get("excluded"):
            lines.append("    excluded: true,")
        lines.append("  },")
    lines.append("];")
    lines.append("")
    return "\n".join(lines)


def section_totals(entries: list[dict]) -> dict[str, float]:
    totals = {key: 0.0 for key, _title in SECTION_ORDER}
    for entry in entries:
        if entry.get("excluded") or entry["iso"] < "2025-01-01" or entry["phase"] == "granny-flat":
            continue
        section = "pool" if entry["phase"] in POOL_IDS else entry["phase"]
        if section not in totals:
            raise SystemExit(f"Counted line has no visible section: {entry['iso']} {entry['phase']} {entry['amount']}")
        totals[section] = money(totals[section] + entry["amount"])
    return totals


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path, help="VicPoint_Spend_Master .xlsx or a csv export of sheet Master")
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT)
    parser.add_argument("--map", type=Path, default=MAP_PATH)
    args = parser.parse_args()
    mapping = json.loads(args.map.read_text())
    source = args.source
    if source.suffix.lower() == ".csv":
        rows = load_csv(source)
    elif source.suffix.lower() == ".xlsx":
        rows = load_xlsx(source)
    else:
        raise SystemExit("Pass an .xlsx workbook or a .csv export of sheet Master")
    entries = build(rows, mapping)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(emit(entries, source.name))
    totals = section_totals(entries)
    project = money(sum(totals.values()))
    print(f"Wrote {len(entries)} lines to {args.out}")
    print(f"Counted project total ${project:,.2f}")
    for key, title in SECTION_ORDER:
        print(f"  {title}: ${totals[key]:,.2f}")


if __name__ == "__main__":
    try:
        main()
    except BrokenPipeError:
        sys.exit(0)
