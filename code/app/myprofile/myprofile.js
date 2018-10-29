'use strict';

angular.module('myApp.myprofile', ['ngRoute', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/myprofile', {
    templateUrl: 'myprofile/myprofile.html',
    controller: 'MyProfileCtrl'
  });
}])

.controller('MyProfileCtrl', function($scope, $rootScope, $cookieStore) {
    $rootScope.loggedIn = $cookieStore.get('loggedIn');
    console.log("here1" + $rootScope.loggedIn);
    $rootScope.loggedInUser = $cookieStore.get('loggedInUser');
    console.log("here2" + $rootScope.loggedInUser);
	if (!$rootScope.loggedIn) {
		window.location.href = '#!/login';
    }
    var user = firebase.auth().currentUser;
    console.log(user.uid)
    if (user != null) {
        firebase.database().ref('user/' + user.uid).once('value').then(function(snapshot) {
            $rootScope.realusername = snapshot.val().username;
            $rootScope.balance = snapshot.val().balance;
            $rootScope.aboutme = snapshot.val().aboutme;
            console.log(snapshot.val)
          });
        }
    // fetchUsername(function(realusername) {
    //     console.log("here3");
    //     $rootScope.realusername = realusername;
    //     console.log("here4")
    //     if (realusername == null) $scope.NoRealusername = true;
    //     $interval.cancel();

    // });

	// $rootScope.loggedIn = $cookieStore.get('loggedIn');
	// if (!$rootScope.loggedIn) {
	// 	window.location.href = '#!/login';
	// }
	
	// $scope.changePassword = function() {
	// 	if ($scope.newPassword.length > 30 || $scope.newPassword.length < 8) {
	// 		$rootScope.error("Please enter a password that is between 8 and 30 characters.");
	// 		return;
	// 	}
	// 	firebaseChangePassword($scope.oldPassword, function(response) {
	// 		console.log(response);
	// 		if (response.includes("user-not-found")) {
	// 			$rootScope.error("Sorry, looks like that user doesn't exist. Please create account a new account.");
	// 		}
	// 		else if (response.includes("wrong-password")) {
	// 			$rootScope.error("Looks like you typed your username or password incorrectly. Please try again.");
	// 		}
	// 		else if (response.includes("user-mismatch")) {
	// 			$rootScope.error("Looks like you typed your username or password incorrectly. Please try again.");
	// 		}
	// 		else if (response === "Update success") {
	// 			$rootScope.error("Your password has been successfully updated. Don't forget it!");
	// 			window.location.href = "#";
	// 		}
	// 	})
	// }
	
	// var firebaseChangePassword = function(password, callback) {
	// 	firebase.auth().currentUser.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(firebase.auth().currentUser.email, password)).then(function() {
	// 			var user = firebase.auth().currentUser;
	// 			user.updatePassword($scope.newPassword).then(function() {
	// 				callback("Update success");
	// 			}, function(error) {
	// 				callback(error.code + ' ' + error.message);
	// 			});
	// 	}).catch(function(error) {
	// 			callback(error.code + ' ' + error.message);
	// 	});
												   
    // }
    var fetchUsername = function(callback) {
        console.log("here5")
        var user = firebase.auth().currentUser;
        if (user != null) {
            firebaseReadFromPath("/user/" + user.uid + "/username", function(data) {
                callback((data == -1) ? 0: data);
            });
        } else {
          callback(null, 0);
        }
      }

      var fetchUserAboutme = function(callback) {
        var user = firebase.auth().currentUser;
        if (user != null) {
            firebaseReadFromPath("/user/" + user.uid + "/aboutme", function(data) {
                callback((data == -1) ? 0: data);
            });
        } else {
          callback(null, 0);
        }
      }
    
    var fetchUserBalance = function(callback) {
        var user = firebase.auth().currentUser;
        if (user != null) {
            firebaseReadFromPath("/user/" + user.uid + "/balance", function(data) {
                callback((data == -1) ? 0: data);
            });
        } else {
          callback(null, 0);
        }
      }


      $scope.$on('$routeChangeSuccess', function(next, current) {
		
			firebaseGetTransactions(function(message, transactions) {
				if (transactions != null) {
					$scope.transactions = transactions.reverse();
					$scope.$apply();
				}
			});
		
	});


    $rootScope.filter = function(value) {
		$rootScope.buttons = value;
    } 
    
    function Transaction(email, uid, amount, shares, date, type) {
		// this._local =  Transaction();
		this.email= email;
		this.uid = uid;
		this.amount = amount;
		this.shares = shares;
		this.date = date;
		this.type = type;
	  }

      var firebaseGetTransactions = function(callback) {
		var user = firebase.auth().currentUser;
		if (user != null) {
		  var path = "/transactions/" + user.uid;
		  firebase.database().ref(path).once('value').then(function(snapshot) {
			if (snapshot.exists())
			var transactions = [];
			let dictionary = snapshot.toJSON();

			for (let entry in dictionary) {
			  var transaction = new Transaction(dictionary[entry].email, dictionary[entry].uid, dictionary[entry].amount, dictionary[entry].shares, dictionary[entry].date, dictionary[entry].type);
			  transactions.push(transaction);
			}
			callback("Transactions succesfully retrived.", transactions);
		  });

		} else {
		  callback("Could not retrive transaction data beause you arent signed in", []);

		}

	  }

      $scope.showAll = function(){
		$scope.dividend = true;
		$scope.trade = true;
		$scope.transfer = true;
	}

	$scope.showTrades = function(){
		$scope.dividend = false;
		$scope.trade = true;
		$scope.transfer = false;
	}

	$scope.showDividends = function(){
		$scope.dividend = true;
		$scope.trade = false;
		$scope.transfer = false;
	}

	$scope.showTransfers = function(){
		$scope.dividend = false;
		$scope.trade = false;
		$scope.transfer = true;
	}
});