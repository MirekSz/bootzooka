/**
 * Created by bartek on 2015-11-03.
 */
class TestTableView {

    /**
     * Handle after the data table panel has been rendered
     *
     * @param targetContainer
     * @param panelModel
     */
    setDataTablePanelHandlers(targetContainer, panelModel) {
        var id = panelModel.def.id;

        $("[id='" + id + "_table']").DataTable({"dom": 'tp', select: 'single'});
    }

}

export default TestTableView;