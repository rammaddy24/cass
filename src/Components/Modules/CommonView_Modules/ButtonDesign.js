import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image, StyleSheet, TextInput
} from 'react-native'
import { color, BG_THEMECOLOUR, width, fontSize, fontFamily, height, LG_BG_THEME } from '../../Constants/fontsAndColors';
import { Container, Content, connect, Picker, Header, Toast, DeviceInfo, Snackbar, LinearGradient, Col, Row, Grid } from '../../../Asset/Libraries/NpmList';

export class ButtonDesign extends Component {

    constructor(props) {
        super(props);

    }
    render() {

        return (

            <TouchableOpacity onPress={() => this.props.onPress_BuutonView()} style={{ height: height / 100 * 7, backgroundColor:this.props.CMB_BuutonColourcode, marginLeft: width / 100 * 4, marginRight: width / 100 * 4, borderRadius: height / 100 * 3.5, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={this.props.CMB_BuutonColourcode == LG_BG_THEME.APPTHEME_Blue ? styles.Container_WhiteTextHeader  :  styles.Container_TextHeader}>{this.props.CMB_TextHeader}</Text>
            </TouchableOpacity>

        )
    }
};

const styles = StyleSheet.create({
    Container_TextHeader: {
        fontSize: fontSize.Large_50,
        fontFamily: fontFamily.Poppins_Bold,
        letterSpacing: width / 100 * 0.2,
        color: LG_BG_THEME.APPTHEME_BLACK,
    },
    Container_WhiteTextHeader:{
        fontSize: fontSize.Large_50,
        fontFamily: fontFamily.Poppins_Bold,
        letterSpacing: width / 100 * 0.2,
        color: LG_BG_THEME.WHITE_THEME,
    }

});

