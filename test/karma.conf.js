module.exports = function (config) {
    "use strict";

    config.set({
        basePath: '../',
        browsers: [process.env.CI ? 'PhantomJS' : 'Chrome'],
        files: [
            {pattern: 'bower_components/angular/angular.js', included: true},
            {pattern: 'bower_components/angular-mocks/angular-mocks.js', included: true},
            {pattern: 'ng-n.min.js', included: true},

            // test files
            {pattern: 'test/src/**/*.js', included: true},
        ],
        frameworks: ['jasmine']
    });
};
