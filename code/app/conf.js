// conf.js

// Download Protractor at http://www.protractortest.org/#/tutorial

exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: [
<<<<<<< HEAD
	  /*'login/login_test.js',
	  'profile/profile_test.js',
=======
	  /*'profile/profile_test.js',
>>>>>>> cabbbd87cdab174ff4b87d5b14e45a42525daa5f
	  'history/history_test.js',
	  'settings/settings_test.js',
	  'tutorial/tutorial_test.js',
	  'history/history_test.js',
	  'viewSearch/viewSearch_test.js',
<<<<<<< HEAD
    */
	  'banking/banking_test.js'
=======
	  */
	 //'login/login_test.js',
	 //'banking/banking_test.js'
	 //'change-password/change-password_test.js'
	 //'glossary/glossary_test.js'
>>>>>>> cabbbd87cdab174ff4b87d5b14e45a42525daa5f
  ]
}
