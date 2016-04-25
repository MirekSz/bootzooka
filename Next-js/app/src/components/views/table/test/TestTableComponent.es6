/**
 * Created by bartosz on 21.05.15.
 *
 * TableComponent class
 */

import BaseRenderingComponent from '../../../BaseRenderingComponent';
import tableTemplate from './table.hbs';
import _each from 'lodash/collection/each';

class TestTableComponent extends BaseRenderingComponent {
    /**
     * @param {ViewComponentDef} element
     */
    constructor(element) {
        super(element);
    }

    renderToImpl(target) {
        var htmlElement = tableTemplate(this);

        target.html(htmlElement);
    }

    addUIListenersImpl(uIListenerBinder) {
        // uIListenerBinder.addClick('button.click', this.sendDataThroughAllSockets);
    }

    addSocketListenersImpl(socketListenerBinder) {
        // _each(this.inputSocketDefList, (socketDef)=> {
        //     socketListenerBinder.add(socketDef.name, (val, def)=> {
        //         let $textArea = $(this.target).find('textarea');
        //         let oldVal = $textArea.val();
        //
        //         if (oldVal != '') {
        //             oldVal += '\n';
        //         }
        //         let newVal = oldVal + val + ' received on socket ' + def.name;
        //
        //         $textArea.val(newVal);
        //     });
        // });
    }

    // sendDataThroughAllSockets() {
    //     _each(this.outputSocketDefList, (socketDef)=> {
    //         this.getOutputSocketByName(socketDef.name).send('Hello from ' + this.id.substr(this.id.lastIndexOf('.') + 1));
    //     });
    // }
}

export default TestTableComponent;
