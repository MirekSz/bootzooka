/**
 * Created by bartosz on 20.05.15.
 *
 * Socket Definition class
 */

class SocketDef {

    constructor(name, type, required = false) {
        this.name = name;
        this.type = type;
        this.required = required;
    }

}

export default SocketDef;