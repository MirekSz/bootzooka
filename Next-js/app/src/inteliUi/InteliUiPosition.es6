/**
 * Created by bartosz on 14.08.15.
 *
 * InteliUiPosition class
 */

class InteliUiPosition {

    constructor(args) {
        this.id = args.id;
        this.positionX = args.positionX;
        this.positionY = args.positionY;
    }

    getId() {
        return this.id;
    }

    setId(id) {
        this.id = id;
    }

    /**
     * Get the object position in editor
     *
     * @return {(positionX, positionY)|Array}
     */
    getPosition() {
        return [this.positionX, this.positionY];
    }

    /**
     * Set the object position in editor
     *
     * @param {Array} position
     */
    setPosition(position) {
        this.positionX = position[0];
        this.positionY = position[1];
    }
}

export default InteliUiPosition;
