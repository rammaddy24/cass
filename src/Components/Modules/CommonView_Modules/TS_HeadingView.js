import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image, StyleSheet
} from 'react-native'
import { color, BG_THEMECOLOUR, width, fontSize, fontFamily, height, LG_BG_THEME } from '../../Constants/fontsAndColors';
import { Container, Content, connect, Picker, Header, Toast, DeviceInfo, Snackbar, LinearGradient, Col, Row, Grid } from '../../../Asset/Libraries/NpmList';

export class TS_HeadingView extends Component {

    constructor(props) {
        super(props);

    }
    render() {

        return (

            <View style={styles.container_TextView}>
                <Text style={styles.container_Text}>{this.props.ASB_Text}</Text>
            </View>
        )
    }
};

const styles = StyleSheet.create({
    container_Text: {
        fontSize: fontSize.lightMedium,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.APPTHEME_BLACK,
    },
    container_TextView: {
        height: height / 100 * 6,
        justifyContent: "center",
       // alignItems:"center",
        //borderRadius: width / 100 * 1,
        //borderBottomColor: LG_BG_THEME.APPTHEME_GREY,
        //borderBottomWidth: width / 100 * 0.5,
        //opacity: 0.6
    },
});

