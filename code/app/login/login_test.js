describe('StockMock Login', function() {

  it('should deny incorrect password', function() {
    browser.get('http://127.0.0.1:60788/app/index.html#!/login');

	element.all(by.model('username')).first().sendKeys('user5@test.com');
	element.all(by.model('password')).first().sendKeys('hellohello');
	
	element(by.name('login')).click();
	  
	browser.sleep(2000);
	expect(element(by.name('errorMessage')).getText()).toEqual("Looks like you typed your username or password incorrectly. Please try again.");
	element(by.name('thanks')).click();
	
  });

  it('should deny user does not exist', function() {
    browser.get('http://127.0.0.1:60788/app/index.html#!/login');

	element.all(by.model('username')).first().sendKeys('blahblahblah@test.com');
	element.all(by.model('password')).first().sendKeys('blahblahblah');
	
	element(by.name('login')).click();
	  
	browser.sleep(2000);
	expect(element(by.name('errorMessage')).getText()).toEqual("Sorry, looks like that user doesn't exist. Please create account a new account.");
	element(by.name('thanks')).click();
  });

  it('should successfully sign up', function() {
    browser.get('http://127.0.0.1:60788/app/index.html#!/login');

	element.all(by.model('create_username')).sendKeys('blahblahblah4@test.com');
	element.all(by.model('create_password')).sendKeys('blahblahblah');
	element.all(by.model('validate')).sendKeys('blahblahblah');
	
	element(by.name('signup')).click();
	browser.sleep(1000);
	expect(browser.getCurrentUrl()).toContain("tutorial");
	
	element(by.name('account')).click();
	element(by.name('delete')).click();
	browser.sleep(1000);
	browser.wait(protractor.ExpectedConditions.alertIsPresent(), 1000);
	expect(browser.switchTo().alert().getText()).toEqual("Are you sure you want to delete your account?");
	browser.switchTo().alert().accept();
	  
	browser.sleep(2000);
	expect(element(by.name('errorMessage')).getText()).toEqual("User was successfully deleted.");
	element(by.name('thanks')).click();
  });

  it('should deny user already exists', function() {
    browser.get('http://127.0.0.1:60788/app/index.html#!/login');

	element.all(by.model('create_username')).sendKeys('blahblahblah2@test.com');
	element.all(by.model('create_password')).sendKeys('blahblahblah');
	element.all(by.model('validate')).sendKeys('blahblahblah');
	
	element(by.name('signup')).click();
	  
	browser.sleep(2000);
	expect(element(by.name('errorMessage')).getText()).toEqual("Hey! That user already exists.");
	element(by.name('thanks')).click();
  });

  it('should deny invalid email', function() {
    browser.get('http://127.0.0.1:60788/app/index.html#!/login');

	element.all(by.model('create_username')).sendKeys('hello');
	element.all(by.model('create_password')).sendKeys('blahblahblah');
	element.all(by.model('validate')).sendKeys('blahblahblah');
	
	element(by.name('signup')).click();
	  
	browser.sleep(2000);
	expect(element(by.name('errorMessage')).getText()).toEqual("Looks like you didn't enter a valid email. Please enter an email as your username.");
	element(by.name('thanks')).click();
  });

  it('should deny too short email', function() {
    browser.get('http://127.0.0.1:60788/app/index.html#!/login');

	element.all(by.model('create_username')).sendKeys('@.');
	element.all(by.model('create_password')).sendKeys('blahblahblah');
	element.all(by.model('validate')).sendKeys('blahblahblah');
	
	element(by.name('signup')).click();
	
	browser.sleep(2000);
	expect(element(by.name('errorMessage')).getText()).toEqual("Please enter a username that is between 3 and 254 characters.");
	element(by.name('thanks')).click();
  });

  it('should deny too long email', function() {
    browser.get('http://127.0.0.1:60788/app/index.html#!/login');
	element.all(by.model('create_username')).sendKeys('abbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb@id.com');
	element.all(by.model('create_password')).sendKeys('blahblahblah');
	element.all(by.model('validate')).sendKeys('blahblahblah');
	
	element(by.name('signup')).click();
	  
	browser.sleep(2000);
	expect(element(by.name('errorMessage')).getText()).toEqual("Please enter a username that is between 3 and 254 characters.");
	element(by.name('thanks')).click();
  });

  it('should deny too short password', function() {
    browser.get('http://127.0.0.1:60788/app/index.html#!/login');

	element.all(by.model('create_username')).sendKeys('blahblahblah4@test.com');
	element.all(by.model('create_password')).sendKeys('1234567');
	element.all(by.model('validate')).sendKeys('1234567');
	
	element(by.name('signup')).click();
	  
	browser.sleep(2000);
	expect(element(by.name('errorMessage')).getText()).toEqual("Please enter a password that is between 8 and 30 characters.");
	element(by.name('thanks')).click();
  });

  it('should deny too long password', function() {
    browser.get('http://127.0.0.1:60788/app/index.html#!/login');

	element.all(by.model('create_username')).sendKeys('blahblahblah4@test.com');
	element.all(by.model('create_password')).sendKeys('1234567890123456789012345678901');
	element.all(by.model('validate')).sendKeys('1234567890123456789012345678901');
	
	element(by.name('signup')).click();
	  
	browser.sleep(2000);
	expect(element(by.name('errorMessage')).getText()).toEqual("Please enter a password that is between 8 and 30 characters.");
	element(by.name('thanks')).click();
  });

  it('should deny passwords do not match', function() {
    browser.get('http://127.0.0.1:60788/app/index.html#!/login');

	element.all(by.model('create_username')).sendKeys('blahblahblah4@test.com');
	element.all(by.model('create_password')).sendKeys('blahblahblah');
	element.all(by.model('validate')).sendKeys('blagblagblag');
	
	element(by.name('signup')).click();
	  
	browser.sleep(2000);
	expect(element(by.name('errorMessage')).getText()).toEqual("Oops! Looks like those passwords don't match. Please try typing them in again.");
	element(by.name('thanks')).click();
  });
	
  it('should successfully login', function() {
    browser.get('http://127.0.0.1:60788/app/index.html#!/login');

	element.all(by.model('username')).first().sendKeys('user5@test.com');
	element.all(by.model('password')).first().sendKeys('hellothere');
	element(by.name('login')).click();
	browser.sleep(1000);
	expect(browser.getCurrentUrl()).toContain("profile");
	expect(element(by.name('greeting')).getText()).toEqual('Hello user5@test.com!');
	element(by.name('account')).click();
	element(by.name('logout')).click();
	
  });
});