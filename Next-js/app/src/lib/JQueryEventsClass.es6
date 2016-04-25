/**
 * Created by bstanislawski on 2015-11-12.
 */

class JQueryEventsClass {

    addListenerOnce(event, target, handler) {
        target.off();
        target.bind(event, handler);
    }

}

export const jQueryEventRegistry = new JQueryEventsClass();