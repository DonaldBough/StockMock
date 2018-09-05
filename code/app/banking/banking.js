'use strict';

angular.module('myApp.banking', ['ngRoute', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/banking', {
    templateUrl: 'banking/banking.html',
    controller: 'BankingCtrl'
  });
}])

.controller('BankingCtrl', function($scope, $rootScope, $cookieStore) {
	$rootScope.loggedIn = $cookieStore.get('loggedIn');
	if (!$rootScope.loggedIn) {
		window.location.href = '#!/login';
	}
	
	$scope.deposit = function(amount) {
		if (amount == undefined || !Number.isInteger(amount)) {
			$rootScope.error("You need to enter an amount to transfer to your bank account!");
		}
		else if (amount <= 0) {
			$rootScope.error("You can't transfer $0! Try entering an amount greater than zero!");
		}
		else {
			getUserBalance(function(response) {
				if (amount > response) {
					$rootScope.error("Whoops... You cannot transfer more money than you have! Try transfering less!");
				}
				else {
					var option = window.confirm("Are you sure you want to deposit $"+amount+" to the bank?");
					if (option == true) {
						var newBalance = parseFloat(response) - amount;
						$scope.currentBalance = newBalance;
						$scope.$apply();
						firebaseMakeTransaction("Bank Deposit", amount, null, function(msg) {});
						updateUserBalance(newBalance, function(message) {
							$rootScope.error("Yay! Your funds were successfully transferred!");
						});
					}
				}
			});
		}
		console.log(amount);
		$scope.depositAmount = '';
	}
	
	$scope.withdraw = function(amount) {
		if (amount == undefined || !Number.isInteger(amount)) {
			$rootScope.error("You need to enter an amount to transfer to from bank account!");
		}
		else if (amount > 1500) {
			$rootScope.error("Sorry! The maximum ammount you can transfer is $1,500! Try entering an amount less than or equal to $1,500.");
		}
		else if (amount <= 0) {
			$rootScope.error("You can't transfer $0! Try entering an amount greater than zero!");
		}
		else {
			var option = window.confirm("Are you sure you want to withdraw $"+amount+" from the bank?");
			if (option == true) {
				getUserBalance(function(response) {
					var newBalance = parseFloat(response) + amount;
					$scope.currentBalance = newBalance;
					$scope.$apply();
					firebaseMakeTransaction("Bank Withdrawal", amount, null, function(msg) {});
					updateUserBalance(newBalance, function(message) {
						$rootScope.error("Yay! Your funds were successfully transferred!");
					});
				});
			}
		}
		console.log(amount);
		$scope.withdrawAmount = '';
	}
	
	$scope.$on('$routeChangeSuccess', function(next, current) {
		if(window.location.href.includes("banking")) {
			getUserBalance(function(balance) {
				$scope.currentBalance = balance;
				$scope.$apply();
			});
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
  
  var getDate = function() {
    var today = new Date();
    return today.getTime();
  }

  var firebaseMakeTransaction = function(type, amount, shares, callback) {
    var user = firebase.auth().currentUser;
    if (user != null) {
      let date = getDate();
	  var path = "/transactions/" + user.uid + "/";
      path += date;
      var id = user.uid;
      firebaseWriteToPath(path, {
        email: user.email,
        uid: id,
        amount: amount,
        shares: shares,
        date: date,
        type: type,
		dividend: 1
      });
      callback("Successfully Made Transaction");
      console.log("Successfully Made Transaction");
    } else {
      callback("Could not make transaction");
      console.log("Could not make transaction");
    }

  }


  /*
  defining Transaction data structure
  */


  function Transaction(email, uid, amount, shares, date, type, dividend) {
    // this._local =  Transaction();
    this.email= email;
    this.uid = uid;
    this.amount = amount;
    this.shares = shares;
    this.date = date;
	this.type = type;
	this.dividend = dividend;
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
          var transaction = new Transaction(dictionary[entry].email, dictionary[entry].uid, dictionary[entry].amount, dictionary[entry].shares, dictionary[entry].date, dictionary[entry].type, dictionary[entry].dividend);
          transactions.push(transaction);
        }
        callback("Transactions succesfully retrieved.", transactions);
      });

    } else {
      callback("Could not retrieve transaction data beause you aren't signed in", []);

    }

  }


});