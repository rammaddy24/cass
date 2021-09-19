import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image, StyleSheet,Platform
} from 'react-native'
import { color, BG_THEMECOLOUR, width, fontSize, fontFamily, height, LG_BG_THEME } from '../../Constants/fontsAndColors';
import { Container, Content, connect, Picker, Header, Toast, DeviceInfo, Snackbar, LinearGradient, Col, Row, Grid } from '../../../Asset/Libraries/NpmList';

export class TS_CircleLIne extends Component {

    constructor(props) {
        super(props);

    }
    render() {

        return (

            <View style={{ width: width / 100 * 6, justifyContent: "center", }}>
                <View style={{ flex: 0.4, justifyContent: "center" }} />
                <View style={{ flex: 0.2, justifyContent: "center", backgroundColor: this.props.Circle_Status == true ? LG_BG_THEME.APPTHEME_1 : LG_BG_THEME.WHITE_THEME }} />
                <View style={{ flex: 0.4, justifyContent: "center" }} />
            </View>


        )
    }
};


const styles = StyleSheet.create({
    container_VAT_White: {
        fontSize: fontSize.Large_50,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.WHITE_THEME,
        textAlign: 'center',

    },
    container_Black: {
        fontSize: fontSize.Large_50,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.APPTHEME_BLACK,
        textAlign: 'center',
    },



});

