/**
 * Created by bstanislawski on 2016-03-30.
 */

class WindowOptions {

    /**
     * @param {String} windowTitle - wrapper title (like upper bar on the panel)
     * @param {String} title
     * @param {String} subtitle
     */
    constructor(windowTitle, title, subtitle) {
        this.windowTitle = windowTitle;
        this.title = title;
        this.subTitle = subtitle;
    }

}

export default WindowOptions;
