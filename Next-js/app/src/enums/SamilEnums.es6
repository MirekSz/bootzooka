/**
 * Created by bstanislawski on 2015-12-14.
 */
const SamilEnums = {
    JSON: {
        RESPONSE_OBJECT: 'responseObject'
    },
    COMMON: {
        DATASET_BINDING: 'dataset-binding',
        BINDING: 'binding',
        ELEMENT_ID: 'elementId',
        TAG_NAME: 'tagName',
        ID: 'id',
        FIELD: 'field',
        LABEL: 'label'
    },
    XML_ELEMENTS: {
        CONTAINER: 'container',
        ROW: 'row',
        COMPONENT: 'component',
        SPRING: 'spring',
        TAB: 'tab',
        TAB_SET: 'tabset',
        SPLIT: 'split',
        SPLIT_SET: 'splitset',
        LONG: 'long',
        ROOT: 'root',
        PROPERTY: 'property'
    },
    TEMPLATES: {
        MEMO: 'memo',
        TITLED: 'titled',
        TOP: 'top'
    },
    COMPONENT_TYPES: {
        ROW: 'row',
        INPUT: 'text',
        LABEL: 'label',
        FIELD: 'field',
        CHECKBOX: 'boolean',
        SEPARATOR: 'separator',
        NUMERIC: 'numeric',
        DATE: 'date',
        DICTIONARY: 'dictionary',
        STRING: 'string'
    },
    NUMERIC_TYPES: {
        FLOAT: 'float'
    },
    NUMERIC_PATTERNS: {
        FLOAT: '[0-9]+([\,|\.][0-9]+)?'
    },
    SAMIL_LOCATION_TAGS: {
        OCCUPY_X: 'occupyx',
        OCCUPY_Y: 'occupyy',
        EXPAND: 'expand',
        EXPAND_X: 'expandx',
        EXPAND_Y: 'expandy',
        ALIGN: 'align',
        FILL: 'fill'
    },
    FILL: {
        NONE: 'none',
        HORIZONTAL: 'horizontal',
        VERTICAL: 'vertical',
        BOTH: 'both'
    },
    SAMIL_TAGS: {
        CHARS: 'chars'
    },
    BOOTSTRAP: {
        ROW_MAX_SIZE: 100,
        START_LABEL_LENGTH_IN_PERCENTAGE: 10,
        START_FIELD_LENGTH_IN_PERCENTAGE: 90,
        LABEL_LENGTH_IN_PERCENTAGE: 0.1,
        FIELD_LENGTH_IN_PERCENTAGE: 0.9,
        CHAR_SIZE: 0.8
    },
    FIELD_DATA_TYPES: {
        INTEGER: 'integer',
        LONG: 'long',
        STRING: 'string',
        DATE: 'date',
        TIME: 'time',
        DATETIME: 'datetime',
        NUMERIC: 'numeric',
        MEMO: 'memo',
        BOOLEAN: 'boolean'
    },
    BUTTON_STATES: {
        DEFAULT: 'default',
        PRIMARY: 'primary',
        SUCCESS: 'success',
        INFO: 'info',
        WARNING: 'warning',
        DANGER: 'danger',
        LINK: 'link'
    },
    ICONS: {
        CHECK: 'check',
        PLUS_SQUARE_O: 'plus-square-o'
    }

};

export default SamilEnums;