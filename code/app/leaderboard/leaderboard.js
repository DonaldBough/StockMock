'use strict';

angular.module('myApp.leaderboard', ['ngRoute', 'ngCookies']) //'ngSanitize'

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/leaderboard', {
    templateUrl: 'leaderboard/leaderboard.html',
    controller: 'LeaderboardCtrl'
  });
}])

.controller('LeaderboardCtrl', function($scope, $rootScope, $cookieStore) {
	$rootScope.loggedIn = $cookieStore.get('loggedIn');
	if (!$rootScope.loggedIn) {
		window.location.href = '#!/login';
	}

//Initialize Global Variables
var map = new Map();

  //Fetch number of shares purchased for each company on StockMock
  var query = firebase.database().ref("user");
  query.once("value").then(function(snapshot) {
      snapshot.forEach(function(user) {
        if(user.val().email !== undefined && user.val().balance !== undefined){
          var username = String(user.val().email);
          var portfolioValue = parseFloat(user.val().balance);
          if(!map.has(username))
            map.set(username, portfolioValue);
        }
      })
  }).then(() => {

   const mapSort = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));

   for (let [key, value] of mapSort) {     // Print leaderboard data
       console.log(key + ' ' + value);
   }
  })

  });
