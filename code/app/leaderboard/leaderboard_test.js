describe('StockMock Leaderboard', function() {
  it('should go to Leaderboard', function() {
    browser.get('http://127.0.0.1:60788/app/index.html#!/login');
 	element.all(by.model('username')).first().sendKeys('test2@gmail.com');
	element.all(by.model('password')).first().sendKeys('password');
	element(by.name('login')).click();
	browser.sleep(1000);
	expect(browser.getCurrentUrl()).toContain("profile");
	expect(element(by.name('greeting')).getText()).toEqual('Hello test2@gmail.com!');
	element(by.name('leaderboard')).click();
 	expect(browser.getCurrentUrl()).toContain("leaderboard");
 	//element(by.name('account')).click();
	element(by.name('logout')).click();
   });
/*
  it('Check rank 1 > rank 2', function(){
  browser.get('http://127.0.0.1:60788/index.html#!/login');
 	element.all(by.model('username')).first().sendKeys('test2@gmail.com');
	element.all(by.model('password')).first().sendKeys('password');
	element(by.name('login')).click();
	browser.sleep(1000);
	element(by.name('leaderboard')).click();
  browser.sleep(1000);
   var table = element(by.id('leaderboardRankings'));
  var rows = table.all(by.css('tr'));
  console.log(rows.get(0));
  });
*/
});
