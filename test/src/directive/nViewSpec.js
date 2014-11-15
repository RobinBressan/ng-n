/*global define,describe,it,beforeEach,expect,inject,jasmine*/

(function() {
    'use strict';

    describe('Directive: nView', function() {

        var $compile,
            $rootScope,
            $scope,
            $n,
            element;

        beforeEach(module('ngN'));

        beforeEach(inject(function($injector) {
            $compile = $injector.get('$compile');
            $n = $injector.get('$n');
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();

            element = $compile('<n-view><p>{{ notification.title() }}</p></n-view>')($scope);
            $scope.$digest();
        }));

        it('should generate view based on the non expired notification', function() {
            var n1 = $n({ title: 'test' });
            n1.save();

            var n2 = $n({ title: 'test2' });
            n2.save();

            $scope.$digest();

            expect(element.find('p').length).toBe(2);

            expect(element.find('p').eq(0).html()).toContain('test');
            expect(element.find('p').eq(1).html()).toContain('test2');
        });
    });
}());
