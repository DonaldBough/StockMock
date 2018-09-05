'use strict';

angular.module('myApp.tutorial', ['ngRoute', 'ngCookies']) //'ngSanitize'

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/tutorial', {
    templateUrl: 'tutorial/tutorial.html',
    controller: 'TutorialCtrl'
  });
}])

.controller('TutorialCtrl', function($scope, $rootScope, $cookieStore) {
	$rootScope.loggedIn = $cookieStore.get('loggedIn');
	if (!$rootScope.loggedIn) {
		window.location.href = '#!/login';
	}

  });
