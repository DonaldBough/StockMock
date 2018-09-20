'use strict';

angular.module('myApp.statistics', ['ngRoute', 'ngCookies']) //'ngSanitize'

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/statistics', {
    templateUrl: 'statistics/statistics.html',
    controller: 'StatisticsCtrl'
  });
}])

.controller('StatisticsCtrl', function($scope, $rootScope, $cookieStore) {
	$rootScope.loggedIn = $cookieStore.get('loggedIn');
	if (!$rootScope.loggedIn) {
		window.location.href = '#!/login';
	}
var numberOfUsers = 0;
var map = new Map();
//Number of users in StockMock

var query = firebase.database().ref("/user/").orderByKey();
query.once("value")
  .then(function(snapshot) {
    snapshot.forEach(function() {
    numberOfUsers++;
  });
});

//Fetch number of shares purchased for each company on StockMock
var query = firebase.database().ref("user");
query.once("value").then(function(snapshot) {
    snapshot.forEach(function(user) {
      var userObj = user.val();
      if(userObj["stocks"] !== undefined) {
        var stocks = userObj["stocks"];
         for(var key in stocks) {
           var symbol = String(key).toUpperCase();
           var shares = parseInt(stocks[key],10);
           if(!map.has(symbol)){
               map.set(symbol, shares);
           }
           else {
               map.set(symbol, map.get(symbol)+shares);
           }
         }
      }

    })
}).then(() => {
//  console.log(map);
const mapSort = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
//console.log(mapSort1);
for (let [key, value] of mapSort) {     // Print sorted data
     console.log(key + ' ' + value);
 }
})


});
