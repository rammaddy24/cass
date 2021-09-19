import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image, StyleSheet
} from 'react-native'
import { color, BG_THEMECOLOUR, width, fontSize, fontFamily, height, LG_BG_THEME } from '../../Constants/fontsAndColors';
import { Container, Content, connect, Picker, Header, Toast, DeviceInfo, Snackbar, LinearGradient, Col, Row, Grid } from '../../../Asset/Libraries/NpmList';

export class ViewAll_Design extends Component {

    constructor(props) {
        super(props);

    }
    render() {

        return (

                <View style={{ flex: this.props.status == "Msg" ? 0.12 : 0.5, justifyContent: "center", flexDirection: 'row' }}>
                    <View style={{ flex: 0.7 }} />
                    <TouchableOpacity onPress={() => this.props.ViewAll_Method()} style={{ flex: 0.25, justifyContent: 'center', backgroundColor:this.props.Text_BG, borderRadius: width / 100 * 4 }}>
                        <Text numberOfLines={1} style={this.props.status == "Msg" ?styles.container_VAT_White : styles.container_ViewallText }>{this.props.ViewText}</Text>
                    </TouchableOpacity>
                    <View style={{ flex: 0.05 }} />
                </View>

        )
    }
};


const styles = StyleSheet.create({
    container_ViewallText: {
        fontSize: fontSize.lightMedium_50,
        fontFamily: fontFamily.Poppins_SemiBold,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.APPTHEME_BLACK,
        textAlign: 'center',
    },
    container_VAT_White: {
        fontSize: fontSize.lightMedium_50,
        fontFamily: fontFamily.Poppins_SemiBold,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.WHITE_THEME,
        textAlign: 'center',
    },



});

