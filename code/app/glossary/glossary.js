'use strict';

angular.module('myApp.glossary', ['ngRoute', 'ngCookies']) //'ngSanitize'

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/glossary', {
    templateUrl: 'glossary/glossary.html',
    controller: 'GlossaryCtrl'
  });
}])

.controller('GlossaryCtrl', function($scope, $rootScope, $cookieStore) {
	$rootScope.loggedIn = $cookieStore.get('loggedIn');
	if (!$rootScope.loggedIn) {
		window.location.href = '#!/login';
	}

  $scope.keys = function (obj) {
      var json = JSON.parse(angular.toJson(obj));
      return Object.keys(json)[0];
  }
  $scope.elements = function (obj) {
      var json = JSON.parse(angular.toJson(obj));
      return json[Object.keys(json)];
  }

  $scope.FAQs = [
      {header: 'When does Market Open and Close?', questions: [
        {a:'Nasdaq and NYSE trading hours are 9:30 am to 4 pm, Eastern Standard Time. For Nasdaq, pre-market trading hours are 4:00 am to 9:30 am, Eastern Standard Time. After hours runs from 4:00 pm to 8:00 pm, Eastern Standard Time. Also, the stock market is usually closed on public holidays, including New Years Day, Martin Luther King, Jr. Day, Washington\'s Birthday, Good Friday, Memorial Day, Independence Day, Labor Day, Thanksgiving Day, and Christmas.'}
      ]},
      {header: 'Assets', questions: [
          {a:'Everything a company or person owns, including money, securities, equipment and real estate. Assets include everything that is owed to the company or person. Assets are listed on a company\'s balance sheet or an individual\'s net worth statement.'}
      ]},
      {header: 'Annual Report', questions: [
          {a:'A publication, including financial statements and a report on operations, issued by a company to its shareholders at the company\'s fiscal year-end.'}
      ]},
      {header: 'Bid', questions: [
          {b:'The highest price a buyer is willing to pay for a stock. When combined with the ask price information, it forms the basis of a stock quote.'}
      ]},
      {header: 'Blue Chip Stocks', questions: [
          {b:'Stocks of leading and nationally known companies that offer a record of continuous dividend payments and other strong investment qualities.'}
      ]},
      {header: 'Bonds', questions: [
          {b:'Promissory notes issued by a corporation or government to its lenders, usually with a specified amount of interest for a specified length of time.'}
      ]},
      {header: 'Cash', questions: [
          {c:'A special term attached to an equity order that requires the trade to be settled either the same day or the following business day for cash.'}
      ]},
      {header: 'Commodities', questions: [
          {c:'Products used for commerce that are traded on a separate, authorized commodities exchange. Commodities include agricultural products and natural resources such as timber, oil and metals. Commodities are the basis for futures contracts traded on these exchanges.'}
      ]},
      {header: 'Demand', questions: [
          {d:'The combined desire, ability and willingness on the part of consumers to buy goods or services. Demand is determined by income and by price, which are, in part, determined by supply.'}
      ]},
      {header: 'Dividend', questions: [
          {d:'The portion of the issuer\'s equity paid directly to shareholders. It is generally paid on common or preferred shares. The issuer or its representative provides the amount, frequency (monthly, quarterly, semi-annually, or annually), payable date, and record date. The exchange that the issue is listed on sets the ex-dividend/distribution (ex-d) date for entitlement. An issuer is under no legal obligation to pay either preferred or common dividends.'}
      ]},{header: 'Equities', questions: [
          {e:'Common and preferred stocks, which represent a share in the ownership of a company.'}
      ]},
      {header: 'Face Value', questions: [
          {f:'The cash denomination of the individual debt instrument. It is the amount of money that the holder of a debt instrument receives back from the issuer on the debt instrument\'s maturity date. Face value is also referred to as par value or principal.'}
      ]},
      {header: 'Growth Stock', questions: [
          {g:'The shares of companies that have enjoyed better-than-average growth over recent years and are expected to continue their climb.'}
      ]},
      {header: 'Hedge', questions: [
          {h:'A strategy used to limit investment loss by making a transaction that offsets an existing position.'}
      ]},
      {header: 'Index', questions: [
          {i:'A statistical measure of the state of the stock market, based on the performance of stocks. Examples are the S&P/TSX Composite Index and the S&P/TSX Venture Composite Index.'}
      ]},
      {header: 'Liabilities', questions: [
          {l:'The debts and obligations of a company or an individual. Current liabilities are debts due and payable within one year. Long-term liabilities are those payable after one year. Liabilities are found on a company\'s balance sheet or an individual\'s net worth statement.'}
      ]},
      {header: 'Price-Earnings (P/E) Ratio', questions: [
          {p:'A common stock\'s last closing market price per share divided by the latest reported 12-month earnings per share. This ratio shows you how many times the actual or anticipated annual earnings a stock is trading at.'}
      ]},
      {header: 'Revenue', questions: [
          {r:'The total amount of funds generated by a business.'}
      ]},
      {header: 'Stock Symbol', questions: [
          {s:'A one-character to three-character, alphabetic root symbol, which represents an issuer listed on Toronto Stock Exchange or TSX Venture Exchange.'}
      ]},
      {header: 'Time', questions: [
          {t:'Time refers to the time period you would like to see charted from the drop-down menu box labelled "Time". These options give you a choice of intraday pricing data ("Daily", "1-Minute", "5-Minute", "15-Minute" and "Hourly") options. The additional options refer to end-of-day pricing data. This term refers to a TSX Group Historical Performance charting feature.'}
      ]},
      {header: 'Transactions', questions: [
          {t:'As reported in exchange trading statistics, represents the total number of trades for a specified period.'}
      ]},
      {header: 'Venture Capital', questions: [
          {v:'Money raised by companies to finance new ventures.'}
      ]},

      {header: 'Warrant', questions: [
          {w:'A security giving the holder the right to purchase securities at a stipulated price within a specified time limit. Exercise of the warrant is solely at the discretion of the holder. Warrants are not exercisable after the expiry date. A warrant is often issued in conjunction with another security as part of a financing. A warrant may be traded as a listed security or it may be held privately.'}
      ]}
  ];

  $scope.camelCase = function(str) {
      return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
          return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
      }).replace(/\s+/g, '');
  };
  });
