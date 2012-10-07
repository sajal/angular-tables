#!/usr/bin/env python
import json, sys
import locale
locale.setlocale(locale.LC_ALL, ('en_US', 'UTF-8'))

def apply_filter(value, filters):
    output = value
    if filters.has_key("number"):
        decimal = filters["number"]
        f = "%."+ str(decimal) + "f"
        value = locale.format(f, value, grouping=True)
    if filters.has_key("after"):
        value = str(value) + str(filters["after"])
    return value

if "__main__" in __name__:
    contents = sys.stdin.read()
    table_data = json.loads(contents)
    colkeys = []
    head = []
    row1 = []
    row2 = []
    hasrow2 = False
    for item in table_data["columns"]:
        cols = 1
        if item.has_key("subcols"):
            hasrow2 = True
            cols = len(item["subcols"])
            for subcol in item["subcols"]:
                row2 += [{
                    "label": subcol["name"],
                    "key": subcol["key"],
                    "colspan": 1
                }]
                colkeys += [subcol["key"]]
        else:
            row2 += [{
                "label": "",
                "colspan": 1
            }]
            colkeys += [item["key"]]
        row1 += [{
            "label": item["name"],
            "colspan": cols,
        }]
    head += [row1]
    if hasrow2:
        head += [row2]
    perpage = 20
    rows = table_data["rows"]
    if table_data.has_key("config"):
        perpage = table_data["config"].get("perpage", perpage)
        if table_data["config"].has_key("defaultsort"):
            sortkey = table_data["config"]["defaultsort"]["key"]
            rows =  sorted(rows, key=lambda k: k[sortkey])
            if table_data["config"]["defaultsort"]["reverse"]:
                rows.reverse()
    rows = rows[:perpage]
    if table_data.has_key("config"):
        if table_data["config"].has_key("filters"):
            filters = table_data["config"]["filters"]
            for row in rows:
                for key in row.keys():
                    if filters.has_key(key):
                        row[key] = apply_filter(row[key], filters[key])

    html = """<div angulartable='' ng-model='tbldata'><table border="1"><thead>"""
    for row in head:
        html += "<tr>"
        for col in row:
            html += "<th colspan='%s'>%s</th>" %(col["colspan"], col["label"])
        html += "</tr>"
    html += "</thead><tbody>"
    for row in rows:
        html += "<tr>"
        for key in colkeys:
            html += "<td>%s</td>" %(row[key])
        html += "</tr>"
    html += "</tbody></table>Use JS client to see rich table</div>"

    print html
    