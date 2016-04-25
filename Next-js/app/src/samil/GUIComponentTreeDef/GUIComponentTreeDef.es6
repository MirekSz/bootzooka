/**
 * Created by bstanislawski on 2015-12-11.
 */
class GUIComponentTreeDef {

    /**
     * @param {GUITree} guiTree
     */
    constructor(guiTree) {
        this.id = guiTree.getId();
        this.name = guiTree.getName();
        this.icon = guiTree.getIcon();

        this.model = guiTree.getModel();
        this.metaDataSourceMap = guiTree.metaDataSource;

        this.components = [];
    }

    connectGUIElementsWithMetaData() {
        this.model.forEach(element => {
            element.setFieldModel(this.metaDataSourceMap);

            this.getChildrenAndSetMetaData(element);
        });
    }

    getRootElement() {
        return this.model[0];
    }

    /**
     * @private
     */
    getChildrenAndSetMetaData(element) {
        var children = element.childrenDefList;

        if (children.length > 0) {
            children.forEach(child => {
                child.setFieldModel(this.metaDataSourceMap);

                this.getChildrenAndSetMetaData(child);
            });
        }
    }

}

export default GUIComponentTreeDef;
