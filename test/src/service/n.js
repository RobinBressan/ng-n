/*global define,describe,it,beforeEach,expect,inject,jasmine,waitsFor,runs*/

(function() {
    'use strict';

    describe('Service: $n', function() {

        var $n,
            $timeout;

        beforeEach(module('ngN'));

        beforeEach(inject(function($injector) {
            $n = $injector.get('$n');
            $timeout = $injector.get('$timeout');
        }));

        it('should add notification to $n.registry() when save is called', function() {
            var notification = $n();

            notification.save();

            var notification2 = $n({ title: 'test' });
            notification2.save();

            expect($n.registry().length).toBe(2);
            expect($n.registry()[0]).toBe(notification);
            expect($n.registry()[1]).toBe(notification2);
            expect($n.registry()[0].title).toBeUndefined();
            expect($n.registry()[1].title()).toBe('test');
        });

        it('should produce configurable notification', function() {
            var notification = $n();

            expect(notification.title).toBeUndefined();

            notification = $n({ title: 'test' });

            expect(notification.timeout()).toBe(-1);
            expect(notification.title()).toBe('test');
            notification.title('Hola');
            expect(notification.title()).toBe('Hola');
        });

        it('should add a timeout when save is called and timeout() was called with a positive integer', function() {
            var notification = $n();

            spyOn(notification, 'kill').andCallThrough();

            notification
                .timeout(200)
                .save();

            expect(notification.kill).not.toHaveBeenCalled();
            $timeout.flush();
            expect(notification.kill).toHaveBeenCalled();
        });

        it('should add a timeout when save is called with a positive integer', function() {
            var notification = $n();

            spyOn(notification, 'save').andCallThrough();

            notification.save(200);

            expect(notification.save.calls.length).toBe(1);
            $timeout.flush();
            expect(notification.save.calls.length).toBe(2);
        });

        it('should marked the notification as expired and trigger an event when kill is called', function() {
            var notification = $n(),
                onKill = jasmine.createSpy('onKill');

            expect(notification.expired()).toBe(false);
            notification.on('kill', onKill);
            notification.kill();

            expect(notification.expired()).toBe(true);
            expect(onKill).toHaveBeenCalledWith(notification);
        });

        it('should call all listeners when trigger is called', function() {
            var notification = $n(),
                onCustomEvent = jasmine.createSpy('onCustomEvent'),
                onCustomEvent2 = jasmine.createSpy('onCustomEvent2'),
                onCustom2Event = jasmine.createSpy('onCustom2Event');

            notification.on('customEvent', onCustomEvent);
            notification.on('customEvent', onCustomEvent2);
            notification.on('custom2Event', onCustom2Event);

            expect(onCustomEvent).not.toHaveBeenCalled();
            expect(onCustomEvent2).not.toHaveBeenCalled();
            expect(onCustom2Event).not.toHaveBeenCalled();

            notification.trigger('customEvent');

            expect(onCustomEvent).toHaveBeenCalledWith(notification);
            expect(onCustomEvent2).toHaveBeenCalledWith(notification);
            expect(onCustom2Event).not.toHaveBeenCalled();

            notification.trigger('custom2Event');
            expect(onCustom2Event).toHaveBeenCalledWith(notification);
        });

        it('should produce custom factory when extend is called', function() {
            var factory = $n.extend({ title: 'default' }),
                notification = factory();

            expect(notification.title).toEqual(jasmine.any(Function));
            expect(notification.title()).toBe('default');
            notification.title('Hola');
            expect(notification.title()).toBe('Hola');
            notification.save();

            expect($n.registry()[0]).toBe(notification);

            var factory2 = factory.extend({ content: '' }),
                notification2 = factory2();

            expect(notification2.title).toEqual(jasmine.any(Function));
            expect(notification2.title()).toBe('default');
            notification2.title('Hola');
            expect(notification2.title()).toBe('Hola');
            expect(notification2.content).toEqual(jasmine.any(Function));
            expect(notification2.content()).toBe('');
            notification2.content('Bye');
            expect(notification2.content()).toBe('Bye');
            notification2.save();

            expect($n.registry()[1]).toBe(notification2);

            expect($n.registry()).toBe(factory2.registry());
        });
    });
}());
