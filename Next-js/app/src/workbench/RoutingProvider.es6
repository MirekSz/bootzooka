"use strict";
/**
 * Created by Mirek on 2016-04-07.
 */
class RoutingProvider {
    constructor() {
        this.restoring = false;
    }

    pageVisited(id) {
        if (this.restoring) {
            return;
        }
        let lastLink = localStorage.getItem("lastLink");
        if (lastLink) {
            localStorage.setItem("prevLink", lastLink);
        }
        localStorage.setItem('lastLink', id);
    }

    resotreLastPage() {
        this.restoring = true;
        let self = this;

        let prevLink = localStorage.getItem("prevLink");
        let lastLink = localStorage.getItem("lastLink");

        const ANIMATION_TIME = 200;
        setTimeout(function () {
            $(`#${prevLink}`).click();
            setTimeout(function () {
                $(`#${lastLink}`).click();
                self.restoring = false;
            }, ANIMATION_TIME);
        }, ANIMATION_TIME);


    }
}

export default new RoutingProvider();
