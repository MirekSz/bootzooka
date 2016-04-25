/**
 * Created by bstanislawski on 2015-12-11.
 */
class GUITree {

    /**
     * @param {String} [xml]
     * @param {String} [name]
     * @param {String} [icon]
     */
    constructor(xml, name, icon) {
        this.name = name;
        this.xml = xml;
        this.icon = icon;

        this.model = [];
        this.metaDataSource = new Map();
    }

    getStringXML() {
        return this.xml;
    }

    setName(name) {
        this.name = name;
    }

    setIcon(icon) {
        this.icon = icon;
    }

    setId(id) {
        this.id = id;
    }

    getName() {
        return this.name;
    }

    getIcon() {
        return this.icon;
    }

    getId() {
        if (this.id) {
            return this.id;
        } else {
            return this.name.replace(' ', '-');
        }
    }

    setModel(model) {
        this.model = model;
    }

    getModel() {
        return this.model;
    }

    setMetaDataSource(metaDataSource) {
        this.metaDataSource = metaDataSource;
    }

    getMetaDataSource() {
        return this.metaDataSource;
    }

}

export default GUITree;
