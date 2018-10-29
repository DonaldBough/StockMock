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
  'myApp.settings',
  'myApp.login',
  'myApp.change-password',
  'myApp.myprofile',
  'myApp.viewSearch',
  'myApp.news',
  'myApp.viewSearch',
  'myApp.leaderboard'
]);

function makeTable(leaderboardSuggestions, stockSuggestions) {
    var table = document.getElementById('t01');
    var tableRows = table.getElementsByTagName('tr');
    var rowCount = tableRows.length;

    for (var x=rowCount-1; x>0; x--) {
        table.removeChild(tableRows[x]);
      }
    for (var i = 0; i < leaderboardSuggestions.length; i++) {
        var row = document.createElement('tr');
            var leaderboardCell = document.createElement('td');
            leaderboardCell.textContent = leaderboardSuggestions[i];
            row.appendChild(leaderboardCell);
            var stockCell = document.createElement('td');
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
    console.log("IM Here2");
    // $rootScope.errorMessage = errorMessage;

    // let leaderBoardStocks = getLeaderboardStocks();


    var table = makeTable(leaderboardSuggestions, stockSuggestions);
    // parentTable.appendChild(table);
    // $timeout(function() {
      $('#botModal').modal('show');




    // });
  };





})
