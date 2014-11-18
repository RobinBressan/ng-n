define(function(require) {
    'use strict';

    function nView ($n, $compile) {
        return {
            restrict: 'E',
            scope: true,
            compile: function(element, attrs, transclude) {
                element.html([
                    '<div ng-repeat="notification in $n.registry()" ng-if="!notification.expired()">',
                    element.html(),
                    '</div>'
                ].join(''));

                return function(scope) {
                    $compile(element.html())(scope);
                    scope.$n = $n;
                }
            }
        };
    };

    nView.$inject = ['$n', '$compile'];

    return nView;
});
