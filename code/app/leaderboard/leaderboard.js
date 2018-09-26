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
          var uid = String(user.key);
          var username = String(user.val().email);
          var portfolioValue = parseFloat(user.val().balance);
          if(!map.has(uid))
            map.set(uid, [username,portfolioValue]);
        }
      })
  }).then(() => {
    //Sorting the map
    const mapSort = new Map([...map.entries()].sort((a, b) => b[1][1] - a[1][1]));
   /*
    Initial way of doing it
    var firebaseMap = new Map();
    for (let [key, value] of mapSort) {     // Print leaderboard data
       console.log(key + ' ' + value[0]+' '+value[1]);
       firebaseMap.set(key,value[0]);
    }
    */
    var topTen = Array.from(mapSort.entries()).slice(0,10).map((element) => ([element[0],element[1][0]]));

    firebase.database().ref("leaderboard").set(strMapToObj(topTen));
    //firebase.database().ref("leaderboard").set(strMapToObj(firebaseMap));
    console.log("Leaderboard PUSHED TO Firebase");
 })

   function strMapToObj(strMap) {
       let obj = Object.create(null);
       for (let [k,v] of strMap) {
           // We don’t escape the key '__proto__'
           // which can cause problems on older engines
           obj[k] = v;
       }
       return obj;
   }
  });
