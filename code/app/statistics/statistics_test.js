describe('StockMock Statistics', function() {
  it('should go to Statistics', function() {
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

});