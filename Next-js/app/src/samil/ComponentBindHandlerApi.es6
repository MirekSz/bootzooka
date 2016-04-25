"use strict";
/**
 * Created by Mirek on 2016-01-21.
 */
import ComponentEventType from './bindHandler/ComponentEventType';
class ComponentBindHandlerApi {
    /**
     *
     * @param {BindHandler} bindHandler
     * @param {BaseGUIComponent} component
     */
    constructor(bindHandler, component) {
        this.bindHandler = bindHandler;
        this.component = component;
    }

    valueModified(value) {
        this.bindHandler.componentEventListener({
            source: this.component,
            eventType: ComponentEventType.VALUE_MODIFIED,
            value
        });
    }

    setValue(value) {
//        if (value == undefined) { to co ma byc
//            value = this.getValue();
//        }
        this.valueModified(value);
        this.bindHandler.componentEventListener({
            source: this.component,
            eventType: ComponentEventType.VALUE_CHANGE,
            value
        });
    }

    setActive() {
        this.bindHandler.componentEventListener({
            source: this.component,
            eventType: ComponentEventType.ACTIVATION,
            value: true
        });
    }

    setDeactive() {
        this.bindHandler.componentEventListener({
            source: this.component,
            eventType: ComponentEventType.ACTIVATION,
            value: false
        });
    }

}

export default ComponentBindHandlerApi;
