/**
 * Created by bartosz on 22.05.15.
 *
 * Global Enums class
 */

const GlobalEnums = {

    ID_BEAN: 'ID_BEAN',
    CONVERTERS: {
        ID_LONG_CONVERTER: 'IdToLongConverter'
    },
    JAVA_TYPES: {
        LONG: 'java.lang.Long',
        STRING: 'java.lang.String'
    },
    SOURCE_TYPES: {
        CONST_VALUE: 'CONST_VALUE',
        SOCKET: 'SOCKET'
    },
    SOCKETS: {
        DISABLE_QUESTION: 'disableQuestionBeforAction'
    },
    SHOW_ACTION: {
        WHAT_NEXT_CLASS: 'pl.com.stream.next.asen.common.service.WhatNext',
        FIXED_ASSET_RECEIVING_DOCUMENT_SHOW_ACTION_ID: 'pl.com.stream.verto.fix.plugin.fixed-asset-client.FixedAssetReceivingDocumentShowAction',
        FIXED_ASSET_LIQUIDATION_DOCUMENT_SHOW_ACTION_ID: 'pl.com.stream.verto.fix.plugin.fixed-asset-client.FixedAssetLiquidationDocumentShowAction',
        FIXED_ASSET_UPGRADE_DOCUMENT_SHOW_ACTION_ID: 'pl.com.stream.verto.fix.plugin.fixed-asset-client.FixedAssetUpgradeDocumentShowAction'
    },
    QUESTIONS: {
        PORTAL: 'portal',
        OPTION: 'option',
        PERMISSION: 'permission'
    }

};

export default GlobalEnums;
