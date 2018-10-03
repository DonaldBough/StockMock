'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ngRoute',
  'ngCookies',
  'myApp.profile',
  'myApp.glossary',
  'myApp.history',
  'myApp.tutorial',
  'myApp.banking',
  'myApp.settings',
  'myApp.login',
  'myApp.change-password',
  'myApp.myprofile',
  'myApp.viewSearch',
  'myApp.news'
]);

app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/profile'});
}]);

app.run(function($rootScope, $timeout) {
    $rootScope.error = function(errorMessage) {
            $rootScope.errorMessage = errorMessage;
			$timeout(function() {
				$('#errorModal').modal('show');
			});
        };
  })