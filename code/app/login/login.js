'use strict';

angular.module('myApp.login', ['ngRoute', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', function($scope, $rootScope, $cookieStore) {
	if (window.location.href.includes('login') && $rootScope.loggedIn) {
		window.location.href = "#";
	}
	$scope.flagg = true;
	$scope.login = function() {
		//console.log($scope.username + " " + $scope.password);

		// check if username contains @ or . or space
		if($scope.username == null || $scope.password == null) {
			$rootScope.error("Looks like you didn't fill all the required fields. Please enter an email and password and try again.");
			return;
		}
		else if (!$scope.username.includes('@')) {
			$rootScope.error("Looks like you didn't enter a valid email. Please enter an email as your username.");
			return;
		}
		else if (!$scope.username.includes('.')) {
			$rootScope.error("Looks like you didn't enter a valid email. Please enter an email as your username.");
			return;
		}
		else if ($scope.username.includes(' ')) {
			$rootScope.error("Looks like you didn't enter a valid email. Please enter an email as your username.");
			return;
		}
		else if ($scope.password.length > 30 || $scope.password.length < 8) {
			$rootScope.error("Please enter a password that is between 8 and 30 characters.");
			return;
		}

		firebaseLogin($scope.username, $scope.password, function(response) {
			//console.log(response);
			if (response.includes("user-not-found")) {
				$rootScope.error("Sorry, looks like that user doesn't exist. Please create account a new account.");
			}
			else if (response.includes("wrong-password")) {
				$rootScope.error("Looks like you typed your username or password incorrectly. Please try again.");
			}
			else if (response.includes("invalid-email")) {
				$rootScope.error("Looks like you didn't enter a valid email. Please enter an email as your username.");
			}
			else if (response.includes("Success! User Logged In.")) {

				firebaseGetTransactions(function(message, transactions) {
					if ($scope.flagg && transactions != null) {
						$scope.flagg = false;
						var count = 0;
						var companies = {};
						for (var i=0; i < transactions.length; i++) {
							if (transactions[i].type.includes("Market Buy") && transactions[i].dividend == 1) {
								var comp = transactions[i].type.substring(0,transactions[i].type.indexOf("Market Buy")-1);
								if (companies[comp] == null) {
									companies[comp] = transactions[i].shares*transactions[i].amount*0.005;
								}
								else {
									companies[comp] = companies[comp] + transactions[i].shares*transactions[i].amount*0.005;
								}
								var path = "/transactions/" + transactions[i].uid + "/" + transactions[i].date + "/dividend/";
								firebaseWriteToPath(path, 0);
							}
							else if (transactions[i].type.includes("Market Sell") && transactions[i].dividend == 1) {
								var comp = transactions[i].type.substring(0,transactions[i].type.indexOf("Market Sell")-1);
								if (companies[comp] == null) {
									companies[comp] = -(transactions[i].shares*transactions[i].amount*0.005);
								}
								else {
									companies[comp] = companies[comp] - transactions[i].shares*transactions[i].amount*0.005;
								}
								var path = "/transactions/" + transactions[i].uid + "/" + transactions[i].date + "/dividend/";
								firebaseWriteToPath(path, 0);
							}
						}
						//console.log(companies);
						for (var key in companies) {
						  if (companies.hasOwnProperty(key) && companies[key].toFixed(2) > 0) {
							
							//console.log(key + " -> " + companies[key]);
							firebaseMakeTransaction(key+" Dividend", companies[key].toFixed(2), null, function(message) {});
							getUserBalance(function(resp) {
								resp = (parseFloat(resp) + parseFloat(companies[key])).toFixed(2);
								updateUserBalance(resp, function(resp2) {});
							});
						  }
						}
					}
				});

				$rootScope.loggedIn = true;
				$cookieStore.put('loggedIn', true);
				$cookieStore.put('loggedInUser', $scope.username);
				window.location.href = "#";
			}
		});
	}

	$scope.signup = function() {
		//console.log($scope.username + " " + $scope.password);

		if($scope.create_username == null || $scope.create_password == null || $scope.validate == null || $scope.create_realusername == null) {
			$rootScope.error("Looks like you didn't fill all the required fields. Please enter an email and password and try again.");
			return;
		}
		else if (!$scope.create_username.includes('@')) {
			$rootScope.error("Looks like you didn't enter a valid email. Please enter an email as your username.");
			return;
		}
		else if (!$scope.create_username.includes('.')) {
			$rootScope.error("Looks like you didn't enter a valid email. Please enter an email as your username.");
			return;
		}
		else if ($scope.create_username.includes(' ')) {
			$rootScope.error("Looks like you didn't enter a valid email. Please enter an email as your username.");
			return;
		}
		else if ($scope.create_username.length < 3 || $scope.create_username.length > 254) {
			$rootScope.error("Please enter a username that is between 3 and 254 characters.");
			return;
		}
		else if ($scope.create_realusername.length < 3 || $scope.create_realusername.length > 254) {
			$rootScope.error("Please enter a username that is between 3 and 254 characters.");
			return;
		}
		else if ($scope.create_password.length > 30 || $scope.create_password.length < 8) {
			$rootScope.error("Please enter a password that is between 8 and 30 characters.");
			return;
		}
		else if (!($scope.create_password === $scope.validate)) {
			$rootScope.error("Oops! Looks like those passwords don't match. Please try typing them in again.");
			return;
		}
		else {
			createFirebaseUser( $scope.create_realusername, $scope.create_username, $scope.create_password, function(response) {
				if (response.includes("email-already-in-use")) {
					$rootScope.error("Hey! That user already exists.");
				}
				else if (response.includes("invalid-email")) {
					$rootScope.error("Looks like you didn't enter a valid email. Please enter an email as your username.");
				}
				else if (response.includes("username already in use")) {
					$rootScope.error("Hey! That username already exists please choose a different username");
				}
				else if (response.includes("User Created and Logged In.")) {
					sendNewUserEmail(firebase.auth().currentUser, function(success, errorMessage) {
						  if (success) {
							console.log("User Created and Logged In and email sent.");
						  } else {
							  console.log(errorMessage);
						  }

					  });
					updateUserBalance(10000, function(response) {});

					$rootScope.loggedIn = true;
					$cookieStore.put('loggedIn', true);
					$cookieStore.put('loggedInUser', $scope.create_username);
					window.location.href = "#!/tutorial";
				}
			});
		}
	}

	$scope.logout = function() {
		firebase.auth().signOut().then(function() {
		  console.log('Signed Out');
		}, function(error) {
		  console.error('Sign Out Error', error);
		});
		$rootScope.loggedIn = false;
		$rootScope.companyName = '';
		$cookieStore.put('loggedIn', false);
	}

	$scope.delete = function() {
		deleteFirebaseUser(function(response) {
			var option = window.confirm("Are you sure you want to delete your account?");
			if (option == true) {
				console.log(response);
				if ((response === "User was successfully deleted.")) {
					$rootScope.error(response);
					$cookieStore.put('loggedIn', false);
					$cookieStore.put('loggedInUser', null);
					window.location.href = "#!/login";
				}
			}
		});
	}

	$scope.changePassword = function() {
		window.location.href = "#!/change-password"
	}

	$scope.loginCheck = function() {
		$rootScope.loggedIn = $cookieStore.get('loggedIn');
		if (!$rootScope.loggedIn) {
			window.location.href = '#!/login';
		}
	}

	 var flag = true;
	 var createFirebaseUser = function(username, email, password, callback) {
			var map = [];
			var x = false;
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
					console.log("2");
					firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
						// Handle Errors here.
						var errorCode = error.code;
						var errorMessage = error.message;
		
						console.log(errorCode + '\n' + errorMessage);
						callback(errorCode + ' ' + errorMessage);
					});
					firebase.auth().onAuthStateChanged(function(user) {
						if (user && flag) {
						var id = user.uid;
						firebase.database().ref('user/' + id).set({
							email: user.email,
							uid: id,
							username : username
						});
							callback("User Created and Logged In.");
							flag = false;
						}
					});
			}
		});
		
		
	}
		
  //$scope.funcName(123, 456)
  var firebaseLogin = function(email, password, callback) {
			firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
			  // Handle Errors here.
			  var errorCode = error.code;
			  var errorMessage = error.message;
			  //
			  // window.alert(errorCode + ' ' + errorMessage); FB is dumb
			  callback( errorCode + ' ' + errorMessage);
			});

			// go on to the next screen

			// $scope.fireWriteTo('users/' + currentUser.uid;)
			// console.log("user logged in");
			firebase.auth().onAuthStateChanged(function(user) {
			  if (user) {
				callback("Success! User Logged In.");
			  }
			});

  }

	var deleteFirebaseUser = function(callback) {
			var user = firebase.auth().currentUser;
			if (user != null) {
			  user.delete().then(function() {
				// User deleted.
				console.log("user deleted")
				firebaseWriteToPath("user/" + user.uid, null);
				firebaseWriteToPath("transactions/" + user.uid, null);
				callback("User was successfully deleted.");
			  }).catch(function(error) {
				// An error happened.
				callback("Was not able to delete user!");
			  });

		}
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

  var sendNewUserEmail = function(user, callback) {
    if (user != null) {
      firebase.auth().sendPasswordResetEmail(user.email).then(function() {
        // Email sent.
        callback(true, " ");
      }).catch(function(error) {
        // An error happened.
		callback(false,"Unable to send you a confirmation email, below is the error\n" + errorCode + ' ' + errorMessage);
      });

    }

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
