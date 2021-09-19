import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image, StyleSheet
} from 'react-native'
import { color, BG_THEMECOLOUR, width, fontSize, fontFamily, height, LG_BG_THEME } from '../../Constants/fontsAndColors';
import { Container, Content, connect, Picker, Header, Toast, DeviceInfo, Snackbar, LinearGradient, Col, Row, Grid } from '../../../Asset/Libraries/NpmList';

export class AS_Textbutton extends Component {

    constructor(props) {
        super(props);

    }
    render() {

        return (

            <TouchableOpacity onPress={() => this.props.ASB_Method()} style={styles.container_TextView}>
                <Text style={styles.container_Text}>{this.props.ASB_Text}</Text>
            </TouchableOpacity>
        )
    }
};

const styles = StyleSheet.create({
    container_Text: {
        fontSize: fontSize.Medium,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.WHITE_THEME,
        textAlign:'right',
        marginRight:width/100*5
    },
    container_TextView: {
        height: height / 100 * 7,
        justifyContent: "center",
        backgroundColor:"red",
        flexDirection:"row"
       
    },
});

