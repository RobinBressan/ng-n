/*global angular */
define(function(require) {
    'use strict';

    var module = angular.module('ngN', []);

    module.factory('$n', require('service/n'));

    module.directive('nView', require('directive/nView'));
    module.directive('transcludeTemplate', require('directive/transcludeTemplate'));

    return module;
});
