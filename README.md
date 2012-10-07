WORK IN PROGRESS DO NOT USE!

angular-tables
==============

Attempt to make fancy tables based on angular.js with non-js fallback.

We get tempted to use rich JavaScript tables (like Google visualizations) in blogposts, completely ignoring non-js clients such as RSS readers, blog-to-email functions, etc. This project is an attempt to show static HTML which gets replaced by JS table id possible without having to write a lot of code each time.

Scope
=====

Given data and configuration for a table, generate a fallback static HTML table, and make a rich JS table to initially support the following :-

* Sortable columns
* Sub-columns
* Searchable
* Loadable Asynchronously
* Paginated

Usage
=====

Need table described in JSON format.

TODO: Describe format

1. Make static table

	$ cat file_containing_json.json | ./static_table_generator.py

Will output the static non-js table

2. Read sample.html or demo.html to see how to pass off the same json to angular.

3. ???

4. Profit!!!