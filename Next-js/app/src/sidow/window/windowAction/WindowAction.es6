/**
 * Created by bartosz on 02.06.15.
 *
 * Option class
 */
import BaseRendering from'../../../lib/rendering/BaseRendering';
import windowActionTemplate from './window_action.hbs';

class WindowAction extends BaseRendering {

    /**
     * @parma {Object} attrs
     * @param {String} id
     * @param {String} text - action label text
     * @param {Function} handler - windowAction handler
     * @param {Object} [attrs] - attributes
     * @param {String} [attrs.state] - state of the windowAction (ex. success, danger, warning..)
     * @param {String} [attrs.icon] - icon of the action
     */
    constructor(id, text, handler, attrs) {
        super();
        this.id = id;
        this.text = text;
        this.handler = handler;

        if (attrs) {
            this.icon = attrs.icon;
            this.state = attrs.state;
        }
    }

    setWindowContext(context) {
        this.contextWindow = context;
    }

    renderToImpl(target) {
        this.target = target;
        let snippet = windowActionTemplate(this);

        this.target.html(snippet);
    }

    disposeImpl(target) {
    }

    /**
     * @param {UIListenerBinder} uIListenerBinder
     */
    addUIListenersImpl(uIListenerBinder) {
        var button = this.target;

        uIListenerBinder.addClick(this.target.find('button.btn'), event => {
            this.handler(event, this);
        });
    }

}

export default WindowAction;
