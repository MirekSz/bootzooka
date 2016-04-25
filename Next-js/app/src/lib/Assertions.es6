const Assertions = {

    required() {
        for (var i = 0; i < arguments.length; i++) {
            var arg = arguments[i];
            if (arg == undefined) {
                throw Error('Illegal object state - value required ');
            }
        }
    },

    type(object, type){
        if (!(object instanceof type)) {
            throw Error(`Object ${object} not instanceof ${type}`)
        }
    },

    promise(){
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                return resolve(4);
            }, 10);
        });
    },

    /**
     * @private
     */
    extend(target, source){
        target = target.prototype;
        source = source.prototype;

        Object.getOwnPropertyNames(source).forEach(function (name) {
            if (name !== "constructor") {
                Object.defineProperty(target, name, Object.getOwnPropertyDescriptor(source, name));
            }
        });
    }
};

export default Assertions;

