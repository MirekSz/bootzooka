/**
 * Created by bstanislawski on 2015-12-11.
 */
import BaseGUIComponent from '../../BaseGUIComponent';
import template from './select.hbs';
import dataSourceRegistry from '../../../vedas/dataSource/DataSourceRegistry';
import DictionaryGUIElementView from './DictionaryGUIElementView';
import samilEnums from '../../../enums/SamilEnums';
import defaultPropertiesRegistry from '../../DefaultPropertiesRegistry';

class DictionaryGUIComponent extends BaseGUIComponent {

    constructor(element) {
        super(element, template);

        this.view = new DictionaryGUIElementView(this);
        this.isDictionary = true;
        this.preferedCharLength = defaultPropertiesRegistry.preferedSizes.DICTIONARY;

        this.guiModel.preferedWidth = Math.round(samilEnums.BOOTSTRAP.CHAR_SIZE * this.preferedCharLength);
    }

    doAfterRenderImpl(targetElement) {
        this.convertToKendoSelect(targetElement);
    }

    addUIListenersImpl(uIListenerBinder) {
        uIListenerBinder.addClick('a.select-element', event => {
            this.view.selectElement(event);
        });
    }

    convertToKendoSelect(targetElement) {
        var model = this.buildModel();

        targetElement.find('select').kendoDropDownList({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: model.data,
            index: 0,
            change: model.onChange
        });
    }

    buildModel() {
        return {
            data: this.field.value,
            onChange: () => {
                console.log('selection change...');
            }
        };
    }

}

export default DictionaryGUIComponent;
