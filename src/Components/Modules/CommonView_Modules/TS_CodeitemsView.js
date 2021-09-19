import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image, StyleSheet
} from 'react-native'
import { color, BG_THEMECOLOUR, width, fontSize, fontFamily, height, LG_BG_THEME } from '../../Constants/fontsAndColors';
import { Container, Content, connect, Picker, Header, Toast, DeviceInfo, Snackbar, LinearGradient, Col, Row, Grid } from '../../../Asset/Libraries/NpmList';

export class TS_CodeitemsView extends Component {

    constructor(props) {
        super(props);

    }
    render() {

        return (

            <View style={{ height: height / 100 * 9, justifyContent: "center", flexDirection: 'row' }}>

                <View style={{ flex: 0.3, justifyContent: 'center', backgroundColor: LG_BG_THEME.WHITE_THEME,opacity:0.6 }}>
                    <Text style={styles.container_Black}>{this.props.Item_Name}</Text>
                </View>

                <View style={{ flex: 0.2, justifyContent: 'center', backgroundColor: LG_BG_THEME.APPTHEME_DLG, opacity: 0.9 }}>
                    <Text style={styles.container_Black}>{this.props.Item_Qty}</Text>
                </View>


                <View style={{ flex: 0.3, justifyContent: 'center', backgroundColor: LG_BG_THEME.APPTHEME_DG, }}>
                    <View style={{ flex: 0.1, justifyContent: 'center' }} />

                    <View style={{ flex: 0.4, justifyContent: 'center' }}>
                        <Text style={styles.container_White_50}>{this.props.Item_Price}</Text>
                    </View>

                    <View style={{ flex: 0.4, justifyContent: 'center' }}>
                        <Text style={styles.container_White}>{this.props.Item_PerPrice}</Text>
                    </View>
                    <View style={{ flex: 0.1, justifyContent: 'center' }} />

                </View>

                <View style={{ flex: 0.03, justifyContent: 'center', }} />

                <View style={{ flex: 0.17, justifyContent: 'center', }}>
                    <View style={{ flex: 0.3, justifyContent: 'center', }} />
                    {this.props.Activestatus == true ?
                        <TouchableOpacity onPress={() => this.props.CB_PDMethod()} style={{ flex: 0.4, justifyContent: 'center', backgroundColor: LG_BG_THEME.WHITE_THEME, borderRadius: width / 100 * 4, alignItems: "flex-end", borderColor: LG_BG_THEME.APPTHEME_2, borderWidth: width / 100 * 0.2 }}>
                            <Image source={require('../../../Asset/Icons/Circle.png')} style={{ width: width / 100 * 6, height: width / 100 * 6, tintColor: LG_BG_THEME.APPTHEME_DG }} />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={() => this.props.CB_PDMethod()} style={{ flex: 0.4, justifyContent: 'center', backgroundColor: LG_BG_THEME.WHITE_THEME, borderRadius: width / 100 * 4, alignItems: "flex-start", borderColor: LG_BG_THEME.APPTHEME_DG, borderWidth: width / 100 * 0.2 }}>
                            <Image source={require('../../../Asset/Icons/Circle.png')} style={{ width: width / 100 * 6, height: width / 100 * 6, tintColor: LG_BG_THEME.APPTHEME_DG }} />
                        </TouchableOpacity>
                    }
                    <View style={{ flex: 0.3, justifyContent: 'center', }} />
                </View>

            </View>


        )
    }
};


const styles = StyleSheet.create({
    container_White: {
        fontSize: fontSize.Small,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.WHITE_THEME,
        textAlign: 'center',

    },
    container_Black: {
        fontSize: fontSize.Medium,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.APPTHEME_BLACK,
        textAlign: 'center',

    },
    container_White_50: {
        fontSize: fontSize.Medium,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.WHITE_THEME,
        textAlign: 'center',

    },



});

