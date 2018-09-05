describe('StockMock History', function() {
  it('should go to history', function() {
    browser.get('http://127.0.0.1:60788/app/index.html#!/login');
	browser.sleep(1000);
	element.all(by.model('username')).first().sendKeys('user5@test.com');
	element.all(by.model('password')).first().sendKeys('hellothere');
	element(by.name('login')).click();
	browser.sleep(1000);
	expect(browser.getCurrentUrl()).toContain("profile");
	expect(element(by.name('greeting')).getText()).toEqual('Hello user5@test.com!');
	  
	element(by.name('history')).click();
	  
	expect(browser.getCurrentUrl()).toContain("history");
	  
  });
  
  it('should show trading', function() {
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
	  
	browser.sleep(2000);
    element(by.name('buy')).click();
	element(by.name('buyShares')).sendKeys('1');
	element(by.name('buySubmit')).click();
	
//	if (((new Date()).getUTCHours()-4) < 4 || ((new Date()).getUTCHours()-4) >= 20) {
//		browser.sleep(2000);
//		expect(element(by.name('errorMessage')).getText()).toEqual("You can't buy shares when the market is closed! The stock market is only open from 4am to 8pm Eastern Standard Time.");
//		element(by.name('thanks')).click();
//		browser.sleep(2000);
//	}
//	else {
		browser.sleep(2000);
		expect(element(by.name('errorMessage')).getText()).toEqual("Nice find! You successfully bought 1 shares of GOOG.");
		element(by.name('thanks')).click();
		
		browser.sleep(3000);
		element(by.name('history')).click();
		
		browser.sleep(1000);

		expect(browser.getCurrentUrl()).toContain("history");
		
		browser.sleep(1000);

		element(by.name('trading')).click();
		
		browser.sleep(1000);

		var type = element(by.repeater('transaction in transactions | filter : buttons').row(0).column('transaction.type'));
		expect(type.getText()).toEqual("GOOG Market Buy");
//	}
	
  });
	
  it('should show dividends', function() {
	  
//	if (((new Date()).getUTCHours()-4) >= 4 && ((new Date()).getUTCHours()-4) < 20) {
		element(by.name('account')).click();
		element(by.name('logout')).click();
		browser.sleep(2000);

		element.all(by.model('username')).first().sendKeys('user5@test.com');
		element.all(by.model('password')).first().sendKeys('hellothere');
		element(by.name('login')).click();
		browser.sleep(2000);
		expect(browser.getCurrentUrl()).toContain("profile");
		expect(element(by.name('greeting')).getText()).toEqual('Hello user5@test.com!');

		element(by.name('history')).click();
		
		browser.sleep(1000);

		expect(browser.getCurrentUrl()).toContain("history");
		
		browser.sleep(1000);

		element(by.name('dividends')).click();
		
		browser.sleep(1000);

		var type = element(by.repeater('transaction in transactions | filter : buttons').row(0).column('transaction.type'));
		expect(type.getText()).toEqual("GOOG Dividend");
	  
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
	  
		browser.sleep(2000);
		element(by.name('sell')).click();
		element(by.name('sellShares')).sendKeys('1');
		element(by.name('sellSubmit')).click();
		
		browser.sleep(2000);
		expect(element(by.name('errorMessage')).getText()).toEqual("Congrats! You successfully sold 1 shares of GOOG.");
		element(by.name('thanks')).click();

		browser.sleep(2000);
		element(by.name('history')).click();
		
		browser.sleep(1000);

		expect(browser.getCurrentUrl()).toContain("history");
		
		browser.sleep(1000);

		element(by.name('trading')).click();
		
		browser.sleep(1000);

		var type = element(by.repeater('transaction in transactions | filter : buttons').row(0).column('transaction.type'));
		expect(type.getText()).toEqual("GOOG Market Sell");
//	}
	
  });
	
  it('should show transfers', function() {
	browser.sleep(2000);
	element(by.name('banking')).click();
	  
	expect(browser.getCurrentUrl()).toContain("banking");
	  
	element(by.model('depositAmount')).sendKeys('1');
	element(by.name('depositSubmit')).click();

	browser.wait(protractor.ExpectedConditions.alertIsPresent(), 1000);
	expect(browser.switchTo().alert().getText()).toEqual("Are you sure you want to deposit $1 to the bank?");
	browser.switchTo().alert().accept();
	  
	browser.sleep(2000);
	expect(element(by.name('errorMessage')).getText()).toEqual("Yay! Your funds were successfully transferred!");
	element(by.name('thanks')).click();
	  
	element(by.model('withdrawAmount')).sendKeys('1');
	element(by.name('withdrawSubmit')).click();

	browser.wait(protractor.ExpectedConditions.alertIsPresent(), 1000);
	expect(browser.switchTo().alert().getText()).toEqual("Are you sure you want to withdraw $1 from the bank?");
	browser.switchTo().alert().accept();

	browser.sleep(2000);
	expect(element(by.name('errorMessage')).getText()).toEqual("Yay! Your funds were successfully transferred!");
	element(by.name('thanks')).click();
	  
	browser.sleep(2000);
	  
	element(by.name('history')).click();
	  
	browser.sleep(1000);
	  
	expect(browser.getCurrentUrl()).toContain("history");
	  
	browser.sleep(1000);
	  
	element(by.name('transfers')).click();
	  
	browser.sleep(1000);
	  
	var type = element(by.repeater('transaction in transactions | filter : buttons').row(0).column('transaction.type'));
	expect(type.getText()).toEqual("Bank Withdrawal");
	type = element(by.repeater('transaction in transactions | filter : buttons').row(1).column('transaction.type'));
	expect(type.getText()).toEqual("Bank Deposit");
	  
	element(by.name('account')).click();
	element(by.name('logout')).click();
	browser.sleep(1000);
  });
	
});