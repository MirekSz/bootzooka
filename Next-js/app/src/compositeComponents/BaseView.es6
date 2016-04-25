"use strict";
/**
 * Created by Mirek on 2015-07-01.
 */
class BaseView {
    constructor() {

    }

    /**
     * @protected
     * @param {String} id
     */
    getDOMElement(id) {
        return $(`[id='${id}']`);
    }

    /**
     * @protected
     * @param {jQuery} container
     * @param {String} id
     * @returns {jQuery}
     */
    getDOMElementFromContainer(container, id) {
        return container.find(`[id='${id}']`);
    }

    /**
     * Create ids from (1,2,3) -> 1_2_3
     *
     * @param args
     * @returns {string}
     */
    static createLocationId(...args) {
        var location = '';
        for (var i = 0; i < args.length; i++) {
            var obj = args[i];
            if (i !== 0) {
                location += '_';
            }
            location += obj;
        }
        return location;
    }

}

export default BaseView;
