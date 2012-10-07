#!/usr/bin/env python

import json

template = json.dumps(open("directives/template.html").read().replace("\n", ""))
js = open("directives/table.js").read().replace("templateUrl:'directives/template.html'", "template:%s" %(template))
open("directives/table-built.js", "w").write(js)

example = open("example.html").read().replace("table.js", "table-built.js")
open("demo.html", "w").write(example)