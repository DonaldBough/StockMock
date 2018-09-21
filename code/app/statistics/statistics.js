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

//Initialize Global Variables
var totalUsers = 0; //Number of users in StockMock
var totalShares = 0; //Number of shares traded on StockMock
var totalUniqueComp = 0; //Number of unique companies traded in StockMock
var map = new Map();

//Fetch number of shares purchased for each company on StockMock
var query = firebase.database().ref("user");
query.once("value").then(function(snapshot) {
    snapshot.forEach(function(user) {
      totalUsers++; //find number of users on StockMock
      var userObj = user.val();
      //Only proceed if user has some stocks
      if(userObj["stocks"] !== undefined) {
        var stocks = userObj["stocks"];
         for(var key in stocks) {
           var symbol = String(key).toUpperCase();
           var shares = parseInt(stocks[key],10);
           totalShares += shares; //find number of shares traded on StockMock
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
totalUniqueComp = map.size; // Unique companies on StockMock = number of companies stored in map

//Sort map in descending order based on values
const mapSort = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));

for (let [key, value] of mapSort) {     // Print sorted data
     console.log(key + ' ' + value);
 }
 console.log("Users on StockMock", totalUsers);
 console.log("Shares traded on StockMock", totalShares);
 console.log("Unique Companies on StockMock", totalUniqueComp);
})
});
