import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image, StyleSheet
} from 'react-native'
import { color, BG_THEMECOLOUR, width, fontSize, fontFamily, height, LG_BG_THEME } from '../../Constants/fontsAndColors';
import { Container, Content, connect, Picker, Header, Toast, DeviceInfo, Snackbar, LinearGradient, Col, Row, Grid } from '../../../Asset/Libraries/NpmList';

export class Card_Joblist extends Component {

    constructor(props) {
        super(props);

    }
    render() {

        return (

            <View
                style={{
                    height: height / 100 * 20, justifyContent: "center", borderRadius: width / 100 * 2, backgroundColor: this.props.Card_BG, marginBottom: width / 100 * 4, elevation: Platform.OS == "android" ? width / 100 * 1 : width / 100 * 0.1,
                    shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.2, shadowColor: LG_BG_THEME.APPTHEME_GREY_2,
                }}>

                <View style={{ flex: 0.7, justifyContent: "center", borderBottomWidth: width / 100 * 0.4, borderBottomColor: LG_BG_THEME.APPTHEME_GREY_2 }}>

                    <View style={{ flex: 0.5, justifyContent: 'center', flexDirection: "row" }}>

                        <View style={{ flex: 0.85, justifyContent: 'center', }}>
                            <View style={{ flex: 0.2 }} />

                            <View style={{ flex: 0.8, justifyContent: 'center' }}>
                                <Text numberOfLines={1} style={styles.container_HeaderText}>{this.props.CardText_Header1} <Text style={styles.container_Text}>{this.props.CardText_1}</Text></Text>
                            </View>


                        </View>

                        {
                            this.props.CardText_ResubmitCount == 0 ?
                                <View style={{ flex: 0.15, }} />

                                :
                                <View style={{ flex: 0.15, }}>

                                    <View style={{ flex: 0.6, backgroundColor: "red", borderBottomLeftRadius: width / 100 * 4, justifyContent: "center", alignItems: "center" }} >
                                        <Text numberOfLines={1} style={styles.container_CountText}>{this.props.CardText_ResubmitCount}</Text>
                                    </View>

                                    <View style={{ flex: 0.4 }} />



                                </View>
                        }

                        {/* 
<TouchableOpacity onPress={() => this.props.CardList_AMORE()} style={{ flex: 0.2, justifyContent: "center", alignItems: "center" }}>
                            <Image source={require('../../../Asset/Icons/Draft_Icon.png')} style={{ width: width / 100 * 8, height: width / 100 * 8, tintColor: LG_BG_THEME.APPTHEME_1 }} />
                        </TouchableOpacity> */}


                    </View>

                    <View style={{ flex: 0.4, justifyContent: 'center', flexDirection: "row" }}>

                        <View style={{ flex: 0.8, justifyContent: 'center' }}>
                            <Text numberOfLines={1} style={styles.container_HeaderText}>{this.props.CardText_Header2} <Text style={styles.container_Text}>{this.props.CardText_2}</Text></Text>
                        </View>

                        <TouchableOpacity onPress={() => this.props.CardList_AMORE()} style={{ flex: 0.2, justifyContent: "flex-start", alignItems: "center" }}>
                            <Image source={require('../../../Asset/Icons/Add_New.png')} style={{ width: width / 100 * 6, height: width / 100 * 6, tintColor: LG_BG_THEME.APPTHEME_1 }} />
                        </TouchableOpacity>
                    </View>


                    <View style={{ flex: 0.1 }} />
                </View>

                <TouchableOpacity onPress={() => this.props.CardList_VAll()} style={{ flex: 0.3, justifyContent: "center", }}>
                    <View style={{ flex: 0.1 }} />
                    <View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <View style={{ flex: 0.8, justifyContent: 'center', }}>
                            <Text numberOfLines={1} style={styles.container_HeaderText}>{this.props.CardTimesheet_Count}</Text>
                        </View>

                        <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('../../../Asset/Icons/left-arrow.png')} style={{ width: width / 100 * 4, height: width / 100 * 4, tintColor: LG_BG_THEME.APPTHEME_1, transform: [{ rotate: '180deg' }] }} />
                        </View>
                    </View>
                    <View style={{ flex: 0.1 }} />

                </TouchableOpacity>

            </View>
        )
    }
};

const styles = StyleSheet.create({
    container_Text: {
        fontSize: fontSize.Medium,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.APPTHEME_BLACK,
        textAlign: "auto",
        marginRight: width / 100 * 5,
        marginLeft: width / 100 * 5,
        opacity: 0.6
    },
    container_HeaderText: {
        fontSize: fontSize.Medium,
        fontFamily: fontFamily.Poppins_SemiBold,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.APPTHEME_BLACK,
        textAlign: "auto",
        marginRight: width / 100 * 5,
        marginLeft: width / 100 * 5,

    },
    container_ThemeText: {
        fontSize: fontSize.Medium,
        fontFamily: fontFamily.Poppins_SemiBold,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.APPTHEME_1,
        textAlign: "auto",
        marginRight: width / 100 * 5,
        marginLeft: width / 100 * 5,
    },
    container_CountText: {
        fontSize: fontSize.lightMedium_50,
        fontFamily: fontFamily.Poppins_SemiBold,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.WHITE_THEME,
        textAlign: "center",

    }



});

