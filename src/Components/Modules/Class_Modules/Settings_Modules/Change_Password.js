import React, { Component, PureComponent } from 'react'
import {
    StyleSheet, Text, Keyboard, AsyncStorage, FlatList,
    View, TouchableOpacity, Image, SafeAreaView, ImageBackground, BackHandler, Alert, Platform, Modal, TextInput, ScrollView, TouchableWithoutFeedback
} from 'react-native'
import { color, width, fontSize, fontFamily, height, LG_BG_THEME } from '../../../Constants/fontsAndColors'
import { Container, Content, connect, Picker, Header, LinearGradient, Snackbar, Splash_screen, base64 } from '../../../../Asset/Libraries/NpmList';
import { Mystatusbar } from '../../../../Asset/Libraries/index'

import { ButtonDesign } from '../../CommonView_Modules/ButtonDesign'
import { AS_HeaderDesign } from '../../CommonView_Modules/AS_HeaderDesign'

import { Cass_APIDetails, Cass_AuthDetails, User_Changepassword } from '././../../../Config/Server'
import { Spinner } from '../../../Config/Spinner';

class Change_Password extends Component {

    constructor(props) {
        super(props);
        this.state = {
            CassUserID: "",
            Old_Password: "",
            New_Password: "",
            Retype_password: ""
        };

    }

    componentDidMount() {
        const { UserInfo_Response } = this.props.CommonReducer

        AsyncStorage.getItem("Cass_UserID", (error, Token_Result) => {
            if (Token_Result != "0" || Token_Result != null) {
                this.setState({ CassUserID: Token_Result, Dashboard_Fetching: false });

            }
        })
    }



