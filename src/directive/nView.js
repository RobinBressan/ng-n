define(function(require) {
    'use strict';

    function nView ($n, $compile) {
        return {
            restrict: 'E',
            scope: true,
            compile: function(element, attrs, transclude) {
                element.html([
                    '<div ng-repeat="notification in $n.registry()" ng-show="!notification.expired()">',
                    element.html(),
                    '</div>'
                ].join(''));

                return function(scope) {
                    $compile(element.html())(scope);
                    scope.$n = $n;

                    scope.$on('$destroy', function() {
                        scope.$n = null;
                    });
                }
            }
        };
    };

    nView.$inject = ['$n', '$compile'];

    return nView;
});
