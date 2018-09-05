'use strict';

angular.module('myApp.change-password', ['ngRoute', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/change-password', {
    templateUrl: 'change-password/change-password.html',
    controller: 'PasswordCtrl'
  });
}])

.controller('PasswordCtrl', function($scope, $rootScope, $cookieStore) {
	
	$rootScope.loggedIn = $cookieStore.get('loggedIn');
	if (!$rootScope.loggedIn) {
		window.location.href = '#!/login';
	}
	
	$scope.changePassword = function() {
		if ($scope.newPassword.length > 30 || $scope.newPassword.length < 8) {
			$rootScope.error("Please enter a password that is between 8 and 30 characters.");
			return;
		}
		firebaseChangePassword($scope.oldPassword, function(response) {
			console.log(response);
			if (response.includes("user-not-found")) {
				$rootScope.error("Sorry, looks like that user doesn't exist. Please create account a new account.");
			}
			else if (response.includes("wrong-password")) {
				$rootScope.error("Looks like you typed your username or password incorrectly. Please try again.");
			}
			else if (response.includes("user-mismatch")) {
				$rootScope.error("Looks like you typed your username or password incorrectly. Please try again.");
			}
			else if (response === "Update success") {
				$rootScope.error("Your password has been successfully updated. Don't forget it!");
				window.location.href = "#";
			}
		})
	}
	
	var firebaseChangePassword = function(password, callback) {
		firebase.auth().currentUser.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(firebase.auth().currentUser.email, password)).then(function() {
				var user = firebase.auth().currentUser;
				user.updatePassword($scope.newPassword).then(function() {
					callback("Update success");
				}, function(error) {
					callback(error.code + ' ' + error.message);
				});
		}).catch(function(error) {
				callback(error.code + ' ' + error.message);
		});
												   
	}
});