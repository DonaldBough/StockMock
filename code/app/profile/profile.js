'use strict';

angular.module('myApp.profile', ['ngRoute', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/profile', {
        templateUrl: 'profile/profile.html',
        controller: 'ProfileCtrl'
    });
}])

.controller('ProfileCtrl', function($scope, $http, $rootScope, $cookieStore, $timeout, $interval) {
    $rootScope.loggedIn = $cookieStore.get('loggedIn');
    $rootScope.loggedInUser = $cookieStore.get('loggedInUser');
    if (!$rootScope.loggedIn) {
        window.location.href = '#!/login';
    }
    $scope.search = function() {
        if ($rootScope.companyName == undefined ||
            $rootScope.companyName == '') {
            $rootScope.error("Hey buddy! You need to enter a symbol to search for!");
            return;
        } else if ($rootScope.companyName.length > 128) {
            $rootScope.error("You can't search for a company longer than 128 characters.");
            return;
        } else {
            window.location.href = "#!/viewSearch?" + $rootScope.companyName;
        }
    }
    $scope.viewComp = function(key) {
        window.location.href = "#!/viewSearch?" + key;
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
                    var totalInvested = fetchStockValues(companies);

                    updateUserInvestment(totalInvested);
                });
            });
        }
        $scope.count = $scope.count + 1;
    }

    $scope.$on('$routeChangeSuccess', function(next, current) {
        if (window.location.href.includes("profile")) {
            $interval(getBalance, 1000, 2);
        }
    });

    var firebaseWriteToPath = function(path, data) {
        firebase.database().ref(path).set(data);
    }

    var firebaseReadFromPath = function(path, callback) {
        var userId = firebase.auth().currentUser.uid;
        firebase.database().ref(path).once('value').then(function(snapshot) {
            var val = snapshot.val();
            callback(val);
        });
    }

    var updateUserBalance = function(value) {
        var user = firebase.auth().currentUser;

        if (user != null) {
            firebaseWriteToPath("/user/" + user.uid + "/balance", value);
            callback("User balance was succesfully updated");
        } else callback("It seems that you are not logged in");
    }

    var updateUserInvestment = function(value, callback) {
        var user = firebase.auth().currentUser;

        if (user != null) {
            firebaseWriteToPath("/user/" + user.uid + "/invested", value + "");
        } else return;
    }

    var getUserBalance = function(callback) {
        var user = firebase.auth().currentUser;
        if (user != null) {
            firebaseReadFromPath("/user/" + user.uid + "/balance", function(data) {
                callback((data == -1) ? 0 : data);
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
                    stocks[stock] = (stocks[stock] == null) ? buy : stocks[stock] + buy;

                } else {
                    if (stocks[stock] == null) {
                        callback("you do not own any of these stocks");
                        return;
                    }
                    if (stocks[stock] + buy == 0) {
                        stocks[stock] = null;
                    } else {
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

    var fetchStockValues = function(companies) {
        let array = [];
        //iterator(array, companies, Object.keys(companies).length);

    }

    var iterator =function(array, companies, length) {
        var promise1 = new Promise(function(resolve) {
            setTimeout(function() {
                Object.keys(companies).forEach(async function(key) {
                   let stockData = await getStockAPI(key);
                   if (Object.keys(stockData)[1] == undefined)
                        return;
                   let price = await (getStockPrice(stockData, array[key]) * companies[key]).toFixed(2);
                   array[key] = price;
                   console.log(array);
                   console.log(array.length == length);
                   //resolve(array);
               });
           }, 500);

       }).then((array) => {
           //console.log(array);
           if (array.length == length) {
               var totalInvested = Object.keys(array).reduce(function(sum, keys){return sum + parseFloat(array[keys]);},0);
               console.log(totalInvested);
           }
           $scope.invested = parseFloat(totalInvested).toFixed(2);
        });
    }

    var getStockAPI = async function(key) {
        const apiKey1 = 'IJ5198MHHWRYRP9Y';
        const apiKey2 = 'H3RM4TRVAXEE1MRR';
        const apiKey3 = 'XVO22C0XJ5EH7F21';
        const apiUrl = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=' + key + '&interval=5min&apikey=' + apiKey1;
        const stockRes = await fetch(apiUrl);
        const stockData = await stockRes.json();
        if (Object.keys(stockData)[1] == undefined) {
            const apiUrl = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=' + key + '&interval=5min&apikey=' + apiKey2;
            const stockRe = await fetch(apiUrl);
            const stockDat = await stockRe.json();
            return stockDat;
        }


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
/*

let stockData = await getStockAPI(key);
let price = 0;
if (Object.keys(stockData)[1] == undefined) {
    return;
} else {
    price = await (getStockPrice(stockData, array[key]) * companies[key]).toFixed(2);
}
array[key] = price;
console.log(array);
*/
