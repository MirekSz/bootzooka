import Assertions from '../lib/Assertions';

/**
 * Created by bartosz on 20.05.15.
 *
 * Base Registry Element class
 */
class BaseComponentDefinition {

    constructor(basicData) {
        this.id = basicData.id;
        this.name = basicData.name;
        this.type = basicData.type;
        this.icon = basicData.icon;
        this.inputSocketDefList = [];
        this.outputSocketDefList = [];
        this.repeaterSocketDefList = [];
        this.actionExtension = basicData.actionExtension;

        Assertions.required(this.id, this.type);
    }


    setInputSocketDefList(inputSocketDefList) {
        this.inputSocketDefList = inputSocketDefList;
    }

    setOutputSocketDefList(outputSocketDefList) {
        this.outputSocketDefList = outputSocketDefList;
    }

    addInputSocketDef(socketDef) {
        this.inputSocketDefList.push(socketDef);
    }

    addOutputSocketDef(socketDef) {
        this.outputSocketDefList.push(socketDef);
    }

    addRepeaterSocketDef(socketDef) {
        this.addInputSocketDef(socketDef);
        this.addOutputSocketDef(socketDef);
        this.repeaterSocketDefList.push(socketDef);
    }

    getRepeaterSocketDefList() {
        return this.repeaterSocketDefList;
    }

    getInputSocketDefList() {
        return this.inputSocketDefList;
    }

    getInputSocketDefListByType(socketType) {
        var inputSocketDefList = this.inputSocketDefList;

        for (var i = 0; i < inputSocketDefList.length; i++) {
            if (inputSocketDefList[i].type === socketType) {
                return inputSocketDefList[i];
            }
        }
    }

    getInputSocketDefByName(name) {
        var inputSocketDefList = this.inputSocketDefList;

        for (var i = 0; i < inputSocketDefList.length; i++) {
            if (inputSocketDefList[i].name === name) {
                return inputSocketDefList[i];
            }
        }
    }

    getRepeaterSocketDefByName(name) {
        var repeaterSocketDefList = this.repeaterSocketDefList;

        for (var i = 0; i < repeaterSocketDefList.length; i++) {
            if (repeaterSocketDefList[i].name === name) {
                return repeaterSocketDefList[i];
            }
        }
    }

    getOutputSocketDefList() {
        return this.outputSocketDefList;
    }

    getOutputSocketDefListByType(socketType) {
        var outputSocketDefList = this.outputSocketDefList;

        for (var i = 0; i < outputSocketDefList.length; i++) {
            if (outputSocketDefList[i].type === socketType) {
                return outputSocketDefList[i];
            }
        }
    }

    getOutputSocketDefByName(name) {
        var outputSocketDefList = this.outputSocketDefList;

        for (var i = 0; i < outputSocketDefList.length; i++) {
            if (outputSocketDefList[i].name === name) {
                return outputSocketDefList[i];
            }
        }
    }

}

export default BaseComponentDefinition;
