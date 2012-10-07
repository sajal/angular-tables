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