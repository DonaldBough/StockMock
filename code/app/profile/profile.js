'use strict';

angular.module('myApp.profile', ['ngRoute', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/profile', {
    templateUrl: 'profile/profile.html',
    controller: 'ProfileCtrl'
  });
}])

.controller('ProfileCtrl', function($scope, $rootScope, $cookieStore, $timeout, $interval) {
	$rootScope.loggedIn = $cookieStore.get('loggedIn');
	$rootScope.loggedInUser = $cookieStore.get('loggedInUser');
	if (!$rootScope.loggedIn) {
		window.location.href = '#!/login';
	}
	
	$scope.search = function() {
		if($rootScope.companyName == undefined ||
		  $rootScope.companyName == '') {
			$rootScope.error("Hey buddy! You need to enter a symbol to search for!");
			return;
		}
		else if($rootScope.companyName.length > 128) {
			$rootScope.error("You can't search for a company longer than 128 characters.");
			return;
		}
		else {
			window.location.href = "#!/viewSearch?"+$rootScope.companyName;
		}
	}
	
	$scope.viewComp = function(key) {
		window.location.href = "#!/viewSearch?"+key;
	}
	
	$scope.count = 0;
	var getBalance = function() {
//		console.log($cookieStore.get('currentBalance'));
//		if ($cookieStore.get('currentBalance') != null) {
//			$interval.cancel(promise);
//			$rootScope.currentBalance = $cookieStore.get('currentBalance');
//			$cookieStore.remove('currentBalance');
//		}
//		else {
			if ($scope.count == 1) {
				getUserBalance(function(balance) {
					$scope.currentBalance = balance;
					fetchUserStocks(function(companies) {
						$timeout(function() {
							$scope.companies = companies;
							if (companies == null) $scope.noCompanies = true;
							$interval.cancel();
						}, 500);
					});
				});
			}
			$scope.count = $scope.count + 1;
//		}
	}
	
	$scope.$on('$routeChangeSuccess', function(next, current) {
		if(window.location.href.includes("profile")) {
			$interval(getBalance, 500, 2);
		}
	});
	
	var firebaseWriteToPath = function(path, data) {

    firebase.database().ref(path).set(data);

  }

  var firebaseReadFromPath = function(path, callback) {
    var userId = firebase.auth().currentUser.uid;
    firebase.database().ref(path).once('value').then(function(snapshot) {
      // var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
      // ...
      var val = snapshot.val();

      callback(val);


    });
    //callback(-1);
  }

  var updateUserBalance = function(value, callback) {
    var user = firebase.auth().currentUser;

    if (user != null) {
      firebaseWriteToPath("/user/" + user.uid + "/balance", value);
      callback("User balance was succesfully updated");
    }
    else callback("It seems that you are not logged in");
  }

  var getUserBalance = function(callback) {
    var user = firebase.auth().currentUser;
    if (user != null) {
      firebaseReadFromPath("/user/" + user.uid + "/balance", function(data) {
        callback((data == -1) ? 0: data);
      });
    } else {
      callback(0, "It seems that you are not logged in");
    }
  }

  var updateUserStocks = function(stock, buy, callback) {
    var user = firebase.auth().currentUser;
    if (user != null) {
      var path = "/user/" + user.uid + "/stocks";
      firebaseReadFromPath(path, function(stocks) {
        if (buy >= 0) {
		  if (stocks == null) {
			  var stockArr = [];
			  stocks = stockArr;
		  }
          stocks[stock] = (stocks[stock] == null) ? buy: stocks[stock] + buy;

        } else {
          if (stocks[stock] == null) {
            callback("you do not own any of these stocks");
            return;
          }
		  if (stocks[stock] + buy == 0) {
			  stocks[stock] = null;
		  }
		  else {
			  stocks[stock] = stocks[stock] + buy;
		  }
        }

        firebaseWriteToPath(path, stocks);
		callback("Success");

      });

    }
  }

  var fetchUserStocks = function(callback) {
    var user = firebase.auth().currentUser;
    if (user != null) {
      var path = "/user/" + user.uid + "/stocks";
      firebaseReadFromPath(path, function(stocks) {
        // let arr = stocks.split(",");
        callback(stocks);
      });
    } else {
      callback(null, 0);
    }
  }

});