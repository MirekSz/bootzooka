/**
 * Created by bartosz on 08.06.15.
 *
 * ObjectKeyGenerator class
 */

class ObjectKeyGenerator {

    /**
     * create a JSON object from the any input object
     *
     * @param object
     * @return {JSON} jsonKeyObject
     */
    generate(obj) {
        return JSON.stringify(obj);
    }
}

export default new ObjectKeyGenerator();
