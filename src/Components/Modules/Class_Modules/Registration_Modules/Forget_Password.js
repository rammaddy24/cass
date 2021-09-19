import React, { Component, PureComponent } from 'react'
import {
    StyleSheet, Text, Keyboard, AsyncStorage, FlatList,
    View, TouchableOpacity, Image, SafeAreaView, ImageBackground, BackHandler, Alert, Platform, Modal, TextInput, ScrollView, TouchableWithoutFeedback
} from 'react-native'
import { color, width, fontSize, fontFamily, height, LG_BG_THEME } from '../../../Constants/fontsAndColors'
import { Container, Content, connect, Picker, Header, LinearGradient, Snackbar, Splash_screen ,base64} from '../../../../Asset/Libraries/NpmList';
import { MyStatusBar_Light } from '../../../../Asset/Libraries/index'

import { ButtonDesign } from '../../CommonView_Modules/ButtonDesign'
import { Cass_AuthDetails, User_ForgotPassword, Cass_APIDetails } from '././../../../Config/Server'
import { Spinner } from '../../../Config/Spinner';

class Forget_Password extends Component {

    constructor(props) {
        super(props);
        this.state = {
            EmailAddress: "",
            Alert_Design_isVisible: false,
            Password_Result: "",
            Dashboard_Fetching: false
        };

    }


    Container_Method(RouteName) {
        if (RouteName == "Goback") {
            this.props.navigation.goBack()
        } else {

            if (this.state.EmailAddress == "") {
                Snackbar.show({
                    title: 'Enter Email Address..!',
                    duration: Snackbar.LENGTH_SHORT,
                });
            } else {
                this.setState({ Dashboard_Fetching: true })

                let ForgotPassword_URL = User_ForgotPassword + this.state.EmailAddress ;
                fetch(ForgotPassword_URL, {
                    method: 'GET',
                    headers: new Headers({
                        'Authorization': "Basic " + base64.encode(Cass_AuthDetails),
                        'X-API-KEY': Cass_APIDetails,
                        'Content-Type': 'application/json',
                    }),
                })
                    .then((response) => response.json())
                    .then((Jsonresponse) => {
                        if (Jsonresponse.status == false) {
                            setTimeout(() => {
                                Snackbar.show({
                                    title: Jsonresponse.message + "..!",
                                    duration: Snackbar.LENGTH_SHORT,
                                });
                             }, 1000)
                            this.setState({ Dashboard_Fetching: false })
                        } else {
                            this.setState({ Alert_Design_isVisible: true, Password_Result: Jsonresponse.password, Dashboard_Fetching: false })
                        }
                    })
                    .catch((error) => {
                        this.setState({ Dashboard_Fetching: false })

                        Snackbar.show({
                            title: "Internal Server Error..!",
                            duration: Snackbar.LENGTH_SHORT,
                        });
                    });

                //
            }
        }
    }

    onRequestClose(RouteName) {
        if (RouteName == "OK") {
            this.setState({ Alert_Design_isVisible: false })
            this.props.navigation.navigate("Login_Screen")
        } else {
            this.setState({ Alert_Design_isVisible: false })

        }
    }

