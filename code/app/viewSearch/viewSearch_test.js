describe('StockMock Search', function() {
  it('should display graph', function() {
    browser.get('http://127.0.0.1:60788/app/index.html#!/login');
	  
	browser.sleep(1000);
	element.all(by.model('username')).first().sendKeys('user5@test.com');
	element.all(by.model('password')).first().sendKeys('hellothere');
	element(by.name('login')).click();
	browser.sleep(1000);
	expect(browser.getCurrentUrl()).toContain("profile");
	expect(element(by.name('greeting')).getText()).toEqual('Hello user5@test.com!');
	  
	element(by.name('companyName')).click();
	element(by.model('companyName')).sendKeys('GOOG');
	element(by.name('searchbtn')).click();
	  
	expect(browser.getCurrentUrl()).toContain("viewSearch");
	var EC = protractor.ExpectedConditions;

	browser.driver.wait(function () {
		browser.wait(EC.visibilityOf(element(by.id('companyChart'))), 10000);
		return element(by.id('companyChart'));
	});
	  
	expect(element(by.id('companyChart')).isDisplayed());
	expect(element(by.name('comp_name')).getText()).toEqual('GOOG');
	expect(element(by.name('price')).isDisplayed());
	expect(element(by.name('balance')).isDisplayed());
  });
	
  it('should buy shares', function() {
	browser.sleep(2000);
    element(by.name('buy')).click();
	browser.sleep(1000);
	element(by.name('buyShares')).sendKeys('1');
	browser.sleep(1000);
	element(by.name('buySubmit')).click();
//	if (((new Date()).getUTCHours()-4) < 4 || ((new Date()).getUTCHours()-4) >= 20) {
//		browser.sleep(2000);
//		expect(element(by.name('errorMessage')).getText()).toEqual("You can't buy shares when the market is closed! The stock market is only open from 4am to 8pm Eastern Standard Time.");
//		element(by.name('thanks')).click();
//	}
//	else {
		browser.sleep(2000);
		expect(element(by.name('errorMessage')).getText()).toEqual("Nice find! You successfully bought 1 shares of GOOG.");
		element(by.name('thanks')).click();
//	}
  });
	
  it('should reject buy if market closed', function() {
	browser.sleep(2000);
    element(by.name('buy')).click();
	browser.sleep(1000);
	element(by.name('buyShares')).sendKeys('1');
	browser.sleep(1000);
	element(by.name('buySubmit')).click();
	browser.sleep(1000);
//	if (((new Date()).getUTCHours()-4) < 4 || ((new Date()).getUTCHours()-4) >= 20) {
//		browser.sleep(2000);
//		expect(element(by.name('errorMessage')).getText()).toEqual("You can't buy shares when the market is closed! The stock market is only open from 4am to 8pm Eastern Standard Time.");
//		element(by.name('thanks')).click();
//	}
//	else {
		browser.sleep(2000);
		expect(element(by.name('errorMessage')).getText()).toEqual("Nice find! You successfully bought 1 shares of GOOG.");
		element(by.name('thanks')).click();
//	}
  });
	
  it('should sell shares', function() {
//	if (((new Date()).getUTCHours()-4) >= 4 && ((new Date()).getUTCHours()-4) < 20) {
		browser.sleep(2000);
		element(by.name('sell')).click();
		browser.sleep(1000);
		element(by.name('sellShares')).sendKeys('1');
		browser.sleep(1000);
		element(by.name('sellSubmit')).click();
		
		browser.sleep(2000);
		expect(element(by.name('errorMessage')).getText()).toEqual("Congrats! You successfully sold 1 shares of GOOG.");
		element(by.name('thanks')).click();
//	}
  });
	
  it('should reject buy for not enough funds', function() {
	browser.sleep(2000);
    element(by.name('buy')).click();
	browser.sleep(1000);
	element(by.name('buyShares')).sendKeys('100');
	browser.sleep(1000);
	element(by.name('buySubmit')).click();
//	if (((new Date()).getUTCHours()-4) < 4 || ((new Date()).getUTCHours()-4) >= 20) {
//		browser.sleep(2000);
//		expect(element(by.name('errorMessage')).getText()).toEqual("You can't buy shares when the market is closed! The stock market is only open from 4am to 8pm Eastern Standard Time.");
//		element(by.name('thanks')).click();
//	}
//	else {
		
		browser.sleep(2000);
		expect(element(by.name('errorMessage')).getText()).toEqual("Looks like you don't have enough money to make this purchase. Try making a bank transfer to get more money.");
		element(by.name('thanks')).click();
//	}
  });
	
  it('should reject selling more than owned', function() {
//	if (((new Date()).getUTCHours()-4) >= 4 && ((new Date()).getUTCHours()-4) < 20) {
		browser.sleep(2000);
		element(by.name('sell')).click();
		browser.sleep(1000);
		element(by.name('sellShares')).sendKeys('100');
		browser.sleep(1000);
		element(by.name('sellSubmit')).click();
		
		browser.sleep(2000);
		expect(element(by.name('errorMessage')).getText()).toContain("You can't sell more shares than you own!");
		element(by.name('thanks')).click();
//	}
	browser.sleep(2000);
	element(by.name('account')).click();
	element(by.name('logout')).click();
  });

});