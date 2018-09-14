'use strict';

angular.module('myApp.history', ['ngRoute', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/history', {
    templateUrl: 'history/history.html',
    controller: 'HistoryCtrl'
  });
}])

.controller('HistoryCtrl', function($scope, $rootScope, $cookieStore, $timeout) {
	$rootScope.loggedIn = $cookieStore.get('loggedIn');
	if (!$rootScope.loggedIn) {
		window.location.href = '#!/login';
	}
	z
	$scope.$on('$routeChangeSuccess', function(next, current) {
		if(window.location.href.includes("history")) {
			firebaseGetTransactions(function(message, transactions) {
				if (transactions != null) {
					$scope.transactions = transactions.reverse();
					$scope.$apply();
				}
			});
		}
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