/**
 * Created by bartosz on 08.06.15.
 *
 * GridPosition class
 */
import ObjectKeyGenerator from '../lib/ObjectKeyGenerator';

class GridPosition {

    /**
     * The class defines the grid coordinates
     *
     * @param {Integer} row
     * @param {Integer} column
     */
    constructor(row, column) {
        if (row === 0) {
            this.row = 1;
        } else {
            this.row = row;
        }

        if (column === 0) {
            this.column = 1;
        } else {
            this.column = column;
        }

        this.hashMapKey = ObjectKeyGenerator.generate(this);
    }

}

export default GridPosition;
