describe('StockMock Settings', function() {
  it('should successfully open settings', function() {
    browser.get('http://127.0.0.1:60788/app/index.html#!/login');

	element.all(by.model('username')).first().sendKeys('user5@test.com');
	element.all(by.model('password')).first().sendKeys('hellothere');
	element(by.name('login')).click();
	browser.sleep(1000);
	expect(browser.getCurrentUrl()).toContain("profile");
	element(by.name('settings')).click();
	browser.sleep(1000);
	expect(browser.getCurrentUrl()).toContain("settings");
  });
	
  it('should successfully delete account', function() {
	element(by.name('account')).click();
	element(by.name('delete')).click();
	browser.sleep(1000);
	browser.wait(protractor.ExpectedConditions.alertIsPresent(), 1000);
	expect(browser.switchTo().alert().getText()).toEqual("Are you sure you want to delete your account?");
	browser.switchTo().alert().accept();
	  
	browser.sleep(2000);
	expect(element(by.name('errorMessage')).getText()).toEqual("User was successfully deleted.");
	element(by.name('thanks')).click();
	browser.sleep(2000);
	  
	expect(browser.getCurrentUrl()).toContain("login");
	  
	element.all(by.model('username')).first().sendKeys('user5@test.com');
	element.all(by.model('password')).first().sendKeys('hellothere');
	element(by.name('login')).click();
	  
	browser.sleep(2000);
	expect(element(by.name('errorMessage')).getText()).toEqual("Sorry, looks like that user doesn't exist. Please create account a new account.");
	element(by.name('thanks')).click();
	  
	element.all(by.model('create_username')).sendKeys('user5@test.com');
	element.all(by.model('create_password')).sendKeys('hellothere');
	element.all(by.model('validate')).sendKeys('hellothere');
	
	element(by.name('signup')).click();
	browser.sleep(1000);
	expect(browser.getCurrentUrl()).toContain("tutorial");
	
  });
	
  it('should display tax documents', function() {
	element(by.name('settings')).click();
	browser.sleep(1000);
	expect(browser.getCurrentUrl()).toContain("settings");
	  
	expect(element(by.name("taxdoc")).isDisplayed());
	expect(element(by.name("formlink")).isDisplayed());
	  
	element(by.name('account')).click();
	element(by.name('logout')).click();
	
  });
});