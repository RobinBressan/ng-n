define(function(require) {
    'use strict';

    function merge(src1, src2) {
        var result = {},
            i;

        for (i in src1) {
            result[i] = src1[i];
        }

        for (i in src2) {
            if (result[i] === undefined) {
                result[i] = src2[i];
            }
        }

        return result;
    }

    function wrap(object, method, callback) {
        return (function(original) {
            return callback(original);
        }(object[method]));
    }

    function n($timeout) {
        var registry = [],
            defaultConfig = {
                timeout: -1
            },
            hashKeyIndex = -1;

        function factory(config) {
            config = config || {};

            var callbacks = {},
                saved = false,
                expired = false;

            model = {
                expired: function() {
                    return expired;
                },

                save: function(delay) {
                    if (saved) {
                        throw new Error('You can not save two times the same notification');
                    }

                    if (delay > 0) {
                        $timeout(function() {
                            model.save();
                        }, delay);
                        return model;
                    }

                    if (config.timeout > -1) {
                        $timeout(function() {
                            model.kill();
                        }, config.timeout);
                    }

                    model.$$hashKey = '_n_' + (++hashKeyIndex);
                    registry.push(model);

                    saved = true;
                    model.trigger('save');

                    return model;
                },

                kill: function() {
                    if (expired) {
                        throw new Error('You can not kill two times the same notification');
                    }

                    expired = true;
                    model.trigger('kill');
                },

                on: function(event, callback) {
                    if (typeof(callback) !== 'function') {
                        return;
                    }

                    if (!callbacks[event]) {
                        callbacks[event] = [];
                    }

                    callbacks[event].push(callback);

                    return model;
                },

                trigger: function(event) {
                    if (!callbacks[event]) {
                        return;
                    }

                    for (var i in callbacks[event]) {
                        callbacks[event][i](model);
                    }

                    return model;
                }
            };

            config = merge(config, defaultConfig);

            require('../util/configurable')(model, config);

            return model;
        }

        factory.extend = function(config) {
            return (function(defaultConfig) {
                var f = function(config) {
                    return factory(merge(config, defaultConfig));
                };

                f.extend = wrap(factory, 'extend', function(extend) {
                    return function(config) {
                        return extend(merge(config, defaultConfig));
                    };
                });

                f.registry = factory.registry;

                return f;
            }(merge(config, defaultConfig)));
        };

        factory.registry = function() {
            return registry;
        };

        return factory;
    };

    n.$inject = ['$timeout'];

    return n;
});
