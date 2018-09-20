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
var totalUsers = 0;
var totalShares = 0;
var totalUniqueComp = 0;
var map = new Map();
//Number of users in StockMock

var query = firebase.database().ref("/user/").orderByKey();
query.once("value")
  .then(function(snapshot) {
    snapshot.forEach(function() {
    totalUsers++;
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
           totalShares += shares;
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
totalUniqueComp = map.size;
const mapSort = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));

for (let [key, value] of mapSort) {     // Print sorted data
     console.log(key + ' ' + value);
 }
 console.log("Users on StockMock", totalUsers);
 console.log("Shares traded on StockMock", totalShares);
 console.log("Unique Companies on StockMock", totalUniqueComp);
})


});
