'use strict';

angular.module('myApp.news', ['ngRoute', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/news', {
    templateUrl: 'news/news.html',
    controller: 'NewsCtrl'
  });
}])

.controller('NewsCtrl', function($scope, $http, $rootScope, $cookieStore, $timeout) {
  redirectIfNotLoggedIn($rootScope, $cookieStore);
  
  $scope.$on('$routeChangeSuccess', function(next, current) {
    if(window.location.href.includes("news")) {
      getNewsArticles(function(articles) {
        saveArticlesInScope($scope, articles);
      });
    }
  });

  function redirectIfNotLoggedIn(rootScope, cookieStore) {
    rootScope.loggedIn = cookieStore.get('loggedIn');
    if (!rootScope.loggedIn) {
      window.location.href = '#!/login';
    }
  }
  
  function saveArticlesInScope(scope, articles) {
    if (articles != null) {
      $timeout(function() {
        scope.articles = articles;
        console.log(scope.articles);
      }, 0);
    }
  }

  var getNewsArticles = function(callback) {
    var apiUrl = 'https://newsapi.org/v2/top-headlines?' +
                'sources=financial-times,crypto-coins-news&' +
                'apiKey=3ef315de0c774040af13a65cdc9c7524';
    $http({
      method: 'GET',
      url: apiUrl
    }).then(function successCallback(articles_response) {
      var articles = getCleanArticles(articles_response.data.articles);
      callback(articles);
    });
  }

  function getCleanArticles(articles) {
    articles.forEach(function(article) {
      article.publishedAt = article.publishedAt.replace('T', '  ').replace('Z', '');
      if (!imageExists(article.urlToImage)) {
        article.urlToImage = '../android-chrome-512x512.png'
      }
      if (article.title.length > 70) {
        article.title = article.title.substring(0, 67) + " ...";
      }
    });
    return articles;
  }

  function imageExists(image_url){
    var http = new XMLHttpRequest();
    http.open('HEAD', image_url, false);
    http.send();
    return http.status != 404;
  }

  $rootScope.filter = function(value) {
    $rootScope.buttons = value;
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