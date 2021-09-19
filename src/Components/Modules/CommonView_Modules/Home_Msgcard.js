import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image, StyleSheet
} from 'react-native'
import { color, BG_THEMECOLOUR, width, fontSize, fontFamily, height, LG_BG_THEME } from '../../Constants/fontsAndColors';
import { Container, Content, connect, Picker, Header, Toast, DeviceInfo, Snackbar, LinearGradient, Col, Row, Grid } from '../../../Asset/Libraries/NpmList';

export class Home_Msgcard extends Component {

    constructor(props) {
        super(props);

    }
    render() {

        return (

            <TouchableOpacity onPress={() => this.props.CardList_Method()}
                style={{
                    height: height / 100 * 15, justifyContent: "center", flexDirection: 'row', borderRadius: width / 100 * 2, backgroundColor: this.props.Card_BG, marginBottom: width / 100 * 4, elevation: Platform.OS == "android" ? width / 100 * 1 : width / 100 * 0.1,
                    shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.2, shadowColor: this.props.Card_BG, borderBottomWidth: width / 100 * 0.4, borderBottomColor: LG_BG_THEME.APPTHEME_GREY_2
                }}>
                <View style={{ flex: 0.25, justifyContent: "center", alignItems: "center" }}>
                    <Image source={require('../../../Asset/Images/Sample_Pic.png')} style={{ width: width / 100 * 14, height: width / 100 * 14 , borderRadius:width/100*7}} />
                </View>
                <View style={{ flex: 0.75, justifyContent: "center", }}>

                    <View style={{ flex: 0.05 }} />

                    <View style={{ flex: 0.5, justifyContent: 'center' }}>
                        <Text numberOfLines={2} style={styles.container_HeaderText}>{this.props.CardText_1}</Text>
                    </View>

                    <View style={{ flex: 0.2, justifyContent: 'center', }}>
                        <Text numberOfLines={1} style={styles.container_Text}>{this.props.CardText_2}</Text>
                    </View>

                    <View style={{ flex: 0.2, justifyContent: 'center', flexDirection: "row" }}>
                        <View style={{ flex: 0.2 }} />
                        <View style={{ flex: 0.8, justifyContent: 'center', alignItems: "center" }}>

                            <Text style={styles.container_ByText}>{this.props.CardText_3}</Text>
                        </View>
                    </View>


                    <View style={{ flex: 0.05 }} />

                </View>


            </TouchableOpacity>
        )
    }
};

const styles = StyleSheet.create({
    container_Text: {
        fontSize: fontSize.lightMedium_50,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.WHITE_THEME,
        textAlign: "auto",
        marginRight: width / 100 * 5
    },
    container_HeaderText: {
        fontSize: fontSize.Medium,
        fontFamily: fontFamily.Poppins_SemiBold,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.WHITE_THEME,
        textAlign: "auto",
        marginRight: width / 100 * 5,

    },
    container_ByText: {
        fontSize: fontSize.lightMedium_50,
        fontFamily: fontFamily.Poppins_SemiBold,
        letterSpacing: width / 100 * 0.1,
        color: "#C0C0C0",
        textAlign: "auto",
    },



});

