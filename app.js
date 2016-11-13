(function () {
  'use strict'

angular.module('NarrowItDownApp',[])
.controller('NarrowItDownController',NarrowItDownController)
.service('MenuSearchService',MenuSearchService)
.constant('ApiBasePath',"https://davids-restaurant.herokuapp.com")
.directive('foundItems',FoundItemsDirective);

function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      found: '<',
      onRemove: '&'
    },
    controller: FoundItemsDirectiveController,
        controllerAs: 'narrow',
        bindToController: true
  };
      return ddo;
}

function FoundItemsDirectiveController() {
  var narrow = this;
}


NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
   var narrow = this;
   narrow.description = "";
   narrow.found = [];
   narrow.menuItemsForDescription = function () {
     var promise = MenuSearchService.getMatchedMenuItems();
     narrow.found = [];
     promise.then(function(response){
       var cil = response.data.menu_items;
       for (var item in cil) {
         if (cil[item].description.indexOf(narrow.description)!=-1 && narrow.description!="") {
           narrow.found.push(cil[item]);
         }
       }

       console.log(narrow.found);
     })
     .catch(function(error){
       console.log("Something went terribly wrong.");
     })
   };
   narrow.removeItem = function (itemIndex) {
     console.log("hola");
     narrow.found.splice(itemIndex,1);
   };
}



MenuSearchService.inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var service = this;



service.getMatchedMenuItems = function () {
  var response = $http({
    method : "GET",
    url : (ApiBasePath + "/menu_items.json"),

  });

  return response;
};

}
})();
