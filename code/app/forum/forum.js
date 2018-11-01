angular.module('myApp.forum', ['ngRoute', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/forum', {
        templateUrl: 'forum/forum.html',
        controller: 'ForumCtrl'
    });
}])
.controller('ForumCtrl', function($scope, $rootScope, $cookieStore) {
	$rootScope.loggedIn = $cookieStore.get('loggedIn');
	if (!$rootScope.loggedIn) {
		window.location.href = '#!/login';
	}

});
