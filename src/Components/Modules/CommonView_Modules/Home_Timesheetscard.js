import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image, StyleSheet
} from 'react-native'
import { color, BG_THEMECOLOUR, width, fontSize, fontFamily, height, LG_BG_THEME } from '../../Constants/fontsAndColors';
import { Container, Content, connect, Picker, Header, Toast, DeviceInfo, Snackbar, LinearGradient, Col, Row, Grid } from '../../../Asset/Libraries/NpmList';

export class Home_Timesheetscard extends Component {

    constructor(props) {
        super(props);

    }
    render() {

        return (

            <View
                style={{
                    height: height / 100 * 14, justifyContent: "center", flexDirection: 'row', borderRadius: width / 100 * 2, backgroundColor: this.props.Card_BG, elevation: Platform.OS == "android" ? width / 100 * 1 : width / 100 * 0.1,
                    shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.2, shadowColor: this.props.Card_BG, flexDirection: "row"
                }}>


                <View style={{ flex: 0.33, justifyContent: 'center' }}>
                    <View style={{ flex: 0.2, justifyContent: "center", borderBottomColor:this.props.CH1_BG, borderBottomWidth: width / 100 * 0.5, marginRight: width / 100 * 6, marginLeft: width / 100 * 6 }} />

                    <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center' }}>
                        <Text numberOfLines={2} style={styles.container_HeaderText}>{this.props.CardHeader_1}</Text>
                    </View>

                    <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center' }}>
                        <Text numberOfLines={2} style={styles.container_HeaderText}>{this.props.CardText_1}</Text>
                    </View>
                    <View style={{ flex: 0.2 }} />

                </View>

                <View style={{ flex: 0.34, justifyContent: 'center' }}>
                <View style={{ flex: 0.2, justifyContent: "center", borderBottomColor:this.props.CH2_BG, borderBottomWidth: width / 100 * 0.5, marginRight: width / 100 * 6, marginLeft: width / 100 * 6 }} />

                    <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center' }}>
                        <Text numberOfLines={2} style={styles.container_HeaderText}>{this.props.CardHeader_2}</Text>

                    </View>

                    <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center' }}>
                        <Text numberOfLines={2} style={styles.container_HeaderText}>{this.props.CardText_2}</Text>

                    </View>
                    <View style={{ flex: 0.2 }} />

                </View>

                <View style={{ flex: 0.33, justifyContent: 'center' }}>
                <View style={{ flex: 0.2, justifyContent: "center", borderBottomColor:this.props.CH3_BG, borderBottomWidth: width / 100 * 0.5, marginRight: width / 100 * 6, marginLeft: width / 100 * 6 }} />

                    <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center' }}>
                        <Text numberOfLines={2} style={styles.container_HeaderText}>{this.props.CardHeader_3}</Text>

                    </View>

                    <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center' }}>
                        <Text numberOfLines={2} style={styles.container_HeaderText}>{this.props.CardText_3}</Text>

                    </View>
                    <View style={{ flex: 0.2 }} />

                </View>



            </View>
        )
    }
};

const styles = StyleSheet.create({
   
    container_HeaderText: {
        fontSize: width / 100 * 3.4,
        fontFamily: fontFamily.Poppins_SemiBold,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.WHITE_THEME,
        textAlign: "center",
       // marginRight: width / 100 * 2,
    },
    container_ByText: {
        fontSize: fontSize.Medium,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.WHITE_THEME,
        textAlign: "auto",
        //marginLeft: width / 100 * 8
    },



});

