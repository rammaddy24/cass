import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image, StyleSheet
} from 'react-native'
import { color, BG_THEMECOLOUR, width, fontSize, fontFamily, height, LG_BG_THEME } from '../../Constants/fontsAndColors';
import { Container, Content, connect, Picker, Header, Toast, DeviceInfo, Snackbar, LinearGradient, Col, Row, Grid } from '../../../Asset/Libraries/NpmList';

export class ASS_HeaderDesign extends Component {

    constructor(props) {
        super(props);

    }
    render() {

        return (

            <View style={{ height: height / 100 * 9, justifyContent: "center", flexDirection: "row", alignItems: "center", backgroundColor: LG_BG_THEME.APPTHEME_1, }}>

                {
                    this.props.LeftIcon_Status == true ?
                        <TouchableOpacity onPress={() => this.props.Onpress_LeftIcon()} style={{ flex: 0.15, justifyContent: "center", alignItems: "center" }}>
                            <Image source={require('../../../Asset/Icons/left-arrow.png')} style={{ width: width / 100 * 4, height: width / 100 * 4, tintColor: LG_BG_THEME.WHITE_THEME }} />
                        </TouchableOpacity>
                        :
                        <View style={{ flex: 0.15, justifyContent: "center", alignItems: "center" }} />
                }


                <View style={{ flex:this.props.RightIcon_Status == true ? 0.65 : 0.65, justifyContent: "center", alignItems: "center" }}>
                    <Text style={styles.container_HeaderWhite}>{this.props.Header_Text}</Text>
                </View>

                {
                    this.props.Reset_Status == true ?
                        <TouchableOpacity onPress={() => this.props.Onpress_More_Reset()} style={{ flex: 0.1, justifyContent: "center", alignItems: "center" }}>
                            <Image source={require('../../../Asset/Icons/rotate.png')} style={{ width: width / 100 * 5, height: width / 100 * 5, tintColor: LG_BG_THEME.WHITE_THEME }} />
                        </TouchableOpacity>
                        : <View style={{ flex: 0.1 }} />
                }

                <TouchableOpacity onPress={() => this.props.Onpress_More_Icon()} style={{ flex: 0.1, justifyContent: "center", alignItems: "center" }}>
                    <Image source={require('../../../Asset/Icons/search.png')} style={{ width: width / 100 * 5, height: width / 100 * 5, tintColor: LG_BG_THEME.WHITE_THEME }} />
                </TouchableOpacity>

                {
                    this.props.RightIcon_Status == true ?
                        <TouchableOpacity onPress={() => this.props.Onpress_RightIcon()} style={{ flex: 0.1, justifyContent: "center", alignItems: "center" }}>
                    <Image source={require('../../../Asset/Icons/Ball_Info.png')} style={{ width: width / 100 * 5, height: width / 100 * 5, tintColor: LG_BG_THEME.WHITE_THEME }} />
                        </TouchableOpacity>
                        :null

}
               


            </View>
        )
    }
};

const styles = StyleSheet.create({
    container_HeaderWhite: {
        fontSize: fontSize.Large,
        fontFamily: fontFamily.Poppins_SemiBold,
        letterSpacing: width / 100 * 0.2,
        color: color.Font_Whitecolor,
        textAlign: "center",
    },
    container_CountWhite: {
        fontSize: fontSize.Small,
        fontFamily: fontFamily.Poppins_SemiBold,
        letterSpacing: width / 100 * 0.2,
        color: color.Font_Whitecolor,
        textAlign: "center",
    }
});

