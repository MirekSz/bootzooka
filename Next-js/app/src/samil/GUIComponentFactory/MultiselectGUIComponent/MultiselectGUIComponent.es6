/**
 * Created by bstanislawski on 2015-12-11.
 */
import BaseGUIComponent from '../../BaseGUIComponent';
import template from './select.hbs';
import MultiselectGUIElementView from './MultiselectGUIElementView';

class MultiselectGUIComponent extends BaseGUIComponent {

    constructor(element) {
        super(element, template);

        this.view = new MultiselectGUIElementView(this);
        this.isMultiselect = true;
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

        targetElement.find('select').kendoMultiSelect({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: model.data,
            dataBound: model.onDataBound,
            filtering: model.onFiltering,
            select: model.onSelect,
            change: model.onChange,
            close: model.onClose,
            open: model.onOpen
        });
    }

    buildModel() {
        return {
            data: [
                {text: "Africa", value: "1"},
                {text: "Europe", value: "2"},
                {text: "Asia", value: "3"},
                {text: "North America", value: "4"},
                {text: "South America", value: "5"},
                {text: "Antarctica", value: "6"},
                {text: "Australia", value: "7"}
            ],

            onDataBound: function () {
                if ("kendoConsole" in window) {
                    console.log("event: dataBound");
                }
            },

            onOpen: function () {
                if ("kendoConsole" in window) {
                    console.log("event: open");
                }
            },

            onClose: function () {
                if ("kendoConsole" in window) {
                    console.log("event: close");
                }
            },

            onChange: function () {
                if ("kendoConsole" in window) {
                    console.log("event: change");
                }
            },

            onSelect: function (event) {
                if ("kendoConsole" in window) {
                    var dataItem = this.dataSource.view()[event.item.index()];
                    console.log(`event :: select (${dataItem.text}:${dataItem.value})`);
                }
            },

            onFiltering: function (event) {
                if ("kendoConsole" in window) {
                    console.log("event :: filtering");
                }
            }
        };
    }

}

export default MultiselectGUIComponent;
