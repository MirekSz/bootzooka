"use strict";
/**
 * Created by Mirek on 2015-08-25.
 */
class EventBusClass {

    constructor() {
        this.listeners = new Map();
    }

    addListener(eventName, callback) {
        if (!this.listeners.get(eventName)) {
            this.listeners.set(eventName, new Set());
        }
        this.listeners.get(eventName).add(callback);
    }

    addListenerOnce(eventName, callback) {
        if (!this.listeners.get(eventName)) {
            this.listeners.set(eventName, new Set());
            this.listeners.get(eventName).add(callback);
        }
    }

    remove(eventName, callback) {
        var listeners = this.listeners.get(eventName);
        listeners.delete(callback);
    }

    send(eventName, obj) {
        var listeners = this.listeners.get(eventName);
        if (listeners) {
            for (let listener of listeners) {
                listener(obj);
            }
        }
    }
}

export const eventBus = new EventBusClass();

export const events = {
    VIEW: {
        ID_INFOS: 'ID_INFOS',
        ID_BEAN: 'IdBean'
    },
    GLOBAL_EVENT: {
        LOGOUT: 'logout',
        SHOW_ERROR: 'showError',
        POST_DONE: 'postDone',
        ASYNCH_START: 'asynchStart',
        ASYNCH_END: 'asynchEnd'
    },
    SAMIL_EVENTS: {
        COMPONENT_RENDERED: 'componentRendered'
    },
    WINDOW: {
        TAB_SHOWN: 'tabShown',
        WINDOW_SHOWN: 'windowShown',
        ANIMATION_HIDE_OVER: 'animationHideOver'
    },
    SIDEBAR: {
        CLEAR_DONE: 'clearDone',
        RESTORE_DONE: 'restoreDone'
    }
};

class IdInfosPublisherClass {
    constructor() {
        this.ADDED = 'ADDED';
        this.UPDATED = 'UPDATED';
        this.DELETED = 'DELETED';
        this.MODIFIED = 'MODIFIED';
        this.LOCKED = 'LOCKED';
    }

    publish(eventsList) {
        eventBus.send(events.VIEW.ID_INFOS, eventsList);
    }

}

export const IdInfosPublisher = new IdInfosPublisherClass();

