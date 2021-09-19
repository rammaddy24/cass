import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image, StyleSheet
} from 'react-native'
import { color, BG_THEMECOLOUR, width, fontSize, fontFamily, height, LG_BG_THEME } from '../../Constants/fontsAndColors';
import { Container, Content, connect, Picker, Header, Toast, DeviceInfo, Snackbar, LinearGradient, Col, Row, Grid } from '../../../Asset/Libraries/NpmList';

export class AS_SidebardDesign extends Component {

    constructor(props) {
        super(props);

    }
    render() {

        return (

            <View style={{ height: height / 100 * 8, justifyContent: "center" }}>

                <TouchableOpacity onPress={() => this.props.AS_SidebardMethod()} style={styles.container_AccountText_View}>
                    <View style={{ flex: 0.15, justifyContent: "center", alignItems: "center" }}>

                        {this.props.AS_SidebardText == "Terms and conditions" ?
                            <Image source={require('../../../Asset/Icons/Terms_Icon.png')} style={{ width: width / 100 * 4, height: width / 100 * 5, tintColor: LG_BG_THEME.APPTHEME_BLACK }} />
                            : this.props.AS_SidebardText == "Support"|| this.props.AS_SidebardText == "Change Password" ?
                                <Image source={require('../../../Asset/Icons/Support_Icon.png')} style={{ width: width / 100 * 5, height: width / 100 * 5.5, tintColor: LG_BG_THEME.APPTHEME_BLACK }} />
                                        :
                                        <Image source={require('../../../Asset/Icons/logout.png')} style={{ width: width / 100 * 5, height: width / 100 * 5, tintColor: LG_BG_THEME.APPTHEME_BLACK, transform: [{ rotate: '180deg' }] }} />
                        }

                    </View>
                    <View style={{ flex: 0.85, justifyContent: "center", alignItems: "flex-start" }}>
                        <Text style={styles.container_Accounttext}>{this.props.AS_SidebardText}</Text>
                    </View>
                </TouchableOpacity>

            </View>
        )
    }
};

const styles = StyleSheet.create({
    container_Accounttext: {
        fontSize: fontSize.lightMedium,
        fontFamily: fontFamily.Poppins_SemiBold,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.APPTHEME_BLACK,
        textAlign: "center",
    },
    container_AccountText_View: {
        height: height / 100 * 6,
        justifyContent: "center",
        backgroundColor: LG_BG_THEME.APPTHEME_BG_2,
        borderRadius: width / 100 * 1,
        borderBottomColor: LG_BG_THEME.APPTHEME_GREY_3,
        borderBottomWidth: width / 100 * 0.5,
        flexDirection: "row",
        marginLeft: width / 100 * 4, marginRight: width / 100 * 4,
        opacity: 0.6
    },
});

