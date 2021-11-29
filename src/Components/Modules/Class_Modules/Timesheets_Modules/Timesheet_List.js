import React, { Component, PureComponent } from 'react'
import {
    StyleSheet, Text, Keyboard, AsyncStorage, FlatList,
    View, TouchableOpacity, Image, SafeAreaView, ImageBackground, BackHandler, Alert, Platform, Modal, TextInput, ScrollView, TouchableWithoutFeedback
} from 'react-native'
import { color, width, fontSize, fontFamily, height, LG_BG_THEME, Notify_THEME } from '../../../Constants/fontsAndColors'
import { Container, Content, connect, Picker, Header, LinearGradient, Snackbar, Splash_screen, Moment, base64 } from '../../../../Asset/Libraries/NpmList';
import { Mystatusbar } from '../../../../Asset/Libraries/index'

import { ASS_HeaderDesign } from '../../CommonView_Modules/ASS_HeaderDesign'
import { Card_Timesheets } from '../../CommonView_Modules/Card_Timesheets'
import { Modal_Text } from '../../CommonView_Modules/Modal_Text'

import { Cass_APIDetails, Cass_AuthDetails, List_Timesheet, User_Authinfo, User_Logout } from '././../../../Config/Server'
import { Spinner } from '../../../Config/Spinner';
import Draft_List from './Draft_List';

import { Timesheets_DataAction } from '../../../../Redux/Actions/Timesheets_DataAction'
import { Timesheets_EditAction } from '../../../../Redux/Actions/Timesheets_EditAction'

