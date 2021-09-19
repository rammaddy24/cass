import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image, StyleSheet
} from 'react-native'
import { color, BG_THEMECOLOUR, width, fontSize, fontFamily, height, LG_BG_THEME } from '../../Constants/fontsAndColors';
import { Container, Content, connect, Picker, Header, Toast, DeviceInfo, Snackbar, LinearGradient, Col, Row, Grid } from '../../../Asset/Libraries/NpmList';

export class MsgCardlist_Design extends Component {

    constructor(props) {
        super(props);

    }
    render() {

        return (

            <TouchableOpacity onPress={() => this.props.CardList_Method()} 
            style={{ height: height / 100 * 17, justifyContent: "center", flexDirection: 'row', borderRadius: width / 100 * 2, backgroundColor: this.props.CardText_status == true ? LG_BG_THEME.APPTHEME_GREY_2  : LG_BG_THEME.WHITE_THEME ,marginBottom:width/100*4,  elevation: Platform.OS == "android" ? width / 100 * 0.1 : width / 100 * 0.1,
            shadowOffset: { width: 2, height: 2 },shadowOpacity: 0.2,  shadowColor:this.props.Card_BG,marginLeft:width/100*2,marginRight:width/100*2 }}>
                <View style={{ flex: 0.25, justifyContent: "center", alignItems: "center" }}>
                    <Image source={require('../../../Asset/Images/Sample_Pic.png')} style={{ width: width / 100 * 14, height: width / 100 * 14 , borderRadius:width/100*7  }} />
                </View>
                <View style={{ flex: 0.75, justifyContent: "center", }}>

                    <View style={{ flex: 0.1 }} />

                    <View style={{ flex: 0.15, justifyContent: 'center' }}>
                        <Text numberOfLines={2} style={styles.container_HeaderText}>{this.props.CardText_1}</Text>
                    </View>
                   
                    <View style={{ flex: 0.5, justifyContent: 'center',opacity:0.6 }}>
                        <Text numberOfLines={3} style={styles.container_Text}>{this.props.CardText_2}</Text>
                    </View>

                    <View style={{ flex: 0.15, justifyContent: 'center',opacity:0.6 }}>
                        <Text numberOfLines={1} style={styles.container_Text}>{this.props.CardText_Header3} <Text style={styles.container_Text}>{this.props.CardText_3}</Text></Text>
                    </View>

                    <View style={{ flex: 0.1 }} />

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
   

   
});

