angular.module('myApp.forum', ['ngRoute', 'ngCookies'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/forum', {
            templateUrl: 'forum/forum.html',
            controller: 'ForumCtrl'
        });
    }])
    .controller('ForumCtrl', function($scope, $rootScope, $cookieStore) {
        $rootScope.loggedIn = $cookieStore.get('loggedIn');
        if (!$rootScope.loggedIn) {
            window.location.href = '#!/login';
        }
        if (localStorage.getItem('banking') === null) {
            localStorage.setItem('banking', JSON.stringify(banking));
        }
        if (localStorage.getItem('dayTrading') === null) {
            localStorage.setItem('dayTrading', JSON.stringify(dayTrading));
        }
        if (localStorage.getItem('mutualFunds') === null) {
            localStorage.setItem('mutualFunds', JSON.stringify(mutualFunds));
        }
        $scope.empty = {};
        $scope.banking = JSON.parse(localStorage.getItem('banking'));
        $scope.dayTrading = JSON.parse(localStorage.getItem('dayTrading'));
        $scope.mutualFunds = JSON.parse(localStorage.getItem('mutualFunds'));
        $scope.Description = function(obj) {
            var json = JSON.parse(angular.toJson(obj));
            return obj;
        }
        $scope.poster = function(obj) {
            var json = JSON.parse(angular.toJson(obj));
            $scope.date = json[Object.keys(json)[2]];
            return json[Object.keys(json)[1]];
        }
        $scope.noOfReplies = function(obj) {
            var json = JSON.parse(angular.toJson(obj));
            return Object.keys(json[Object.keys(json)[0]]).length;
        }
        $scope.replies = function(obj) {
            var json = JSON.parse(angular.toJson(obj));
            return json[Object.keys(json)[0]];
        }
        $scope.countOfPosts = function() {
            return Object.keys($scope.banking).length + Object.keys($scope.dayTrading).length + Object.keys($scope.mutualFunds).length;
        }
        $scope.usersTable = function() {
            var arr = [];
            //var temp = $scope.banking[Object.keys($scope.banking)[0]]['Poster'];
            Object.keys($scope.banking).forEach(i => {
                if (arr.indexOf([$scope.banking[i]['Poster']]) == -1)
                    arr.push($scope.banking[i]['Poster']);
            });
            Object.keys($scope.dayTrading).forEach(i => {
                if (arr.indexOf([$scope.dayTrading[i]['Poster']]) == -1)
                    arr.push($scope.dayTrading[i]['Poster']);
            });
            Object.keys($scope.mutualFunds).forEach(i => {
                if (arr.indexOf([$scope.mutualFunds[i]['Poster']]) == -1)
                    arr.push($scope.mutualFunds[i]['Poster']);
            });
            return arr;
        }
        $scope.getID = function(obj) {
            var rep = obj.split(" ");
            var res = rep.join('-');
            return res;
        }
        $scope.getOtherID = function(obj){
            var rep = obj.split(" ");
            var res = rep.join(',');
            return res;
        }
        $scope.newID = function(obj){
            var rep = obj.split(" ");
            var res = rep.join('.');
            return res;
        }
        $scope.buttonID = function(obj){
            var rep = obj.split(" ");
            var res = rep.join('/');
            return res;
        }
        $scope.getDOMID = function(obj, comma) {
            var rep = obj.split('-');
            var res = rep.join(" ");
            var reply = document.getElementById(obj).value;
            var user = document.getElementById(comma).value;
            if (banking.hasOwnProperty(res)){
                banking[res][Object.keys(banking[res])[0]][user] = reply;
                localStorage.setItem('banking', JSON.stringify(banking));
            }
            if (dayTrading.hasOwnProperty(res)){
                dayTrading[res][Object.keys(dayTrading[res])[0]][user] = reply;
                localStorage.setItem('dayTrading', JSON.stringify(dayTrading));
            }
            if (mutualFunds.hasOwnProperty(res)){
                mutualFunds[res][Object.keys(mutualFunds[res])[0]][user] = reply;
                localStorage.setItem('mutualFunds', JSON.stringify(mutualFunds));
            }
            location.reload();
            return 0;
        }
        $scope.toggleHide = function(obj, button) {
            var x = document.getElementById(obj);
            var y = document.getElementById(button);
            if (x.hasAttribute('hidden')) {
                x.removeAttribute('hidden');
            } else {
                x.setAttribute('hidden');
            }
            y.setAttribute('hidden', true);
            return;
        }
    });

function addPost(postDOM, userDOM) {
    var post = document.getElementById(postDOM).value;
    var user = document.getElementById(userDOM).value;
    var subtopic = JSON.parse(localStorage.getItem(postDOM));
    subtopic[post] = {
        "Replies": {},
        "Poster": user,
        "TimePosted": getDate()
    };
    localStorage.setItem(postDOM, JSON.stringify(subtopic));
    location.reload();
}



function getDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    today = mm + '/' + dd + '/' + yyyy;
    return today;
}

var banking = {
    "When is a savings account's return rate to good to be true?": {
        "Replies": {
            "hparak": "I would say that 5% is the most ",
            "dbough": "@hparak is an idiot, 7% is the highest"
        },
        "Poster": "razao",
        "TimePosted": "11/23/2018"
    },
    "How do you transfer funds into StockMock?!": {
        "Replies": {
            "admin-rohan": "Navigate to the bank subtab under tools"
        },
        "Poster": "njames",
        "TimePosted": "11/27/2018"
    }
};

var dayTrading = {
    "Is day trading a viable career option?": {
        "Replies": {
            "poster": "I would say that ",
            "poster2": "reply"
        },
        "Poster": "newStockMockUser",
        "TimePosted": "10/15/2018"
    }
};

var mutualFunds = {
    "Whats the difference between a Roth IRA and a regular IRA?": {
        "Replies": {},
        "Poster": "rohanOhan",
        "TimePosted": "12/01/2018"
    },
    "When is the best age to start investing in IRAs?": {
        "Replies": {
            "poster": "I would say that ",
            "poster2": "reply"
        },
        "Poster": "AdibSpell",
        "TimePosted": "11/13/2018"
    }
};
