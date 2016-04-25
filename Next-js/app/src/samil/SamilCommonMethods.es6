/**
 * Created by bstanislawski on 2016-02-05.
 */
import defaultPropertiesRegistry from './DefaultPropertiesRegistry';
import samilEnums from '../enums/SamilEnums';

class SamilCommonMethods {

    /**
     * @param {String} txt
     * @returns {number}
     */
    getWidthOfText(txt) {
        var fontName = defaultPropertiesRegistry.fontName;
        var fontSize = defaultPropertiesRegistry.fontSize;
        var paddingBuffer = 0;

        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        ctx.font = `${fontSize}px ${fontName}`;
        return ctx.measureText(txt).width + paddingBuffer;
    }

    /**
     * @param {number} labelSizeInPx
     * @returns {number}
     */
    getSizeInBootstrapUnit(labelSizeInPx) {
        var rowSizeInPx = defaultPropertiesRegistry.containerWidth;
        var bootstrapUnitInPx = Math.round(rowSizeInPx / samilEnums.BOOTSTRAP.ROW_MAX_SIZE);

        var result = labelSizeInPx / bootstrapUnitInPx;
        var rest = result - Math.floor(labelSizeInPx / bootstrapUnitInPx);

        if (rest) {
            result = Math.floor(labelSizeInPx / bootstrapUnitInPx);
            result++;
        }

        //add require mark space
        result++;

        return result;
    }

}

export default new SamilCommonMethods();
