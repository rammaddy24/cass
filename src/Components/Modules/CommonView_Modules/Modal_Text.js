import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image, StyleSheet
} from 'react-native'
import { color, BG_THEMECOLOUR, width, fontSize, fontFamily, height, LG_BG_THEME } from '../../Constants/fontsAndColors';
import { Container, Content, connect, Picker, Header, Toast, DeviceInfo, Snackbar, LinearGradient, Col, Row, Grid } from '../../../Asset/Libraries/NpmList';

export class Modal_Text extends Component {

    constructor(props) {
        super(props);

    }
    render() {

        return (
            <View style={{ height: height / 100 * 5, justifyContent: 'center', borderColor: this.props.Modal_InfoBG , backgroundColor:LG_BG_THEME.WHITE_THEME,borderWidth:width/100*0.5,marginLeft:width/100*2,marginRight:width/100*2 }}>
                <Text numberOfLines={1} style={styles.Container_Infotext}>{this.props.Modal_Infotext }</Text>
            </View>
        )
    }
};

const styles = StyleSheet.create({
    Container_Infotext: {
        fontSize: fontSize.lightMedium,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.1,
        color: color.Font_Black,
        textAlign: "center",
        //fontWeight: "500" 
    },



});

