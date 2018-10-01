'use strict';

angular.module('myApp.viewSearch', ['ngRoute', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/viewSearch', {
    templateUrl: 'viewSearch/viewSearch.html',
    controller: 'ViewSearchCtrl'
  });
}])


.controller('ViewSearchCtrl', function($scope, $http, $interval, $rootScope, $cookieStore) {
	$rootScope.loggedIn = $cookieStore.get('loggedIn');
	if (!$rootScope.loggedIn) {
		window.location.href = '#!/login';
	}
	$rootScope.compName = $rootScope.companyName;

	$rootScope.search = function() {
		if($rootScope.companyName == undefined ||
		  $rootScope.companyName == '') {
			$rootScope.error("Hey buddy! You need to enter a symbol to search for!");
			return;
		}
		else if($rootScope.companyName.length > 128) {
			$rootScope.error("You can't search for a company longer than 128 characters.");
			return;
		}
		$rootScope.searchInProgress = true;

		var alphaVantageAPIKey = 'IJ5198MHHWRYRP9Y';

		console.log("Getting api data for: " + $rootScope.companyName);
		$rootScope.notfound = false;

		var apiUrl = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=' + $rootScope.companyName + '&interval=5min&apikey=' + alphaVantageAPIKey;
		// Call api for company data
		$http({
		  method: 'GET',
		  url: apiUrl
		}).then(function successCallback(response) {
					console.log("Successful Alpha Vantage response");
					var data = response.data['Time Series (5min)'];
					var dateArr = [];
					var priceArr = [];
					if (data == undefined) {
						$rootScope.notfound = true;
						$rootScope.data = data;
						$rootScope.searchInProgress = false;
						
						window.onload = $rootScope.error('Uh oh... it looks like \"'+$rootScope.companyName+'\" does not exist.');

						$rootScope.companyName = '';
					}
					else {
						var dayOfData;
						$rootScope.data = data;
						angular.forEach(data, function(priceRaw, dateRaw) {
							var d = JSON.stringify(dateRaw)
							var day = d.substring(d.indexOf("-") + 4, d.indexOf("-") + 6)
							if (dayOfData == undefined)
								dayOfData = day
							if (day == dayOfData) {
								//Only display data from data, AlphaVantage gives multiple days back
								var date = d.substring(d.indexOf(" "), d.length - 1)
								dateArr.push(date)

								var p = JSON.stringify(priceRaw)
								var l = p.indexOf("open") + 7
								var r = p.indexOf(",") - 1
								var price = p.substring(l, r)
								priceArr.push(price)
							}
						});
						$scope.currentPrice = parseFloat(priceArr[0]).toFixed(2);
						getUserBalance(function(response) {
							$scope.currentBalance = response;
							$scope.$apply();
						});

						dateArr = dateArr.reverse();
						priceArr = priceArr.reverse();
						var ctx = document.getElementById("companyChart");
						var companyChart = new Chart(ctx, {
						    type: 'line',
						    data: {
						        labels: dateArr,
						        datasets: [{
						            data: priceArr,
						            backgroundColor: [
						                // 'rgba(200, 230, 201, 0.2)'
						                'rgba(187, 222, 251, 0.2)'
						            ],
						            borderColor: [
						            	// 'rgba(56, 142, 60, 1)'
						            	'rgba(25, 118, 210, 1)'
						            ],
						            borderWidth: 1
						        }]
						    },
						    options: {
						    	  tooltips: {
								    mode: 'index',
								    intersect: false,
								  },
								 hover: {
								    mode: 'nearest',
								    intersect: true
								  },
						    	responsive: true,
								maintainAspectRatio: false,
								legend: {display: false},
						    	elements: { point: { radius: 0 } },
						        scales: {
						        	xAxes: [{
						                gridLines: {
						    				display: false
						    			}
						            }],
						            yAxes: [{
						                ticks: {
						                    beginAtZero:false
						                },
						                gridLines: {
						    				display: false
						    			}
						            }]
						        }
						    }
						});

						// $rootScope.data = data;
						var a = window.location.href;
						var b = a.substring(a.indexOf("?")+1);
						$rootScope.companyName = b;
						$rootScope.compName = $rootScope.companyName;
						$rootScope.notfound = false;
						$rootScope.searchInProgress = false;
						$rootScope.companyName = '';
					}

		  }, function errorCallback(response) {
		  	console.log("Error in Alpha Vantage response");
			window.onload = $rootScope.error('Sorry, something went wrong when I went to get your data. Please try again.');
			$rootScope.searchInProgress = false;
			$rootScope.notfound = true;
			$rootScope.companyName = '';
		  });
	};

	$scope.$on('$routeChangeSuccess', function(next, current) {
		if(!$rootScope.companyName && window.location.href.includes("viewSearch")) {
			if (!window.location.href.includes("?")) {
				$rootScope.notfound = true;
				$rootScope.companyName = '';
				$rootScope.compName = $rootScope.companyName;
			}
			else {
				var a = window.location.href;
				var b = a.substring(a.indexOf("?")+1);
				$rootScope.companyName = b;
				$rootScope.search();
			}
		}
		else if ($rootScope.companyName && window.location.href.includes("viewSearch")) {
			if (!window.location.href.includes("?")) {
				$rootScope.companyName = '';
				$rootScope.data = '';
				$rootScope.notfound = true;
			}
			else {
				var a = window.location.href;
				var b = a.substring(a.indexOf("?")+1);
				$rootScope.companyName = b;
				$rootScope.search();
			}
		}
	});

	$scope.$on('$locationChangeStart', function(event, next, current) {
		$rootScope.data = '';
		$rootScope.notfound = false;
		$rootScope.compName = '';
		$rootScope.companyName = '';
		$rootScope.searchInProgress = false;
	});

	$rootScope.buyShares = function() {
		var obj = $rootScope.data;

		var n = $scope.numberOfShares;
		
//		Removed for user convenience
//		var time = (new Date()).getUTCHours()-4;
//		if (time < 4 || time >= 20) {
//			$('#buyModal').modal('hide');
//			$rootScope.error("You can't buy shares when the market is closed! The stock market is only open from 4am to 8pm Eastern Standard Time.");
//		}

		if (n == undefined || !Number.isInteger(n)) {
			$('#buyModal').modal('hide');
			$rootScope.error("Hi! Please enter an integer.");
		}
		else if (n <= 0) {
			$('#buyModal').modal('hide');
			$rootScope.error("You can't buy zero shares! Please enter a number of shares greater than zero.");
		}
		else {
			getUserBalance(function(response) {
				if (response == null || response == 0) {}
				else if (response < n*$scope.currentPrice) {
					$('#buyModal').modal('hide');
					$rootScope.error("Looks like you don't have enough money to make this purchase. Try making a bank transfer to get more money.");
				}
				else {
					$('#buyModal').modal('hide');
          $rootScope.compName = $rootScope.compName.toUpperCase();
					$rootScope.error("Nice find! You successfully bought "+n+" shares of "+$rootScope.compName+".");
					
					response = (response - (n*$scope.currentPrice)).toFixed(2);
					updateUserBalance(response, function(message) {});
					updateUserStocks($rootScope.compName,n,function(message) {});
					firebaseMakeTransaction($rootScope.compName+" Market Buy", n*$scope.currentPrice, n, function(message) {
							//console.log(message);
					});
					$scope.currentBalance = response;
					$scope.$apply();
				}
			});
		}
		$scope.numberOfShares = '';
	}

	$rootScope.sellShares = function() {
		var n = $scope.numberOfShares;
		if (n == undefined || !Number.isInteger(n)) {
			$('#sellModal').modal('hide');
			$rootScope.error("Hi! Please enter an integer.");
		}
		else if (n <= 0) {
			$('#sellModal').modal('hide');
			$rootScope.error("You can't sell zero shares! Please enter a number of shares greater than zero.");
		}
		else {
			fetchUserStocks(function(response) {
				var resp = response[$rootScope.compName];
				if (resp == null) {
					$('#sellModal').modal('hide');
					$rootScope.error("Looks like you do not own any shares of this company.");
				}
				else if (n > resp) {
					$('#sellModal').modal('hide');
					$rootScope.error("Whoops... You only own " + resp + " shares. You can't sell more shares than you own!");
				}
				else {
					getUserBalance(function(balance) {
						$('#sellModal').modal('hide');
						$rootScope.error("Congrats! You successfully sold "+n+" shares of " + $rootScope.compName + ".");

						var newBalance = (parseFloat(balance) + n*$scope.currentPrice).toFixed(2);
						updateUserBalance(newBalance, function(message) {});
						updateUserStocks($rootScope.compName, -n, function(response2) {});
						firebaseMakeTransaction($rootScope.compName+" Market Sell", n*$scope.currentPrice, n, function(message) {
							console.log(message);
						});
						$scope.currentBalance = newBalance;
						$scope.$apply();
					});
				}
			});
		}
		$scope.numberOfShares = '';
	}
	
	$rootScope.close = function() {
		$scope.numberOfShares = '';
	}
	
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
