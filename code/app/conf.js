// conf.js

// Download Protractor at http://www.protractortest.org/#/tutorial

exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: [
	  /*'login/login_test.js',
	  'profile/profile_test.js',
	  'history/history_test.js',
	  'glossary/glossary_test.js',
	  'change-password/change-password_test.js',
	  'settings/settings_test.js',
	  'tutorial/tutorial_test.js',
	  'history/history_test.js',
	  'viewSearch/viewSearch_test.js',
    */
	  'banking/banking_test.js'
  ]
}
