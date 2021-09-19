import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image, StyleSheet
} from 'react-native'
import { color, BG_THEMECOLOUR, width, fontSize, fontFamily, height, LG_BG_THEME } from '../../Constants/fontsAndColors';
import { Container, Content, connect, Picker, Header, Toast, DeviceInfo, Snackbar, LinearGradient, Col, Row, Grid } from '../../../Asset/Libraries/NpmList';

export class CardList_Design extends Component {

    constructor(props) {
        super(props);

    }
    render() {

        return (


            <TouchableOpacity onPress={() => this.props.CardList_Method()}
                style={{flex:1, justifyContent: "center", flexDirection: 'row', borderRadius: width / 100 * 2, backgroundColor: this.props.CardText_status == true ? LG_BG_THEME.APPTHEME_GREY_2 : LG_BG_THEME.WHITE_THEME, marginBottom: width / 100 * 4, elevation: Platform.OS == "android" ? width / 100 * 1 : width / 100 * 0.1,
                    shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.2, shadowColor: this.props.Card_BG, borderColor: this.props.Card_BG, borderWidth: width / 100 * 1, margin: width / 100 * 2,
                }}>
                <View style={{ flex: 0.25, justifyContent: "center", alignItems: "center" }}>
                    <Image source={require('../../../Asset/Images/Notify_Sample.png')} style={{ width: width / 100 * 16, height: width / 100 * 16, borderRadius: width / 100 * 8, opacity: 0.8 }} />
                </View>
                <View style={{ flex: 0.75, justifyContent: "center", }}>

                    <View style={{ flex: 0.05 }} />

                    <View style={{ flex: 0.15, justifyContent: 'center',marginTop:width/100*1 }}>
                        <Text  style={styles.container_HeaderText}>{this.props.CardText_Header1} <Text style={styles.container_HeaderText}>{this.props.CardText_1}</Text></Text>
                    </View>

                    <View style={{ flex: 0.15, justifyContent: 'center',marginTop:width/100*1 }}>
                        <Text  style={styles.container_Text}>{this.props.CardText_HeaderID} <Text style={styles.container_Text}>{this.props.CardText_ID}</Text></Text>
                    </View>

                    <View style={{ flex: 0.15, justifyContent: 'center',marginTop:width/100*1 }}>
                        <Text  style={styles.container_Text}>{this.props.CardText_Header3} <Text style={styles.container_Text}>{this.props.CardText_3}</Text></Text>
                    </View>
                    <View style={{ flex: 0.15, justifyContent: 'center',marginTop:width/100*1 }}>
                        <Text  style={styles.container_Text}>{this.props.CardText_Header4} <Text style={styles.container_Text}>{this.props.CardText_4}</Text></Text>
                    </View>

                    <View style={{ flex: 0.3,marginTop:width/100*1 }}>
                        <Text  style={styles.container_Text}>{this.props.CardText_Header2} <Text style={styles.container_Text}>{this.props.CardText_2}</Text></Text>
                    </View>
                    <View style={{ flex: 0.05,marginTop:width/100*1 }} />

                </View>


            </TouchableOpacity>
        )
    }
};

const styles = StyleSheet.create({
    container_Text: {
        fontSize: fontSize.Small,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.APPTHEME_BLACK,
        textAlign: "auto",
        marginRight: width / 100 * 5
    },
    container_HeaderText: {
        fontSize: fontSize.Medium,
        fontFamily: fontFamily.Poppins_SemiBold,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.APPTHEME_BLACK,
        textAlign: "auto",
        marginRight: width / 100 * 5,
    },
    container_StatusText: {
        fontSize: fontSize.lightMedium,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.WHITE_THEME,
        textAlign: "auto",
        marginRight: width / 100 * 5
    },
    container_StatusHeaderText: {
        fontSize: fontSize.Medium,
        fontFamily: fontFamily.Poppins_SemiBold,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.WHITE_THEME,
        textAlign: "auto",
        marginRight: width / 100 * 5,
    },


});

