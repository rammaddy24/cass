import React, { Component, PureComponent } from 'react'
import {
    StyleSheet, Text, Keyboard, AsyncStorage, FlatList, Linking,
    View, TouchableOpacity, Image, SafeAreaView, ImageBackground, BackHandler, Alert, Platform, Modal, TextInput, ScrollView, TouchableWithoutFeedback
} from 'react-native'
import { color, width, fontSize, fontFamily, height, LG_BG_THEME, Notify_THEME } from '../../../Constants/fontsAndColors'
import { Container, Content, connect, Picker, Header, LinearGradient, Snackbar, CalendarPicker, Moment, base64 } from '../../../../Asset/Libraries/NpmList';
import { Mystatusbar, isIOS } from '../../../../Asset/Libraries/index'
import BottomNavigation, { ShiftingTab } from 'react-native-material-bottom-navigation'

import MsgInfo_Response from '../Extra_Modules/Msg_Response.json'

import { AS_HeaderDesign } from '../../CommonView_Modules/AS_HeaderDesign'
import { AS_TextView } from '../../CommonView_Modules/AS_TextView'
import { AS_Textbutton } from '../../CommonView_Modules/AS_Textbutton'
import { Modal_Msgtext } from '../../CommonView_Modules/Modal_Msgtext'
import { ASS_HeaderDesign } from '../../CommonView_Modules/ASS_HeaderDesign'

import { AS_SidebardDesign } from '../../CommonView_Modules/AS_SidebardDesign'
import { CardList_Design } from '../../CommonView_Modules/CardList_Design'
import { MsgCardlist_Design } from '../../CommonView_Modules/MsgCardlist_Design'
import { Card_Joblist } from '../../CommonView_Modules/Card_Joblist'
import { CM_ButtonDesign } from '../../CommonView_Modules/CM_ButtonDesign'
import { ViewAll_Design } from '../../CommonView_Modules/ViewAll_Design'
import { Home_Msgcard } from '../../CommonView_Modules/Home_Msgcard'
import { Home_Headertext } from '../../CommonView_Modules/Home_Headertext'
import { Home_Timesheetscard } from '../../CommonView_Modules/Home_Timesheetscard'
import { Home_Usertext } from '../../CommonView_Modules/Home_Usertext'
import { Modal_Text } from '../../CommonView_Modules/Modal_Text'

import { User_Info, Message_List, Notification_List, Calender_Details, List_Timesheet, Cass_AuthDetails, Cass_APIDetails, Job_list, User_Authinfo, User_Logout, User_Readstatus } from '././../../../Config/Server'
import { NotifyInfo_Action } from '../../../../Redux/Actions/NotifyInfo_Action'
import { UserInfo_Action } from '../../../../Redux/Actions/UserInfo_Action'
import { Addmore_TSdata } from '../../../../Redux/Actions/Addmore_TSdata'
import { Notification_Count } from '../../../../Redux/Actions/Notification_Count'

import { Spinner } from '../../../Config/Spinner';
import GestureRecognizer, { swipeDirections } from '../../../Constants/GestureRecognizer'
import { notifications, messages } from "react-native-firebase-push-notifications"

