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
        if(user.val().username !== undefined && user.val().balance !== undefined){
          var uid = String(user.key);
          var username = String(user.val().username);
          var invested = parseFloat((user.val().invested !== undefined)?user.val().invested:0);
          var portfolioValue = parseFloat(parseFloat(user.val().balance) + invested).toFixed(2);
          if(!map.has(uid))
            map.set(uid, [username,portfolioValue]);
        }
      })
  }).then(() => {
    //Sorting the map
    const mapSort = new Map([...map.entries()].sort((a, b) => b[1][1] - a[1][1]));
    var topTen = Array.from(mapSort.entries()).slice(0,10).map((element) => ([element[0],element[1][0]]));
    let mapTable = "";
    let mapped = {};
    var lol = 0;

        for (let [key, value] of mapSort) {
          lol++;
          // Print sorted data
          mapped[value[0]] = value[1];
          mapTable += `
          <tr>
              <td>${lol}</td>
              <td>
                <a href="#!/myprofile?id=${key}">
                  ${value[0]}
                </a>
              </td>
              <td colspan="2">${value[1]}</td>
          </tr>`;
          if (lol == 10) {
            break;
          }
        }

     document.getElementById("leaderboardRankings").innerHTML = mapTable;
    firebase.database().ref("leaderboard").set(strMapToObj(topTen));
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
