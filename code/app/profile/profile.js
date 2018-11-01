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
    $rootScope.whosBalance = "Their Buying Power";
    $rootScope.youOrThey = "They";
    $rootScope.whoHasNoCompanies = "They do not currently own any shares."
  }
  else {
    $rootScope.whosBalance = "Your Buying Power";
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
      redirect();
    }
  }

  function redirect() {
    firebase.database().ref("user").once('value').then(function(snapshot) {
      let users = snapshot.toJSON();

      if (doesUsernameExist(users)) {
        window.location.href = "#!/myprofile?"+$rootScope.companyName;
      }
      else {
       window.location.href = "#!/viewSearch?"+$rootScope.companyName;
      }
    });
  }

  function doesUsernameExist(users) {
    let queriedUsername = $rootScope.companyName;

    for (let user in users) {
      if (users[user].username == queriedUsername)
        return true;
    }
    return false;
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
            //$scope.companies = companies;
            if (companies == null) $scope.noCompanies = true;
            $interval.cancel();
          }, 500);
            fetchStockValues(companies, balance);

        });
      });
    }
    $scope.count = $scope.count + 1;
  }

  $scope.$on('$routeChangeSuccess', function(next, current) {
    if(window.location.href.includes("profile")) {
      $interval(getBalance, 1000, 2);
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

  var updateUserInvestment = function(value, callback) {
    var userId;
    if ($routeParams != null && $routeParams.id != null)
      userId = $routeParams.id;
    else if (firebase.auth().currentUser != null)
      userId = firebase.auth().currentUser.uid
    else
      return;
    firebaseWriteToPath("/user/" + userId + "/invested", value + "");
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

    var fetchStockValues = async function(companies, balance) {
      let array = [];
      let companiesJSON = {};
      if (companies != null)
        await iterator(array, companies, balance, Object.keys(companies).length, companiesJSON);
      return 0;
    }

    var iterator = async function(array, companies, balance, length, companiesJSON) {
      var promise1 = new Promise(function(resolve) {
        $timeout(function() {
          Object.keys(companies).forEach(async function(key) {
           let stockData = await getStockAPI(key);
           if (Object.keys(stockData)[1] == undefined)
              return;
           let price = await (getStockPrice(stockData, array[key]) * companies[key]).toFixed(2);
           array.push(parseFloat(price));
           companiesJSON[key]= parseFloat(price);
           if (array.length == length)
            resolve(companiesJSON);
         });
       }, 500);
     }).then((companiesJSON) => {
       console.log(companiesJSON);
         $scope.$apply(function () {
           Object.keys(companiesJSON).forEach(async function(keys) {
             let json = JSON.parse(JSON.stringify(companiesJSON[keys]));
           });
           $scope.companies = companiesJSON;
         });
         console.log(array);
         if (array.length > 1)
          var totalInvested = Object.keys(array).reduce(function(sum, keys){return sum + parseFloat(companiesJSON[keys]);},0);
          else totalInvested = array[0];
          console.log("Total Invested:" + totalInvested);
          console.log("Total:" + (parseFloat(balance)+parseFloat(totalInvested)).toFixed(2));
          console.log(totalInvested);
          updateUserInvestment(totalInvested);
      });
    }
    var getStockAPI = async function(key) {
      const apiKey1 = 'IJ5198MHHWRYRP9Y';
      const apiKey2 = 'H3RM4TRVAXEE1MRR';
      const apiUrl = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=' + key + '&interval=5min&apikey=' + apiKey1;
      const stockRes = await fetch(apiUrl);
      const stockData = await stockRes.json();
      return stockData;
    }

    var getStockPrice = function(stockData) {
      const stockDates = stockData[Object.keys(stockData)[1]];
      const priceArr = stockDates[Object.keys(stockDates)[Object.keys(stockDates).length - 1]];
      const p = JSON.stringify(priceArr);
      const l = p.indexOf("open") + 7;
      const r = p.indexOf(",") - 1;
      return parseFloat(p.substring(l, r)).toFixed(2);
    }
});
