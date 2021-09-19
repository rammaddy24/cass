
import React, { Component, PureComponent } from 'react'
import {
    StyleSheet, Text, Keyboard, AsyncStorage, FlatList,
    View, TouchableOpacity, Image, SafeAreaView, ImageBackground, BackHandler, Alert, Platform, Modal, TextInput, ScrollView, TouchableWithoutFeedback
} from 'react-native'
import { color, width, fontSize, fontFamily, height, LG_BG_THEME } from '../../../Constants/fontsAndColors'
import { Container, Content, connect, Picker, Header, LinearGradient, Snackbar, Splash_screen, base64 } from '../../../../Asset/Libraries/NpmList';
import { MyStatusBar_Light } from '../../../../Asset/Libraries/index'
import { ButtonDesign } from '../../CommonView_Modules/ButtonDesign'

import { Cass_APIDetails, Cass_AuthDetails, User_Login, } from '././../../../Config/Server'
import { Cass_UserLogin } from '../../../../Redux/Actions/Cass_UserLogin';
import { notifications, messages } from "react-native-firebase-push-notifications"
import DeviceInfo from 'react-native-device-info';

import { Spinner } from '../../../Config/Spinner';

class Login_Screen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            EmailAddress: "testdev@gmail.com",
            Password: "dev@123",
            // EmailAddress: "",
            // Password: "",
            Notification_ID: "",
            Device_ID: "",
            Dashboard_Fetching: false

        };

    }

    componentDidMount() {
        //this.getInitialNotification()
        this.onTokenButtonPress()
    }

    onTokenButtonPress = async () => {
        const token = await this.getToken()
        this.setState({
            Notification_ID: token,
            Device_ID: DeviceInfo.getUniqueId()

        })
    }

    getToken = async () => {
        //get the messeging token
        const token = await notifications.getToken()
        //you can also call messages.getToken() (does the same thing)
        return token
    }

    // getInitialNotification = async () => {
    //     const notification = await notifications.getInitialNotification()
    //     return notification
    // }


    
    Container_Method(RouteName) {
        if (RouteName == "Forgot_Password") {
            this.props.navigation.navigate("Forget_Password")
        } else {

            if (this.state.EmailAddress == "") {
                Snackbar.show({
                    title: 'Enter Email Address..!',
                    duration: Snackbar.LENGTH_SHORT,
                });
            } else if (this.state.Password == "") {
                Snackbar.show({
                    title: 'Enter Password..!',
                    duration: Snackbar.LENGTH_SHORT,
                });
            } else {
                this.setState({ Dashboard_Fetching: true })
                fetch(User_Login, {
                    method: 'POST',
                    headers: new Headers({
                        'Authorization': "Basic " + base64.encode(Cass_AuthDetails),
                        'X-API-KEY': Cass_APIDetails,
                        'Content-Type': 'application/json',
                    }),
                    body: JSON.stringify({
                        "email": this.state.EmailAddress,
                        "password": this.state.Password,
                        "push_notify_id": this.state.Notification_ID,
                        "device_token": this.state.Device_ID,
                    })
                })
                    .then((response) => response.json())
                    .then((Jsonresponse) => {

                        this.setState({ Dashboard_Fetching: false })

                        
                        if (Jsonresponse.status == true) {
                            AsyncStorage.setItem('Cass_UserID', Jsonresponse.data.id.toString(), () => {

                            });
                            AsyncStorage.setItem('Cass_RoleID', Jsonresponse.data.role_id.toString(), () => {

                            });

                            AsyncStorage.setItem('Cass_DeviceID', this.state.Device_ID, () => {

                            });
                            AsyncStorage.setItem('Cass_Pushnotify', this.state.Notification_ID, () => {
                    
                            });
                            
                           this.props.navigation.navigate("Drawer")
                           setTimeout(() => {
                            Snackbar.show({
                                title: Jsonresponse.message + "..!",
                                duration: Snackbar.LENGTH_SHORT,
                            });
                         }, 1000)
                        }else{
                            setTimeout(() => {
                                Snackbar.show({
                                    title: Jsonresponse.error + "..!",
                                    duration: Snackbar.LENGTH_SHORT,
                                });
                             }, 1000)
                        }
                       
                      
                    })
                    .catch((error) => {
                        this.setState({ Dashboard_Fetching: false })                        
                        Snackbar.show({
                            title: "Internal Server Error..!",
                            duration: Snackbar.LENGTH_SHORT,
                        });
                    });
            }
        }
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
                                                value={this.state.EmailAddress}
                                                onSubmitEditing={() => this.refs.Password.focus()}

                                            />
                                        </View>

                                    </View>
                                </View>

                                <View style={styles.Container_EP_2} />

                                <View style={{ height: height / 100 * 8, justifyContent: "center", marginLeft: width / 100 * 4, marginRight: width / 100 * 4 }}>

                                    <View style={{ height: height / 100 * 8, justifyContent: "center", borderRadius: width / 100 * 1, borderBottomColor: LG_BG_THEME.APPTHEME_BLACK, borderBottomWidth: width / 100 * 0.2 }}>


                                        <View style={{ flex: 1, justifyContent: "center", }}>

                                            <TextInput
                                                placeholder='Password'
                                                ref='Password'
                                                returnKeyType="go"
                                                selectionColor={LG_BG_THEME.WHITE_THEME}
                                                secureTextEntry={true}
                                                underlineColorAndroid='transparent'
                                                placeholderTextColor={LG_BG_THEME.WHITE_THEME}
                                                style={styles.container_Text}
                                                onChangeText={(Password) => this.setState({ Password })}
                                                value={this.state.Password}
                                                onSubmitEditing={() => this.Container_Method("Login")}
                                            />
                                        </View>

                                    </View>
                                </View>
                                <View style={styles.Container_EP_2} />
                                <TouchableOpacity onPress={() => this.Container_Method("Forgot_Password")} style={{ height: height / 100 * 4, justifyContent: "center", alignItems: "flex-end", marginLeft: width / 100 * 4, marginRight: width / 100 * 4 }}>
                                    <Text style={styles.container_Text}>{"Forget Password?"}</Text>
                                </TouchableOpacity>


                                <View style={styles.Container_EP_4} />

                                <ButtonDesign
                                    CMB_BuutonColourcode={LG_BG_THEME.WHITE_THEME}
                                    onPress_BuutonView={() => this.Container_Method("Login")}
                                    CMB_TextHeader={"SUBMIT"}
                                />
                                <View style={styles.Container_EP_4} />

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
        CommonReducer: state.CommonReducer
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        Cass_UserLogin: (Username, Password,) => {
            dispatch(Cass_UserLogin(Username, Password));
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login_Screen);