    AlertPopup_Method() {
        return (
            <Modal
                animationType='slide'
                transparent={true}
                visible={this.state.Alert_Design_isVisible}
                onRequestClose={() => { this.onRequestClose() }}>

                <View style={{ flex: 1, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={{ height: "100%", width: width / 100 * 100, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', backgroundColor: 'transparent' }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: width / 100 * 2 }}>

                            <View style={{ height: width / 100 * 2, width: width / 100 * 80, justifyContent: 'center', alignSelf: 'center', backgroundColor: color.Font_Whitecolor, borderTopLeftRadius: width / 100 * 2, borderTopRightRadius: width / 100 * 2 }} />

                            <View style={{ height: width / 100 * 8, width: width / 100 * 80, justifyContent: 'center', alignSelf: 'center', backgroundColor: color.Font_Whitecolor }}>
                                <Text numberOfLines={1} style={{ fontSize: fontSize.lightMedium, fontFamily: fontFamily.LatoHeavy, letterSpacing: width / 100 * 0.1, color: color.Font_Black, textAlign: "center" }}>{"Authentication Success..!"}</Text>

                            </View>
                            <View style={{ height: width / 100 * 0.2, width: width / 100 * 80, justifyContent: 'center', alignSelf: 'center', backgroundColor: LG_BG_THEME.APPTHEME_1, marginLeft: width / 100 * 1, marginRight: width / 100 * 1 }} />

                            <View style={{ height: width / 100 * 15, width: width / 100 * 80, justifyContent: 'center', alignSelf: 'center', backgroundColor: color.Font_Whitecolor, }}>
                                <Text numberOfLines={3} style={{ fontSize: fontSize.lightMedium_50, fontFamily: fontFamily.LatoSemibold, letterSpacing: width / 100 * 0.1, color: color.Font_Black, textAlign: "center", marginLeft: width / 100 * 1, marginRight: width / 100 * 1 }}>{"Please Check your Mail id to get the Password"}</Text>

                            </View>

                            <View style={{ height: width / 100 * 0.5, width: width / 100 * 80, justifyContent: 'center', alignSelf: 'center', backgroundColor: LG_BG_THEME.APPTHEME_1, marginLeft: width / 100 * 1, marginRight: width / 100 * 1 }} />

                            <TouchableOpacity onPress={() => this.onRequestClose("OK")} style={{ height: width / 100 * 10, width: width / 100 * 80, justifyContent: 'center', alignSelf: 'center', backgroundColor: LG_BG_THEME.APPTHEME_1, borderBottomLeftRadius: width / 100 * 2, borderBottomRightRadius: width / 100 * 2, alignItems: "center" }}>
                                <Text numberOfLines={1} style={{ fontSize: fontSize.lightMedium_50, fontFamily: fontFamily.LatoBold, letterSpacing: width / 100 * 0.1, color: color.Font_Whitecolor, textAlign: "center" }}>{"OK"}</Text>
                            </TouchableOpacity>

                        </View>

                    </View>
                </View>
            </Modal>
        )
    }

    render() {

        const { Dashboard_Fetching } = this.state;

        var spinner = false;
        if (Dashboard_Fetching == true) {
            spinner = <Spinner visibility={true} />
        } else {
            spinner = false
        }


        return (
            <LinearGradient key="background" start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[LG_BG_THEME.WHITE_THEME, LG_BG_THEME.WHITE_THEME]} style={{ flex: 1, justifyContent: "center" }} >
                {this.state.Alert_Design_isVisible == true ? this.AlertPopup_Method() : null}
                {spinner}
                <MyStatusBar_Light />

                <View style={{ flex: 1 }}>

                    <View style={{ flex: 0.3, justifyContent: "center", alignItems: "center" }}>
                        <Image source={require('../../../../Asset/Images/App_Themeicon.png')} style={{ width: width / 100 * 35, height: width / 100 * 35 }} />
                    </View>

                    <View style={{ flex: 0.7, backgroundColor: LG_BG_THEME.APPTHEME_1, borderTopLeftRadius: width / 100 * 10, borderTopRightRadius: width / 100 * 10, }}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <ScrollView showsVerticalScrollIndicator={false} style={{ marginLeft: width / 100 * 2, marginRight: width / 100 * 2 }}>

                                <View style={styles.Container_EP_12} />
                                <View style={{ height: height / 100 * 8, justifyContent: "center", marginLeft: width / 100 * 4, marginRight: width / 100 * 4 }}>

                                    <View style={{ height: height / 100 * 8, justifyContent: "center", borderRadius: width / 100 * 1, borderBottomColor: LG_BG_THEME.APPTHEME_BLACK, borderBottomWidth: width / 100 * 0.2 }}>


                                        <View style={{ flex: 1, justifyContent: "center", }}>

                                            <TextInput
                                                placeholder='Email Address'
                                                ref='EmailAddress'
                                                returnKeyType='next'
                                                underlineColorAndroid='transparent'
                                                placeholderTextColor={LG_BG_THEME.WHITE_THEME}
                                                selectionColor={LG_BG_THEME.WHITE_THEME}
                                                style={styles.container_Text}
                                                onChangeText={(EmailAddress) => this.setState({ EmailAddress })}
                                                onSubmitEditing={() => this.Container_Method("Login_Screen")}

                                            />
                                        </View>

                                    </View>
                                </View>

                                <View style={styles.Container_EP_2} />


                                <TouchableOpacity onPress={() => this.Container_Method("Goback")} style={{ height: height / 100 * 4, justifyContent: "center", alignItems: "flex-end", marginLeft: width / 100 * 4, marginRight: width / 100 * 4 }}>
                                    <Text style={styles.container_Text}>{"Sign In"}</Text>
                                </TouchableOpacity>


                                <View style={styles.Container_EP_4} />

                                <ButtonDesign
                                    CMB_BuutonColourcode={LG_BG_THEME.WHITE_THEME}
                                    onPress_BuutonView={() => this.Container_Method("Login_Screen")}
                                    CMB_TextHeader={"SUBMIT"}
                                />

                            </ScrollView>
                        </TouchableWithoutFeedback>
                    </View>
                </View>

            </LinearGradient>

        )
    }

}


const styles = StyleSheet.create({

    container_Text: {
        fontSize: fontSize.lightMedium,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.WHITE_THEME,
        marginLeft: width / 100 * 2
    },
    Container_EP_2: {
        height: height / 100 * 2
    },
    Container_EP_4: {
        height: height / 100 * 4
    },
    Container_EP_8: {
        height: height / 100 * 8
    },
    Container_EP_12: {
        height: height / 100 * 12
    }
});

const mapStateToProps = (state) => {
    return {
        // CommonReducer: state.CommonReducer
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        // DashboardAction : () => { dispatch(DashboardAction()) },

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Forget_Password);
