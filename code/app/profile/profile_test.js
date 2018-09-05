describe('StockMock Profile', function() {
  it('should go to profile', function() {
    browser.get('http://127.0.0.1:60788/app/index.html#!/login');

	element.all(by.model('username')).first().sendKeys('user5@test.com');
	element.all(by.model('password')).first().sendKeys('hellothere');
	element(by.name('login')).click();
	browser.sleep(1000);
	expect(browser.getCurrentUrl()).toContain("profile");
	expect(element(by.name('greeting')).getText()).toEqual('Hello user5@test.com!');
	  
	browser.get('http://127.0.0.1:60788/app/index.html#!/settings');
	
	element(by.name('profile')).click();
	  
	expect(browser.getCurrentUrl()).toContain("profile");
	expect(element(by.name('greeting')).getText()).toEqual('Hello user5@test.com!');
	element(by.name('account')).click();
	element(by.name('logout')).click();
	
  });
});