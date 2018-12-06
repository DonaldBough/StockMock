describe('StockMock Banking', function() {
  it('should go to banking', function() {
    browser.get('http://127.0.0.1:60788/app/index.html#!/login');

	element.all(by.model('username')).first().sendKeys('user5@test.com');
	element.all(by.model('password')).first().sendKeys('hellothere');
	element(by.name('login')).click();
	browser.sleep(1000);
	expect(browser.getCurrentUrl()).toContain("profile");
	expect(element(by.name('greeting')).getText()).toEqual('Hello user5@test.com!');

	element(by.name('banking')).click();

	expect(browser.getCurrentUrl()).toContain("banking");

  });

  it('should deposit $1', function() {
	var bal;
	element(by.name('balance')).getText().then(function(text) {
		bal = text.substring(text.indexOf(":")+2, text.length);

		element(by.model('depositAmount')).sendKeys('1');
		element(by.name('depositSubmit')).click();

		browser.wait(protractor.ExpectedConditions.alertIsPresent(), 1000);
		expect(browser.switchTo().alert().getText()).toEqual("Are you sure you want to deposit $1 to the bank?");
		browser.switchTo().alert().accept();

		browser.sleep(2000);
		expect(element(by.name('errorMessage')).getText()).toEqual("Yay! Your funds were successfully transferred!");
		element(by.name('thanks')).click();
		browser.sleep(2000);

		var bal2;
		element(by.name('balance')).getText().then(function(text2) {
			bal2 = text2.substring(text2.indexOf(":")+2, text2.length);

			expect(bal2).not.toEqual(bal);
		});
	});
  });

  it('should deposit $10', function() {
  var bal;
  element(by.name('balance')).getText().then(function(text) {
    bal = text.substring(text.indexOf(":")+2, text.length);

    element(by.model('depositAmount')).sendKeys('10');
    element(by.name('depositSubmit')).click();

    browser.wait(protractor.ExpectedConditions.alertIsPresent(), 1000);
    expect(browser.switchTo().alert().getText()).toEqual("Are you sure you want to deposit $1 to the bank?");
    browser.switchTo().alert().accept();

    browser.sleep(2000);
    expect(element(by.name('errorMessage')).getText()).toEqual("Yay! Your funds were successfully transferred!");
    element(by.name('thanks')).click();
    browser.sleep(2000);

    var bal2;
    element(by.name('balance')).getText().then(function(text2) {
      bal2 = text2.substring(text2.indexOf(":")+2, text2.length);

      expect(bal2).not.toEqual(bal);
    });
  });
  });

  it('should deposit $50', function() {
  var bal;
  element(by.name('balance')).getText().then(function(text) {
    bal = text.substring(text.indexOf(":")+2, text.length);

    element(by.model('depositAmount')).sendKeys('50');
    element(by.name('depositSubmit')).click();

    browser.wait(protractor.ExpectedConditions.alertIsPresent(), 1000);
    expect(browser.switchTo().alert().getText()).toEqual("Are you sure you want to deposit $1 to the bank?");
    browser.switchTo().alert().accept();

    browser.sleep(2000);
    expect(element(by.name('errorMessage')).getText()).toEqual("Yay! Your funds were successfully transferred!");
    element(by.name('thanks')).click();
    browser.sleep(2000);

    var bal2;
    element(by.name('balance')).getText().then(function(text2) {
      bal2 = text2.substring(text2.indexOf(":")+2, text2.length);

      expect(bal2).not.toEqual(bal);
    });
  });
  });

  it('should deposit $100', function() {
  var bal;
  element(by.name('balance')).getText().then(function(text) {
    bal = text.substring(text.indexOf(":")+2, text.length);

    element(by.model('depositAmount')).sendKeys('100');
    element(by.name('depositSubmit')).click();

    browser.wait(protractor.ExpectedConditions.alertIsPresent(), 1000);
    expect(browser.switchTo().alert().getText()).toEqual("Are you sure you want to deposit $1 to the bank?");
    browser.switchTo().alert().accept();

    browser.sleep(2000);
    expect(element(by.name('errorMessage')).getText()).toEqual("Yay! Your funds were successfully transferred!");
    element(by.name('thanks')).click();
    browser.sleep(2000);

    var bal2;
    element(by.name('balance')).getText().then(function(text2) {
      bal2 = text2.substring(text2.indexOf(":")+2, text2.length);

      expect(bal2).not.toEqual(bal);
    });
  });
  });

  it('should deposit $500', function() {
  var bal;
  element(by.name('balance')).getText().then(function(text) {
    bal = text.substring(text.indexOf(":")+2, text.length);

    element(by.model('depositAmount')).sendKeys('500');
    element(by.name('depositSubmit')).click();

    browser.wait(protractor.ExpectedConditions.alertIsPresent(), 1000);
    expect(browser.switchTo().alert().getText()).toEqual("Are you sure you want to deposit $1 to the bank?");
    browser.switchTo().alert().accept();

    browser.sleep(2000);
    expect(element(by.name('errorMessage')).getText()).toEqual("Yay! Your funds were successfully transferred!");
    element(by.name('thanks')).click();
    browser.sleep(2000);

    var bal2;
    element(by.name('balance')).getText().then(function(text2) {
      bal2 = text2.substring(text2.indexOf(":")+2, text2.length);

      expect(bal2).not.toEqual(bal);
    });
  });
  });

  it('should deposit $1000', function() {
  var bal;
  element(by.name('balance')).getText().then(function(text) {
    bal = text.substring(text.indexOf(":")+2, text.length);

    element(by.model('depositAmount')).sendKeys('1000');
    element(by.name('depositSubmit')).click();

    browser.wait(protractor.ExpectedConditions.alertIsPresent(), 1000);
    expect(browser.switchTo().alert().getText()).toEqual("Are you sure you want to deposit $1 to the bank?");
    browser.switchTo().alert().accept();

    browser.sleep(2000);
    expect(element(by.name('errorMessage')).getText()).toEqual("Yay! Your funds were successfully transferred!");
    element(by.name('thanks')).click();
    browser.sleep(2000);

    var bal2;
    element(by.name('balance')).getText().then(function(text2) {
      bal2 = text2.substring(text2.indexOf(":")+2, text2.length);

      expect(bal2).not.toEqual(bal);
    });
  });
  });

  it('should withdraw $1', function() {
	var bal;
	element(by.name('balance')).getText().then(function(text) {
		bal = text.substring(text.indexOf(":")+2, text.length);

		element(by.model('withdrawAmount')).sendKeys('1');
		element(by.name('withdrawSubmit')).click();

		browser.wait(protractor.ExpectedConditions.alertIsPresent(), 1000);
		expect(browser.switchTo().alert().getText()).toEqual("Are you sure you want to withdraw $1 from the bank?");
		browser.switchTo().alert().accept();

		browser.sleep(2000);
		expect(element(by.name('errorMessage')).getText()).toEqual("Yay! Your funds were successfully transferred!");
		element(by.name('thanks')).click();
		browser.sleep(2000);

		var bal2;
		element(by.name('balance')).getText().then(function(text2) {
			bal2 = text2.substring(text2.indexOf(":")+2, text2.length);

			expect(bal).not.toEqual(bal2);
		});
	});
  });

  it('should withdraw $10', function() {
	var bal;
	element(by.name('balance')).getText().then(function(text) {
		bal = text.substring(text.indexOf(":")+2, text.length);

		element(by.model('withdrawAmount')).sendKeys('10');
		element(by.name('withdrawSubmit')).click();

		browser.wait(protractor.ExpectedConditions.alertIsPresent(), 1000);
		expect(browser.switchTo().alert().getText()).toEqual("Are you sure you want to withdraw $1 from the bank?");
		browser.switchTo().alert().accept();

		browser.sleep(2000);
		expect(element(by.name('errorMessage')).getText()).toEqual("Yay! Your funds were successfully transferred!");
		element(by.name('thanks')).click();
		browser.sleep(2000);

		var bal2;
		element(by.name('balance')).getText().then(function(text2) {
			bal2 = text2.substring(text2.indexOf(":")+2, text2.length);

			expect(bal).not.toEqual(bal2);
		});
	});
  });

  it('should withdraw $50', function() {
  var bal;
  element(by.name('balance')).getText().then(function(text) {
    bal = text.substring(text.indexOf(":")+2, text.length);

    element(by.model('withdrawAmount')).sendKeys('50');
    element(by.name('withdrawSubmit')).click();

    browser.wait(protractor.ExpectedConditions.alertIsPresent(), 1000);
    expect(browser.switchTo().alert().getText()).toEqual("Are you sure you want to withdraw $1 from the bank?");
    browser.switchTo().alert().accept();

    browser.sleep(2000);
    expect(element(by.name('errorMessage')).getText()).toEqual("Yay! Your funds were successfully transferred!");
    element(by.name('thanks')).click();
    browser.sleep(2000);

    var bal2;
    element(by.name('balance')).getText().then(function(text2) {
      bal2 = text2.substring(text2.indexOf(":")+2, text2.length);

      expect(bal).not.toEqual(bal2);
    });
  });
  });

  it('should withdraw $100', function() {
	var bal;
	element(by.name('balance')).getText().then(function(text) {
		bal = text.substring(text.indexOf(":")+2, text.length);

		element(by.model('withdrawAmount')).sendKeys('100');
		element(by.name('withdrawSubmit')).click();

		browser.wait(protractor.ExpectedConditions.alertIsPresent(), 1000);
		expect(browser.switchTo().alert().getText()).toEqual("Are you sure you want to withdraw $1 from the bank?");
		browser.switchTo().alert().accept();

		browser.sleep(2000);
		expect(element(by.name('errorMessage')).getText()).toEqual("Yay! Your funds were successfully transferred!");
		element(by.name('thanks')).click();
		browser.sleep(2000);

		var bal2;
		element(by.name('balance')).getText().then(function(text2) {
			bal2 = text2.substring(text2.indexOf(":")+2, text2.length);

			expect(bal).not.toEqual(bal2);
		});
	});
  });

  it('should withdraw $500', function() {
  var bal;
  element(by.name('balance')).getText().then(function(text) {
    bal = text.substring(text.indexOf(":")+2, text.length);

    element(by.model('withdrawAmount')).sendKeys('1');
    element(by.name('withdrawSubmit')).click();

    browser.wait(protractor.ExpectedConditions.alertIsPresent(), 1000);
    expect(browser.switchTo().alert().getText()).toEqual("Are you sure you want to withdraw $1 from the bank?");
    browser.switchTo().alert().accept();

    browser.sleep(2000);
    expect(element(by.name('errorMessage')).getText()).toEqual("Yay! Your funds were successfully transferred!");
    element(by.name('thanks')).click();
    browser.sleep(2000);

    var bal2;
    element(by.name('balance')).getText().then(function(text2) {
      bal2 = text2.substring(text2.indexOf(":")+2, text2.length);

      expect(bal).not.toEqual(bal2);
    });
  });
  });

  it('should withdraw $1000', function() {
  var bal;
  element(by.name('balance')).getText().then(function(text) {
    bal = text.substring(text.indexOf(":")+2, text.length);

    element(by.model('withdrawAmount')).sendKeys('1000');
    element(by.name('withdrawSubmit')).click();

    browser.wait(protractor.ExpectedConditions.alertIsPresent(), 1000);
    expect(browser.switchTo().alert().getText()).toEqual("Are you sure you want to withdraw $1 from the bank?");
    browser.switchTo().alert().accept();

    browser.sleep(2000);
    expect(element(by.name('errorMessage')).getText()).toEqual("Yay! Your funds were successfully transferred!");
    element(by.name('thanks')).click();
    browser.sleep(2000);

    var bal2;
    element(by.name('balance')).getText().then(function(text2) {
      bal2 = text2.substring(text2.indexOf(":")+2, text2.length);

      expect(bal).not.toEqual(bal2);
    });
  });
  });

  it('should reject withdraw too much money', function() {
	element(by.model('withdrawAmount')).sendKeys('1501');
	element(by.name('withdrawSubmit')).click();

	browser.sleep(2000);
	expect(element(by.name('errorMessage')).getText()).toEqual("Sorry! The maximum ammount you can transfer is $1,500! Try entering an amount less than or equal to $1,500.");
	element(by.name('thanks')).click();
	browser.sleep(2000);
  });

  it('should reject withdraw not enough money', function() {
	element(by.model('withdrawAmount')).sendKeys('0');
	element(by.name('withdrawSubmit')).click();

	browser.sleep(2000);
	expect(element(by.name('errorMessage')).getText()).toEqual("You can't transfer $0! Try entering an amount greater than zero!");
	element(by.name('thanks')).click();
	browser.sleep(2000);
  });

  it('should reject deposit too much money', function() {

	element(by.model('depositAmount')).sendKeys('1000000');
	element(by.name('depositSubmit')).click();

	browser.sleep(2000);
	expect(element(by.name('errorMessage')).getText()).toEqual("Whoops... You cannot transfer more money than you have! Try transfering less!");
	element(by.name('thanks')).click();
	browser.sleep(2000);
  });

  it('should reject deposit not enough money', function() {
	element(by.model('depositAmount')).sendKeys('0');
	element(by.name('depositSubmit')).click();

	browser.sleep(2000);
	expect(element(by.name('errorMessage')).getText()).toEqual("You can't transfer $0! Try entering an amount greater than zero!");
	element(by.name('thanks')).click();
	browser.sleep(2000);
  });

  it('should load tutorial for linking bank account', function() {
	browser.sleep(2000);
	expect(element(by.name('banktutorial')).isDisplayed());
	element(by.name('account')).click();
	element(by.name('logout')).click();
  });

});
