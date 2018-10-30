'use strict';

angular.module('myApp.myprofile', ['ngRoute', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/myprofile', {
    templateUrl: 'myprofile/myprofile.html',
    controller: 'MyProfileCtrl'
  });
}])

.controller('MyProfileCtrl', function($scope, $rootScope, $cookieStore, $routeParams) {
    let userId;
    $rootScope.loggedIn = $cookieStore.get('loggedIn');
    $rootScope.loggedInUser = $cookieStore.get('loggedInUser');

	if (!$rootScope.loggedIn) {
		window.location.href = '#!/login';
    }
    // Let firebase auth initialize
    sleep(1000);
    let user = firebase.auth().currentUser;
    if (user != null) {
        if ($routeParams != null && $routeParams.id != null)
            userId = $routeParams.id;
        else
            userId = user.uid
        firebase.database().ref('user/' + userId).once('value').then(function(snapshot) {
            $rootScope.realusername = snapshot.val().username;
            $rootScope.balance = snapshot.val().balance;
            $rootScope.aboutme = snapshot.val().aboutme;
            console.log(snapshot.val)
          });
        }

      $scope.$on('$routeChangeSuccess', function(next, current) {
			firebaseGetTransactions(function(message, transactions) {
				if (transactions != null) {
					$scope.transactions = transactions.reverse();
                    sleep(1000);
					$scope.$apply();
				}
			});
		
	});

    function sleep(milliseconds) {
      var start = new Date().getTime();
      for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
          break;
        }
      }
    }


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
		var userId;
        var user = firebase.auth().currentUser;

		if (user != null) {
          if ($routeParams != null && $routeParams.id != null)
            userId = $routeParams.id;
          else
            userId = user.uid
		  var path = "/transactions/" + userId;
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