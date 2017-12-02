'use strict';

import React,{PropTypes,Component} from 'react';
import {
    NativeModules,
    View,
    requireNativeComponent,
    UIManager,
    findNodeHandle
} from 'react-native';




var iface = {
    name: 'CardView',
    propTypes: {
        cornerRadius: PropTypes.number,
        cardElevation: PropTypes.number,
        cardMaxElevation: PropTypes.number,
        ...View.propTypes, // include the default view properties
    },
};
module.exports = requireNativeComponent('RNCardView', iface);


