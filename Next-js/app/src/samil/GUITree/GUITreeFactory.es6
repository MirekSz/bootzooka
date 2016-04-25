/**
 * Created by bstanislawski on 2015-12-11.
 */
import GUITree from './GUITree';
import GUIElementDef from './GUIElementDef';
import SAMIL_ENUMS from '../../enums/SamilEnums';

class GUITreeFactory {

    parseXmlToGUITree(stringXml) {
        var guiTree = new GUITree(stringXml);

        this.createModel(guiTree);

        return guiTree;
    }

    createModel(guiTree) {
        var xml = guiTree.getStringXML();
        var guiTreeModel = guiTree.getModel();
        var parsedXML = $.parseXML(xml);

        var root = $(parsedXML).find('Root');
        var node = new GUIElementDef();

        node.buildFromJQuery(root);

        guiTreeModel.push(node);
    }

}

export default new GUITreeFactory();
