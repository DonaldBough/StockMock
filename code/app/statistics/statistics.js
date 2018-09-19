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

//Number of users in StockMock
var count = 0;
var query = firebase.database().ref("/user/").orderByKey();
query.once("value")
  .then(function(snapshot) {
    snapshot.forEach(function() {
    count++
  });
//console.log(count);
});

//Fetch number of shares purchased for each company on StockMock
var map = new Map();
var query = firebase.database().ref("user").orderByKey();
query.once("value").then(function(snapshot) {
    snapshot.forEach(function(users) {
      var uid = users.key;
      var path = "/user/"+uid+"/stocks/";
      var query = firebase.database().ref(path).orderByKey();
      query.once("value").then(function(snapshot) {
          snapshot.forEach(function(stock) {
            var symbol = String(stock.key).toUpperCase();
            var shares = parseInt(stock.val(),10);
            if(!map.has(symbol)){
              map.set(symbol, shares);
            }
            else {
              map.set(symbol, map.get(symbol)+shares);
            }
          });
      });
    });
});

console.log(map);

});
