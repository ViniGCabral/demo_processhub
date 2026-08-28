import json
from pathlib import Path

import openpyxl


SOURCE = Path(r"C:\Users\ViniciusCabral\Downloads\cadeia_valor_sao_martinho.xlsx")
OUTPUT = Path(__file__).resolve().parents[1] / "src" / "data" / "saoMartinhoValueChain.ts"


def text(value):
    return str(value).strip() if value is not None else ""


workbook = openpyxl.load_workbook(SOURCE, data_only=True, read_only=True)
sheet = workbook["Cadeia Personalizada"]
rows = sheet.iter_rows(min_row=2, values_only=True)

hierarchy = {}
for row in rows:
    l1_code, l1_en, l1_pt = map(text, row[0:3])
    l2_code, l2_en, l2_pt = map(text, row[3:6])
    l3_code, l3_en, l3_pt = map(text, row[6:9])
    l4_code, l4_en, l4_pt = map(text, row[9:12])
    criticality = text(row[19])
    if not all((l1_code, l2_code, l3_code, l4_code)):
        continue

    l1 = hierarchy.setdefault(
        l1_code,
        {
            "code": l1_code,
            "nameEN": l1_en,
            "namePT": l1_pt or l1_en,
            "category": "PRIMARY" if criticality == "Core" else "SUPPORT",
            "l2": {},
        },
    )
    l2 = l1["l2"].setdefault(
        l2_code,
        {"code": l2_code, "name": l2_pt or l2_en, "nameEN": l2_en, "l3": {}},
    )
    l3 = l2["l3"].setdefault(
        l3_code,
        {"code": l3_code, "name": l3_pt or l3_en, "nameEN": l3_en, "l4": {}},
    )
    l3["l4"].setdefault(
        l4_code,
        {"code": l4_code, "name": l4_pt or l4_en, "nameEN": l4_en},
    )


def q(value):
    return json.dumps(value, ensure_ascii=False)


lines = [
    '// Mock da cadeia de valor da São Martinho, derivado de "cadeia_valor_sao_martinho.xlsx".',
    '// A aplicação representa os níveis L1 a L4; os registros L5 da fonte não são carregados.',
    'import type { L1Process } from "@/stores/valueChainStore";',
    '',
    'export const SAO_MARTINHO_BUSINESS_UNIT = "São Martinho";',
    '',
    'export function buildSaoMartinhoValueChain(): L1Process[] {',
    '  return [',
]

for l1 in hierarchy.values():
    lines.extend([
        '    {',
        f'      id: {q("sm-" + l1["code"].lower())},',
        f'      name: {q(l1["namePT"])},',
        f'      namePT: {q(l1["namePT"])},',
        f'      nameEN: {q(l1["nameEN"])},',
        f'      code: {q(l1["code"])},',
        f'      category: {q(l1["category"])},',
        f'      businessUnit: SAO_MARTINHO_BUSINESS_UNIT,',
        f'      description: {q("Cadeia ponta a ponta " + l1["code"] + " da São Martinho.")},',
        '      l2Processes: [',
    ])
    for l2 in l1["l2"].values():
        lines.extend([
            '        {',
            f'          id: {q("sm-" + l2["code"].lower())},',
            f'          name: {q(l2["name"])},',
            f'          code: {q(l2["code"])},',
            f'          description: {q("English: " + l2["nameEN"])},',
            '          businessUnit: SAO_MARTINHO_BUSINESS_UNIT,',
            '          l3Processes: [',
        ])
        for l3 in l2["l3"].values():
            lines.extend([
                '            {',
                f'              id: {q("sm-" + l3["code"].lower())},',
                f'              name: {q(l3["name"])},',
                f'              code: {q(l3["code"])},',
                f'              description: {q("English: " + l3["nameEN"])},',
                '              businessUnit: SAO_MARTINHO_BUSINESS_UNIT,',
                '              status: "active",',
                '              l4Tasks: [',
            ])
            for l4 in l3["l4"].values():
                lines.extend([
                    '                {',
                    f'                  id: {q("sm-" + l4["code"].lower())},',
                    f'                  name: {q(l4["name"])},',
                    f'                  code: {q(l4["code"])},',
                    f'                  description: {q("English: " + l4["nameEN"])},',
                    '                  businessUnit: SAO_MARTINHO_BUSINESS_UNIT,',
                    '                  status: "active",',
                    '                },',
                ])
            lines.extend(['              ],', '            },'])
        lines.extend(['          ],', '        },'])
    lines.extend(['      ],', '    },'])

lines.extend(['  ];', '}', ''])
OUTPUT.write_text("\n".join(lines), encoding="utf-8")
print(f"Generated {OUTPUT} with {len(hierarchy)} L1 chains")
