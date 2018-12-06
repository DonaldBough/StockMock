describe('StockMock Login', function() {
  it('should deny incorrect password', function() {
    browser.get('http://127.0.0.1:60788/app/index.html#!/login');

	element.all(by.model('username')).first().sendKeys('user5@test.com');
	element.all(by.model('password')).first().sendKeys('hellothere');
	element(by.name('login')).click();
	browser.sleep(1000);
	expect(browser.getCurrentUrl()).toContain("profile");
	expect(element(by.name('greeting')).getText()).toEqual('Hello user5@test.com!');
	  
	element(by.name('account')).click();
	element(by.name('change-password')).click();
	  
	browser.sleep(1000);
	expect(browser.getCurrentUrl()).toContain("change-password");
	  
	element.all(by.model('username')).first().sendKeys('user5@test.com');
	element.all(by.model('oldPassword')).first().sendKeys('hellohello');
	element.all(by.model('newPassword')).first().sendKeys('hellohello');
	element(by.name('submit2')).click();
	  
	browser.sleep(2000);
	expect(element(by.name('errorMessage')).getText()).toEqual("Looks like you typed your username or password incorrectly. Please try again.");
	element(by.name('thanks')).click();
  });
	
  it('should deny too short password', function() {
	browser.get('http://127.0.0.1:60788/app/index.html#!/change-password');
	element.all(by.model('username')).first().sendKeys('user5@test.com');
	element.all(by.model('oldPassword')).first().sendKeys('hellothere');
	element.all(by.model('newPassword')).first().sendKeys('1234567');
	element(by.name('submit2')).click();
	  
	browser.sleep(2000);
	expect(element(by.name('errorMessage')).getText()).toEqual("Please enter a password that is between 8 and 30 characters.");
	element(by.name('thanks')).click();
  });
	
  it('should deny too long password', function() {
	browser.get('http://127.0.0.1:60788/app/index.html#!/change-password');
	element.all(by.model('username')).first().sendKeys('user5@test.com');
	element.all(by.model('oldPassword')).first().sendKeys('hellothere');
	element.all(by.model('newPassword')).first().sendKeys('1234567890123456789012345678901');
	element(by.name('submit2')).click();
	  
	browser.sleep(2000);
	expect(element(by.name('errorMessage')).getText()).toEqual("Please enter a password that is between 8 and 30 characters.");
	element(by.name('thanks')).click();
  });
	  
  it('should successfully change password', function() {
	browser.get('http://127.0.0.1:60788/app/index.html#!/change-password');
	element.all(by.model('username')).first().sendKeys('user5@test.com');
	element.all(by.model('oldPassword')).first().sendKeys('hellothere');
	element.all(by.model('newPassword')).first().sendKeys('hellohello');
	element(by.name('submit2')).click();
	  
	browser.sleep(2000);
	expect(element(by.name('errorMessage')).getText()).toEqual("Your password has been successfully updated. Don't forget it!");
	element(by.name('thanks')).click();
	  
  });
	
  it('should successfully log out', function() {
	  browser.sleep(2000);
	  element(by.name('account')).click();
	  element(by.name('logout')).click();
	  
	  browser.sleep(1000);
	  expect(browser.getCurrentUrl()).toContain("login");
	  
	  element.all(by.model('username')).first().sendKeys('user5@test.com');
	  element.all(by.model('password')).first().sendKeys('hellohello');
	  element(by.name('login')).click();
	  browser.sleep(2000);
	  expect(browser.getCurrentUrl()).toContain("profile");
	  expect(element(by.name('greeting')).getText()).toEqual('Hello user5@test.com!');
	  
	  browser.sleep(1000);
	  
	  element(by.name('account')).click();
	  element(by.name('change-password')).click();
	  
	  browser.sleep(1000);
	  expect(browser.getCurrentUrl()).toContain("change-password");
	  
	  element.all(by.model('username')).first().sendKeys('user5@test.com');
	  element.all(by.model('oldPassword')).first().sendKeys('hellohello');
	  element.all(by.model('newPassword')).first().sendKeys('hellothere');
	  element(by.name('submit2')).click();
	  
	  browser.sleep(2000);
	  expect(element(by.name('errorMessage')).getText()).toEqual("Your password has been successfully updated. Don't forget it!");
	  element(by.name('thanks')).click();
	  
	  browser.sleep(2000);
	  
	  element(by.name('account')).click();
	  element(by.name('logout')).click();
  });
});

