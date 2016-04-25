"use strict";
/**
 * Created by Mirek on 2016-03-03.
 */
import pl from './pl.json';

class Reman {
    constructor() {

    }

    getRes(key) {
        return pl[key];
    }

}

export default new Reman();
