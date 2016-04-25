/**
 * Created by Mirek on 2015-07-01.
 */
export function applyMixin(source, target) {
    source.call(target.prototype);
}

export var helloMixin = (function () {

    function init(options) {
        this.name = 'World';
        if (options.sufix) {
            this.name = 'World ' + options.sufix;
        }
    }

    function hello() {
        return 'Hello ' + this.name;
    }

    return function () {
        this.hello = hello;
        this.helloMixinInitializer = init;
        return this;
    };
})();

/**
 * @class ObservableMixin
 * @mixin
 */
export var ObservableMixin = (function () {
    function init(options) {
        this.listeners = new Set();
        if (options.listenerValidator) {
            this.validator = options.listenerValidator;
        }
    }

    function addListener(listener) {
        if (this.validator) {
            this.validator(listener);
        }
        this.listeners.add(listener);
    }

    function removeListener(listener) {
        this.listeners.delete(listener);
    }

    function removeAllListeners() {
        this.listeners.clear();
    }

    function fireListeners(data) {
        for (let listener of this.listeners) {
            listener(data);
        }
    }

    return function () {
        this.ObservableMixinInitializer = init;
        this.addListener = addListener;
        this.removeListener = removeListener;
        this.removeAllListeners = removeAllListeners;
        this.fireListeners = fireListeners;
        return this;
    };
})();


export function mixinInitializer(target, options) {
    var constructor = target.constructor;
    var ownPropertyNames = Object.getOwnPropertyNames(constructor.prototype);
    for (var i = 0; i < ownPropertyNames.length; i++) {
        var obj = ownPropertyNames[i];
        if (obj.endsWith('Initializer')) {
            constructor.prototype[obj].call(target, options || {});
        }
    }
}