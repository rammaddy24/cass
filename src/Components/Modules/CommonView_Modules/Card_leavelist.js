import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image, StyleSheet
} from 'react-native'
import { color, BG_THEMECOLOUR, width, fontSize, fontFamily, height, LG_BG_THEME,Notify_THEME } from '../../Constants/fontsAndColors';
import { Container, Content, connect, Picker, Header, Toast, DeviceInfo, Snackbar, LinearGradient, Col, Row, Grid } from '../../../Asset/Libraries/NpmList';

export class Card_leavelist extends Component {

    constructor(props) {
        super(props);

    }
    render() {

        return (

            <TouchableOpacity
                style={{
                    height: height / 100 * 24, justifyContent: "center", borderRadius: width / 100 * 2, backgroundColor: LG_BG_THEME.WHITE_THEME, marginBottom: width / 100 * 4, elevation: Platform.OS == "android" ? width / 100 * 1 : width / 100 * 0.1,
                    shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.2, shadowColor: LG_BG_THEME.APPTHEME_GREY_2, justifyContent: 'center',borderColor: Notify_THEME.AW_EngineerLeave, borderWidth: width / 100 * 0.5
                }}>

                <View style={{ flex: 1, justifyContent: "center" }}>

                <View style={{ flex: 0.05, justifyContent: 'center' }}/>

                    <View style={{ flex: 0.175, justifyContent: 'center' }}>
                        <Text numberOfLines={1} style={styles.container_HeaderText}>{this.props.CardText_Header1} <Text style={styles.container_Text}>{this.props.CardText_1}</Text></Text>
                    </View>

                    <View style={{ flex: 0.175, justifyContent: 'center' }}>
                        <Text numberOfLines={1} style={styles.container_HeaderText}>{this.props.CardText_Header2} <Text style={styles.container_Text}>{this.props.CardText_2}</Text></Text>
                    </View>

                    <View style={{ flex: 0.175, justifyContent: 'center' }}>
                        <Text numberOfLines={1} style={styles.container_HeaderText}>{this.props.CardText_Header3} <Text style={styles.container_Text}>{this.props.CardText_3}</Text></Text>
                    </View>

                    <View style={{ flex: 0.175, justifyContent: 'center' }}>
                        <Text numberOfLines={1} style={styles.container_HeaderText}>{this.props.CardText_Header4} <Text style={styles.container_Text}>{this.props.CardText_4}</Text></Text>
                    </View>

                    <View style={{ flex: 0.25, }}>
                        <Text numberOfLines={3} style={styles.container_HeaderText}>{this.props.CardText_Header5} <Text style={styles.container_Text}>{this.props.CardText_5}</Text></Text>
                    </View>


                </View>


            </TouchableOpacity>
        )
    }
};

const styles = StyleSheet.create({
    container_Text: {
        fontSize: fontSize.lightMedium,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.APPTHEME_GREY,
        textAlign: "auto",
        marginRight: width / 100 * 5,
        marginLeft: width / 100 * 5,
        opacity: 0.8
    },
    container_HeaderText: {
        fontSize: fontSize.Medium,
        fontFamily: fontFamily.Poppins_SemiBold,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.APPTHEME_GREY,
        textAlign: "auto",
        marginRight: width / 100 * 5,
        marginLeft: width / 100 * 5,
    },
    container_ThemeText: {
        fontSize: fontSize.Medium,
        fontFamily: fontFamily.Poppins_SemiBold,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.APPTHEME_GREY,
        textAlign: "auto",
        marginRight: width / 100 * 5,
        marginLeft: width / 100 * 5,
    }



});

