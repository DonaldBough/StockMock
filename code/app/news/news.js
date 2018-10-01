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

  var getNewsArticles = function(callback) {
    var apiUrl = getApiUrl();
    $http({
      method: 'GET',
      url: apiUrl
    }).then(function successCallback(articles_response) {
      var articles = getCleanArticles(articles_response.data.articles);
      callback(articles);
    });
  }

  function getApiUrl() {
    var apiString = 'https://newsapi.org/v2/top-headlines?';

    if ($scope.language != null && $scope.language != 'en') {
      apiString += 'country=' + $scope.language + '&';
      apiString += 'category=business&'
      return apiString += 'apiKey=3ef315de0c774040af13a65cdc9c7524';
    }
    if ($scope.newsSource != null) {
      apiString += 'sources=' + $scope.newsSource + '&';
      return apiString += 'apiKey=3ef315de0c774040af13a65cdc9c7524';
    }
    if ($scope.company != null) {
      apiString += 'q=' + $scope.company + '&';
      return apiString += 'apiKey=3ef315de0c774040af13a65cdc9c7524';
    }
    apiString += 'sources=financial-times,crypto-coins-news&';
    return apiString += 'apiKey=3ef315de0c774040af13a65cdc9c7524';
  }

  function getCleanArticles(articles) {
    articles.forEach(function(article) {
      article.publishedAt = article.publishedAt.replace('T', '  ').replace('Z', '');
      if (article.title.length > 70) {
        article.title = article.title.substring(0, 67) + " ...";
      }
    });
    return articles;
  }

  function saveArticlesInScope(scope, articles) {
    if (articles != null) {
      $timeout(function() {
        scope.articles = articles;
      }, 0);
    }
  }

  $rootScope.displayNewsArticles = function(language, newsSource, company) {
    $scope.language = language;
    $scope.newsSource = newsSource;
    $scope.company = company;
    getNewsArticles(function(articles) {
      saveArticlesInScope($scope, articles);
    });
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

function imgError(image) {
    image.onerror = '';
    image.src = '../android-chrome-512x512.png';
    return true;
}