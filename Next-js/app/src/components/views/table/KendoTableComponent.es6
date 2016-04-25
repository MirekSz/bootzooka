/**
 * Created by bartosz on 21.05.15.
 *
 * TableComponent class
 */

import TableComponent from './TableComponent';
import KendoTable from './kendo/KendoTable';

class KendoTableComponent extends TableComponent {
    /**
     * @param {ViewComponentDef} element
     */
    constructor(element) {
        super(element);
    }

    createView() {
        return new KendoTable({
            id: this.def.id,
            columnModel: this.columnModel,
            dataModel: this.dataModel,
            controller: this.controller
        });
    }


}

export default KendoTableComponent;
