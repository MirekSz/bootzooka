"use strict";
/**
 * Created by Mirek on 2015-08-18.
 */
import BaseRendering from '../../../lib/rendering/BaseRendering';
const DETAILS_SUFIX = '_TreeDetailsViewProvider';
const VIEW_SUFIX = '_TreeViewProvider';
class DetailsView extends BaseRendering {

    constructor(id) {
        super();
        this.id = id + DETAILS_SUFIX;
    }

    renderToImpl(target) {
//        $(target).html('Details view');
    }
}

export default DetailsView;