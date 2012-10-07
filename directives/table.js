angular.module('AngularTable', []).directive('angulartable', function ($filter) {
  return {
    restrict:'EAC',
    replace:true,
    templateUrl:'directives/template.html',
    scope: {"tdata" : "=ngModel"},
    link:function (scope, element, attrs) {
      scope.getsortclass = function(key, reverse){
        return (scope.sorting.key==key && scope.sorting.reverse==reverse) ? "sortactive":"sortinactive"
      }
      scope.getfiltered = function(item, key){
        var filtered = item;
        if (scope.tdata.config && scope.tdata.config.filters && scope.tdata.config.filters[key]){
          
          if (scope.tdata.config.filters[key].number || scope.tdata.config.filters[key].number == 0){
            //need to check for undefined cause number can be 0
            filtered = $filter('number')(filtered, scope.tdata.config.filters[key].number);
          }
          
          if (scope.tdata.config.filters[key].after){
            filtered = filtered + scope.tdata.config.filters[key].after
          }
        }
        return filtered
      }
      var initialize = function(){
        //Runs each time the associated ng-model is updated
        if (scope.tdata){
          //We has tdata
          scope.colkeys = [];
          scope.head = [];
          scope.search = {};
          var row1 = [], 
            row2=[],
            hasrow2=false;
          angular.forEach(scope.tdata.columns, function(item){
            //for each main column
            var cols = 1;
            if (item.subcols){
              hasrow2 = true;
              cols = item.subcols.length;
              angular.forEach(item.subcols, function(subcol){
                //for each subcolumn
                this.push({
                  label: subcol.name,
                  colspan: 1,
                  key: subcol.key,
                  sortable: subcol.sortable,
                  searchable: subcol.searchable
                })
                scope.colkeys.push(subcol.key);
              }, row2);
            } else {
              row2.push({name: "", colspan: 1})
              scope.colkeys.push(item.key);
            }
            this.push({
              label: item.name,
              colspan: cols,
              key: item.key,
              sortable: item.sortable,
              searchable: item.searchable
            })
          }, row1);
          scope.head.push(row1);
          if (hasrow2){
            scope.head.push(row2);
          }
          scope.original = scope.tdata.rows;
        }
        if ((scope.tdata.config) && (scope.tdata.config.defaultsort)){
          scope.sorting = scope.tdata.config.defaultsort
        } else {
          scope.sorting = {}
        }
        //Bootstrap pagination things
        if ((scope.tdata.config) && (scope.tdata.config.perpage)){
          scope.perpage = scope.tdata.config.perpage
        } else {
          scope.perpage = 20
        }
        scope.refilter(1)
      }

      scope.refilter = function(pagenum){
        scope.curpage = pagenum
        scope.body = $filter('filter')(scope.original, scope.search);
        if (scope.sorting && scope.sorting.key){
          scope.body.sort(function(a,b){
            return a[scope.sorting.key] - b[scope.sorting.key]
          });
          if (scope.sorting.reverse){
            scope.body.reverse()
          }
        }
        scope.numpages = Math.ceil(scope.body.length / scope.perpage);
        //Set class by hand- dunno why angular gets confused :(
        var tmpfiltered = scope.body.slice(scope.perpage * (scope.curpage - 1))
        scope.body = []
        var rowclass = "even"
        angular.forEach(tmpfiltered, function(row){
          rowclass = rowclass == "even" ? "odd":"even" ;
          row._cssclass = rowclass;
          this.push(row)
        }, scope.body)
        
      }



      //run initialize once.. just for the fun of it..
      initialize()
      scope.$watch("ngModel", function(){
        //The whole table gets re-initialized if associated data changes
        initialize()
      })
      scope.$watch("search", function(){
        //Rerun all the filters if search changes, goto page 1
        scope.refilter(1)
      }, true)
      scope.$watch("sorting", function(){
        //Rerun all the filters if sorting conditions change, goto page 1
        scope.refilter(1)
      }, true)
    }
  }
})