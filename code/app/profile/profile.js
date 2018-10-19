'use strict';

angular.module('myApp.profile', ['ngRoute', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/profile', {
    templateUrl: 'profile/profile.html',
    controller: 'ProfileCtrl'
  });
}])

.controller('ProfileCtrl', function($scope, $rootScope, $cookieStore, $timeout, $interval, $routeParams) {
	$rootScope.loggedIn = $cookieStore.get('loggedIn');
	$rootScope.loggedInUser = $cookieStore.get('loggedInUser');
	if (!$rootScope.loggedIn) {
		window.location.href = '#!/login';
	}
  if ($routeParams != null && $routeParams.id != null) {
    $rootScope.whosBalance = "Their balance";
    $rootScope.youOrThey = "They";
    $rootScope.whoHasNoCompanies = "They do not currently own any shares."
  }
  else {
    $rootScope.whosBalance = "Your balance";
    $rootScope.youOrThey = "You";
    $rootScope.whoHasNoCompanies = "You don't own any shares. Search a company to get started."
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
    firebase.database().ref(path).once('value').then(function(snapshot) {
      var val = snapshot.val();

      callback(val);
    });
  }

  var getUserBalance = function(callback) {
    var userId;

    if ($routeParams != null && $routeParams.id != null)
      userId = $routeParams.id;
    else if (firebase.auth().currentUser != null)
      userId = firebase.auth().currentUser.uid
    else
      callback(0, "It seems that you are not logged in"); 
    firebaseReadFromPath("/user/" + userId + "/balance", function(data) {
      callback((data == -1) ? 0: data);
    });
  }

  var updateUserStocks = function(stock, buy, callback) {
    var userId;

    if ($routeParams != null && $routeParams.id != null)
      userId = $routeParams.id;
    else if (firebase.auth().currentUser != null)
      userId = firebase.auth().currentUser.uid
    else
      callback();
    var path = "/user/" + userId + "/stocks";
    firebaseReadFromPath(path, function(stocks) {
      if (buy >= 0) {
  		  if (stocks == null) {
  			  var stockArr = [];
  			  stocks = stockArr;
  		  }
        stocks[stock] = (stocks[stock] == null) ? buy: stocks[stock] + buy;
      }
      else {
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

  var fetchUserStocks = function(callback) {
    var userId;

    if ($routeParams != null && $routeParams.id != null)
      userId = $routeParams.id;
    else if (firebase.auth().currentUser != null)
      userId = firebase.auth().currentUser.uid
    else
      callback(null, 0);
    var path = "/user/" + userId + "/stocks";
    firebaseReadFromPath(path, function(stocks) {
      callback(stocks);
    });
  }
});