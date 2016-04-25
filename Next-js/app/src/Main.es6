/**
 *
 * Main flow file
 *
 **/
'use strict';

//require("babel/polyfill");

import site from './designer/Site';

const Main = {

    start() {
        site.start();
    },

    startDeveloperMode() {
        site.startDeveloperMode();
    }

};

export default Main;