let Notification_HeaderFlag = false

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ActiveTab: "Home",
            Notifications_Tab: "Messages",

            Calendar_Date: "",
            CD_Month: "",
            CD_Year: "",
            CD_Date: "",

            Timesheet_Date: "",
            TD_Month: "",
            TD_Year: "",
            TD_Date: "",

            Msg_ResponseArray: [],
            Notify_ResponseArray: [],
            User_ResponseArray: "",
            Info_Modal: false,

            CassUserID: "",
            CassRoleID: "",
            Dashboard_Fetching: false,
            Message_ListCount: 0,
            Message_ListIndex: 0,
            CD_List: [],

            RTS_Dayone: "",
            RTS_DayTwo: "",
            RTS_DayThere: "",

            RTS_Dateone: "",
            RTS_DateTwo: "",
            RTS_DateThere: "",

            RTS_Date_BG_1: "",
            RTS_Date_BG_2: "",
            RTS_Date_BG_3: "",

            RTS_DateFormat_1: "",
            RTS_DateFormat_2: "",
            RTS_DateFormat_3: "",

            Info_Message: "",
            Info_MSG_FN: "",
            Info_MSG_LN: "",
            Info_MSG_Time: "",
            Info_ModalName: "",
            Jobs_ResponseArray: [],
            Jobs_RArray: [],

            CD_Holiday_dates: [],
            CD_Leave_dates: [],
            CD_Timesheetslist: [],
            Alert_Design_isVisible: false,
            Cass_DeviceID: "",
            Cass_NotifyID: "",
            Notification_count: 0,
            Message_Unreadcount: 0,
            CD_Combined_dates: [],
            Sorting_isVisible: false,
            Reset_Enable: false,
            Pagination_Status: 1,
            Alert_Msg_isVisible: false,
            Notification_HeaderTitle: "",
            Notification_HeaderBody: "",
            TS_SearchText: "",
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

        this.onNotificationListener()
        this.onNotificationOpenedListener()
        this.forceUpdate()

    }
   

    onNotificationListener = () => {

        this.removeOnNotification = notifications.onNotification(notification => {
                if(Notification_HeaderFlag == false && notification._title != undefined){
                    this.setState({
                        Notification_HeaderTitle: notification._title,
                        Notification_HeaderBody: notification._body,
                        Alert_Msg_isVisible: true,
                    })
                    Notification_HeaderFlag = true
                    this.Notification_Msg()
                }
        })
        this.forceUpdate()
    }

    onNotificationOpenedListener = () => {
        //remember to remove the listener on un mount
        //this gets triggered when the application is in the background
        this.removeOnNotificationOpened = notifications.onNotificationOpened( notification => { this.Authorization_success() })
    }
    
    componentWillUnmount() {
        if (this.removeOnNotification) {
            this.removeOnNotification()
        }
        if(this.removeOnNotificationOpened){
            this.removeOnNotificationOpened()
        }
    }

    Notification_Msg() {
        return (
            <Modal
                animationType='slide'
                transparent={true}
                visible={this.state.Alert_Msg_isVisible}>

                <View style={{ flex: 1, justifyContent: "center", alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={{ height: "100%", width: width / 100 * 100, justifyContent: 'center', }}>

                        <View style={{ flex: 0.25 }} />

                        <View style={{ flex: 0.5, justifyContent: 'center', borderRadius: width / 100 * 2, flexDirection: 'row' }}>
                            <View style={{ flex: 0.1 }} />

                            <View style={{ flex: 0.8, backgroundColor: LG_BG_THEME.APPTHEME_1, borderRadius: width / 100 * 3, justifyContent: 'center' }}>
                                <View style={{ flex: 0.35, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image source={require('../../../../Asset/Images/App_Themeicon.png')} style={{ width: width / 100 * 30, height: width / 100 * 25, borderRadius: width / 100 * 2 }} />
                                </View>
                                <View style={{ flex: 0.45, justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{ flex: 0.05 }} />

                                    <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text numberOfLines={3} style={{ fontSize: fontSize.lightMedium_50, fontFamily: fontFamily.Poppins_Bold, letterSpacing: width / 100 * 0.1, color: LG_BG_THEME.WHITE_THEME, textAlign: "center", marginLeft: width / 100 * 3, marginRight: width / 100 * 3 }}>{this.state.Notification_HeaderTitle}</Text>
                                    </View>
                                    <View style={{ flex: 0.6, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text numberOfLines={6} style={{ fontSize: fontSize.lightMedium_50, fontFamily: fontFamily.Poppins_Regular, letterSpacing: width / 100 * 0.1, color: LG_BG_THEME.WHITE_THEME, textAlign: "auto", marginLeft: width / 100 * 3, marginRight: width / 100 * 3 }}>{this.state.Notification_HeaderBody}</Text>
                                    </View>
                                    <View style={{ flex: 0.05 }} />

                                </View>

                                <View style={{ flex: 0.2, justifyContent: 'center' }}>
                                    <CM_ButtonDesign
                                        CMB_BuutonColourcode={LG_BG_THEME.APPTHEME_Blue}
                                        onPress_BuutonView={() => this.PushReferesh_Method()}
                                        CMB_TextHeader={"OK"}
                                    />
                                </View>
                            </View>

                            <View style={{ flex: 0.1 }} />
                        </View>
                        <View style={{ flex: 0.25 }} />

                    </View>
                </View>
            </Modal>
        )

    }


    PushReferesh_Method() {
       this.Authorization_success()
        this.setState({
            Alert_Msg_isVisible: false,
        })
        Notification_HeaderFlag = false
        this.forceUpdate()
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
                console.log(error,UserInfo_URL)

                this.setState({ Dashboard_Fetching: false });
                Snackbar.show({
                    title: "Internal Server Error..!",
                    duration: Snackbar.LENGTH_SHORT,
                });
            });
    }

    Authorization_success() {
        let Status = 1
        AsyncStorage.getItem("Cass_UserID", (error, Token_Result) => {
            if (Token_Result != "0" || Token_Result != null) {
                AsyncStorage.getItem("Cass_RoleID", (error, Token_RoleID) => {
                    if (Token_RoleID != "0" || Token_RoleID != null) {
                        this.setState({ CassUserID: Token_Result, CassRoleID: Token_RoleID, Dashboard_Fetching: true }, () => this._fetchdata(Token_Result, Token_RoleID, Status));
                    }
                })
            }
        })


        var Current_Date = new Date(new Date().getTime())
        this.setState({
            Calendar_Date: Moment(Current_Date).format('YYYY-MM-DD'),
            CD_Year: Moment(Current_Date).format('YYYY'),
            CD_Month: Moment(Current_Date).format('MMMM'),
            CD_Date: Moment(Current_Date).format('DD'),
            Timesheet_Date: Moment(Current_Date).format('YYYY-MM-DD'),
            TD_Year: Moment(Current_Date).format('YYYY'),
            TD_Month: Moment(Current_Date).format('MMMM'),
            TD_Date: Moment(Current_Date).format('DD'),
         
        })

        const today = new Date(new Date().getTime())
        const Yesterday = new Date(new Date().getTime() - (86400000 * 1))
        const DayBefore = new Date(new Date().getTime() - (86400000 * 2))

        this.setState({
            RTS_Dayone: Moment(today).format("dddd"),
            RTS_Dateone: Moment(today).format("D - MMMM"),
            RTS_DayTwo: Moment(Yesterday).format("dddd"),
            RTS_DateTwo: Moment(Yesterday).format("D - MMMM"),
            RTS_DayThere: Moment(DayBefore).format("dddd"),
            RTS_DateThere: Moment(DayBefore).format("D - MMMM"),

            RTS_DateFormat_1: Moment(DayBefore).format('YYYY-MM-DD'),
            RTS_DateFormat_2: Moment(Yesterday).format('YYYY-MM-DD'),
            RTS_DateFormat_3: Moment(today).format('YYYY-MM-DD'),
          

        })
    }

    async _fetchdata(Token_Result, Token_RoleID, Status) {
        let UserInfo_Response = await this._fetch_UserInfo(Token_Result, Token_RoleID,);
        let MsgInfo_Response = await this._fetch_MsgInfo(Token_Result, Token_RoleID);
        let NotifyInfo_Response = await this._fetch_NotifyInfo(Token_Result, Token_RoleID);
        let CDInfo_Response = await this._fetch_CalenderInfo(Token_Result, Token_RoleID);
        let JobsInfo_Response = await this._fetch_JobsInfo(Token_Result, Token_RoleID, Status);

        try {
            this.setState({
                User_ResponseArray: UserInfo_Response.User_Info,
                Msg_ResponseArray: MsgInfo_Response.Msg_Info == undefined ? [] : MsgInfo_Response.Msg_Info,
                Notify_ResponseArray: NotifyInfo_Response.Notify_Info == undefined ? [] : NotifyInfo_Response.Notify_Info,
                Message_ListCount: MsgInfo_Response.Msg_Info == undefined ? 0 : MsgInfo_Response.Msg_Info.length,
                CD_List: CDInfo_Response.CD_Info == undefined ? [] : CDInfo_Response.CD_Info,
                Jobs_ResponseArray: JobsInfo_Response.Job_Info == undefined ? [] : JobsInfo_Response.Job_Info,
                Jobs_RArray: JobsInfo_Response.Job_Info == undefined ? [] : JobsInfo_Response.Job_Info,
                Dashboard_Fetching: false,
               
            })

            if (CDInfo_Response.CD_Info != undefined) {
                if (CDInfo_Response.CD_Info.timesheet_dates != undefined) {
                    for (let i = 0; i < CDInfo_Response.CD_Info.timesheet_dates.length; i++) {
                        if (CDInfo_Response.CD_Info.timesheet_dates[i] == this.state.RTS_DateFormat_1) {
                            this.setState({ RTS_Date_BG_1: "TS" })
                        }
                        if (CDInfo_Response.CD_Info.timesheet_dates[i] == this.state.RTS_DateFormat_2) {
                            this.setState({ RTS_Date_BG_2: "TS" })
                        }
                        if (CDInfo_Response.CD_Info.timesheet_dates[i] == this.state.RTS_DateFormat_3) {
                            this.setState({ RTS_Date_BG_3: "TS" })
                        }
                    }
                    this.setState({
                        CD_Timesheetslist: CDInfo_Response.CD_Info.timesheet_dates,

                    })
                }
                if (CDInfo_Response.CD_Info.holiday_dates != undefined) {

                    for (let i = 0; i < CDInfo_Response.CD_Info.holiday_dates.length; i++) {
                        if (CDInfo_Response.CD_Info.holiday_dates[i] == this.state.RTS_DateFormat_1) {
                            this.setState({ RTS_Date_BG_1: "HD" })
                        }
                        if (CDInfo_Response.CD_Info.holiday_dates[i] == this.state.RTS_DateFormat_2) {
                            this.setState({ RTS_Date_BG_2: "HD" })
                        }
                        if (CDInfo_Response.CD_Info.holiday_dates[i] == this.state.RTS_DateFormat_3) {
                            this.setState({ RTS_Date_BG_3: "HD" })
                        }
                    }
                    this.setState({
                        CD_Holiday_dates: CDInfo_Response.CD_Info.holiday_dates,
                    })
                }
                if (CDInfo_Response.CD_Info.combined_dates != undefined) {

                    for (let i = 0; i < CDInfo_Response.CD_Info.combined_dates.length; i++) {
                        if (CDInfo_Response.CD_Info.combined_dates[i] == this.state.RTS_DateFormat_1) {
                            this.setState({ RTS_Date_BG_1: "TSH" })
                        }
                        if (CDInfo_Response.CD_Info.combined_dates[i] == this.state.RTS_DateFormat_2) {
                            this.setState({ RTS_Date_BG_2: "TSH" })
                        }
                        if (CDInfo_Response.CD_Info.combined_dates[i] == this.state.RTS_DateFormat_3) {
                            this.setState({ RTS_Date_BG_3: "TSH" })
                        }
                    }
                    this.setState({
                        CD_Combined_dates: CDInfo_Response.CD_Info.combined_dates,
                    })
                }

                if (CDInfo_Response.CD_Info.engineer_leave_dates != undefined) {
                    this.setState({
                        CD_Leave_dates: CDInfo_Response.CD_Info.engineer_leave_dates,
                    })
                }

            }


            if (NotifyInfo_Response.Notify_Info != undefined) {
                let Count = 0
                for (let i = 0; i < NotifyInfo_Response.Notify_Info.length; i++) {
                    if (NotifyInfo_Response.Notify_Info[i].status == 1) {
                        Count = ++Count
                    }
                }
                this.setState({ Notification_count: Count })
                this.props.Notification_Count(Count)

            }

            if (MsgInfo_Response.Msg_Info != undefined) {
                let Count = 0
                for (let i = 0; i < MsgInfo_Response.Msg_Info.length; i++) {
                    if (MsgInfo_Response.Msg_Info[i].status == 1) {
                        Count = ++Count
                    }
                }
                this.setState({ Message_Unreadcount: Count })
            }

            this.props.UserInfo_Action(UserInfo_Response.User_Info)
this.forceUpdate()
        } catch (err) {
            console.log(err,"Data_fecth")
            this.setState({ Dashboard_Fetching: false,Alert_Msg_isVisible: false, });
        }
    }

    _fetch_UserInfo(Token_Result, Token_RoleID) {
        return new Promise((resolve, reject) => {
            let UserInfo_URL = User_Info + Token_Result + "&user_role=" + Token_RoleID;
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

                    let User_Info = ""
                    if (Jsonresponse.status == true) {
                        User_Info = Jsonresponse.data
                        resolve({ User_Info });
                    } else {
                        resolve(User_Info)
                    }
                })
                .catch((error) => {
                    resolve("")
                    console.log(error,UserInfo_URL)

                    this.setState({ Dashboard_Fetching: false });
                    Snackbar.show({
                        title: "Internal Server Error..!",
                        duration: Snackbar.LENGTH_SHORT,
                    });
                });
        });
    }

    _fetch_MsgInfo(Token_Result, Token_RoleID) {
        return new Promise((resolve, reject) => {
            let MsgInfo_URL = Message_List + Token_Result + "&user_role=" + Token_RoleID;
            fetch(MsgInfo_URL, {
                method: 'GET',
                headers: new Headers({
                    'Authorization': "Basic " + base64.encode(Cass_AuthDetails),
                    'X-API-KEY': Cass_APIDetails,
                    'Content-Type': 'application/json',
                }),
            })
                .then((response) => response.json())
                .then((Jsonresponse) => {
                    let Msg_Info = ""
                    if (Jsonresponse.status != false) {
                        Msg_Info = Jsonresponse
                        resolve({ Msg_Info });
                    } else {
                        resolve(Msg_Info)
                    }
                })
                .catch((error) => {
                    console.log(error,MsgInfo_URL)

                    this.setState({ Dashboard_Fetching: false });
                    resolve("")
                    Snackbar.show({
                        title: "Internal Server Error..!",
                        duration: Snackbar.LENGTH_SHORT,
                    });
                });
        });
    }

    _fetch_NotifyInfo(Token_Result, Token_RoleID) {
        return new Promise((resolve, reject) => {
            let NotifyInfo_URL = Notification_List + Token_Result + "&user_role=" + Token_RoleID;
            fetch(NotifyInfo_URL, {
                method: 'GET',
                headers: new Headers({
                    'Authorization': "Basic " + base64.encode(Cass_AuthDetails),
                    'X-API-KEY': Cass_APIDetails,
                    'Content-Type': 'application/json',
                }),
            })
                .then((response) => response.json())
                .then((Jsonresponse) => {
                    let Notify_Info = ""
                    if (Jsonresponse.status != false) {
                        Notify_Info = Jsonresponse
                        resolve({ Notify_Info });
                    } else {
                        resolve(Notify_Info)
                    }
                })
                .catch((error) => {
                    console.log(error,NotifyInfo_URL)

                    resolve("")
                    this.setState({ Dashboard_Fetching: false });
                    Snackbar.show({
                        title: "Internal Server Error..!",
                        duration: Snackbar.LENGTH_SHORT,
                    });
                });
        });
    }


    _fetch_CalenderInfo(Token_Result, Token_RoleID) {

        return new Promise((resolve, reject) => {
            let CalenderDetails_URL = Calender_Details + Token_Result + "&user_role=" + Token_RoleID;
            fetch(CalenderDetails_URL, {
                method: 'GET',
                headers: new Headers({
                    'Authorization': "Basic " + base64.encode(Cass_AuthDetails),
                    'X-API-KEY': Cass_APIDetails,
                    'Content-Type': 'application/json',
                }),

            })
                .then((response) => response.json())
                .then((Jsonresponse) => {
                    let CD_Info = ""
                    if (Jsonresponse.status != false) {
                        CD_Info = Jsonresponse
                        resolve({ CD_Info });
                    } else {
                        resolve(CD_Info)
                    }
                })
                .catch((error) => {
                    console.log(error,CalenderDetails_URL)

                    resolve("")
                    this.setState({ Dashboard_Fetching: false });
                    Snackbar.show({
                        title: "Internal Server Error..!",
                        duration: Snackbar.LENGTH_SHORT,
                    });
                });
        });
    }

    _fetch_JobsInfo(Token_Result, Token_RoleID, Pagination_Status) {
        return new Promise((resolve, reject) => {
            let JobsInfo_URL = Job_list + Token_Result + "&user_role=" + Token_RoleID + "&pagination=" + Pagination_Status;
            fetch(JobsInfo_URL, {
                method: 'GET',
                headers: new Headers({
                    'Authorization': "Basic " + base64.encode(Cass_AuthDetails),
                    'X-API-KEY': Cass_APIDetails,
                    'Content-Type': 'application/json',
                }),
            })
                .then((response) => response.json())
                .then((Jsonresponse) => {
                    let Job_Info = ""
                    if (Jsonresponse.status != false) {
                        Job_Info = Jsonresponse
                        resolve({ Job_Info });
                    } else {
                        resolve(Job_Info)
                    }
                })
                .catch((error) => {
                    console.log(error,JobsInfo_URL)

                    resolve("")
                    this.setState({ Dashboard_Fetching: false });
                    Snackbar.show({
                        title: "Internal Server Error..!",
                        duration: Snackbar.LENGTH_SHORT,
                    });
                });
        });
    }


    _fetch_TSInfo(Token_Result, Token_RoleID, JobNumber) {
        return new Promise((resolve, reject) => {
            let TSInfo_URL = (List_Timesheet + Token_Result + "&user_role=" + Token_RoleID + "&job_no=" + JobNumber);

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
                    let TS_Info = ""
                    if (Jsonresponse.status != false) {
                        TS_Info = Jsonresponse
                        resolve({ TS_Info });
                    } else {
                        resolve(TS_Info)
                    }
                })
                .catch((error) => {
                    console.log(error,TSInfo_URL)
                    resolve("")
                    this.setState({ Dashboard_Fetching: false });
                    Snackbar.show({
                        title: "Internal Server Error..!",
                        duration: Snackbar.LENGTH_SHORT,
                    });
                });
        });
    }

    //......Bottom Navigation Tab Bar......//

    tabs = [
        {
            key: 'Home',
            icon: 'Home',
            label: 'Home',
            barColor: LG_BG_THEME.WHITE_THEME,
            pressColor: LG_BG_THEME.WHITE_THEME,
        },
        {
            key: 'Calendar',
            icon: 'Calendar',
            label: 'Calendar',
            barColor: LG_BG_THEME.WHITE_THEME,
            pressColor: LG_BG_THEME.WHITE_THEME,
        },
        {
            key: 'Timesheet',
            icon: 'Timesheet',
            label: 'Jobs',
            barColor: LG_BG_THEME.WHITE_THEME,
            pressColor: LG_BG_THEME.WHITE_THEME,
        },
        {
            key: 'Message',
            icon: 'Message',
            label: 'Message',
            barColor: LG_BG_THEME.WHITE_THEME,
            pressColor: LG_BG_THEME.WHITE_THEME,
        },
        {
            key: 'Settings',
            icon: 'Settings',
            label: 'Settings',
            barColor: LG_BG_THEME.WHITE_THEME,
            pressColor: LG_BG_THEME.WHITE_THEME,
        }
    ]

    state = {
        ActiveTab: 'Home'
    }

    renderIcon = icon => ({ isActive }) => (

        icon == "Message" ?
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Image source={require('../../../../Asset/Icons/Message_Icon.png')} style={{ width: width / 100 * 6, height: width / 100 * 6, tintColor: isActive ? LG_BG_THEME.APPTHEME_1 : LG_BG_THEME.WHITE_THEME, opacity: 0.9 }} />
                {this.state.Message_Unreadcount != 0 ?
                    <View style={{ zIndex: 1000, justifyContent: "center", alignItems: "center", position: 'absolute', top: width / 100 * 1.5, right: width / 100 * -3, backgroundColor: "red", borderRadius: width / 100 * 3, width: width / 100 * 6, height: width / 100 * 6 }}>
                        <Text style={styles.container_CountWhite}>{this.state.Message_Unreadcount}</Text>
                    </View>
                    : null}
            </View>
            :

            <Image
                source={icon == "Home" ? require('../../../../Asset/Icons/Home_Icon.png') :
                    icon == "Calendar" ? require('../../../../Asset/Icons/Calendar_Icon.png') :
                        icon == "Timesheet" ? require('../../../../Asset/Icons/Timesheet_Icon.png') :
                            require('../../../../Asset/Icons/settings.png')} style={{ width: width / 100 * 6, height: width / 100 * 6, tintColor: isActive ? LG_BG_THEME.APPTHEME_1 : LG_BG_THEME.WHITE_THEME, opacity: 0.9 }} />
    )


    renderTab = ({ tab, isActive }) => (
        <ShiftingTab
            backgroundColor={isActive ? LG_BG_THEME.WHITE_THEME : LG_BG_THEME.APPTHEME_1}
            isActive={isActive}
            key={tab.key}
            label={tab.label}
            //style={{backgroundColor:"red"}}
            labelStyle={{ color: isActive ? LG_BG_THEME.APPTHEME_1 : LG_BG_THEME.WHITE_THEME, fontFamily: fontFamily.Poppins_SemiBold, marginLeft: width / 100 * 1, textAlign: 'left' }}
            renderIcon={this.renderIcon(tab.icon)}
        />
    )

    //......Account Tab......//

    Account_Method(RouteName) {
        if (RouteName == "Edit_Settings" || RouteName == "Change_Password") {
            this.props.navigation.navigate(RouteName)
        } else if (RouteName == "Logout") {
            Alert.alert(
                'Confirmation..!',
                'Are you sure, You want to Logout ?',
                [
                    { text: 'YES', onPress: () => this.lastLogin_Method() },
                    { text: 'NO', style: 'cancel' },

                ],
                { cancelable: false }
            )
        } else if (RouteName == "Terms_conditions") {
            Linking.openURL("http://appbox.website/casstimesheet/terms")
        } else if (RouteName == "Support") {
            Linking.openURL("http://appbox.website/casstimesheet/support")
        } else {
            Snackbar.show({
                title: 'Server Underconstruction..!',
                duration: Snackbar.LENGTH_SHORT,
            });
        }

    }


    Floating_Button() {

        if (this.state.ActiveTab == "Payments") {
            Snackbar.show({
                title: 'Server Underconstruction..!',
                duration: Snackbar.LENGTH_SHORT,
            });
        } else if (this.state.ActiveTab == "Businesses") {
            this.props.navigation.navigate("Add_Business")

        } else {
            this.props.navigation.navigate("Campaigns_Screen")
        }
    }

    Container_Method(RouteName, Route_Data) {
        if (RouteName == "Tab") {
            this.setState({ ActiveTab: "Message" })
            this.renderIcon("Message")

        } else {
            if (RouteName == "Timesheet_List") {

                if (Route_Data == undefined) {
                    this.props.navigation.navigate(RouteName, {
                        CalendarDate: "",
                        Job_Number: "",
                        Job_IDNumber: ""
                    });
                } else {
                    this.props.navigation.navigate(RouteName, {
                        CalendarDate: "",
                        Job_Number: Route_Data,
                        Job_IDNumber: ""
                    });
                }

            } else if (RouteName == "AddMore_Timesheet") {
                this._fetchTS_data(this.state.CassUserID, this.state.CassRoleID, Route_Data)
            } else {
                this.props.navigation.navigate(RouteName)
            }
        }
    }

    async _fetchTS_data(Token_Result, Token_RoleID, JobNumber) {

        const Timesheets_Response = await this._fetch_TSInfo(Token_Result, Token_RoleID, JobNumber);
        try {
            this.props.Addmore_TSdata(Timesheets_Response.TS_Info[0])
        } catch (err) {
            console.log(err)

            this.setState({ Dashboard_Fetching: false });
        }
    }

    Notifications_TabMethod(RouteName) {
        this.setState({ Notifications_Tab: RouteName })
    }

    Calender_Method(RouteName) {

        if (RouteName == "Add_Leave" || RouteName == "Add_Timesheet") {
            this.props.navigation.navigate(RouteName, {
                CalendarDate: this.state.Calendar_Date,
            });

        } else if (RouteName == "Jobs_List") {
            this.props.navigation.navigate(RouteName, {
                TimesheetDate: this.state.Timesheet_Date,
            });
        } else {

            if (RouteName == "LeaveTaken_List") {
                this.props.navigation.navigate(RouteName, {
                    CalendarDate: "",
                });
            } else {
                this.props.navigation.navigate(RouteName)
            }
        }

    }

    Message_Method(RouteName) {

        if (RouteName != undefined) {

            fetch(User_Readstatus, {
                method: 'POST',
                headers: new Headers({
                    'Authorization': "Basic " + base64.encode(Cass_AuthDetails),
                    'X-API-KEY': Cass_APIDetails,
                    'Content-Type': 'application/json',
                }),
                body: JSON.stringify({
                    "user_id": this.state.CassUserID,
                    "message_id": RouteName.id
                })
            })

                .then((response) => response.json())
                .then((Jsonresponse) => {
                    if (Jsonresponse.status == true) {
                        this.setState({
                            Info_ModalName: "Message",
                            Info_Message: RouteName.message,
                            Info_MSG_FN: RouteName.first_name,
                            Info_MSG_LN: RouteName.last_name,
                            Info_MSG_Time: Moment(RouteName.sent_at).format('D-MMMM-YY') + " at " + Moment(RouteName.sent_at).format("h A"),
                            Info_Modal: true
                        })
                        this.Refersh_Method("Message")
                    } else {
                        Snackbar.show({
                            title: Jsonresponse.message + "..!",
                            duration: Snackbar.LENGTH_SHORT,
                        });
                    }
                })
                .catch((error) => {
                    console.log(error)
                    this.setState({ Dashboard_Fetching: false });
                    Snackbar.show({
                        title: "Internal Server Error..!",
                        duration: Snackbar.LENGTH_SHORT,
                    });
                });

        }
    }

    async Refersh_Method(Route_Data) {

        if (Route_Data == "Message") {
            const MsgInfo_Response = await this._fetch_MsgInfo(this.state.CassUserID, this.state.CassRoleID)
            try {
                this.setState({
                    Msg_ResponseArray: MsgInfo_Response.Msg_Info == undefined ? [] : MsgInfo_Response.Msg_Info,
                    Message_ListCount: MsgInfo_Response.Msg_Info == undefined ? 0 : MsgInfo_Response.Msg_Info.length, Dashboard_Fetching: false
                })
                if (MsgInfo_Response.Msg_Info != undefined) {
                    let Count = 0
                    for (let i = 0; i < MsgInfo_Response.Msg_Info.length; i++) {
                        if (MsgInfo_Response.Msg_Info[i].status == 1) {
                            Count = ++Count
                        }
                    }
                    this.setState({ Message_Unreadcount: Count })
                }

            } catch (error) {
                console.log(error)

                this.setState({ Dashboard_Fetching: false });
            }
        } else {
            const NotifyInfo_Response = await this._fetch_NotifyInfo(this.state.CassUserID, this.state.CassRoleID)
            try {
                this.setState({
                    Notify_ResponseArray: NotifyInfo_Response.Notify_Info == undefined ? [] : NotifyInfo_Response.Notify_Info,
                })

                if (NotifyInfo_Response.Notify_Info != undefined) {
                    let Count = 0
                    for (let i = 0; i < NotifyInfo_Response.Notify_Info.length; i++) {
                        if (NotifyInfo_Response.Notify_Info[i].status == 1) {
                            Count = ++Count
                        }
                    }
                    this.setState({ Notification_count: Count })
                    this.props.Notification_Count(Count)
                }

            } catch (err) {
                console.log(err)

                this.setState({ Dashboard_Fetching: false });
            }
        }

    }


    Notification_Method(RouteName) {
        fetch(User_Readstatus, {
            method: 'POST',
            headers: new Headers({
                'Authorization': "Basic " + base64.encode(Cass_AuthDetails),
                'X-API-KEY': Cass_APIDetails,
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify({
                "user_id": this.state.CassUserID,
                "notification_id": RouteName.id
            })
        })

            .then((response) => response.json())
            .then((Jsonresponse) => {
                if (Jsonresponse.status == true) {
                    this.Refersh_Method("Nofication")

                    this.props.navigation.navigate("Timesheet_List", {
                        CalendarDate: "",
                        Job_Number: "",
                        Job_IDNumber: RouteName.from_table_id
                    });
                } else {
                    Snackbar.show({
                        title: Jsonresponse.message + "..!",
                        duration: Snackbar.LENGTH_SHORT,
                    });
                }
            })
            .catch((error) => {
                console.log(error)
                this.setState({ Dashboard_Fetching: false });
                Snackbar.show({
                    title: "Internal Server Error..!",
                    duration: Snackbar.LENGTH_SHORT,
                });
            });


    }

    onDateChange(RouteName, Date_Index) {

        if (RouteName == "CALENDAR") {
            this.setState({
                Calendar_Date: Moment(Date_Index).format('YYYY-MM-DD'),
                CD_Year: Moment(Date_Index).format('YYYY'),
                CD_Month: Moment(Date_Index).format('MMMM'),
                CD_Date: Moment(Date_Index).format('DD')
            })

            var CL_Routename = false
            if (this.state.CD_List.timesheet_dates != undefined) {
                for (let i = 0; i < this.state.CD_List.timesheet_dates.length; i++) {
                    if (Moment(Date_Index).format('YYYY-MM-DD') == this.state.CD_List.timesheet_dates[i]) {
                        this.props.navigation.navigate("Timesheet_List", {
                            CalendarDate: Moment(Date_Index).format('YYYY-MM-DD'),
                            Job_Number: "",
                            Job_IDNumber: "",
                        });
                        CL_Routename = true
                        this.forceUpdate()
                    }
                }
            }



            if (this.state.CD_List.engineer_leave_dates != undefined) {
                for (let i = 0; i < this.state.CD_List.engineer_leave_dates.length; i++) {
                    if (Moment(Date_Index).format('YYYY-MM-DD') == this.state.CD_List.engineer_leave_dates[i]) {
                        this.props.navigation.navigate("LeaveTaken_List", {
                            CalendarDate: Moment(Date_Index).format('YYYY-MM-DD'),
                        });
                        CL_Routename = true
                        this.forceUpdate()
                    }
                }
            }

            if (this.state.CD_List.combined_dates != undefined) {
                for (let i = 0; i < this.state.CD_List.combined_dates.length; i++) {
                    if (Moment(Date_Index).format('YYYY-MM-DD') == this.state.CD_List.combined_dates[i]) {
                        this.props.navigation.navigate("LeaveTaken_List", {
                            CalendarDate: Moment(Date_Index).format('YYYY-MM-DD'),
                        })
                        this.props.navigation.navigate("Timesheet_List", {
                            CalendarDate: Moment(Date_Index).format('YYYY-MM-DD'),
                            Job_Number: "",
                            Job_IDNumber: ""
                        })
                        CL_Routename = true
                        this.forceUpdate()
                    }
                }
            }


            if (this.state.CD_List.holiday_dates != undefined) {
                for (let i = 0; i < this.state.CD_List.holiday_dates.length; i++) {
                    if (Moment(Date_Index).format('YYYY-MM-DD') == this.state.CD_List.holiday_dates[i]) {
                        Snackbar.show({
                            title: 'Office Holiday..!',
                            duration: Snackbar.LENGTH_SHORT,
                        });
                        CL_Routename = true
                        this.forceUpdate()
                    }
                }
            }

            if (CL_Routename == false) {
                this.props.navigation.navigate("Add_Timesheet", {
                    CalendarDate: Moment(Date_Index).format('YYYY-MM-DD'),
                });
                Snackbar.show({
                    title: 'NO Timesheets is Present..!',
                    duration: Snackbar.LENGTH_SHORT,
                });
            }
        } else {
            this.setState({
                Timesheet_Date: Moment(Date_Index).format('YYYY-MM-DD'),
                TD_Year: Moment(Date_Index).format('YYYY'),
                TD_Month: Moment(Date_Index).format('MMMM'),
                TD_Date: Moment(Date_Index).format('DD')
            })
        }

        this.forceUpdate()
    }
    Container_Model(RouteName) {
        this.setState({ Info_Modal: RouteName, Info_ModalName: "" })
    }

    onSwipe(gestureName, gestureState) {
        const { SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
        this.setState({ gestureName: gestureName });
        switch (gestureName) {
            case SWIPE_RIGHT:

                if (this.state.Message_ListIndex >= 1) {
                    this.setState({ Message_ListIndex: --this.state.Message_ListIndex })
                } else {
                    Snackbar.show({
                        title: 'First Message..!',
                        duration: Snackbar.LENGTH_SHORT,
                    });
                }
                break;
            case SWIPE_LEFT:
                if (this.state.Message_ListIndex < 4) {
                    if ((this.state.Message_ListCount - 1) != this.state.Message_ListIndex) {
                        this.setState({ Message_ListIndex: ++this.state.Message_ListIndex })

                    } else {
                        Snackbar.show({
                            title: 'Final Message..!',
                            duration: Snackbar.LENGTH_SHORT,
                        });
                    }
                } else {
                    Snackbar.show({
                        title: 'Final Message..!',
                        duration: Snackbar.LENGTH_SHORT,
                    });
                }
                break;
        }
    }

    async Container_Reset() {
        const JobsInfo_Response = await this._fetch_JobsInfo(this.state.CassUserID, this.state.CassRoleID, 1)
        this.setState({
            Jobs_ResponseArray: [],
            Jobs_RArray: [],
            Pagination_Status: 1,
            Dashboard_Fetching: true
        });
        setTimeout(() => {
            this.setState({
                Jobs_ResponseArray: JobsInfo_Response.Job_Info == undefined ? [] : JobsInfo_Response.Job_Info,
                Jobs_RArray: JobsInfo_Response.Job_Info == undefined ? [] : JobsInfo_Response.Job_Info,
                Pagination_Status: 1,
                Dashboard_Fetching: false
            });

        }, 1000)
        this.forceUpdate()
    }

    onEndReached = ({ distanceFromEnd }) => {
        if (!this.onEndReachedCalledDuringMomentum) {
            this.onRefresh_End()
            this.onEndReachedCalledDuringMomentum = true;
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
                console.log(error)

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
                Jobs_ResponseArray: this.state.Jobs_RArray,
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

        const { Jobs_RArray } = this.state;
        var newData = []
        try {

            if (RouteName == "Job_No") {
                newData = Jobs_RArray.filter(function (item) {
                    const itemData = item.job_no ? item.job_no.toUpperCase() : ''.toUpperCase();
                    const textData = Data_Response.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                })
            }

            this.setState({
                Jobs_ResponseArray: newData,
                Reset_Enable: true,
                Sorting_isVisible: false
            });

            this.forceUpdate()

        } catch (err) {
            console.log(err)

        }
    }

    onRefresh_End() {
        this.setState({ Dashboard_Fetching: true, Pagination_Status: ++this.state.Pagination_Status }, () => this._fetchEnddata(this.state.CassUserID, this.state.CassRoleID,));
        this.forceUpdate()
    }


    async _fetchEnddata(Token_Result, Token_RoleID) {
        const JobsInfo_Response = await this._fetch_JobsInfo(Token_Result, Token_RoleID, this.state.Pagination_Status);
        try {
            this.setState({
                Jobs_ResponseArray: Array.from(new Set(Array.from(new Set(this.state.Jobs_ResponseArray)).concat(Array.from(new Set(JobsInfo_Response.Job_Info == undefined ? [] : JobsInfo_Response.Job_Info))))),
                Jobs_RArray: Array.from(new Set(Array.from(new Set(this.state.Jobs_ResponseArray)).concat(Array.from(new Set(JobsInfo_Response.Job_Info == undefined ? [] : JobsInfo_Response.Job_Info))))),
                Dashboard_Fetching: false
            })

        } catch (err) {
            console.log(err)

            this.setState({ Dashboard_Fetching: false });
        }
    }
    
    
    render() {

        const { Dashboard_Fetching } = this.state;
        const { NotificationCount } = this.props.CommonReducer

        var spinner = false;
        if (Dashboard_Fetching == true) {
            spinner = <Spinner visibility={true} />
        } else {
            spinner = false
        }

        const config = {
            velocityThreshold: 0.1,
            directionalOffsetThreshold: 50
        };


        let customDatesStyles = [];


        if (this.state.CD_Timesheetslist != undefined) {
            for (let i = 0; i < this.state.CD_Timesheetslist.length; i++) {
                customDatesStyles.push({
                    date: new Date(this.state.CD_Timesheetslist[i]),
                    style: { backgroundColor: Notify_THEME.AW_APPROVED },
                    textStyle: { color: LG_BG_THEME.WHITE_THEME }, // sets the font color
                    //containerStyle: [{borderRadius:width/100*2}], // extra styling for day container
                });
            }
        }

        if (this.state.CD_Holiday_dates != undefined) {
            for (let i = 0; i < this.state.CD_Holiday_dates.length; i++) {
                customDatesStyles.push({
                    date: new Date(this.state.CD_Holiday_dates[i]),
                    style: { backgroundColor: LG_BG_THEME.APPTHEME_GREY },
                    textStyle: { color: LG_BG_THEME.WHITE_THEME }, // sets the font color
                    // containerStyle: [borderRadius width/100*1], // extra styling for day container
                });
            }
        }

        if (this.state.CD_Combined_dates != undefined) {
            for (let i = 0; i < this.state.CD_Combined_dates.length; i++) {
                customDatesStyles.push({
                    date: new Date(this.state.CD_Combined_dates[i]),
                    style: { backgroundColor: Notify_THEME.AW_APPROVED },
                    textStyle: { color: LG_BG_THEME.WHITE_THEME }, // sets the font color
                    // containerStyle: [borderRadius width/100*1], // extra styling for day container
                });
            }
        }


        if (this.state.CD_Leave_dates != undefined) {
            for (let i = 0; i < this.state.CD_Leave_dates.length; i++) {
                customDatesStyles.push({
                    date: new Date(this.state.CD_Leave_dates[i]),
                    style: { backgroundColor: Notify_THEME.AW_EngineerLeave },
                    textStyle: { color: LG_BG_THEME.APPTHEME_BLACK }, // sets the font color
                    // containerStyle: [borderRadius width/100*1], // extra styling for day container
                });
            }
        }

        return (
            <LinearGradient key="background" start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[LG_BG_THEME.APPTHEME_BG_2, LG_BG_THEME.APPTHEME_1]} style={{ flex: 1, justifyContent: "center" }} >
                {spinner}
                {this.state.Alert_Design_isVisible == true ? this.AlertPopup_Method() : null}
                {this.state.Alert_Msg_isVisible == true ? this.Notification_Msg() : null}

                <Mystatusbar />

                <View style={{ flex: 1, justifyContent: "center", backgroundColor: LG_BG_THEME.APPTHEME_1 }}>


                    {
                        this.state.ActiveTab == "Home" ?
                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                                <View style={{ flex: 1, }}>
                                    <AS_HeaderDesign
                                        Onpress_RightIcon={() => this.Container_Method("Notification_Screen")}
                                        Header_Text={"WELCOME"}
                                        RightIcon_Status={"welcome"}
                                        LeftIcon_Status={false}
                                        Notification_Count={NotificationCount}
                                    />


                                    <View style={{ flex: 0.5, backgroundColor: LG_BG_THEME.APPTHEME_1, }}>
                                        <View style={styles.Container_EP_1} />

                                        <View style={{ flex: 0.2, justifyContent: "center", alignItems: 'center', backgroundColor: LG_BG_THEME.APPTHEME_1, }}>
                                            <View style={{ height: width / 100 * 20, width: width / 100 * 20, borderRadius: width / 100 * 10, justifyContent: "center", backgroundColor: LG_BG_THEME.APPTHEME_BG, alignItems: 'center', borderColor: LG_BG_THEME.WHITE_THEME, borderWidth: width / 100 * 0.6 }}>
                                                <Image source={{ uri: this.state.User_ResponseArray.image }} style={{ width: width / 100 * 14, height: width / 100 * 14, borderRadius: width / 100 * 7 }} />
                                            </View>
                                        </View>

                                        <View style={styles.Container_EP_1} />

                                        <View style={{ flex: 0.8, justifyContent: "center" }}>

                                            <View style={{ flex: 0.3, justifyContent: "center" }}>
                                                <View style={styles.Container_EP_1} />


                                                {
                                                    this.state.User_ResponseArray.first_name == undefined ?
                                                        null
                                                        :
                                                        <Home_Usertext
                                                            ASB_Text={this.state.User_ResponseArray.first_name + " " + this.state.User_ResponseArray.last_name}
                                                        />
                                                }

                                                <Home_Usertext
                                                    ASB_Text={this.state.User_ResponseArray.department_name}
                                                />
                                            </View>
                                            <View style={styles.Container_EP_1} />

                                            <View style={{ flex: 0.7, justifyContent: "center" }}>
                                                <View style={{ flex: 0.3, justifyContent: "center", flexDirection: "row" }}>
                                                    <View style={{ flex: 0.15, justifyContent: "center", alignItems: "center" }}>
                                                        <Image source={require('../../../../Asset/Icons/Calendar_Icon.png')} style={{ width: width / 100 * 6, height: width / 100 * 6, tintColor: LG_BG_THEME.WHITE_THEME }} />
                                                    </View>
                                                    <View style={{ flex: 0.85, justifyContent: "center", alignItems: "flex-start" }}>
                                                        <Text numberOfLines={1} style={styles.container_WText}>{"Recent Timesheet"}</Text>
                                                    </View>
                                                </View>

                                                <View style={{ flex: 0.7, justifyContent: "center", marginLeft: width / 100 * 6, marginRight: width / 100 * 6 }}>
                                                    <Home_Timesheetscard
                                                        Card_BG={"#292929"}
                                                        CardHeader_1={this.state.RTS_DayThere}
                                                        CardText_1={this.state.RTS_DateThere}
                                                        CH1_BG={this.state.RTS_Date_BG_1 == "TS" ? Notify_THEME.AW_APPROVED : this.state.RTS_Date_BG_1 == "TSH" ? Notify_THEME.AW_APPROVED : this.state.RTS_Date_BG_1 == "HD" ? LG_BG_THEME.APPTHEME_GREY : "#FFFF00"}
                                                        CardHeader_2={this.state.RTS_DayTwo}
                                                        CardText_2={this.state.RTS_DateTwo}
                                                        CH2_BG={this.state.RTS_Date_BG_2 == "TS" ? Notify_THEME.AW_APPROVED : this.state.RTS_Date_BG_2 == "TSH" ? Notify_THEME.AW_APPROVED : this.state.RTS_Date_BG_2 == "HD" ? LG_BG_THEME.APPTHEME_GREY : "#FFFF00"}
                                                        CardHeader_3={this.state.RTS_Dayone}
                                                        CardText_3={this.state.RTS_Dateone}
                                                        CH3_BG={this.state.RTS_Date_BG_3 == "TS" ? Notify_THEME.AW_APPROVED : this.state.RTS_Date_BG_3 == "TSH" ? Notify_THEME.AW_APPROVED : this.state.RTS_Date_BG_3 == "HD" ? LG_BG_THEME.APPTHEME_GREY : "#FFFF00"}
                                                    />
                                                </View>
                                            </View>

                                        </View>
                                    </View>

                                    <View style={{ flex: 0.5, backgroundColor: LG_BG_THEME.APPTHEME_BG_2, }}>
                                        <View style={{ flex: 0.20, backgroundColor: LG_BG_THEME.APPTHEME_1, borderBottomLeftRadius: width / 100 * 10, borderBottomRightRadius: width / 100 * 10, }}>
                                            <View style={{ flex: 0.2, }} />

                                            <ViewAll_Design
                                                ViewAll_Method={() => this.Container_Method("Timesheet_List")}
                                                status={"Timesheet"}
                                                ViewText={"View All"}
                                                Text_BG={LG_BG_THEME.WHITE_THEME}
                                            />
                                            <View style={{ flex: 0.3 }} />

                                        </View>

                                        <View style={{ flex: 0.80, justifyContent: 'center', backgroundColor: LG_BG_THEME.APPTHEME_BG_2 }} >

                                            <View style={styles.Container_EP_1} />

                                            <Home_Headertext
                                                Home_Centertext={"MESSAGES"}
                                            />

                                            <View style={styles.Container_EP_2} />

                                            <View style={{ flex: 0.43, justifyContent: 'center', }}>


                                                {
                                                    this.state.Message_ListCount == 0 ?

                                                        <Home_Msgcard
                                                            CardList_Method={() => this.Message_Method()}
                                                            Card_BG={LG_BG_THEME.APPTHEME_1}
                                                            CardText_1={""}
                                                            CardText_2={"No Recent Message"}
                                                            CardText_Header3={""}
                                                            CardText_3={""}
                                                        />

                                                        :
                                                        <GestureRecognizer
                                                            onSwipe={(direction, state) => this.onSwipe(direction, state)}
                                                            config={config}>
                                                            <Home_Msgcard
                                                                CardList_Method={() => this.Message_Method()}
                                                                Card_BG={LG_BG_THEME.APPTHEME_1}
                                                                CardText_1={this.state.Msg_ResponseArray[this.state.Message_ListIndex].message}
                                                                CardText_2={Moment(this.state.Msg_ResponseArray[this.state.Message_ListIndex].sent_at).format('D-MMMM-YY') + " at " + Moment(this.state.Msg_ResponseArray[this.state.Message_ListIndex].sent_at).format("h A")}
                                                                CardText_Header3={""}
                                                                CardText_3={"-by " + this.state.Msg_ResponseArray[this.state.Message_ListIndex].first_name + " " + this.state.Msg_ResponseArray[this.state.Message_ListIndex].last_name}
                                                            />

                                                        </GestureRecognizer>


                                                }

                                            </View>

                                            <View style={{ flex: 0.15, justifyContent: "center", flexDirection: "row" }}>
                                                <View style={{ flex: 0.4, }} />
                                                <View style={{ flex: 0.2, justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                                                    {this.state.Msg_ResponseArray.slice(0, 5).map((item, index) => (
                                                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginLeft: width / 100 * 1, marginRight: width / 100 * 1 }}>
                                                            <Image source={require('../../../../Asset/Icons/Circle.png')} style={{ width: width / 100 * 2, height: width / 100 * 2, tintColor: index == this.state.Message_ListIndex ? LG_BG_THEME.APPTHEME_1 : LG_BG_THEME.APPTHEME_GREY }} />
                                                        </View>
                                                    ))}
                                                </View>

                                                <View style={{ flex: 0.4, }} />

                                            </View>

                                            <ViewAll_Design
                                                ViewAll_Method={() => this.Container_Method("Tab")}
                                                status={"Msg"}
                                                ViewText={"View All"}
                                                Text_BG={"#010066"}
                                            />
                                            <View style={{ flex: 0.05 }} />
                                        </View>

                                    </View>

                                </View>
                            </TouchableWithoutFeedback>
                            : this.state.ActiveTab == "Calendar" ?

                                <View style={{ flex: 1 }}>
                                    <AS_HeaderDesign
                                        Onpress_RightIcon={() => this.Container_Method("Goback")}
                                        Header_Text={"CALENDAR"}
                                        RightIcon_Status={false}
                                        LeftIcon_Status={false}
                                    />

                                    <View style={{ flex: 0.15, backgroundColor: LG_BG_THEME.APPTHEME_1, justifyContent: 'center', flexDirection: 'row', }}>

                                        <View style={{ flex: 0.2, }} />

                                        <View style={{ flex: 0.6, justifyContent: 'center', flexDirection: 'row' }}>


                                            <View style={{ flex: 0.495, justifyContent: "center", alignItems: "center" }}>
                                                <Text style={{ fontSize: Platform.OS == "android" ? width / 100 * 10.2 : width / 100 * 10, fontFamily: fontFamily.Poppins_SemiBold, letterSpacing: width / 100 * 0.1, color: LG_BG_THEME.WHITE_THEME,textAlign:'center' }}>{this.state.CD_Date}</Text>
                                            </View>

                                            <View style={{ flex: 0.01, backgroundColor: LG_BG_THEME.WHITE_THEME }} />
                                            <View style={{ flex: 0.495, justifyContent: "center", alignItems: "center" }}>
                                                <View style={{ flex: 0.1, justifyContent: "center", alignItems: "center" }} />

                                                <View style={{ flex: 0.4, justifyContent: "center", alignItems: "center" }}>
                                                    <Text numberOfLines={1} style={{ fontSize: fontSize.Large, fontFamily: fontFamily.Poppins_SemiBold, letterSpacing: width / 100 * 0.1, color: LG_BG_THEME.WHITE_THEME,textAlign:'auto' }}>{this.state.CD_Month}</Text>
                                                </View>

                                                <View style={{ flex: 0.4, justifyContent: "center", alignItems: "center" }}>
                                                    <Text style={{ fontSize: fontSize.ExtraLarge, fontFamily: fontFamily.Poppins_SemiBold, letterSpacing: width / 100 * 0.1, color: LG_BG_THEME.WHITE_THEME,textAlign:'center' }}>{this.state.CD_Year}</Text>
                                                </View>

                                                <View style={{ flex: 0.1, justifyContent: "center", alignItems: "center" }} />
                                            </View>

                                        </View>

                                        <View style={{ flex: 0.2, }} />

                                    </View>
                                    <View style={{ flex: 0.05, backgroundColor: LG_BG_THEME.APPTHEME_BG_2, }}>
                                        <View style={{ flex: 1, backgroundColor: LG_BG_THEME.APPTHEME_1, borderBottomLeftRadius: width / 100 * 12, borderBottomRightRadius: width / 100 * 12, }} />
                                    </View>

                                    <View style={{ flex: 0.8, justifyContent: 'center', backgroundColor: LG_BG_THEME.APPTHEME_BG_2, }}>
                                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                            <ScrollView showsVerticalScrollIndicator={false}>

                                                <View style={styles.Container_EP_2} />

                                                <View style={styles.Calendar_View}>

                                                    <CalendarPicker
                                                        startFromMonday={false}
                                                        allowRangeSelection={false}
                                                        selectedStartDate={this.state.Calendar_Date}
                                                        initialDate={new Date(new Date().getTime())}
                                                        // minDate={new Date(new Date().getTime() - (86400000 * 90))}
                                                        //maxDate={new Date(new Date().getTime())}
                                                        // weekdays={['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']}
                                                        months={['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']}
                                                        previousTitle="<"
                                                        nextTitle=">"
                                                        enableSwipe={true}
                                                        dayShape={"square"}
                                                        todayBackgroundColor={LG_BG_THEME.APPTHEME_1}
                                                        selectedDayColor={LG_BG_THEME.APPTHEME_2}
                                                        selectedDayTextColor={LG_BG_THEME.WHITE_THEME}
                                                        scaleFactor={375}
                                                        todayTextStyle={{
                                                            fontFamily: fontFamily.Poppins_SemiBold,
                                                            color: LG_BG_THEME.WHITE_THEME,
                                                        }}
                                                        width={width / 100 * 70}
                                                        height={height / 100 * 50}
                                                        textStyle={{
                                                            fontFamily: fontFamily.Poppins_Regular,
                                                            color: LG_BG_THEME.APPTHEME_BLACK,
                                                        }}
                                                        onDateChange={(Date) => this.onDateChange("CALENDAR", Date)}
                                                        customDatesStyles={customDatesStyles}


                                                    />
                                                </View>

                                                <View style={styles.Container_EP_2} />

                                                <View style={{ height: height / 100 * 7, justifyContent: "center", flexDirection: 'row', marginLeft: width / 100 * 5, marginRight: width / 100 * 5, backgroundColor: LG_BG_THEME.APPTHEME_Blue, borderRadius: height / 100 * 3.5 }}>

                                                    <TouchableOpacity onPress={() => this.Calender_Method("Add_Leave")} style={{ flex: 0.3, justifyContent: 'center', alignItems: "center", backgroundColor: LG_BG_THEME.APPTHEME_Blue, borderRadius: height / 100 * 3.5 }}>
                                                        <Image source={require('../../../../Asset/Icons/Add_New.png')} style={{ width: width / 100 * 6, height: width / 100 * 6, tintColor: LG_BG_THEME.WHITE_THEME }} />
                                                    </TouchableOpacity>

                                                    <View style={{ flex: 0.4, justifyContent: "center", alignItems: "center" }}>
                                                        <Text style={{ fontSize: fontSize.Medium, fontFamily: fontFamily.Poppins_SemiBold, letterSpacing: width / 100 * 0.1, color: LG_BG_THEME.WHITE_THEME }}>{"Leave"}</Text>
                                                    </View>

                                                    <TouchableOpacity onPress={() => this.Calender_Method("LeaveTaken_List")} style={{ flex: 0.3, justifyContent: 'center', alignItems: "center", backgroundColor: LG_BG_THEME.APPTHEME_Blue, borderRadius: height / 100 * 3.5 }}>
                                                        <Image source={require('../../../../Asset/Icons/View_icon.png')} style={{ width: width / 100 * 6, height: width / 100 * 6, tintColor: LG_BG_THEME.WHITE_THEME }} />
                                                    </TouchableOpacity>


                                                </View>

                                                {/* <CM_ButtonDesign
                                                    CMB_BuutonColourcode={LG_BG_THEME.APPTHEME_Blue}
                                                    onPress_BuutonView={() => this.Calender_Method("")}
                                                    CMB_TextHeader={"View Leave"}
                                                /> */}

                                                <View style={styles.Container_EP_1} />

                                                <View style={{ height: height / 100 * 7, justifyContent: "center", flexDirection: 'row', marginLeft: width / 100 * 5, marginRight: width / 100 * 5, backgroundColor: LG_BG_THEME.APPTHEME_Blue, borderRadius: height / 100 * 3.5 }}>

                                                    <TouchableOpacity onPress={() => this.Calender_Method("Add_Timesheet")} style={{ flex: 0.3, justifyContent: 'center', alignItems: "center", }}>
                                                        <Image source={require('../../../../Asset/Icons/Add_New.png')} style={{ width: width / 100 * 6, height: width / 100 * 6, tintColor: LG_BG_THEME.WHITE_THEME }} />
                                                    </TouchableOpacity>

                                                    <View style={{ flex: 0.4, justifyContent: "center", alignItems: "center" }}>
                                                        <Text style={{ fontSize: fontSize.Medium, fontFamily: fontFamily.Poppins_SemiBold, letterSpacing: width / 100 * 0.1, color: LG_BG_THEME.WHITE_THEME }}>{"Timesheet"}</Text>

                                                    </View>

                                                    <TouchableOpacity onPress={() => this.Container_Method("Timesheet_List")} style={{ flex: 0.3, justifyContent: 'center', alignItems: "center" }}>
                                                        <Image source={require('../../../../Asset/Icons/View_icon.png')} style={{ width: width / 100 * 6, height: width / 100 * 6, tintColor: LG_BG_THEME.WHITE_THEME }} />

                                                    </TouchableOpacity>


                                                </View>
                                                {/* <CM_ButtonDesign
                                                    CMB_BuutonColourcode={LG_BG_THEME.APPTHEME_Blue}
                                                    onPress_BuutonView={() => this.Calender_Method("Add_Timesheet")}
                                                    CMB_TextHeader={"Add Timesheet"}
                                                /> */}
                                                <View style={styles.Container_EP_1} />

                                            </ScrollView>
                                        </TouchableWithoutFeedback>

                                    </View>


                                </View>
                                : this.state.ActiveTab == "Timesheet" ?

                                    <View style={{ flex: 1, backgroundColor: LG_BG_THEME.APPTHEME_BG_2 }}>

                                        <ASS_HeaderDesign
                                            Onpress_LeftIcon={() => this.Container_Method("Goback")}
                                            Onpress_More_Icon={() => this.setState({ Sorting_isVisible: true })}
                                            Onpress_More_Reset={() => this.Container_Reset()}
                                            Header_Text={"JOBS"}
                                            RightIcon_Status={false}
                                            LeftIcon_Status={false}
                                            Reset_Status={true}
                                        />
                                        <View style={{ flex: 0.02 }} />
                                        <View style={styles.Container_EP_2} />

                                        <View style={{ flex: 0.08, justifyContent: 'center', flexDirection: "row" }}>

                                            <View style={{ flexDirection: "row", flex: 0.495, justifyContent: 'center', alignItems: 'center' }} />


                                            <View style={{ flex: 0.02, justifyContent: 'center' }} />

                                            <View style={styles.Container_TimesheetHeader}>
                                                <Text style={styles.container_TabText}>{"Total Jobs - " + this.state.Jobs_ResponseArray.length}</Text>
                                            </View>
                                        </View>

                                        <View style={{ flex: 0.9, marginTop: width / 100 * 2, marginLeft: width / 100 * 6, marginRight: width / 100 * 6 }}>
                                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>


                                                {this.state.Jobs_ResponseArray.length == 0 ?
                                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={styles.container_EmptyText}>{"No Jobs Found..!"}</Text>
                                                    </View>
                                                    :
                                                    <FlatList style={{ flex: 1, }}
                                                        data={this.state.Jobs_ResponseArray}
                                                        showsVerticalScrollIndicator={false}
                                                        onRefresh={() => this.Container_Reset()}
                                                        refreshing={this.state.Dashboard_Fetching}
                                                        keyExtractor={(item, index) => item.key}

                                                        onEndReached={this.onEndReached.bind(this)}
                                                        onEndReachedThreshold={0.5}
                                                        onMomentumScrollEnd={() => { this.onEndReachedCalledDuringMomentum = false }}
                                                        renderItem={({ item, index }) =>
                                                            <Card_Joblist
                                                                CardList_AMORE={() => this.Container_Method("AddMore_Timesheet", item.job_no)}
                                                                CardList_VAll={() => this.Container_Method("Timesheet_List", item.job_no)}
                                                                Card_BG={LG_BG_THEME.WHITE_THEME}
                                                                CardText_Header1={"Job No : "}
                                                                CardText_1={item.job_no}
                                                                CardText_Header2={"Worked on: "}
                                                                CardText_2={Moment(item.job_date).format('DD-MMMM-YY')}
                                                                CardTimesheet_Count={"No.of.Timesheets : " + item.timesheet_count}
                                                                CardText_ResubmitCount={item.timesheet_resubmit_count}
                                                            />
                                                        }
                                                    />
                                                }


                                            </TouchableWithoutFeedback>


                                        </View>

                                    </View>
                                    : this.state.ActiveTab == "Message" ?

                                        <View style={{ flex: 1, backgroundColor: LG_BG_THEME.APPTHEME_BG_2 }}>
                                            <AS_HeaderDesign
                                                Onpress_RightIcon={() => this.Container_Model(true)}
                                                Header_Text={this.state.Notifications_Tab.toUpperCase()}
                                                RightIcon_Status={"Info"}
                                                LeftIcon_Status={false}
                                            />

                                            <View style={{ flex: 0.02 }} />
                                            <View style={styles.Container_EP_2} />

                                            <View style={{ flex: 0.08, justifyContent: 'center', flexDirection: "row" }}>
                                                <TouchableOpacity onPress={() => this.Notifications_TabMethod("Messages")} style={this.state.Notifications_Tab == "Messages" ? styles.Container_ActiveTabView : styles.Container_TabView}>
                                                    {this.state.Message_Unreadcount != 0 ?
                                                        <Text style={styles.container_TabText}>{"Messages "} <Text style={styles.container_TabCountText}>{" " + this.state.Message_Unreadcount + " "}</Text></Text>
                                                        :
                                                        <Text style={styles.container_TabText}>{"Messages "}</Text>
                                                    }

                                                </TouchableOpacity>

                                                <View style={{ flex: 0.02, justifyContent: 'center' }} />

                                                <TouchableOpacity onPress={() => this.Notifications_TabMethod("Notifications")} style={this.state.Notifications_Tab == "Notifications" ? styles.Container_ActiveTabView : styles.Container_TabView}>

                                                    {NotificationCount != 0 ?
                                                        <Text style={styles.container_TabText}>{"Notifications "} <Text style={styles.container_TabCountText}>{" " + NotificationCount + " "}</Text></Text>
                                                        :
                                                        <Text style={styles.container_TabText}>{"Notifications "}</Text>
                                                    }

                                                </TouchableOpacity>
                                            </View>

                                            <View style={styles.Container_EP_2} />
                                            <View style={{ flex: 0.9, marginTop: width / 100 * 2 }}>
                                                {this.state.Notifications_Tab == "Messages" ?
                                                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                                                        {this.state.Msg_ResponseArray.length == 0 ?
                                                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                                <Text style={styles.container_EmptyText}>{"No Message Found..!"}</Text>
                                                            </View>
                                                            :
                                                            <FlatList style={{ flex: 1, }}
                                                                data={this.state.Msg_ResponseArray}
                                                                showsVerticalScrollIndicator={false}
                                                                keyExtractor={(item, index) => item.key}
                                                                renderItem={({ item, index }) =>

                                                                    <MsgCardlist_Design
                                                                        CardList_Method={() => this.Message_Method(item)}
                                                                        Card_BG={"transparent"}
                                                                        CardText_1={item.first_name + " " + item.last_name}
                                                                        CardText_2={item.message}
                                                                        CardText_Header3={"Date : "}
                                                                        CardText_status={item.status == 1 ? true : false}
                                                                        CardText_3={Moment(item.sent_at).format('DD-MMMM-YY') + " at " + Moment(item.sent_at).format("h A")}
                                                                    />
                                                                }
                                                            />
                                                        }

                                                    </TouchableWithoutFeedback>
                                                    :
                                                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                                        {this.state.Notify_ResponseArray.length == 0 ?
                                                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                                <Text style={styles.container_EmptyText}>{"No Notification Found..!"}</Text>
                                                            </View>
                                                            :
                                                            <FlatList style={{ flex: 1, }}
                                                                data={this.state.Notify_ResponseArray.slice(0, 5)}
                                                                showsVerticalScrollIndicator={false}
                                                                keyExtractor={(item, index) => item.key}
                                                                renderItem={({ item, index }) =>

                                                                    <CardList_Design
                                                                        CardList_Method={() => this.Notification_Method(item)}
                                                                        Card_BG={parseInt(item.notify_color_status) == 1 ? Notify_THEME.AW_SUPERADMIN :
                                                                            parseInt(item.notify_color_status) == 2 ? Notify_THEME.AW_ADMIN :
                                                                                parseInt(item.notify_color_status) == 3 ? Notify_THEME.AW_FINANCE :
                                                                                    parseInt(item.notify_color_status) == 4 ? Notify_THEME.AW_APPROVED : Notify_THEME.AW_REJECTED}
                                                                        CardText_Header1={"Job No : "}
                                                                        CardText_1={item.job_no}
                                                                        CardText_Header2={"Status : "}
                                                                        CardText_2={item.notify_message}
                                                                        CardText_ID={item.from_table_id}
                                                                        CardText_HeaderID={"Timesheet Id : "}
                                                                        CardText_status={item.status == 1 ? true : false}
                                                                        CardText_Header3={item.reason == null ? "By :" : "Reason : "}
                                                                        CardText_3={item.reason == null ? item.submitter_name : item.reason}
                                                                        CardText_Header4={"Date : "}
                                                                        CardText_4={Moment(item.created_at).format('D-MMMM-YY') + " at " + Moment(item.created_at).format("h A")}
                                                                    />
                                                                }

                                                            />
                                                        }
                                                    </TouchableWithoutFeedback>

                                                }
                                            </View>
                                        </View>

                                        :

                                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                                            <View style={{ flex: 1 }}>
                                                <AS_HeaderDesign
                                                    Onpress_RightIcon={() => this.Container_Method("Goback")}
                                                    Header_Text={"SETTINGS"}
                                                    RightIcon_Status={false}
                                                    LeftIcon_Status={false}
                                                />

                                                <View style={{ flex: 0.4, backgroundColor: LG_BG_THEME.APPTHEME_1, }}>
                                                    <View style={styles.Container_EP_4} />

                                                    <View style={{ flex: 0.3, justifyContent: "center", alignItems: 'center', backgroundColor: LG_BG_THEME.APPTHEME_1, }}>

                                                        <View style={{ height: width / 100 * 20, width: width / 100 * 20, borderRadius: width / 100 * 10, justifyContent: "center", backgroundColor: LG_BG_THEME.APPTHEME_BG, alignItems: 'center', borderColor: LG_BG_THEME.WHITE_THEME, borderWidth: width / 100 * 0.6 }}>
                                                            <Image source={{ uri: this.state.User_ResponseArray.image }} style={{ width: width / 100 * 14, height: width / 100 * 14, borderRadius: width / 100 * 7 }} />
                                                        </View>

                                                    </View>


                                                    <View style={{ flex: 0.7, marginLeft: width / 100 * 4, marginRight: width / 100 * 4 }}>

                                                        <View style={styles.Container_EP_2} />
                                                        {
                                                            this.state.User_ResponseArray.first_name == undefined ?
                                                                null
                                                                :
                                                                <AS_TextView
                                                                    ASB_Text={this.state.User_ResponseArray.first_name + " " + this.state.User_ResponseArray.last_name}
                                                                />
                                                        }
                                                        <AS_TextView
                                                            ASB_Text={this.state.User_ResponseArray.department_name}
                                                        />
                                                        <AS_TextView
                                                            ASB_Text={this.state.User_ResponseArray.email}
                                                        />
                                                        <View style={styles.Container_EP_2} />
                                                    </View>
                                                </View>

                                                <View style={{ flex: 0.1, backgroundColor: LG_BG_THEME.APPTHEME_BG_2, justifyContent: "center" }}>
                                                    <View style={{ flex: 1, backgroundColor: LG_BG_THEME.APPTHEME_1, borderBottomLeftRadius: width / 100 * 12, borderBottomRightRadius: width / 100 * 12, justifyContent: "center", alignItems: "center", flexDirection: 'row' }}>
                                                        <View style={{ flex: 0.7 }} />
                                                        <TouchableOpacity onPress={() => this.Account_Method("Edit_Settings")} style={{ flex: 0.3, justifyContent: 'center', flexDirection: 'row' }}>
                                                            <View style={{ flex: 0.6, justifyContent: 'center', alignItems: 'flex-end' }}>
                                                                <Text numberOfLines={1} style={styles.container_EditText}>{"Edit"}</Text>
                                                            </View>

                                                            <View style={{ flex: 0.4, justifyContent: 'center', alignItems: "center" }}>
                                                                <Image source={require('../../../../Asset/Icons/Edit_Icon.png')} style={{ width: width / 100 * 3.5, height: width / 100 * 3.5, tintColor: LG_BG_THEME.WHITE_THEME, }} />
                                                            </View>
                                                        </TouchableOpacity>

                                                    </View>
                                                </View>
                                                <View style={{ flex: 0.5, backgroundColor: LG_BG_THEME.APPTHEME_BG_2, }} >
                                                    <View style={styles.Container_EP_2} />

                                                    <AS_SidebardDesign
                                                        AS_SidebardMethod={() => this.Account_Method("Terms_conditions")}
                                                        AS_SidebardText={"Terms and conditions"}
                                                    />

                                                    <AS_SidebardDesign
                                                        AS_SidebardMethod={() => this.Account_Method("Support")}
                                                        AS_SidebardText={"Support"}
                                                    />

<AS_SidebardDesign
                                                        AS_SidebardMethod={() => this.Account_Method("Change_Password")}
                                                        AS_SidebardText={"Change Password"}
                                                    />

                                                    <AS_SidebardDesign
                                                        AS_SidebardMethod={() => this.Account_Method("Logout")}
                                                        AS_SidebardText={"Logout"}
                                                    />
                                                </View>

                                            </View>
                                        </TouchableWithoutFeedback>
                    }


                    <BottomNavigation
                        ActiveTab={this.state.ActiveTab}
                        onTabPress={newTab => this.setState({ ActiveTab: newTab.key })}
                        renderTab={this.renderTab}
                        tabs={this.tabs}
                    />


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
                                            <Text numberOfLines={1} style={{ fontSize: fontSize.Medium, fontFamily: fontFamily.Poppins_Bold, letterSpacing: width / 100 * 0.1, color: color.Font_Whitecolor, textAlign: "center" }}>{this.state.Info_ModalName == "Message" ? "Message" : "COLOUR INFO"}</Text>
                                        </View>
                                    </View>

                                    <View style={{ height: width / 100 * 70, justifyContent: 'center', backgroundColor: LG_BG_THEME.WHITE_THEME, }}>

                                        {
                                            this.state.Info_ModalName == "Message" ?


                                                <View style={{ flex: 1 }}>
                                                    <View style={styles.Container_EP_2} />

                                                    <Modal_Msgtext
                                                        Modal_Infotext={"First Name : " + this.state.Info_MSG_FN}
                                                        Modal_InfoBG={LG_BG_THEME.WHITE_THEME}
                                                        Modal_Flag={false}

                                                    />

                                                    <Modal_Msgtext
                                                        Modal_Infotext={"Last Name : " + this.state.Info_MSG_LN}
                                                        Modal_InfoBG={LG_BG_THEME.WHITE_THEME}
                                                        Modal_Flag={false}
                                                    />

                                                    <Modal_Msgtext
                                                        Modal_Infotext={"Sent At : " + this.state.Info_MSG_Time}
                                                        Modal_InfoBG={LG_BG_THEME.WHITE_THEME}
                                                        Modal_Flag={false}

                                                    />
                                                    <Modal_Msgtext
                                                        Modal_Infotext={"Message: " + this.state.Info_Message}
                                                        Modal_InfoBG={LG_BG_THEME.WHITE_THEME}
                                                        Modal_Flag={true}
                                                    />



                                                    <View style={styles.Container_EP_2} />

                                                </View>
                                                :
                                                <View style={{ flex: 1 }}>

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

                                        }
                                    </View>


                                    <View style={{ height: width / 100 * 12, justifyContent: 'center', alignSelf: 'center', backgroundColor: LG_BG_THEME.APPTHEME_1, borderBottomLeftRadius: width / 100 * 2, borderBottomRightRadius: width / 100 * 2, flexDirection: 'row' }}>
                                        <TouchableOpacity onPress={() => this.Container_Model(false)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text numberOfLines={1} style={{ fontSize: fontSize.Medium, fontFamily: fontFamily.Poppins_Bold, letterSpacing: width / 100 * 0.1, color: color.Font_Whitecolor, textAlign: "center", }}>{"Close"}</Text>
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
                                    <View style={{ height: width / 100 * 20, width: width / 100 * 80, justifyContent: 'center', backgroundColor: color.Font_Whitecolor, borderTopLeftRadius: width / 100 * 2, borderTopRightRadius: width / 100 * 2 }}>
                                        <View style={{ flex: 1, width: width / 100 * 70, justifyContent: 'center', borderBottomWidth: width / 100 * 0.5, borderBottomColor: LG_BG_THEME.APPTHEME_BLACK, marginLeft: width / 100 * 3, marginRight: width / 100 * 3 }}>
                                            <TextInput
                                                placeholder={"Search By Job No"}
                                                returnKeyType="go"
                                                selectionColor={LG_BG_THEME.APPTHEME_BLACK}
                                                underlineColorAndroid='transparent'
                                                placeholderTextColor={LG_BG_THEME.APPTHEME_BLACK}
                                                style={styles.container_SearchText}
                                                onChangeText={(Search_Text) => this.setState({ TS_SearchText: Search_Text })}
                                            />
                                        </View>

                                        <View style={styles.Container_EP_2} />

                                    </View>

                                    <View style={{ height: width / 100 * 0.5, width: width / 100 * 80, justifyContent: 'center', alignSelf: 'center', backgroundColor: LG_BG_THEME.APPTHEME_1, marginLeft: width / 100 * 1, marginRight: width / 100 * 1 }} />

                                    <View style={{ height: width / 100 * 12, width: width / 100 * 80, justifyContent: 'center', alignSelf: 'center', backgroundColor: LG_BG_THEME.APPTHEME_1, borderBottomLeftRadius: width / 100 * 2, borderBottomRightRadius: width / 100 * 2, flexDirection: 'row' }}>
                                        <TouchableOpacity onPress={() => this.TextInput_Method(this.state.TS_SearchText, "Job_No")} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text numberOfLines={1} style={{ fontSize: fontSize.Medium, fontFamily: fontFamily.Poppins_Regular, letterSpacing: width / 100 * 0.1, color: color.Font_Whitecolor, textAlign: "center" }}>{"Search"}</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </TouchableWithoutFeedback>
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
        marginLeft: width / 100 * 2
    },
    container_SearchText: {
        fontSize: fontSize.lightMedium,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.APPTHEME_BLACK,
        marginLeft: width / 100 * 2
    },
    container_EditText: {
        fontSize: fontSize.lightMedium,
        fontFamily: fontFamily.Poppins_SemiBold,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.WHITE_THEME,
        marginLeft: width / 100 * 2
    },
    container_TabText: {
        fontSize: fontSize.Medium,
        fontFamily: fontFamily.Poppins_Bold,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.APPTHEME_BLACK,
        marginLeft: width / 100 * 2,
    },
    container_TabCountText: {
        fontSize: fontSize.Medium,
        fontFamily: fontFamily.Poppins_Bold,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.WHITE_THEME,
        marginLeft: width / 100 * 2,
        backgroundColor: 'red',
    },
    container_EmptyText: {
        fontSize: fontSize.Medium,
        fontFamily: fontFamily.Poppins_Bold,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.APPTHEME_BLACK,
        marginLeft: width / 100 * 2,
    },
    container_WText: {
        fontSize: fontSize.Medium,
        fontFamily: fontFamily.Poppins_SemiBold,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.WHITE_THEME,
        textAlign: "auto",
        marginRight: width / 100 * 5
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
    Container_EP_8: {
        height: height / 100 * 8
    },
    Container_EP_12: {
        height: height / 100 * 12
    },
    Container_ActiveTabView: {
        flex: 0.49, justifyContent: 'center', alignItems: 'center',
        backgroundColor: LG_BG_THEME.WHITE_THEME,
        elevation: Platform.OS == "android" ? width / 100 * 1 : width / 100 * 0.1,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowColor: LG_BG_THEME.APPTHEME_1,
        borderBottomColor: LG_BG_THEME.APPTHEME_1,
        borderBottomWidth: width / 100 * 0.6
    },
    Container_TabView: {
        flex: 0.49, justifyContent: 'center', alignItems: 'center',
        backgroundColor: LG_BG_THEME.WHITE_THEME,
        elevation: Platform.OS == "android" ? width / 100 * 1 : width / 100 * 0.1,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowColor: LG_BG_THEME.APPTHEME_1
    },
    Container_TimesheetHeader: {
        flex: 0.49,
        justifyContent: 'center',
        alignItems: 'center',

    },
    Calendar_View: {
        height: height / 100 * 40,
        justifyContent: 'center',
        backgroundColor: "#EFEFEF",
        marginLeft: width / 100 * 10,
        marginRight: width / 100 * 10,
        marginTop: width / 100 * 2, marginBottom: width / 100 * 2,
        elevation: Platform.OS == "android" ? width / 100 * 1 : width / 100 * 0.2,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowColor: LG_BG_THEME.APPTHEME_1,
    },
    container_CountWhite: {
        fontSize: fontSize.Small,
        fontFamily: fontFamily.Poppins_SemiBold,
        letterSpacing: width / 100 * 0.2,
        color: color.Font_Whitecolor,
        textAlign: "center",
    }



});

const mapStateToProps = (state) => {
    return {
        CommonReducer: state.CommonReducer
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        NotifyInfo_Action: (Notify_Response) => { dispatch(NotifyInfo_Action(Notify_Response)); },
        UserInfo_Action: (User_Response) => { dispatch(UserInfo_Action(User_Response)); },
        Addmore_TSdata: (User_Response) => { dispatch(Addmore_TSdata(User_Response)); },
        Notification_Count: (NotificationCount) => { dispatch(Notification_Count(NotificationCount)); },

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
