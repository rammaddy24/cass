import React, { Component, PureComponent } from 'react'
import {
    StyleSheet, Text, Keyboard, AsyncStorage, FlatList,
    View, TouchableOpacity, Image, SafeAreaView, ImageBackground, BackHandler, Alert, Platform, Modal, TextInput, ScrollView, TouchableWithoutFeedback
} from 'react-native'
import { color, width, fontSize, fontFamily, height, LG_BG_THEME } from '../../../Constants/fontsAndColors'
import { Container, Content, connect, Picker, Header, LinearGradient, Snackbar, Splash_screen,base64 } from '../../../../Asset/Libraries/NpmList';
import { Mystatusbar } from '../../../../Asset/Libraries/index'

import { ButtonDesign } from '../../CommonView_Modules/ButtonDesign'
import { AS_HeaderDesign } from '../../CommonView_Modules/AS_HeaderDesign'

import { Basic_Auth, User_DepartmentsList, Cass_APIKEY,Cass_APIDetails,Cass_AuthDetails,User_Update } from '././../../../Config/Server'
import { Spinner } from '../../../Config/Spinner';

class Edit_Settings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            EmailAddress: "",
            UserName: "",
            Department: "",
            User_PIC: "",
            User_ResponseArray: [],
            Dashboard_Fetching: false,
            CassUserID: "",
            CassRoleID: "",
            EngInfo_Response: [],
            Dept_Modal: false,
            Department_Id: [],
            User_Firstname:"",
            User_Lastname:"",
            S1_Engineer_OverallArrayId: [],
            S1_Engineer_UnArrayId: []

        };

    }

    componentDidMount() {
        const { UserInfo_Response } = this.props.CommonReducer

        AsyncStorage.getItem("Cass_UserID", (error, Token_Result) => {
            if (Token_Result != "0" || Token_Result != null) {
                AsyncStorage.getItem("Cass_RoleID", (error, Token_RoleID) => {
                    if (Token_RoleID != "0" || Token_RoleID != null) {
                        this.setState({ CassUserID: Token_Result, CassRoleID: Token_RoleID, Dashboard_Fetching: false }, () => this._fetchdata(Token_Result, Token_RoleID));
                    }
                })
            }
        })

        this.setState({
            User_ResponseArray: UserInfo_Response,
            UserName: UserInfo_Response.username,
            User_Firstname: UserInfo_Response.first_name,
            User_Lastname: UserInfo_Response.last_name,
            Department: UserInfo_Response.department_name,
            EmailAddress: UserInfo_Response.email,
            User_PIC: UserInfo_Response.image,
            Department_Id: UserInfo_Response.department_ids.split(",")
        })
       
        // let DepartmentId = UserInfo_Response.department_ids.split(",")
        // for (let i = 0; i < DepartmentId.length; i++) {
        //     this.state.Department_Id.push({
        //         "id": DepartmentId[i],
        //     })
        // }

    }


    async _fetchdata(Token_Result, Token_RoleID) {
        const EngineerList_Response = await this._fetch_EngineerInfo(Token_Result, Token_RoleID);

        try {
            this.setState({
                Dashboard_Fetching: false
            })

            let EditInfo_Selected = []
            let EditInfo_UnSelected = []

            for (let j = 0; j < EngineerList_Response.Engineer_Info.length; j++) {
                for (let i = 0; i < this.state.Department_Id.length; i++) {
                    if (EngineerList_Response.Engineer_Info[i].id == this.state.Department_Id[i]) {
                        EditInfo_Selected.push({
                            "id": EngineerList_Response.Engineer_Info[j].id,
                            "department_name": EngineerList_Response.Engineer_Info[j].department_name,
                            "status": EngineerList_Response.Engineer_Info[j].status,
                            "isClicked": true,
                        })
                    }
                }
                this.state.S1_Engineer_OverallArrayId.push(EngineerList_Response.Engineer_Info[j].id)
            }


            if(this.state.S1_Engineer_OverallArrayId.length != this.state.Department_Id.length){
                this.setState({
                    S1_Engineer_UnArrayId: this.state.S1_Engineer_OverallArrayId.filter(n => !this.state.Department_Id.includes(n))
                })
    
                for (let j = 0; j < EngineerList_Response.Engineer_Info.length; j++) {
                    for (let i = 0; i < this.state.S1_Engineer_UnArrayId.length; i++) {
                        if (EngineerList_Response.Engineer_Info[j].id == this.state.S1_Engineer_UnArrayId[i]) {
                            EditInfo_UnSelected.push({
                                "id": EngineerList_Response.Engineer_Info[j].id,
                                "department_name": EngineerList_Response.Engineer_Info[j].department_name,
                                "status": EngineerList_Response.Engineer_Info[j].status,
                                "isClicked": false,
                            })
                        }
                    }
                }
            }
           

            this.setState({
                EngInfo_Response: Array.from(new Set(EditInfo_Selected.concat(EditInfo_UnSelected))),
            })


            // for (let i = 0; i < EngineerList_Response.Engineer_Info.length; i++) {
            //     this.state.EngInfo_Response.push({
            //         "id": EngineerList_Response.Engineer_Info[i].id,
            //         "department_name": EngineerList_Response.Engineer_Info[i].department_name,
            //         "status": EngineerList_Response.Engineer_Info[i].status,
            //         "isClicked": false,
            //     })
            // }

            this.forceUpdate()

        } catch (err) {
            this.setState({ Dashboard_Fetching: false });
        }
    }


    _fetch_EngineerInfo(Token_Result, Token_RoleID) {
        return new Promise((resolve, reject) => {
            let EngineersList_URL = User_DepartmentsList + Token_Result + "&user_role=" + Token_RoleID ;
            fetch(EngineersList_URL, {
                method: 'GET',
                headers: new Headers({
                    'Authorization': "Basic " + base64.encode(Cass_AuthDetails),
                    'X-API-KEY': Cass_APIDetails,
                    'Content-Type': 'application/json',
                }),
            })
                .then((response) => response.json())
                .then((Jsonresponse) => {
                    let Engineer_Info = ""
                    if (Jsonresponse.status != false) {
                        Engineer_Info = Jsonresponse
                        resolve({ Engineer_Info });
                    } else {
                        resolve(Engineer_Info)
                    }
                })
                .catch((error) => {
                    this.setState({ Dashboard_Fetching: false });
                    Snackbar.show({
                        title: "Internal Server Error..!",
                        duration: Snackbar.LENGTH_SHORT,
                    });
                });
        });
    }


    Container_Method(RouteName) {
        if (RouteName == "Goback") {
            this.props.navigation.goBack()
        } else {
            const { UserInfo_Response } = this.props.CommonReducer

            fetch(User_Update, {
                method: 'POST',
                headers: new Headers({
                    'Authorization': "Basic " + base64.encode(Cass_AuthDetails),
                    'X-API-KEY': Cass_APIDetails,
                    'Content-Type': 'application/json',
                }),
                body: JSON.stringify({
                    "email": this.state.EmailAddress,
                    "username": this.state.UserName,
                    "department_id": UserInfo_Response.department_ids,
                    "image": this.state.User_PIC,
                    "user_id": UserInfo_Response.id,
                    "user_role": UserInfo_Response.role_id,
                    "role_id": UserInfo_Response.role_id,
                    "status": UserInfo_Response.status,
                    "first_name": this.state.User_Firstname,
                    "last_name": this.state.User_Lastname,
                    "phone": UserInfo_Response.phone,
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

        }
    }

    Container_Model(RouteName) {

        const { EngInfo_Response } = this.state;

        this.setState({
            Dept_Modal: RouteName
        })
        this.forceUpdate()
    }

    Dept_ToggleMethod(RouteName) {
        const { EngInfo_Response,Department_Id } = this.state;

        for (let i = 0; i < EngInfo_Response.length; i++) {

            if (EngInfo_Response[i].id == RouteName.id) {
                if (EngInfo_Response[i].isClicked == false) {
                    EngInfo_Response[i].isClicked = true

                    // this.state.Department_Id.push(RouteName)
                    // this.setState({
                    //     Department_Id: Array.from(new Set(this.state.S1_Engineer_ArrayId))
                    // })
                } else {
                    EngInfo_Response[i].isClicked = false
                    // var Id = []
                    // for (hv = 0; hv < this.state.Department_Id.length; hv++) {
                    //     Id.push(this.state.Department_Id[hv])
                    // }
                    // var Dept_Id = this.state.Department_Id.splice(Id.indexOf(RouteName.id), 1);
                    // this.setState({ Department_Id: Dept_Id})
                    // this.setState({
                    //     Department_Id: Array.from(new Set(this.state.Department_Id)),
                    // })
                }
            }

        }

        this.forceUpdate()
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
                        Header_Text={"SETTINGS"}
                        RightIcon_Status={true}
                        LeftIcon_Status={false}
                    />

                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ScrollView showsVerticalScrollIndicator={false}>

                            <View style={{ flex: 0.7, backgroundColor: LG_BG_THEME.APPTHEME_1, borderBottomLeftRadius: width / 100 * 10, borderBottomRightRadius: width / 100 * 10, }}>

                                <View style={styles.Container_EP_4} />

                                <View style={{ flex: 0.2, justifyContent: "center", alignItems: 'center', backgroundColor: LG_BG_THEME.APPTHEME_1, }}>

                                    <View style={{ height: width / 100 * 20, width: width / 100 * 20, borderRadius: width / 100 * 10, justifyContent: "center", backgroundColor: LG_BG_THEME.APPTHEME_BG, alignItems: 'center', borderColor: LG_BG_THEME.WHITE_THEME, borderWidth: width / 100 * 0.6 }}>
                                        <Image source={{ uri: this.state.User_PIC }} style={{ width: width / 100 * 14, height: width / 100 * 14,borderRadius:width/100*7  }} />
                                    </View>

                                </View>

                                <View style={{ flex: 0.8, marginLeft: width / 100 * 4, marginRight: width / 100 * 4 }} >
                                    <View style={styles.Container_EP_4} />
                                    <View style={{ height: height / 100 * 8, justifyContent: "center", marginLeft: width / 100 * 4, marginRight: width / 100 * 4 }}>

                                        <View style={{ height: height / 100 * 8, justifyContent: "center", borderRadius: width / 100 * 1, borderBottomColor: LG_BG_THEME.WHITE_THEME, borderBottomWidth: width / 100 * 0.2 }}>
                                            <View style={{ flex: 1, justifyContent: "center", }}>
                                                <TextInput
                                                    placeholder='Name'
                                                    ref='Name'
                                                    returnKeyType='next'
                                                    underlineColorAndroid='transparent'
                                                    placeholderTextColor={LG_BG_THEME.WHITE_THEME}
                                                    style={styles.container_Text}
                                                    onChangeText={(User_Firstname) => this.setState({ User_Firstname })}
                                                    onSubmitEditing={() => this.refs.Department.focus()}
                                                    value={this.state.User_Firstname}
                                                    selectionColor={LG_BG_THEME.WHITE_THEME}

                                                />
                                            </View>
                                          
                                        </View>
                                    </View>

                                    <View style={styles.Container_EP_2} />

                                    <View style={{ height: height / 100 * 8, justifyContent: "center", marginLeft: width / 100 * 4, marginRight: width / 100 * 4 }}>

                                        <View style={{ height: height / 100 * 8, justifyContent: "center", borderRadius: width / 100 * 1, borderBottomColor: LG_BG_THEME.WHITE_THEME, borderBottomWidth: width / 100 * 0.2 }}>
                                            <View style={{ flex: 1, justifyContent: "center", }}>
                                                <TextInput
                                                    placeholder='Name'
                                                    ref='Name'
                                                    returnKeyType='next'
                                                    underlineColorAndroid='transparent'
                                                    placeholderTextColor={LG_BG_THEME.WHITE_THEME}
                                                    style={styles.container_Text}
                                                    onChangeText={(User_Lastname) => this.setState({ User_Lastname })}
                                                    onSubmitEditing={() => this.refs.Department.focus()}
                                                    value={this.state.User_Lastname}
                                                    selectionColor={LG_BG_THEME.WHITE_THEME}

                                                />
                                            </View>

                                        </View>
                                    </View>

                                    <View style={styles.Container_EP_2} />

                                    <View style={{ height: height / 100 * 8, justifyContent: "center", marginLeft: width / 100 * 4, marginRight: width / 100 * 4 }}>

                                        <View style={{ height: height / 100 * 8, justifyContent: "center", borderRadius: width / 100 * 1, borderBottomColor: LG_BG_THEME.WHITE_THEME, borderBottomWidth: width / 100 * 0.2 }}>
                                            <TouchableOpacity onPress={() => this.Container_Model(true, "Open")} style={{ flex: 1, justifyContent: "center", }}>
                                                <Text numberOfLines={1} style={styles.container_Text}>{this.state.Department}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={styles.Container_EP_2} />
                                    <View style={{ height: height / 100 * 8, justifyContent: "center", marginLeft: width / 100 * 4, marginRight: width / 100 * 4 }}>

                                        <View style={{ height: height / 100 * 8, justifyContent: "center", borderRadius: width / 100 * 1, borderBottomColor: LG_BG_THEME.WHITE_THEME, borderBottomWidth: width / 100 * 0.2 }}>

                                            <View style={{ flex: 1, justifyContent: "center", }}>

                                                <TextInput
                                                    placeholder='Email'
                                                    ref='Email'
                                                    returnKeyType="go"
                                                    editable={false}
                                                    underlineColorAndroid='transparent'
                                                    placeholderTextColor={LG_BG_THEME.WHITE_THEME}
                                                    style={styles.container_Text}
                                                    onChangeText={(EmailAddress) => this.setState({ EmailAddress })}
                                                    onSubmitEditing={() => this.Container_Method("SUBMIT")}
                                                    value={this.state.EmailAddress}
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


                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={this.state.Dept_Modal}
                    animationType="slide"
                    onRequestClose={() => { this.setState({ Dept_Modal: false }) }}>

                    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <View style={{ height: "100%", justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: width / 100 * 2, flexDirection: "row" }}>

                                <View style={{ flex: 0.1, }} />
                                <View style={{ flex: 0.8, justifyContent: 'center' }}>

                                    <View style={{ height: width / 100 * 12, justifyContent: 'center', alignSelf: 'center', backgroundColor: LG_BG_THEME.APPTHEME_1, borderTopLeftRadius: width / 100 * 2, borderTopRightRadius: width / 100 * 2, flexDirection: 'row' }}>
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text numberOfLines={1} style={{ fontSize: fontSize.Medium, fontFamily: fontFamily.Poppins_Bold, letterSpacing: width / 100 * 0.1, color: color.Font_Whitecolor, textAlign: "center" }}>{"DEPARTMENT INFO"}</Text>
                                        </View>
                                    </View>

                                    <View style={{ height: width / 100 * 70, justifyContent: 'center', backgroundColor: LG_BG_THEME.WHITE_THEME, }}>

                                        <View style={styles.Container_EP_2} />

                                        <FlatList style={{ flex: 1 }}
                                            data={this.state.EngInfo_Response}
                                            showsVerticalScrollIndicator={false}
                                            keyExtractor={(item, index) => item.key}
                                            renderItem={({ item, index }) =>
                                                <View  style={{ flex: 1, justifyContent: "center", marginLeft: height / 100 * 2, marginRight: height / 100 * 2, marginTop: width / 100 * 5, borderBottomColor: LG_BG_THEME.APPTHEME_GREY_2, borderBottomWidth: width / 100 * 0.2 }}>
                                                    <View style={{ flex: 0.05, justifyContent: 'center' }} />
                                                    <View style={{ flex: 0.9, justifyContent: 'center', flexDirection: "row" }}>
                                                        <View style={{ flex: 0.15, justifyContent: 'center', alignItems: "center" }}>
                                                            <Text numberOfLines={1} style={{ fontSize: fontSize.Medium, fontFamily: fontFamily.Poppins_Regular, letterSpacing: width / 100 * 0.1, color: color.Font_Black, textAlign: "center", marginLeft: width / 100 * 2 }}>{index + 1 + ". "}</Text>
                                                        </View>
                                                        <View style={{ flex: 0.70, justifyContent: 'center' }}>
                                                            <Text numberOfLines={2} style={{ fontSize: fontSize.Medium, fontFamily: fontFamily.Poppins_Regular, letterSpacing: width / 100 * 0.1, color: color.Font_Black, textAlign: "left", marginLeft: width / 100 * 2 }}>{item.department_name}</Text>
                                                        </View>
                                                        <View style={{ flex: 0.15, justifyContent: 'center', alignItems: "center" }}>
                                                            {/* <Image source={require('../../../../Asset/Icons/Toggle.png')} style={{ width: width / 100 * 6, height: width / 100 * 6, tintColor: item.isClicked == false ? LG_BG_THEME.APPTHEME_BLACK : LG_BG_THEME.APPTHEME_1, transform: item.isClicked == true ? [{ rotate: '0deg' }] : [{ rotate: '180deg' }] }} /> */}
                                                        </View>
                                                    </View>
                                                    <View style={{ flex: 0.05, justifyContent: 'center', alignItems: "center" }} />
                                                </View>

                                            }
                                        />

                                        <View style={styles.Container_EP_2} />

                                    </View>

                                    <View style={{ height: width / 100 * 12, justifyContent: 'center', alignSelf: 'center', backgroundColor: LG_BG_THEME.APPTHEME_1, borderBottomLeftRadius: width / 100 * 2, borderBottomRightRadius: width / 100 * 2, flexDirection: 'row' }}>
                                        <TouchableOpacity onPress={() => this.Container_Model(false, "Close")} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text numberOfLines={1} style={{ fontSize: fontSize.Medium, fontFamily: fontFamily.Poppins_Bold, letterSpacing: width / 100 * 0.1, color: color.Font_Whitecolor, textAlign: "center" }}>{"Cancel"}</Text>
                                        </TouchableOpacity>
                                        

                                    </View>
                                </View>

                                <View style={{ flex: 0.1, }} />

                            </View>

                        </View>
                    </View>
                </Modal>

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
export default connect(mapStateToProps, mapDispatchToProps)(Edit_Settings);
