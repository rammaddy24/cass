import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image, StyleSheet
} from 'react-native'
import { color, BG_THEMECOLOUR, width, fontSize, fontFamily, height, LG_BG_THEME } from '../../Constants/fontsAndColors';
import { Container, Content, connect, Picker, Header, Toast, DeviceInfo, Snackbar, LinearGradient, Col, Row, Grid } from '../../../Asset/Libraries/NpmList';

export class Home_Headertext extends Component {

    constructor(props) {
        super(props);

    }
    render() {

        return (

            <View style={{ flex: 0.25, justifyContent: 'center', flexDirection: 'row', }}>
                <View style={{ flex: 0.15, justifyContent: "center", alignItems: "center" }}>
                    {
                        this.props.Home_Centertext == "MESSAGES" ?
                        <Image source={require('../../../Asset/Icons/Message_Icon.png')} style={{ width: width / 100 * 6, height: width / 100 * 6, tintColor: LG_BG_THEME.APPTHEME_BLACK }} />
                        :
                        <Image source={require('../../../Asset/Icons/Timesheet_Icon.png')} style={{ width: width / 100 * 6, height: width / 100 * 6, tintColor: LG_BG_THEME.WHITE_THEME }} />
                    }
                </View>
                <View style={{ flex: 0.85, justifyContent: "center", alignItems: "flex-start" }}>
                    <Text numberOfLines={1} style={this.props.Home_Centertext == "MESSAGES" ? styles.container_Text : styles.container_WText}>{this.props.Home_Centertext}</Text>
                </View>

            </View>
        )
    }
};

const styles = StyleSheet.create({
    container_Text: {
        fontSize: fontSize.Medium,
        fontFamily: fontFamily.Poppins_SemiBold,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.APPTHEME_BLACK,
        textAlign: "auto",
        marginRight: width / 100 * 5
    },
    container_WText: {
        fontSize: fontSize.Medium,
        fontFamily: fontFamily.Poppins_SemiBold,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.WHITE_THEME,
        textAlign: "auto",
        marginRight: width / 100 * 5
    },


});

