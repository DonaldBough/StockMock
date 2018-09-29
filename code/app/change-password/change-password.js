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
	
	$scope.changeUsername = function() {

		if($scope.realusername == null) {
			$rootScope.error("Looks like you didn't fill all the required fields.");
			return;
		}
		else if ($scope.realusername.length < 3 || $scope.realusername.length > 254) {
			$rootScope.error("Please enter a username that is between 3 and 254 characters.");
			return;
		}
		else {
			firebaseChangeUsername( $scope.realusername, function(response) {
				if (response.includes("user-not-found")) {
					$rootScope.error("Sorry, looks like that user doesn't exist. Please create account a new account.");
				}
				else if (response.includes("wrong-password")) {
					$rootScope.error("Looks like you typed your password incorrectly. Please try again.");
				}
				else if (response.includes("username already in use")) {
					$rootScope.error("Hey! That username already exists please choose a different username");
				}
				else if (response.includes("Username changed")) {
					console.log("Username changed");
				}
			});
		}
	}

	var firebaseChangeUsername = function(username, callback) {
		var map = [];
		var q = firebase.database().ref("user");
		q.once("value")
		.then(function(snapshot) {
			snapshot.forEach(function(user) {
				var userObj = user.val();
				map.push(userObj.username);
			}
		)}).then(()=> {
		if(map.includes(username)) {
			console.log("1");
			callback("username already in use");
			console.log("username already in use");
			return;
		}
		else {
				var flag = true;
				console.log("2");
				firebase.auth().currentUser;
				firebase.auth().onAuthStateChanged(function(user) {
					if (user && flag) {
					var id = user.uid;
					firebaseWriteToPath("/user/" + id + "/username", username);
					// firebase.database().ref('user/' + id).set({
					// 	username : username
					// });
						callback("Username changed");
					}
				});
		}
	});
	
	
}

$scope.changeAboutme = function() {

	if($scope.aboutme == null) {
		$rootScope.error("Looks like you didn't fill all the required fields.");
		return;
	}
	else {
		firebaseChangeAboutme( $scope.aboutme, function(response) {
			if (response.includes("user-not-found")) {
				$rootScope.error("Sorry, looks like that user doesn't exist. Please create account a new account.");
			}
			else if (response.includes("wrong-password")) {
				$rootScope.error("Looks like you typed your password incorrectly. Please try again.");
			}
			else if (response.includes("username already in use")) {
				$rootScope.error("Hey! That username already exists please choose a different username");
			}
			else if (response.includes("About Me changed")) {
				console.log("About Me changed");
			}
		});
	}
}

var firebaseChangeAboutme = function(aboutme, callback) {
			var flag = true;
			console.log("2");
			firebase.auth().currentUser;
			firebase.auth().onAuthStateChanged(function(user) {
				if (user && flag) {
				var id = user.uid;
				firebaseWriteToPath("/user/" + id + "/aboutme", aboutme);
					callback("About Me changed");
				}
			});
	}

var firebaseWriteToPath = function(path, data) {

	firebase.database().ref(path).set(data);

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