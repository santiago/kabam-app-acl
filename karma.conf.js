// Karma configuration
// Generated on Tue Sep 17 2013 15:49:52 GMT+0700 (WIT)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'public/bower_components/jquery/jquery.js',
      'public/bower_components/angular/angular.js',
      'public/bower_components/angular-resource/angular-resource.js',
      'public/bower_components/angular-cookies/angular-cookies.js',
      'public/bower_components/angular-sanitize/angular-sanitize.js',
      'public/bower_components/kabam-core-web-frontend/public/components/ui-router/angular-ui-router.js',
      'public/bower_components/kabam-core-web-frontend/public/components/ui-router/stateDirectives.js',
      'public/bower_components/ng-grid/ng-grid-2.0.7.debug.js',
      'public/bower_components/kabam-core-web-frontend/public/components/config/*.js',
      'public/bower_components/kabam-core-web-frontend/public/components/auth/main.js',
      'public/bower_components/kabam-core-web-frontend/public/components/auth/controllers/main.js',
      'public/bower_components/kabam-core-web-frontend/public/components/auth/services/**/*.js',
      'public/group/services.js',
      'public/group/main.js',
      'public/group/controllers.js',
      'public/loader.js',
      'public/bower_components/kabam-core-web-frontend/public/components/kabam/**/*.js',

      //Testing
      'public/bower_components/chai/chai.js',
      'public/bower_components/angular-mocks/angular-mocks.js',
      'test/unit/**/*Spec.js'
    ],


    // list of files to exclude
    exclude: [

    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
