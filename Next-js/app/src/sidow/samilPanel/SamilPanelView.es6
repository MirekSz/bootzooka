/**
 * Created by bstanislawski on 2016-03-14.
 */

import GUIComponentFactoryRegistry from '../../samil/GUIComponentFactory/GUIComponentFactoryRegistry';
import GUITreeFactory from '../../samil/GUITree/GUITreeFactory';
import GUITree from '../../samil/GUITree/GUITree';
import assertions from '../../lib/Assertions';

import WindowContentBaseView from '../window/WindowContentBaseView';

class SamilPanelView extends WindowContentBaseView {

    /**
     * @param {String} id
     * @param {SamilPanelContentComponents} contentComponents
     * @param {WindowAreaContentExtraOptions} [options]
     */
    constructor(id, contentComponents, options) {
        super(id, options);

        /** @type {DataSource} */
        this.dataSource = contentComponents.dataSource;

        /** @type {String|GUITree} */
        this.setModel(contentComponents.model);

        /** @type {GUIComponentTree} */
        this.content = undefined;

        assertions.required(id, contentComponents);
    }

    init() {
        var guiTree = this.createGUITree();

        guiTree.setId(this.id);
        guiTree.setName(this.name);
        guiTree.setIcon(this.icon);
        guiTree.setMetaDataSource(this.dataSource.metaDataSource);

        this.content = GUIComponentFactoryRegistry.createGUIComponentTree(guiTree);
        this.content.bindDataSource(this.dataSource);
    }

    activateImpl() {
        console.log('samilPanelView is active now..');
    }

    visibleChangeImpl(on) {
    }

    renderToImpl(target) {
        this.content.renderTo(target);
    }

    disposeImpl() {
        this.content.dispose();
    }

    /**
     * @private
     */
    setModel(model) {
        if (model) {
            if (model instanceof GUITree) {
                /** @type {GUITree} */
                this.objectiveModel = model;
            } else {
                /** @type {String} */
                this.model = model;
            }
        }
    }

    /**
     * @private
     * @returns {GUITree}
     */
    createGUITree() {
        if (this.model) {
            return GUITreeFactory.parseXmlToGUITree(this.model.trim());
        } else {
            return this.objectiveModel;
        }
    }

}

export default SamilPanelView;

