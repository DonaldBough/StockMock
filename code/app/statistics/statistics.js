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
console.log(count);
});


});