class Timesheet_List extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Timelist_ResponseArray: [],
            TimeSheets_Array: [],
            Info_Modal: false,
            StartDate: '',
            CassUserID: "",
            CassRoleID: '',
            Leave_SD: "",
            Dashboard_Fetching: false,
            JobNumber: "",
            Alert_Design_isVisible: false,
            Cass_DeviceID: "",
            Cass_NotifyID: "",
            Job_ID: "",
            Sorting_isVisible: false,
            Timelist_RA: [],
            Reset_Enable: false,
            Pagination_Status: 1,
            TS_SearchText: "",
            activeTab: props.navigation.state.params.draftList?1:0
        };
        this.onEndReachedCalledDuringMomentum = true;
    }

    componentDidMount() {
    
        AsyncStorage.getItem("Cass_UserID", (error, Token_Result) => {
            if (Token_Result != "0" || Token_Result != null) {
                AsyncStorage.getItem("Cass_DeviceID", (error, Token_DeviceID) => {
                    AsyncStorage.getItem("Cass_Pushnotify", (error, Token_NotifyID) => {
                        if (Token_DeviceID != "0" || Token_DeviceID != null) {
                            this.setState({ Dashboard_Fetching: true, CassUserID: Token_Result, Cass_DeviceID: Token_DeviceID, Cass_NotifyID: Token_NotifyID }, () => this.API_AUTH(Token_Result, Token_DeviceID, Token_NotifyID));
                        } else {
                            this.setState({ Alert_Design_isVisible: true, Dashboard_Fetching: false })
                        }
                    })
                })
            }
        })

    }


    async API_AUTH(Token_Result, Token_DeviceID, Token_NotifyID) {

        let UserInfo_URL = User_Authinfo + Token_Result + "&device_token=" + Token_DeviceID + "&push_notify_id=" + Token_NotifyID;
        fetch(UserInfo_URL, {
            method: 'GET',
            headers: new Headers({
                'Authorization': "Basic " + base64.encode(Cass_AuthDetails),
                'X-API-KEY': Cass_APIDetails,
                'Content-Type': 'application/json',
            }),
        })
            .then((response) => response.json())
            .then((Jsonresponse) => {
                if (parseInt(Jsonresponse.logged_in) == 1) {
                    this.Authorization_success()
                } else {
                    this.setState({ Alert_Design_isVisible: true, Dashboard_Fetching: false })
                }
            })
            .catch((error) => {
                this.setState({ Dashboard_Fetching: false });
                Snackbar.show({
                    title: "Internal Server Error..!",
                    duration: Snackbar.LENGTH_SHORT,
                });
            });
    }

    Authorization_success() {
        const { state } = this.props.navigation;
        let Calendar_Date = state.params.CalendarDate
        let Job_Number = state.params.Job_Number
        let Job_IDParms = state.params.Job_IDNumber

        this.setState({
            StartDate: Calendar_Date == "" ? "" : Moment(Calendar_Date).format('DD-MMM-YY'),
            Leave_SD: Calendar_Date == "" ? "" : Moment(Calendar_Date).format('YYYY-MM-DD'),
        })
        AsyncStorage.getItem("Cass_UserID", (error, Token_Result) => {
            if (Token_Result != "0" || Token_Result != null) {
                AsyncStorage.getItem("Cass_RoleID", (error, Token_RoleID) => {
                    if (Token_RoleID != "0" || Token_RoleID != null) {
                        this.setState({ CassUserID: Token_Result, CassRoleID: Token_RoleID, Dashboard_Fetching: true, JobNumber: Job_Number, Job_ID: Job_IDParms }, () => this._fetchdata(Token_Result, Token_RoleID, 1));
                    }
                })
            }
        })
    }


    async _fetchdata(Token_Result, Token_RoleID, Page_Number) {
        const Timesheets_Response = await this._fetch_TSInfo(Token_Result, Token_RoleID, Page_Number);
        try {
            if (Timesheets_Response.TS_Info != undefined) {
                this.setState({
                    Timelist_ResponseArray: Timesheets_Response.TS_Info,
                    Timelist_RA: Timesheets_Response.TS_Info,
                    Dashboard_Fetching: false
                })
            }
        } catch (err) {
            this.setState({ Dashboard_Fetching: false });
        }
    }

    async _fetchEnddata(Token_Result, Token_RoleID, JobNumber) {
        const Timesheets_Response = await this._fetch_TSInfo(Token_Result, Token_RoleID, this.state.Pagination_Status);
        try {

            if (Timesheets_Response.TS_Info != undefined) {
                this.setState({
                    Timelist_ResponseArray: Array.from(new Set(Array.from(new Set(this.state.Timelist_ResponseArray)).concat(Array.from(new Set(Timesheets_Response.TS_Info))))),
                    Timelist_RA: Array.from(new Set(Array.from(new Set(this.state.Timelist_ResponseArray)).concat(Array.from(new Set(Timesheets_Response.TS_Info))))),
                    Dashboard_Fetching: false
                })
            }
        } catch (err) {
            this.setState({ Dashboard_Fetching: false });
        }
    }

    _fetch_TSInfo(Token_Result, Token_RoleID, Page_Number) {
        return new Promise((resolve, reject) => {
            let TSJob_URL = (List_Timesheet + Token_Result + "&user_role=" + Token_RoleID + "&job_no=" + this.state.JobNumber + "&pagination=" + Page_Number)
            let TSDate_URL = (List_Timesheet + Token_Result + "&user_role=" + Token_RoleID + "&date=" + this.state.Leave_SD + "&pagination=" + Page_Number);
            let TSEmpty_URL = (List_Timesheet + Token_Result + "&user_role=" + Token_RoleID + "&pagination=" + Page_Number);
            let TSJobID_URL = (List_Timesheet + Token_Result + "&user_role=" + Token_RoleID + "&id=" + this.state.Job_ID);


            let TSInfo_URL = this.state.JobNumber != "" ? TSJob_URL : this.state.Leave_SD != "" ? TSDate_URL : this.state.Job_ID != "" ? TSJobID_URL : TSEmpty_URL
          
            const { draftList } = this.props.navigation.state.params;
            if(draftList!==undefined){
                TSInfo_URL =TSEmpty_URL;
            }

            fetch(TSInfo_URL, {
                method: 'GET',
                headers: new Headers({
                    'Authorization': "Basic " + base64.encode(Cass_AuthDetails),
                    'X-API-KEY': Cass_APIDetails,
                    'Content-Type': 'application/json',
                }),
            })
                .then((response) => response.json())
                .then((Jsonresponse) => {

                    let TS_Info = "";
                    if (Jsonresponse.status != false) {
                        TS_Info = Jsonresponse;

                        resolve({ TS_Info });
                    } else {
                        this.setState({ Dashboard_Fetching: false });
                        Snackbar.show({
                            title: Jsonresponse.message,
                            duration: Snackbar.LENGTH_SHORT,
                        });
                        resolve(TS_Info)
                    }
                })
                .catch((error) => {
                    resolve("")
                    this.setState({ Dashboard_Fetching: false });
                    Snackbar.show({
                        title: "Internal Server Error..!",
                        duration: Snackbar.LENGTH_SHORT,
                    });
                });
        });
    }

    Container_Method(RouteName, Route_Data) {

        const { UserInfo_Response } = this.props.CommonReducer

        if (RouteName == "Goback") {
            this.props.navigation.goBack()
        } else if (RouteName == "Info") {
            this.setState({ Info_Modal: true })
        } else if (RouteName == "More") {
            this.setState({ Sorting_isVisible: true })
        } else {

            if (RouteName == "Edit") {

                if (Route_Data.submitter_name == UserInfo_Response.first_name.concat(" "+UserInfo_Response.last_name)) {
                    this.props.Timesheets_EditAction(Route_Data)
                } else {
                    Snackbar.show({
                        title: "Only Subimter can edit timesheet..!",
                        duration: Snackbar.LENGTH_SHORT,
                    });
                }

            } else {
                this.props.Timesheets_DataAction(Route_Data)

            }


        }

    }

    Container_Model(RouteName) {
        this.setState({ Info_Modal: RouteName })
    }


    Render_Usercost(RouteName) {
        try {

            let Results_Array = JSON.parse(RouteName.replace(/'/g, '"'))
            let Results = 0
            for (let i = 0; i < Results_Array.length; i++) {
                Results += parseFloat(Results_Array[i])
            }
            return Results.toFixed(2)

        } catch (err) {

        }
    }

    Render_WorkQty(RouteName) {
        try {

            let Results_Array = JSON.parse(RouteName.replace(/'/g, '"'))
            let Results = 0
            for (let i = 0; i < Results_Array.length; i++) {
                Results += parseInt(Results_Array[i].qty)
            }
            return Results
        } catch (err) {

        }
    }

    Render_WorkItems(RouteName) {
        try {
            let Results_Array = JSON.parse(RouteName.replace(/'/g, '"'))
            return Results_Array.length
        } catch (err) {

        }
    }


    onRefresh_End() {
        if (this.state.Job_ID == "") {
            this.setState({ Dashboard_Fetching: true, Pagination_Status: ++this.state.Pagination_Status }, () => this._fetchEnddata(this.state.CassUserID, this.state.CassRoleID));
        }
        this.forceUpdate()
    }

    Floating_Button() {
        this.props.navigation.navigate("Add_Timesheet", {
            CalendarDate: Moment(new Date(new Date().getTime())).format('YYYY-MM-DD'),
        });
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
                                <Text numberOfLines={1} style={{ fontSize: fontSize.lightMedium, fontFamily: fontFamily.LatoHeavy, letterSpacing: width / 100 * 0.1, color: color.Font_Black, textAlign: "center" }}>{"Attention Required..!"}</Text>

                            </View>
                            <View style={{ height: width / 100 * 0.2, width: width / 100 * 80, justifyContent: 'center', alignSelf: 'center', backgroundColor: LG_BG_THEME.LIGHTGREY_THEME, marginLeft: width / 100 * 1, marginRight: width / 100 * 1 }} />

                            <View style={{ height: width / 100 * 15, width: width / 100 * 80, justifyContent: 'center', alignSelf: 'center', backgroundColor: color.Font_Whitecolor, }}>
                                <Text numberOfLines={3} style={{ fontSize: fontSize.lightMedium_50, fontFamily: fontFamily.LatoSemibold, letterSpacing: width / 100 * 0.1, color: color.Font_Black, textAlign: "center", marginLeft: width / 100 * 1, marginRight: width / 100 * 1 }}>{"Session Expired... Please login to continue..!"}</Text>
                            </View>

                            <View style={{ height: width / 100 * 0.5, width: width / 100 * 80, justifyContent: 'center', alignSelf: 'center', backgroundColor: LG_BG_THEME.LIGHTGREY_THEME, marginLeft: width / 100 * 1, marginRight: width / 100 * 1 }} />

                            <TouchableOpacity onPress={() => this.lastLogin_Method()} style={{ height: width / 100 * 10, width: width / 100 * 80, justifyContent: 'center', alignSelf: 'center', backgroundColor: LG_BG_THEME.LIGHTGREY_THEME, borderBottomLeftRadius: width / 100 * 2, borderBottomRightRadius: width / 100 * 2, alignItems: "center" }}>
                                <Text numberOfLines={1} style={{ fontSize: fontSize.lightMedium_50, fontFamily: fontFamily.LatoBold, letterSpacing: width / 100 * 0.1, color: color.Font_Whitecolor, textAlign: "center" }}>{"OK"}</Text>
                            </TouchableOpacity>

                        </View>

                    </View>
                </View>
            </Modal>
        )
    }

    lastLogin_Method() {

        fetch(User_Logout, {
            method: 'POST',
            headers: new Headers({
                'Authorization': "Basic " + base64.encode(Cass_AuthDetails),
                'X-API-KEY': Cass_APIDetails,
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify({
                "user_id": this.state.CassUserID,
                "device_token": this.state.Cass_DeviceID,
                "push_notify_id": this.state.Cass_NotifyID,
            })
        })

            .then((response) => response.json())
            .then((Jsonresponse) => {
                if (Jsonresponse.status == true) {
                    Snackbar.show({
                        title: Jsonresponse.message + "..!",
                        duration: Snackbar.LENGTH_SHORT,
                    });

                    this.props.navigation.navigate("Login_Screen")

                    AsyncStorage.setItem('Cass_DeviceID', "0", () => {

                    });
                    AsyncStorage.setItem('Cass_Pushnotify', "0", () => {

                    });
                    AsyncStorage.setItem('Cass_UserID', "0", () => {

                    });

                    AsyncStorage.setItem('Cass_RoleID', "0", () => {

                    });
                    this.setState({
                        MF_ArrayList_Fetching: false, Alert_Design_isVisible: false, Dashboard_Fetching: false
                    })
                } else {
                    Snackbar.show({
                        title: Jsonresponse.message + "..!",
                        duration: Snackbar.LENGTH_SHORT,
                    });
                    this.setState({
                        MF_ArrayList_Fetching: false, Alert_Design_isVisible: false, Dashboard_Fetching: false
                    })
                }
            })
            .catch((error) => {
                this.setState({ Dashboard_Fetching: false });
                Snackbar.show({
                    title: "Internal Server Error..!",
                    duration: Snackbar.LENGTH_SHORT,
                });
            });

    }



    onRequestClose(RouteName) {

        if (RouteName == "Reset") {
            this.setState({
                Timelist_ResponseArray: this.state.Timelist_RA,
                S1_Search: "",
                Sorting_isVisible: false
            })

        } else if (RouteName == "Submit") {
            this.setState({
                Sorting_isVisible: false,
                Reset_Enable: true
            })
        } else {
            this.setState({
                Sorting_isVisible: false
            })
        }
        this.forceUpdate()
    }

    TextInput_Method(Data_Response, RouteName) {

        const { Timelist_RA } = this.state;
        var newData = []
        try {

                if (RouteName == "TS_ID") {
                    newData = Timelist_RA.filter(function (item) {
                        const itemData = item.id ? item.id.toUpperCase() : ''.toUpperCase();
                        const textData = Data_Response.toUpperCase();
                        return itemData.indexOf(textData) > -1;
                    })
                }else if (RouteName == "Job_No") {
                    newData = Timelist_RA.filter(function (item) {
                        const itemData = item.job_no ? item.job_no.toUpperCase() : ''.toUpperCase();
                        const textData = Data_Response.toUpperCase();
                        return itemData.indexOf(textData) > -1;
                    })
                } else {
                    newData = Timelist_RA.filter(function (item) {
                        const itemData = item.exchange ? item.exchange.toUpperCase() : ''.toUpperCase();
                        const textData = Data_Response.toUpperCase();
                        return itemData.indexOf(textData) > -1;
                    })

                }

                this.setState({
                    Timelist_ResponseArray: newData,
                    Reset_Enable: true,
                    Sorting_isVisible:false
                });
                this.forceUpdate()

        } catch (err) {
        }
    }

    async Container_Reset() {

        let status = 1
        const Timesheets_Response = await this._fetch_TSInfo(this.state.CassUserID, this.state.CassRoleID, status)
        this.setState({
            Timelist_ResponseArray: [],
            Timelist_RA: [],
            Pagination_Status: 1,
            Dashboard_Fetching: true
        });
        setTimeout(() => {
            this.setState({
                Timelist_ResponseArray: Timesheets_Response.TS_Info == undefined ? [] : Timesheets_Response.TS_Info,
                Timelist_RA: Timesheets_Response.TS_Info == undefined ? [] : Timesheets_Response.TS_Info,
                Pagination_Status: 1,
                Dashboard_Fetching: false
            });

        }, 1000)
        this.forceUpdate()

    }
    changeActiveTab = ()=>{
        const {activeTab} = this.state;
        if(activeTab ===0){
            this.setState({activeTab:1});
        }else {
            this.setState({activeTab:0});
        }
 
    }

    onEndReached = ({ distanceFromEnd }) => {
        if (!this.onEndReachedCalledDuringMomentum) {
            this.onRefresh_End()
            this.onEndReachedCalledDuringMomentum = true;
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
            <LinearGradient key="background" start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[LG_BG_THEME.APPTHEME_BG_2, LG_BG_THEME.APPTHEME_BG_2]} style={{ flex: 1, justifyContent: "center" }} >
                {spinner}
                {this.state.Alert_Design_isVisible == true ? this.AlertPopup_Method() : null}

                <Mystatusbar />
                <View style={{ flex: 1 }}>
                    <ASS_HeaderDesign
                        Onpress_LeftIcon={() => this.Container_Method("Goback")}
                        Onpress_RightIcon={() => this.Container_Method("Info")}
                        Onpress_More_Icon={() => this.Container_Method("More")}
                        Onpress_More_Reset={() => this.Container_Reset()}
                        Header_Text={"TIMESHEETS"}
                        RightIcon_Status={true}
                        LeftIcon_Status={true}
                        Reset_Status={true}
                    />
                    <View>
                        <View style = {{flexDirection:'row' }}>
                            <TouchableOpacity onPress= {()=>this.changeActiveTab()} style= {{ padding:8,margin:8,flex:2,backgroundColor:
                                this.state.activeTab===0? LG_BG_THEME.APPTHEME_1 :LG_BG_THEME.WHITE_THEME }}>   
                                <Text style={{textAlign:'center',
                                color:this.state.activeTab===0? '#FFF' : '#000'}}>
                                    TimeSheet List
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress= {()=>this.changeActiveTab()}  style= {{padding:8,margin:8,flex:2,backgroundColor:
                                 this.state.activeTab===1?LG_BG_THEME.APPTHEME_1 :LG_BG_THEME.WHITE_THEME}}>   
                                <Text style={{textAlign:'center',
                                color: this.state.activeTab===1? '#FFF' : '#000'}}>
                                    Draft List
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                 

                    <View style={{ flex: 0.02 }} />
                    <View style={styles.Container_EP_2} />
                    
                   {this.state.activeTab ===0 ?
                    <>
                          <View style={{ flex: 0.08, justifyContent: 'center', flexDirection: "row" }}>

                            <View style={{ flexDirection: "row", flex: 0.395, justifyContent: 'center', alignItems: 'center' }}>

                                <View style={{ flex: 0.3, justifyContent: 'center', alignItems: "flex-end" }}>
                                    <Image source={require('../../../../Asset/Icons/Calendar_Icon.png')} style={{ width: width / 100 * 3.5, height: width / 100 * 3.5, tintColor: LG_BG_THEME.APPTHEME_BLACK, }} />
                                </View>
                                <View style={{ flex: 0.7, justifyContent: 'center', alignItems: "flex-start" }}>
                                    <Text style={styles.container_TabText}>{this.state.StartDate}</Text>
                                </View>
                            </View>


                            <View style={{ flex: 0.02, justifyContent: 'center' }} />

                            <View style={styles.Container_TimesheetHeader}>
                                <Text style={styles.container_TabText}>{"Total Timesheets - " + this.state.Timelist_ResponseArray.length}</Text>
                            </View>
                            </View>

                            <View style={{ flex: 0.9, marginTop: width / 100 * 2, marginLeft: width / 100 * 6, marginRight: width / 100 * 6 }}>
                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                                {this.state.Timelist_ResponseArray.length == 0 ?
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={styles.container_EmptyText}>{"No Timesheets Found..!"}</Text>
                                    </View>
                                    :
                                    <FlatList style={{ flex: 1, }}
                                        data={this.state.Timelist_ResponseArray}
                                        showsVerticalScrollIndicator={false}
                                        onRefresh={() => this.Container_Reset()}
                                        refreshing={this.state.Dashboard_Fetching}
                                        keyExtractor={(item, index) => item.key}
                                        onEndReached={this.onEndReached.bind(this)}
                                        onEndReachedThreshold={0.5}
                                        //onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false }}
                                        onMomentumScrollEnd={() => { this.onEndReachedCalledDuringMomentum = false }}
                                        renderItem={({ item, index }) =>

                                            <Card_Timesheets
                                                CardList_AMORE={() => this.Container_Method("Edit", item)}
                                                CardList_Method={() => this.Container_Method("View", item)}
                                                Card_BG={item.dept_super_admin_status == "1" && item.dept_admin_status == "0" && item.finance_status == "0" && item.engineer_status == "0" ? Notify_THEME.AW_SUPERADMIN :
                                                    item.dept_super_admin_status == "2" && item.dept_admin_status == "1" && item.finance_status == "0" && item.engineer_status == "0" ? Notify_THEME.AW_ADMIN :
                                                        item.dept_super_admin_status == "2" && item.dept_admin_status == "2" && item.finance_status == "1" && item.engineer_status == "0" ? Notify_THEME.AW_FINANCE :
                                                            item.dept_super_admin_status == "2" && item.dept_admin_status == "2" && item.finance_status == "2" && item.engineer_status == "0" ? Notify_THEME.AW_APPROVED :
                                                                item.dept_super_admin_status == "1" && item.dept_admin_status == "3" && item.finance_status == "0" && item.engineer_status == "0" ? Notify_THEME.AW_SUPERADMIN :
                                                                    item.dept_super_admin_status == "1" && item.dept_admin_status == "0" && item.finance_status == "3" && item.engineer_status == "0" ? Notify_THEME.AW_SUPERADMIN :
                                                                        Notify_THEME.AW_REJECTED}
                                                CardText_Header1={"Job No : "}
                                                CardText_1={item.job_no}
                                                CardText_Header2={"Exchange : "}
                                                CardText_2={item.exchange}
                                                CardText_Header3={"Total :"}
                                                CardText_3={"£ " + this.Render_Usercost(item.user_cost)}
                                                CardText_Header4={"Qty :"}
                                                CardText_4={this.Render_WorkQty(item.work_item_id_qty)}
                                                CardText_Header5={"Timesheet ID : "}
                                                CardText_5={item.id}
                                                CardText_Header6={"Worked on: "}
                                                CardText_Header7={"Units : "}
                                                CardText_7={this.Render_WorkItems(item.work_item_id_qty)}
                                                CardText_6={Moment(item.job_date).format('DD-MMMM-YY')}
                                                ActiveStatus={parseInt(item.engineer_status) == 1 ? true : false}
                                            />
                                        }
                                    />
                                }
                            </TouchableWithoutFeedback>

                            <View style={styles.Header_container}>
                                <TouchableOpacity onPress={() => this.Floating_Button()} style={styles.Header_Innercontainer}>
                                    <Image source={require('../../../../Asset/Icons/PlusIcon.png')} style={{ width: width / 100 * 4, height: width / 100 * 4, tintColor: LG_BG_THEME.WHITE_THEME }} />
                                </TouchableOpacity>
                            </View>
                            </View>

                            <Modal
                            animationType='slide'
                            transparent={true}
                            visible={this.state.Info_Modal}
                            animationType="slide"
                            onRequestClose={() => { this.setState({ Info_Modal: false }) }}>

                            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                <View style={{ height: "100%", justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>

                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: width / 100 * 2, flexDirection: "row" }}>

                                        <View style={{ flex: 0.1, }} />
                                        <View style={{ flex: 0.8, justifyContent: 'center' }}>

                                            <View style={{ height: width / 100 * 12, justifyContent: 'center', alignSelf: 'center', backgroundColor: LG_BG_THEME.APPTHEME_1, borderTopLeftRadius: width / 100 * 2, borderTopRightRadius: width / 100 * 2, flexDirection: 'row' }}>
                                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text numberOfLines={1} style={{ fontSize: fontSize.Medium, fontFamily: fontFamily.Poppins_Regular, letterSpacing: width / 100 * 0.1, color: color.Font_Whitecolor, textAlign: "center" }}>{"COLOUR INFO"}</Text>
                                                </View>
                                            </View>

                                            <View style={{ height: width / 100 * 70, justifyContent: 'center', backgroundColor: LG_BG_THEME.WHITE_THEME, }}>

                                                <View style={styles.Container_EP_2} />

                                                <Modal_Text
                                                    Modal_Infotext={"Awaiting Dept Super Admin..!"}
                                                    Modal_InfoBG={Notify_THEME.AW_SUPERADMIN}
                                                />

                                                <View style={styles.Container_EP_2} />

                                                <Modal_Text
                                                    Modal_Infotext={"Awaiting Dept Admin..!"}
                                                    Modal_InfoBG={Notify_THEME.AW_ADMIN}
                                                />

                                                <View style={styles.Container_EP_2} />

                                                <Modal_Text
                                                    Modal_Infotext={"Awaiting Finance Dept..!"}
                                                    Modal_InfoBG={Notify_THEME.AW_FINANCE}
                                                />

                                                <View style={styles.Container_EP_2} />

                                                <Modal_Text
                                                    Modal_Infotext={"Timesheets Approved..!"}
                                                    Modal_InfoBG={Notify_THEME.AW_APPROVED}
                                                />

                                                <View style={styles.Container_EP_2} />

                                                <Modal_Text
                                                    Modal_Infotext={"Timesheets Rejected..!"}
                                                    Modal_InfoBG={Notify_THEME.AW_REJECTED}
                                                />

                                                <View style={styles.Container_EP_2} />
                                            </View>

                                            <View style={{ height: width / 100 * 12, justifyContent: 'center', alignSelf: 'center', backgroundColor: LG_BG_THEME.APPTHEME_1, borderBottomLeftRadius: width / 100 * 2, borderBottomRightRadius: width / 100 * 2, flexDirection: 'row' }}>
                                                <TouchableOpacity onPress={() => this.Container_Model(false)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text numberOfLines={1} style={{ fontSize: fontSize.Medium, fontFamily: fontFamily.Poppins_Regular, letterSpacing: width / 100 * 0.1, color: color.Font_Whitecolor, textAlign: "center" }}>{"Cancel"}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        <View style={{ flex: 0.1, }} />

                                    </View>

                                </View>
                            </View>
                            </Modal>

                            <Modal
                            animationType='slide'
                            transparent={true}
                            visible={this.state.Sorting_isVisible}
                            onRequestClose={() => { this.onRequestClose() }}>
                            <View style={{ flex: 1, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>

                                <View style={{ height: "100%", width: width / 100 * 100, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', backgroundColor: 'transparent' }}>
                                    <TouchableWithoutFeedback onPress={Keyboard.dismiss} onPressIn={() => { this.onRequestClose() }}>

                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: width / 100 * 2 }}>
                                            <View style={{ height: width / 100 * 45, width: width / 100 * 80, justifyContent: 'center', backgroundColor: color.Font_Whitecolor, borderTopLeftRadius: width / 100 * 2, borderTopRightRadius: width / 100 * 2 }}>

                                                <TouchableOpacity onPress={() => this.setState({ S1_Search: "Search By Job NO" })} style={{ height: width / 100 * 9, width: width / 100 * 80, justifyContent: 'center' }}>
                                                    <Text numberOfLines={1} style={{ fontSize: fontSize.Small, fontFamily: fontFamily.Poppins_Regular, letterSpacing: width / 100 * 0.1, color: this.state.S1_Search == "Search By Job NO" ? LG_BG_THEME.APPTHEME_1 : color.Font_lightgrey, textAlign: "justify", marginLeft: width / 100 * 3 }}>{"1. Search By Job NO "}</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity onPress={() => this.setState({ S1_Search: "Search By Exchange" })} style={{ height: width / 100 * 9, width: width / 100 * 80, justifyContent: 'center' }}>
                                                    <Text numberOfLines={1} style={{ fontSize: fontSize.Small, fontFamily: fontFamily.Poppins_Regular, letterSpacing: width / 100 * 0.1, color: this.state.S1_Search == "Search By Exchange" ? LG_BG_THEME.APPTHEME_1 : color.Font_lightgrey, textAlign: "justify", marginLeft: width / 100 * 3 }}>{"2. Search By Exchange "}</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity onPress={() => this.setState({ S1_Search: "Search By Timesheet NO" })} style={{ height: width / 100 * 9, width: width / 100 * 80, justifyContent: 'center' }}>
                                                    <Text numberOfLines={1} style={{ fontSize: fontSize.Small, fontFamily: fontFamily.Poppins_Regular, letterSpacing: width / 100 * 0.1, color: this.state.S1_Search == "Search By Timesheet NO" ? LG_BG_THEME.APPTHEME_1 : color.Font_lightgrey, textAlign: "justify", marginLeft: width / 100 * 3 }}>{"3. Search By Timesheet NO "}</Text>
                                                </TouchableOpacity>

                                                <View style={{ flex: 1, width: width / 100 * 70, justifyContent: 'center', borderBottomWidth: width / 100 * 0.5, borderBottomColor: LG_BG_THEME.APPTHEME_BLACK, marginLeft: width / 100 * 3, marginRight: width / 100 * 3 }}>
                                                    <TextInput
                                                        placeholder={this.state.S1_Search == "" ? "Select the option for Search" : this.state.S1_Search}
                                                        returnKeyType="go"
                                                        selectionColor={LG_BG_THEME.APPTHEME_BLACK}
                                                        underlineColorAndroid='transparent'
                                                        placeholderTextColor={LG_BG_THEME.APPTHEME_BLACK}
                                                        style={styles.container_Text}
                                                        onChangeText={(Search_Text) => this.setState({ TS_SearchText: Search_Text })}
                                                    />
                                                </View>
                                                <View style={styles.Container_EP_2} />
                                            </View>

                                            <View style={{ height: width / 100 * 0.5, width: width / 100 * 80, justifyContent: 'center', alignSelf: 'center', backgroundColor: LG_BG_THEME.APPTHEME_1, marginLeft: width / 100 * 1, marginRight: width / 100 * 1 }} />

                                            <View style={{ height: width / 100 * 12, width: width / 100 * 80, justifyContent: 'center', alignSelf: 'center', backgroundColor: LG_BG_THEME.APPTHEME_1, borderBottomLeftRadius: width / 100 * 2, borderBottomRightRadius: width / 100 * 2, flexDirection: 'row' }}>
                                                <TouchableOpacity onPress={() => this.TextInput_Method(this.state.TS_SearchText, this.state.S1_Search == "Search By Job NO" ? "Job_No" : this.state.S1_Search == "Search By Timesheet NO" ? "TS_ID" : "Exchange")} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text numberOfLines={1} style={{ fontSize: fontSize.Medium, fontFamily: fontFamily.Poppins_Regular, letterSpacing: width / 100 * 0.1, color: color.Font_Whitecolor, textAlign: "center" }}>{"Search"}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>

                            </View>

                            </Modal>


                    </>    
                   :
                   <Draft_List navigation = {this.props.navigation}/>

                   }

                </View>
            </LinearGradient>

        )
    }

}


const styles = StyleSheet.create({

    container_TabText: {
        fontSize: fontSize.lightMedium,
        fontFamily: fontFamily.Poppins_SemiBold,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.APPTHEME_BLACK,
        marginLeft: width / 100 * 2,
    },
    Container_EP_1: {
        height: height / 100 * 1
    },
    Container_EP_2: {
        height: height / 100 * 2
    },
    Container_EP_4: {
        height: height / 100 * 4
    },

    Container_TimesheetHeader: {
        flex: 0.59,
        justifyContent: 'center',
        alignItems: 'center',

    },
    Container_Infotext: {
        fontSize: fontSize.Medium,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.1,
        color: color.Font_Black,
        textAlign: "center",
    },
    container_EmptyText: {
        fontSize: fontSize.Medium,
        fontFamily: fontFamily.Poppins_Bold,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.APPTHEME_BLACK,
        marginLeft: width / 100 * 2,
    },
    Header_container: {
        zIndex: 1000,
        justifyContent: "center",
        alignItems: "center",
        position: 'absolute',
        bottom: height / 100 * 10,
        right: width / 100 * 8
    },
    Header_Innercontainer: {
        backgroundColor: LG_BG_THEME.APPTHEME_1,
        justifyContent: 'center',
        alignItems: "center",
        height: height / 100 * 6,
        width: height / 100 * 6,
        borderRadius: height / 100 * 3,
        elevation: Platform.OS == "android" ? width / 100 * 1 : width / 100 * 0.1,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowColor: LG_BG_THEME.APPTHEME_2,
    },
    container_Text: {
        fontSize: fontSize.Small,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.APPTHEME_BLACK,
        marginLeft: width / 100 * 2
    },
});

const mapStateToProps = (state) => {
    return {
        CommonReducer: state.CommonReducer
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        Timesheets_DataAction: (TSInfo_Response) => { dispatch(Timesheets_DataAction(TSInfo_Response)) },
        Timesheets_EditAction: (TSInfo_Response) => { dispatch(Timesheets_EditAction(TSInfo_Response)) },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Timesheet_List);
