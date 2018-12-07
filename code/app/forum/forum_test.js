describe('StockMock Forum', function() {
  it('should go to forum', function() {
    browser.get('http://127.0.0.1:60788/app/index.html#!/forum');

	element.all(by.model('username')).first().sendKeys('user5@test.com');
	element.all(by.model('password')).first().sendKeys('hellothere');
	element(by.name('login')).click();
	browser.sleep(1000);
	expect(browser.getCurrentUrl()).toContain("profile");
	expect(element(by.name('greeting')).getText()).toEqual('Hello user5@test.com!');

	element(by.name('tools')).click();
	element(by.name('forum')).click();

	expect(browser.getCurrentUrl()).toContain("forum");


  });

  it('should check for banking post button', function() {

    expect(element(by.id('postButtonBanking')))

  });

  it('should  check for mutual funds post button', function() {

    expect(element(by.id('postButtonMF')))

  });

  it('Should check for Day trading post button', function() {

    expect(element(by.id('postButton')))

  });

  it('Should log out', function() {
    element(by.name('account')).click();
    element(by.name('logout')).click();
  });
});
