define(function(require) {
    'use strict';

    function nView ($n) {
        return {
            restrict: 'E',
            transclude: true,
            scope: true,
            template: '<div ng-repeat="notification in $n.registry()" ng-if="!notification.expired()" transclude-template></div>',
            link: function(scope) {
                scope.$n = $n;
            }
        };
    };

    nView.$inject = ['$n'];

    return nView;
});
