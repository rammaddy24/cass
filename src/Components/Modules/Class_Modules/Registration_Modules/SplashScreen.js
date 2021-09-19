import React, { Component, Fragment,useEffect } from 'react'
import {
    StyleSheet, Text, Keyboard, AsyncStorage, FlatList,
    View, TouchableOpacity, Image, SafeAreaView, ImageBackground, BackHandler, Alert, Platform, Modal, TextInput, ScrollView, TouchableWithoutFeedback
} from 'react-native'
import { color, width, fontSize, fontFamily, height, LG_BG_THEME } from '../../../Constants/fontsAndColors'
import { Container, Content, connect, Picker, Header, LinearGradient, Snackbar, Splash_screen } from '../../../../Asset/Libraries/NpmList';
import { MyStatusBar_Light } from '../../../../Asset/Libraries/index'
import { Mystatusbar } from '../../../../Asset/Libraries/index'

export default class SplashScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };

    }
    
    componentDidMount() {
        Splash_screen.hide();
        AsyncStorage.getItem("Cass_UserID", (error, Token_Result) => {
            if (Token_Result == "0" || Token_Result == null) {
                setTimeout(() => {
                   this.props.navigation.navigate("Login_Screen")
                }, 2000)
            } else {
                setTimeout(() => {
                    this.props.navigation.navigate("Drawer")
                }, 2000)
            }
        })
    
    }


   
    render() {


        return (
            <LinearGradient key="background" start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[LG_BG_THEME.WHITE_THEME, LG_BG_THEME.WHITE_THEME]} style={{ flex: 1, justifyContent: "center" }} >

                <MyStatusBar_Light />
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 0.3 }} />

                        <View style={{ flex: 0.4, justifyContent: "center", alignItems: "center" }}>
                            <Image source={require('../../../../Asset/Images/App_Themeicon.png')} style={{ width: width / 100 * 60, height: width / 100 * 60 }} />
                        </View>
                        
                        <View style={{ flex: 0.3 }} />
                    </View>
                </TouchableWithoutFeedback>
            </LinearGradient>

        )
    }

}


const styles = StyleSheet.create({

    container_HeaderText: {
        fontSize: fontSize.Medium,
        fontFamily: fontFamily.SegoeUIRegular,
        letterSpacing: width / 100 * 0.1,
        color: color.Font_Black,
        textAlign: "center"
    },
    container_TextTheme: {
        fontSize: fontSize.Large_50,
        fontFamily: fontFamily.SegoeUIRegular,
        letterSpacing: width / 100 * 0.1,
        color: color.Font_LoginTheme,
        textAlign: "center"
    },

    container_Privacy: {
        fontSize: fontSize.lightMedium_50,
        fontFamily: fontFamily.SegoeUIRegular,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.LIGHTGREY_THEME,
        textAlign: "center"
    },
    container_Appname: {
        fontSize: fontSize.ExtraLarge_plus,
        fontFamily: fontFamily.SegoeUIBold,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.APPTHEME_1,
        textAlign: "center"
    },
    container_Signuptext: {
        fontSize: fontSize.Large_50,
        fontFamily: fontFamily.SegoeUIRegular,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.WHITE_THEME,
        textAlign: "center"
    }
});

// const mapStateToProps = (state) => {
//     return {
//         // CommonReducer: state.CommonReducer
//     };
// }

// const mapDispatchToProps = (dispatch) => {
//     return {
//         // DashboardAction : () => { dispatch(DashboardAction()) },

//     }
// }
// export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
