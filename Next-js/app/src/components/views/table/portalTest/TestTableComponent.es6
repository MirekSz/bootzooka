/**
 * Created by bartosz on 21.05.15.
 *
 * TableComponent class
 */
import site from '../../../../designer/Site';

import BaseRenderingComponent from '../../../BaseRenderingComponent';
import tableTemplate from './table.hbs';
import _each from 'lodash/collection/each';

import PanelElement from '../../../../designer/models/PanelElement';

class TestTableComponent extends BaseRenderingComponent {
    /**
     * @param {ViewComponentDef} element
     */
    constructor(element) {
        super(element);
    }

    renderToImpl(target) {
        //target.html(tableTemplate(this));

        var tablePanel = new PanelElement({
            panelBodyTemplate: tableTemplate,
            targetContainer: target,
            panelBodyModel: this,
            panelHandlers: site.view.setDataTablePanelHandlers
        });

        site.addPanel(tablePanel);
    }

    addUIListenersImpl(uIListenerBinder) {
        uIListenerBinder.addClick('button.click', this.sendDataThroughAllSockets);
    }

    addSocketListenersImpl(socketListenerBinder) {
        _each(this.inputSocketDefList, (socketDef)=> {
            socketListenerBinder.add(socketDef.name, (val, def)=> {
                var $textArea = $(this.target).find('textarea');
                var oldVal = $textArea.val();

                if (oldVal != '') {
                    oldVal += '\n';
                }
                var newVal = oldVal + val + ' received on socket ' + def.name;

                $textArea.val(newVal);
            });
        });
    }

    sendDataThroughAllSockets() {
        _each(this.outputSocketDefList, (socketDef)=> {
            this.getOutputSocketByName(socketDef.name).send('Hello from ' + this.id.substr(this.id.lastIndexOf('.') + 1));
        });
    }
}

export default TestTableComponent;
