'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ngRoute',
  'ngCookies',
  'myApp.profile',
  'myApp.glossary',
  'myApp.history',
  'myApp.tutorial',
  'myApp.banking',
  'myApp.statistics',
  'myApp.settings',
  'myApp.login',
  'myApp.change-password',
  'myApp.myprofile',
  'myApp.viewSearch',
  'myApp.news',
  'myApp.viewSearch',
  'myApp.leaderboard',
  'myApp.forum'
]);

function makeTable(leaderboardSuggestions, stockSuggestions) {
    var table = document.getElementById('botTable');
    var tableRows = table.getElementsByTagName('tr')
    var rowCount = tableRows.length;

    for (var x=rowCount-1; x>0; x--) {
        table.removeChild(tableRows[x]);
    }

    var len = Math.max(leaderboardSuggestions.length, stockSuggestions.length);
    len = Math.min(len, 10)
    for (var i = 0; i < len; i++) {
        var row = document.createElement('tr')
        row.classList.add("botRow");
            var leaderboardCell = document.createElement('td');
            leaderboardCell.classList.add("botRow");
            leaderboardCell.textContent = leaderboardSuggestions[i];
            row.appendChild(leaderboardCell);
            var stockCell = document.createElement('td');
            stockCell.classList.add("botCell");
            stockCell.textContent = stockSuggestions[i];
            row.appendChild(stockCell);
        table.appendChild(row);
    }
    // return table;
}

app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/profile'});
}]);

app.run(function($rootScope, $timeout) {
  $rootScope.error = function(errorMessage) {
    console.log("IM Here");
    $rootScope.errorMessage = errorMessage;
    $timeout(function() {
      $('#errorModal').modal('show');
    });
  };

  $rootScope.bot = function(leaderboardSuggestions, stockSuggestions) {
    // console.log("IM Here2");
    // $rootScope.errorMessage = errorMessage;

    // let leaderBoardStocks = getLeaderboardStocks();


    var table = makeTable(leaderboardSuggestions, stockSuggestions);
    // parentTable.appendChild(table);
    // $timeout(function() {
      $('#botModal').modal('show');




    // });
  };





})
