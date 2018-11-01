describe('StockMock Statistics', function() {
  it('should go to Leaderboard', function() {
    browser.get('http://127.0.0.1:60788/app/index.html#!/login');

	element.all(by.model('username')).first().sendKeys('test2@gmail.com');
	element.all(by.model('password')).first().sendKeys('password');
	element(by.name('login')).click();
	browser.sleep(1000);
	expect(browser.getCurrentUrl()).toContain("profile");
	expect(element(by.name('greeting')).getText()).toEqual('Hello test2@gmail.com!');
	element(by.name('tools')).click();
  element(by.name('statistics')).click();

	expect(browser.getCurrentUrl()).toContain("statistics");

	//element(by.name('account')).click();
	element(by.name('logout')).click();
  browser.sleep(1000);

  });

  it('Check Total Users', function(){
    browser.get('http://127.0.0.1:60788/app/index.html#!/login');

  element.all(by.model('create_realusername')).sendKeys('testuser');
  element.all(by.model('create_username')).sendKeys('blahblahblah4@test.com');
  element.all(by.model('create_password')).sendKeys('blahblahblah');
  element.all(by.model('validate')).sendKeys('blahblahblah');

  element(by.name('signup')).click();
  browser.sleep(5000);
  expect(browser.getCurrentUrl()).toContain("tutorial");

  element(by.name('tools')).click();
  element(by.name('statistics')).click();
	expect(browser.getCurrentUrl()).toContain("statistics");

  var total = element(by.id('users'));


  element(by.name('account')).click();
  element(by.name('delete')).click();
  browser.sleep(1000);
  browser.wait(protractor.ExpectedConditions.alertIsPresent(), 1000);
  expect(browser.switchTo().alert().getText()).toEqual("Are you sure you want to delete your account?");
  browser.switchTo().alert().accept();

  browser.sleep(2000);
  expect(element(by.name('errorMessage')).getText()).toEqual("User was successfully deleted.");
  element(by.name('thanks')).click();

  browser.get('http://127.0.0.1:60788/index.html#!/login');

  element.all(by.model('username')).first().sendKeys('test2@gmail.com');
	element.all(by.model('password')).first().sendKeys('password');
	element(by.name('login')).click();
	browser.sleep(1000);

  element(by.name('tools')).click();
  element(by.name('statistics')).click();
	expect(browser.getCurrentUrl()).toContain("statistics");

  var newTotal = element(by.id('users'));
  var int1 = parseInt(total.getText,10);
  var int2 = parseInt(total.getText,10);
  var int2 = int2++;
  expect(int1 === int2);

  	element(by.name('logout')).click();

  });
/*
  it('Check Total Shares', function(){
    browser.get('http://127.0.0.1:60788/index.html#!/login');

    element.all(by.model('username')).first().sendKeys('test2@gmail.com');
    element.all(by.model('password')).first().sendKeys('password');
    element(by.name('login')).click();
    browser.sleep(1000);
    expect(browser.getCurrentUrl()).toContain("profile");
    expect(element(by.name('greeting')).getText()).toEqual('Hello test2@gmail.com!');

  element(by.name('tools')).click();
  element(by.name('statistics')).click();
	expect(browser.getCurrentUrl()).toContain("statistics");

  var total1 = element(by.id('shares'));

//

  element(by.name('companyName')).click();
	element(by.model('companyName')).sendKeys('KE');
	element(by.name('searchbtn')).click();

	expect(browser.getCurrentUrl()).toContain("viewSearch");
	var EC = protractor.ExpectedConditions;

	browser.driver.wait(function () {
		browser.wait(EC.visibilityOf(element(by.id('companyChart'))), 10000);
		return element(by.id('companyChart'));
	});

	expect(element(by.id('companyChart')).isDisplayed());
	expect(element(by.name('comp_name')).getText()).toEqual('KE');
	expect(element(by.name('price')).isDisplayed());
	expect(element(by.name('balance')).isDisplayed());

	browser.sleep(3000);
    element(by.name('buy')).click();
	element(by.name('buyShares')).sendKeys('5');
	element(by.name('buySubmit')).click();

  browser.sleep(2000);
  expect(element(by.name('errorMessage')).getText()).toEqual("Nice find! You successfully bought 5 shares of KE.");
  element(by.name('thanks')).click();
//
/*
  element(by.name('tools')).click();
  element(by.name('statistics')).click();
  expect(browser.getCurrentUrl()).toContain("statistics");

  var total2 = element(by.id('shares'));

  var int1 = parseInt(total1.getText,10);
  var int2 = parseInt(total2.getText,10);
  var int1 = int1 + 5;
  expect(int1 === int2);

//

  element(by.name('companyName')).click();
  element(by.model('companyName')).sendKeys('KE');
  element(by.name('searchbtn')).click();

  expect(browser.getCurrentUrl()).toContain("viewSearch");
  var EC = protractor.ExpectedConditions;

  browser.driver.wait(function () {
    browser.wait(EC.visibilityOf(element(by.id('companyChart'))), 10000);
    return element(by.id('companyChart'));
  });

  expect(element(by.id('companyChart')).isDisplayed());
  expect(element(by.name('comp_name')).getText()).toEqual('KE');
  expect(element(by.name('price')).isDisplayed());
  expect(element(by.name('balance')).isDisplayed());

  browser.sleep(2000);
  element(by.name('sell')).click();
  element(by.name('sellShares')).sendKeys('5');
  element(by.name('sellSubmit')).click();

  browser.sleep(2000);
  expect(element(by.name('errorMessage')).getText()).toEqual("Congrats! You successfully sold 1 shares of GOOG.");
  element(by.name('thanks')).click();

  browser.sleep(2000);

//

  //element(by.name('logout')).click();

  });
*/
});
