/**
 * Created by bartosz on 21.05.15.
 *
 * TableComponent class
 */

import BaseRenderingComponent from '../../../BaseRenderingComponent';
import panelTemplate from './panel.hbs';
import _each from 'lodash/collection/each';

import PanelElementView from './PanelElementView';

const ANIMATION_TIMEOUT = 500;

class PanelElementComponent extends BaseRenderingComponent {
    
    /**
     * @param {PanelElementComponentDef} element
     */
    constructor(element) {
        super(element);
    }

    renderToImpl(target) {
        var snippet = panelTemplate(this);

        target.html(snippet).promise().done(() => {
            this.showPanel(target);
        });
    }

    dispose() {
        this.content.dispose();

        super.dispose();
    }

    disposeImpl() {
        super.disposeImpl();
    }

    addUIListenersImpl(uIListenerBinder) {
        uIListenerBinder.addClick('a.click', this.sendDataThroughAllSockets);
    }

    addSocketListenersImpl(socketListenerBinder) {
        _each(this.inputSocketDefList, (socketDef)=> {
            socketListenerBinder.add(socketDef.name, (val, def) => {
            });
        });
    }

    sendDataThroughAllSockets() {
        _each(this.outputSocketDefList, (socketDef)=> {
            this.getOutputSocketByName(socketDef.name).send('Hello from ' + this.id.substr(this.id.lastIndexOf('.') + 1));
        });
    }

    /**
     * Standard set of handlers for panel element
     *
     * @private
     */
    showPanel(targetContainer) {
        var view = new PanelElementView();
        this.body = targetContainer.find('.panel-body');

        this.$panel = targetContainer.find('.panel');

        setTimeout(() => {
            this.$panel.removeClass('beforeAnimation');
        }, ANIMATION_TIMEOUT);

        view.handleStandardPanelBehavior(this.$panel);
        view.renderContent(this);
    }

    /**
     * method the dispose the panel
     */
    disposePanel() {
        var self = this;
        var $panelRow = $panel.closest('.row');
        // var panelRowElements = self.getPanelRowElements($panelRow);

        this.$panel.addClass('beforeAnimation');

        setTimeout(() => {
            // $panel.parent().addClass('hidden');
            //
            // if (panelRowElements.length > 0) {
            //     let panelClassList = $panel.closest('.animated-panel').attr('class').split(' ');
            //
            //     for (let i = 0; i < panelClassList.length; i++) {
            //         let classElement = panelClassList[i];
            //
            //         if (classElement.indexOf('col-lg-') > -1) {
            //             $panel.closest('.animated-panel').removeClass(classElement);
            //         }
            //     }
            // }
            this.dispose();
        }, ANIMATION_TIMEOUT);
    }

}

export default PanelElementComponent;
