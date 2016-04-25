/**
 * Created by Mirek on 2015-06-16.
 */
class ContentManager {
    constructor() {
        this.currentVisibleElements = new Map();
    }

    renderElementTo(element, target) {
        var dest = $('#' + target);
        element.renderTo(dest);
        this.currentVisibleElements[target] = element;
    }

}

export default new ContentManager();