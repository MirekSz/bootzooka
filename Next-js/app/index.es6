'use strict';

import Main from './src/Main';
import routingProvider from './src/workbench/RoutingProvider';
import styles from './styles.es6';
import {eventBus, events} from './src/lib/EventBus';

//start the application
$(document).ready(function () {
        window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
            eventBus.send(events.GLOBAL_EVENT.SHOW_ERROR, JSON.stringify(errorMsg));
        };

        window.addEventListener('unhandledRejection', (err) => {
            eventBus.send(events.GLOBAL_EVENT.SHOW_ERROR, JSON.stringify(err));
        });

        Main.startDeveloperMode();

        // setTimeout(function () {
        //     routingProvider.resotreLastPage();
        // }, 500);

        //Main.start();
    }
);