    Container_Method(RouteName) {
        Keyboard.dismiss()
        if (RouteName == "Goback") {
            this.props.navigation.goBack()
        } else {

            if (this.state.Old_Password == "") {
                Snackbar.show({
                    title: "Enter Old Password..!",
                    duration: Snackbar.LENGTH_SHORT,
                });
            } else if (this.state.New_Password == "") {
                Snackbar.show({
                    title: "Enter New Password..!",
                    duration: Snackbar.LENGTH_SHORT,
                });
            } else if (this.state.Retype_password == "") {
                Snackbar.show({
                    title: "Enter Retype New Password..!",
                    duration: Snackbar.LENGTH_SHORT,
                });
            } else {

                if(this.state.Retype_password == this.state.New_Password){
                    fetch(User_Changepassword, {
                        method: 'POST',
                        headers: new Headers({
                            'Authorization': "Basic " + base64.encode(Cass_AuthDetails),
                            'X-API-KEY': Cass_APIDetails,
                            'Content-Type': 'application/json',
                        }),
                        body: JSON.stringify({
                            "user_id": this.state.CassUserID,
                            "old_password": this.state.Old_Password,
                            "new_password": this.state.New_Password,                        
                        })
                    })
                        .then((response) => response.json())
                        .then((Jsonresponse) => {
    
                            if (Jsonresponse.status == true) {
                                Snackbar.show({
                                    title: Jsonresponse.message + "..!",
                                    duration: Snackbar.LENGTH_SHORT,
                                });
                                this.setState({ Dashboard_Fetching: false })
    
                                this.props.navigation.navigate("Dashboard")
                            } else {
                                Snackbar.show({
                                    title: Jsonresponse.error + "..!",
                                    duration: Snackbar.LENGTH_SHORT,
                                });
                                this.setState({ Dashboard_Fetching: false })
    
                            }
                        })
                        .catch((error) => {
                            this.setState({ Dashboard_Fetching: false })
                            Snackbar.show({
                                title: "Internal Server Error..!",
                                duration: Snackbar.LENGTH_SHORT,
                            });
                        });
                }else{
                    Snackbar.show({
                        title: "Mismatch New Password and Retype New Paswword..!",
                        duration: Snackbar.LENGTH_SHORT,
                    });
                }
               
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
            <LinearGradient key="background" start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[LG_BG_THEME.WHITE_THEME, LG_BG_THEME.WHITE_THEME]} style={{ flex: 1, }} >
                {spinner}

                <Mystatusbar />

                <View style={{ flex: 1 }}>
                    <AS_HeaderDesign
                        Onpress_RightIcon={() => this.Container_Method("Goback")}
                        Header_Text={"CHANGE PASSWORD"}
                        RightIcon_Status={true}
                        LeftIcon_Status={false}
                    />

                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ScrollView showsVerticalScrollIndicator={false}>

                            <View style={{ flex: 0.7, backgroundColor: LG_BG_THEME.APPTHEME_1, borderBottomLeftRadius: width / 100 * 10, borderBottomRightRadius: width / 100 * 10, }}>

                                <View style={styles.Container_EP_4} />


                                <View style={{ flex: 0.8, marginLeft: width / 100 * 4, marginRight: width / 100 * 4 }} >
                                    <View style={styles.Container_EP_4} />
                                    <View style={{ height: height / 100 * 8, justifyContent: "center", marginLeft: width / 100 * 4, marginRight: width / 100 * 4 }}>

                                    <View style={{ flex: 1, justifyContent: "center", borderRadius: width / 100 * 1, borderBottomColor: LG_BG_THEME.WHITE_THEME, borderBottomWidth: width / 100 * 0.2 }}>
                                            <View style={{ flex: 1, justifyContent: "center", }}>
                                                <TextInput
                                                    placeholder='Old Password'
                                                    ref='Old_Password'
                                                    returnKeyType='next'
                                                    secureTextEntry={true}
                                                    underlineColorAndroid='transparent'
                                                    placeholderTextColor={LG_BG_THEME.WHITE_THEME}
                                                    style={styles.container_Text}
                                                    onChangeText={(Old_Password) => this.setState({ Old_Password })}
                                                    onSubmitEditing={() => this.refs.New_password.focus()}
                                                    selectionColor={LG_BG_THEME.WHITE_THEME}
                                                />
                                            </View>

                                        </View>
                                    </View>

                                    <View style={styles.Container_EP_2} />

                                    <View style={{ height: height / 100 * 8, justifyContent: "center", marginLeft: width / 100 * 4, marginRight: width / 100 * 4 }}>

                                    <View style={{ flex: 1, justifyContent: "center", borderRadius: width / 100 * 1, borderBottomColor: LG_BG_THEME.WHITE_THEME, borderBottomWidth: width / 100 * 0.2 }}>
                                            <View style={{ flex: 1, justifyContent: "center", }}>
                                                <TextInput
                                                    placeholder='New password'
                                                    ref='New_password'
                                                    returnKeyType='next'
                                                    underlineColorAndroid='transparent'
                                                    placeholderTextColor={LG_BG_THEME.WHITE_THEME}
                                                    style={styles.container_Text}
                                                    secureTextEntry={true}
                                                    onChangeText={(New_Password) => this.setState({ New_Password })}
                                                    onSubmitEditing={() => this.refs.Retype_password.focus()}
                                                    selectionColor={LG_BG_THEME.WHITE_THEME}
                                                />
                                            </View>

                                        </View>
                                    </View>

                                    <View style={styles.Container_EP_2} />

                                    <View style={{ height: height / 100 * 8, justifyContent: "center", marginLeft: width / 100 * 4, marginRight: width / 100 * 4 }}>

                                        <View style={{ flex: 1, justifyContent: "center", borderRadius: width / 100 * 1, borderBottomColor: LG_BG_THEME.WHITE_THEME, borderBottomWidth: width / 100 * 0.2 }}>
                                            <View style={{ flex: 1, justifyContent: "center", }}>
                                                <TextInput
                                                    placeholder='Retype New password'
                                                    ref='Retype_password'
                                                    returnKeyType="go"
                                                    underlineColorAndroid='transparent'
                                                    placeholderTextColor={LG_BG_THEME.WHITE_THEME}
                                                    style={styles.container_Text}
                                                    secureTextEntry={true}
                                                    onChangeText={(Retype_password) => this.setState({ Retype_password })}
                                                    onSubmitEditing={() => this.Container_Method("SUBMIT")}
                                                    selectionColor={LG_BG_THEME.WHITE_THEME}
                                                />
                                            </View>

                                        </View>
                                    </View>

                                    <View style={styles.Container_EP_4} />

                                    <ButtonDesign
                                        CMB_BuutonColourcode={LG_BG_THEME.WHITE_THEME}
                                        onPress_BuutonView={() => this.Container_Method("SUBMIT")}
                                        CMB_TextHeader={"SUBMIT"}
                                    />

                                    <View style={styles.Container_EP_4} />

                                </View>
                            </View>

                            <View style={styles.Container_EP_8} />

                        </ScrollView>
                    </TouchableWithoutFeedback>

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
        marginLeft: width / 100 * 2,
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
        // DashboardAction : () => { dispatch(DashboardAction()) },

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Change_Password);
