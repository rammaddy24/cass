import React, { Component, PureComponent } from 'react'
import {
    StyleSheet, Text, Keyboard, AsyncStorage, FlatList,
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

import { User_Info, Message_List, Notification_List, Calender_Details, List_Timesheet, Cass_AuthDetails, Cass_APIDetails, Job_list } from '././../../../Config/Server'
import { NotifyInfo_Action } from '../../../../Redux/Actions/NotifyInfo_Action'
import { UserInfo_Action } from '../../../../Redux/Actions/UserInfo_Action'
import { Addmore_TSdata } from '../../../../Redux/Actions/Addmore_TSdata'

import { Spinner } from '../../../Config/Spinner';
import GestureRecognizer, { swipeDirections } from '../../../Constants/GestureRecognizer'

// const customDatesStylesCallback = date => {
//     // switch(date.isoWeekday()) {
//     //   case 1: // Monday
//     //     return {
//     //       style:{
//     //         backgroundColor: '#909',
//     //       },
//     //       textStyle: {
//     //         color: '#0f0',
//     //         fontWeight: 'bold',
//     //       }
//     //     };
//     //   case 7: // Sunday
//     //     return {
//     //       textStyle: {
//     //         color: 'red',
//     //       }
//     //     };
//     // }
//     console.error(date)

//   }


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


        };

    }



    componentDidMount() {

        AsyncStorage.getItem("Cass_UserID", (error, Token_Result) => {
            if (Token_Result != "0" || Token_Result != null) {
                AsyncStorage.getItem("Cass_RoleID", (error, Token_RoleID) => {
                    if (Token_RoleID != "0" || Token_RoleID != null) {
                        this.setState({ CassUserID: Token_Result, CassRoleID: Token_RoleID, Dashboard_Fetching: true }, () => this._fetchdata(Token_Result, Token_RoleID));
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
            TD_Date: Moment(Current_Date).format('DD')
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

    async _fetchdata(Token_Result, Token_RoleID) {
        const UserInfo_Response = await this._fetch_UserInfo(Token_Result, Token_RoleID);
        const MsgInfo_Response = await this._fetch_MsgInfo(Token_Result, Token_RoleID);
        const NotifyInfo_Response = await this._fetch_NotifyInfo(Token_Result, Token_RoleID);
        const CDInfo_Response = await this._fetch_CalenderInfo(Token_Result, Token_RoleID);
        const JobsInfo_Response = await this._fetch_JobsInfo(Token_Result, Token_RoleID);

        try {
            this.setState({
                Msg_ResponseArray: MsgInfo_Response.Msg_Info,
                Notify_ResponseArray: NotifyInfo_Response.Notify_Info,
                User_ResponseArray: UserInfo_Response.User_Info,
                Message_ListCount: MsgInfo_Response.Msg_Info.length,
                CD_List: CDInfo_Response.CD_Info,
                CD_Timesheetslist: CDInfo_Response.CD_Info.timesheet_dates,
                Jobs_ResponseArray: JobsInfo_Response.Job_Info,
                Dashboard_Fetching: false
            })

            for (let i = 0; i < CDInfo_Response.CD_Info.timesheet_dates.length; i++) {

                if (CDInfo_Response.CD_Info.timesheet_dates[i] == this.state.RTS_DateFormat_1) {
                    this.setState({
                        RTS_Date_BG_1: "TS"
                    })
                }
                if (CDInfo_Response.CD_Info.timesheet_dates[i] == this.state.RTS_DateFormat_2) {
                    this.setState({
                        RTS_Date_BG_2: "TS"
                    })
                }
                if (CDInfo_Response.CD_Info.timesheet_dates[i] == this.state.RTS_DateFormat_3) {
                    this.setState({
                        RTS_Date_BG_3: "TS"
                    })
                }
            }

            for (let i = 0; i < CDInfo_Response.CD_Info.holiday_dates.length; i++) {

                if (CDInfo_Response.CD_Info.holiday_dates[i] == this.state.RTS_DateFormat_1) {
                    this.setState({
                        RTS_Date_BG_1: "HD"
                    })
                }
                if (CDInfo_Response.CD_Info.holiday_dates[i] == this.state.RTS_DateFormat_2) {
                    this.setState({
                        RTS_Date_BG_2: "HD"
                    })
                }
                if (CDInfo_Response.CD_Info.holiday_dates[i] == this.state.RTS_DateFormat_3) {
                    this.setState({
                        RTS_Date_BG_3: "HD"
                    })
                }
            }


            this.props.NotifyInfo_Action(NotifyInfo_Response.Notify_Info)
            this.props.UserInfo_Action(UserInfo_Response.User_Info)

        } catch (err) {
            this.setState({ Dashboard_Fetching: false });
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
                        reject(User_Info)
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
                        reject(Msg_Info)
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
                        reject(Notify_Info)
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
                        reject(CD_Info)
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

    _fetch_JobsInfo(Token_Result, Token_RoleID) {
        return new Promise((resolve, reject) => {
            let JobsInfo_URL = Job_list + Token_Result + "&user_role=" + Token_RoleID;
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
                        reject(Job_Info)
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
                        reject(TS_Info)
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
        <Image
            source={icon == "Home" ? require('../../../../Asset/Icons/Home_Icon.png') :
                icon == "Calendar" ? require('../../../../Asset/Icons/Calendar_Icon.png') :
                    icon == "Timesheet" ? require('../../../../Asset/Icons/Timesheet_Icon.png') :
                        icon == "Message" ? require('../../../../Asset/Icons/Message_Icon.png') :
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
        if (RouteName == "Edit_Settings") {
            this.props.navigation.navigate("Edit_Settings")
        } else if (RouteName == "Logout") {
            Alert.alert(
                'Confirmation..!',
                'Are you sure, You want to Logout ?',
                [
                    { text: 'YES', onPress: () => this.Login_Screen() },
                    { text: 'NO', style: 'cancel' },

                ],
                { cancelable: false }
            )
        } else {
            Snackbar.show({
                title: 'Server Underconstruction..!',
                duration: Snackbar.LENGTH_SHORT,
            });
        }

    }


    Login_Screen() {
        AsyncStorage.setItem('Cass_UserID', "0", () => {

        });
        AsyncStorage.setItem('Cass_RoleID', "0", () => {

        });
        this.props.navigation.navigate("Login_Screen")
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
                    });
                } else {
                    this.props.navigation.navigate(RouteName, {
                        CalendarDate: "",
                        Job_Number: Route_Data,
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
            this.props.navigation.navigate(RouteName)
        }

    }

    Message_Method(RouteName) {

        if (RouteName != undefined) {
            this.setState({
                Info_ModalName: "Message",
                Info_Message: RouteName.message,
                Info_MSG_FN: RouteName.first_name,
                Info_MSG_LN: RouteName.last_name,
                Info_MSG_Time: Moment(RouteName.sent_at).format('D-MMMM-YY') + " at " + Moment(RouteName.sent_at).format("h A"),
                Info_Modal: true
            })
        }



    }

    onDateChange(RouteName, Date_Index) {

        //var Current_Date = new Date(new Date().getTime() + (86400000))


        if (RouteName == "CALENDAR") {
            this.setState({
                Calendar_Date: Moment(Date_Index).format('YYYY-MM-DD'),
                CD_Year: Moment(Date_Index).format('YYYY'),
                CD_Month: Moment(Date_Index).format('MMMM'),
                CD_Date: Moment(Date_Index).format('DD')
            })


            for (let i = 0; i < this.state.CD_Timesheetslist.length; i++) {
                if (Moment(Date_Index).format('YYYY-MM-DD') == this.state.CD_Timesheetslist[i]) {
                    Snackbar.show({
                        title: 'Timesheets is Present..!',
                        duration: Snackbar.LENGTH_SHORT,
                    });
                    this.props.navigation.navigate("Timesheet_List", {
                        CalendarDate: Moment(Date_Index).format('YYYY-MM-DD'),
                        Job_Number: "",
                    });
                }
            }


            for (let i = 0; i < this.state.CD_List.holiday_dates.length; i++) {
                if (Moment(Date_Index).format('YYYY-MM-DD') == this.state.CD_List.holiday_dates[i]) {
                    Snackbar.show({
                        title: 'Office Holiday..!',
                        duration: Snackbar.LENGTH_SHORT,
                    });
                }
            }


        } else {
            this.setState({
                Timesheet_Date: Moment(Date_Index).format('YYYY-MM-DD'),
                TD_Year: Moment(Date_Index).format('YYYY'),
                TD_Month: Moment(Date_Index).format('MMMM'),
                TD_Date: Moment(Date_Index).format('DD')
            })
        }
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


    onRefresh() {
        this.setState({ Dashboard_Fetching: true }, () => this._fetchdata(this.state.CassUserID, this.state.CassRoleID));

    }

    render() {

        const { Dashboard_Fetching } = this.state;

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

        // let customDatesStyles = [];

        //     for (let i = 0; i < this.state.CD_Timesheetslist.length; i++) {

        //         customDatesStyles.push({
        //             date: this.state.CD_Timesheetslist[i],
        //             // Random colors
        //             style: { backgroundColor: '#00000' },
        //             textStyle: { color: 'black' }, // sets the font color
        //             containerStyle: [], // extra styling for day container
        //         });
        //     }
        // }

        let customDatesStyles = [];
        if (this.state.CD_Timesheetslist != undefined) {
            for (let i = 0; i < this.state.CD_Timesheetslist.length; i++) {
                customDatesStyles.push({
                    date: new Date(this.state.CD_Timesheetslist[i]),
                    style: { backgroundColor: LG_BG_THEME.APPTHEME_DLG},
                    textStyle: { color: LG_BG_THEME.WHITE_THEME }, // sets the font color
                   // containerStyle: [borderRadius width/100*1], // extra styling for day container
                });
            }
        }

         // for (let j = 0; j < this.state.S1_Engineer_ArrayId.length; j++) {
            //     for (let i = 0; i < EngineerList_Response.User_EngInfo.length; i++) {
            //         // if (EngineerList_Response.User_EngInfo[i].id == this.state.S1_Engineer_ArrayId[j]) {
            //         //     this.state.S4_CostInfo.push({
            //         //         "username": EngineerList_Response.User_EngInfo[i].username,
            //         //         "user_percentage": this.state.S4_CostPercentage[j],
            //         //         "user_cost": this.state.S4_UserAmount[j],
            //         //     })
            //         // }
            //     }
            // }
          //  S4_CostPercentage_AE: [],
        return (
            <LinearGradient key="background" start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[LG_BG_THEME.APPTHEME_BG_2, LG_BG_THEME.APPTHEME_1]} style={{ flex: 1, justifyContent: "center" }} >
                {spinner}

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
                                    />

                                    <View style={{ flex: 0.5, backgroundColor: LG_BG_THEME.APPTHEME_1, }}>
                                        <View style={styles.Container_EP_1} />

                                        <View style={{ flex: 0.2, justifyContent: "center", alignItems: 'center', backgroundColor: LG_BG_THEME.APPTHEME_1, }}>
                                            <View style={{ height: width / 100 * 20, width: width / 100 * 20, borderRadius: width / 100 * 10, justifyContent: "center", backgroundColor: LG_BG_THEME.APPTHEME_BG, alignItems: 'center', borderColor: LG_BG_THEME.WHITE_THEME, borderWidth: width / 100 * 0.6 }}>
                                                <Image source={{ uri: this.state.User_ResponseArray.image }} style={{ width: width / 100 * 14, height: width / 100 * 14, }} />
                                            </View>
                                        </View>

                                        <View style={styles.Container_EP_1} />

                                        <View style={{ flex: 0.8, justifyContent: "center" }}>

                                            <View style={{ flex: 0.3, justifyContent: "center" }}>
                                                <View style={styles.Container_EP_1} />
                                                <Home_Usertext
                                                    ASB_Text={this.state.User_ResponseArray.username}
                                                />
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
                                                        CH1_BG={this.state.RTS_Date_BG_1 == "TS" ? "#80FF00" : this.state.RTS_Date_BG_1 == "HD" ? "#FF0000" : "#FFFF00"}
                                                        CardHeader_2={this.state.RTS_DayTwo}
                                                        CardText_2={this.state.RTS_DateTwo}
                                                        CH2_BG={this.state.RTS_Date_BG_2 == "TS" ? "#80FF00" : this.state.RTS_Date_BG_2 == "HD" ? "#FF0000" : "#FFFF00"}
                                                        CardHeader_3={this.state.RTS_Dayone}
                                                        CardText_3={this.state.RTS_Dateone}
                                                        CH3_BG={this.state.RTS_Date_BG_3 == "TS" ? "#80FF00" : this.state.RTS_Date_BG_3 == "HD" ? "#FF0000" : "#FFFF00"}
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
                                                <Text style={{ fontSize: Platform.OS == "android" ? width / 100 * 10.2 : width / 100 * 10, fontFamily: fontFamily.Poppins_SemiBold, letterSpacing: width / 100 * 0.1, color: LG_BG_THEME.WHITE_THEME }}>{this.state.CD_Date}</Text>
                                            </View>

                                            <View style={{ flex: 0.01, backgroundColor: LG_BG_THEME.WHITE_THEME }} />
                                            <View style={{ flex: 0.495, justifyContent: "center", alignItems: "center" }}>
                                                <View style={{ flex: 0.1, justifyContent: "center", alignItems: "center" }} />

                                                <View style={{ flex: 0.4, justifyContent: "center", alignItems: "center" }}>
                                                    <Text style={{ fontSize: fontSize.ExtraLarge, fontFamily: fontFamily.Poppins_SemiBold, letterSpacing: width / 100 * 0.1, color: LG_BG_THEME.WHITE_THEME }}>{this.state.CD_Month}</Text>
                                                </View>

                                                <View style={{ flex: 0.4, justifyContent: "center", alignItems: "center" }}>
                                                    <Text style={{ fontSize: fontSize.ExtraLarge, fontFamily: fontFamily.Poppins_SemiBold, letterSpacing: width / 100 * 0.1, color: LG_BG_THEME.WHITE_THEME }}>{this.state.CD_Year}</Text>
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
                                                        minDate={new Date(new Date().getTime() - (86400000 * 90))}
                                                        maxDate={new Date(new Date().getTime() + (86400000 * 1))}
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
                                                        onDateChange={this.onDateChange}
                                                        customDatesStyles={customDatesStyles}


                                                    />
                                                </View>

                                                <View style={styles.Container_EP_2} />

                                                <CM_ButtonDesign
                                                    CMB_BuutonColourcode={LG_BG_THEME.APPTHEME_Blue}
                                                    onPress_BuutonView={() => this.Calender_Method("Add_Leave")}
                                                    CMB_TextHeader={"Add Leave"}
                                                />

                                                <View style={styles.Container_EP_1} />

                                                <CM_ButtonDesign
                                                    CMB_BuutonColourcode={LG_BG_THEME.APPTHEME_Blue}
                                                    onPress_BuutonView={() => this.Calender_Method("Add_Timesheet")}
                                                    CMB_TextHeader={"Add Timesheet"}
                                                />
                                                <View style={styles.Container_EP_1} />

                                            </ScrollView>
                                        </TouchableWithoutFeedback>

                                    </View>


                                </View>
                                : this.state.ActiveTab == "Timesheet" ?

                                    <View style={{ flex: 1, backgroundColor: LG_BG_THEME.APPTHEME_BG_2 }}>
                                        <AS_HeaderDesign
                                            Onpress_LeftIcon={() => this.Container_Method("Goback")}
                                            Onpress_RightIcon={() => this.Container_Method("Goback")}
                                            Header_Text={"JOBS"}
                                            RightIcon_Status={false}
                                            LeftIcon_Status={false}
                                        />

                                        <View style={{ flex: 0.02 }} />
                                        <View style={styles.Container_EP_2} />

                                        <View style={{ flex: 0.08, justifyContent: 'center', flexDirection: "row" }}>

                                            <View style={{ flexDirection: "row", flex: 0.495, justifyContent: 'center', alignItems: 'center' }}>

                                                {/* <View style={{ flex: 0.3, justifyContent: 'center', alignItems: "flex-end" }}>
                                                    <Image source={require('../../../../Asset/Icons/Calendar_Icon.png')} style={{ width: width / 100 * 3.5, height: width / 100 * 3.5, tintColor: LG_BG_THEME.APPTHEME_BLACK, }} />
                                                </View>
                                                <View style={{ flex: 0.7, justifyContent: 'center', alignItems: "flex-start" }}>
                                                    <Text style={styles.container_TabText}>{this.state.StartDate}</Text>
                                                </View> */}
                                            </View>


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
                                                        onRefresh={() => this.onRefresh()}
                                                        refreshing={this.state.Dashboard_Fetching}
                                                        keyExtractor={(item, index) => item.key}
                                                        renderItem={({ item, index }) =>
                                                            <Card_Joblist
                                                                CardList_AMORE={() => this.Container_Method("AddMore_Timesheet", item.job_no)}
                                                                CardList_VAll={() => this.Container_Method("Timesheet_List", item.job_no)}
                                                                Card_BG={LG_BG_THEME.WHITE_THEME}
                                                                CardText_Header1={"Job No : "}
                                                                CardText_1={item.job_no}
                                                                CardText_Header2={"Created Date : "}
                                                                CardText_2={Moment(item.created).format('D-MMMM-YY') + " at " + Moment(item.created).format("h A")}
                                                                CardTimesheet_Count={"Timesheets " + item.timesheet_count}
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
                                                    <Text style={styles.container_TabText}>{"Messages"}</Text>
                                                </TouchableOpacity>

                                                <View style={{ flex: 0.02, justifyContent: 'center' }} />

                                                <TouchableOpacity onPress={() => this.Notifications_TabMethod("Notifications")} style={this.state.Notifications_Tab == "Notifications" ? styles.Container_ActiveTabView : styles.Container_TabView}>
                                                    <Text style={styles.container_TabText}>{"Notifications"}</Text>
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
                                                                        CardText_3={Moment(item.sent_at).format('D-MMMM-YY') + " at " + Moment(item.sent_at).format("h A")}
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
                                                                        CardList_Method={() => this.Message_Method()}
                                                                        Card_BG={item.dept_super_admin_status == "1" && item.dept_admin_status == "0" && item.finance_status == "0" && item.engineer_status == "0" ? Notify_THEME.AW_SUPERADMIN :
                                                                            item.dept_super_admin_status == "2" && item.dept_admin_status == "1" && item.finance_status == "0" && item.engineer_status == "0" ? Notify_THEME.AW_ADMIN :
                                                                                item.dept_super_admin_status == "2" && item.dept_admin_status == "2" && item.finance_status == "2" && item.engineer_status == "0" ? Notify_THEME.AW_FINANCE :
                                                                                    item.dept_super_admin_status == "2" && item.dept_admin_status == "2" && item.finance_status == "2" && item.engineer_status == "0" ? Notify_THEME.AW_APPROVED : Notify_THEME.AW_REJECTED}
                                                                        CardText_Header1={"Job No : "}
                                                                        CardText_1={item.job_no}
                                                                        CardText_Header2={"Status : "}
                                                                        CardText_2={item.notify_message}
                                                                        CardText_Header3={"By : "}
                                                                        CardText_3={item.submitter_name}
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
                                                            <Image source={{ uri: this.state.User_ResponseArray.image }} style={{ width: width / 100 * 14, height: width / 100 * 14, }} />
                                                        </View>

                                                    </View>


                                                    <View style={{ flex: 0.7, marginLeft: width / 100 * 4, marginRight: width / 100 * 4 }}>

                                                        <View style={styles.Container_EP_2} />
                                                        <AS_TextView
                                                            ASB_Text={this.state.User_ResponseArray.username}
                                                        />
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
                                                        AS_SidebardMethod={() => this.Account_Method("Terms and conditions")}
                                                        AS_SidebardText={"Terms and conditions"}
                                                    />

                                                    <AS_SidebardDesign
                                                        AS_SidebardMethod={() => this.Account_Method("Support")}
                                                        AS_SidebardText={"Support"}
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


    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);



import React, { Component, PureComponent } from 'react'
import {
    StyleSheet, Text, Keyboard, AsyncStorage, FlatList,
    View, TouchableOpacity, Image, SafeAreaView, ImageBackground, BackHandler, Alert, Platform, Modal, TextInput, ScrollView, TouchableWithoutFeedback
} from 'react-native'
import { color, width, fontSize, fontFamily, height, LG_BG_THEME } from '../../../Constants/fontsAndColors'
import { Container, Content, connect, Picker, Header, LinearGradient, Snackbar, Moment, base64, CalendarPicker } from '../../../../Asset/Libraries/NpmList';
import { Mystatusbar } from '../../../../Asset/Libraries/index'

import { AS_HeaderDesign } from '../../CommonView_Modules/AS_HeaderDesign'
import { CM_ButtonDesign } from '../../CommonView_Modules/CM_ButtonDesign'
import { CM_BoxButton } from '../../CommonView_Modules/CM_BoxButton'
import { TS_Circleview } from '../../CommonView_Modules/TS_Circleview'
import { TS_CircleLIne } from '../../CommonView_Modules/TS_CircleLIne'
import { TS_CodeitemsView } from '../../CommonView_Modules/TS_CodeitemsView'

import { Spinner } from '../../../Config/Spinner';

import { Cass_APIDetails, Cass_AuthDetails, User_EngineersList, User_DepartmentsList, User_WorkItems, Timesheet_Add } from '../../../Config/Server'
import { TS_HeadingView } from '../../CommonView_Modules/TS_HeadingView'

class AddMore_Timesheet extends Component {

    constructor(props) {
        super(props);

        this.state = {
            Add_TimesheetScreen: "Step 1",
            Add_TimesheetScreenIndex: 1,
            S1C_ModalRouteName: "",
            S1C_Modal: false,

            DeptList_Arraylist: [],
            Engineer_ArrayList: [],
            Engineer_DataResponse: [],
            S2_Quatitylist_Response: [],
            S2_Quatitylist_AR: [],

            S1_Dept_Name: "",
            S1_Dept_ID: "",
            S1_Job_No: "",
            S1_Exchange: "",
            S1_Date: "",
            S1_Engineer_DataArray: [],
            S1_Engineer_ArrayId: [],
            S1_Engineer_ALength: 0,

            S2_TextQty: [],
            S2_QtyArraylist: [],
            S2_Qty_Count: 0,
            S2_Qty_Amount: 0,

            S3_InfoArray: [],
            S3_Section_No: "",
            S3_Distance: "",
            S3_Blockage: "",
            S3_Desilt: "",
            S3_New_Track: "",
            S3_DFESlipNumber: "",
            S3_Comments: "",
            S3_Infostatus: false,
            S3_TextComments: "",

            S4_CostPercentage: [],
            S4_UserAmount: [],

            Report_Success: false,
            ItemCode_View: false,

            SubmitterName: "",
            CassUserID: '',
            CassRoleID: "",

            Modal_Itemcode: "",
            Modal_ItemDescription: "",
            Modal_ItemPrice: "",
            Modal_ItemDept: "",

            Modal_SectionNo: "",
            Modal_Distance: "",
            Modal_Blockage: "",
            Modal_Desiit: "",
            Modal_Newtrack: "",
            Modal_SlipNo: "",
            Modal_SlipComments: "",
            Calendar_Modal: false,
            S1_DateVisible: "",
            S1_Engineer_OverallArrayId: [],
            S1_Engineer_UnArrayId: [],
            S2_QtyArraylist_Preview: "",
            Total_IteamCount: 0,

        };

    }

    componentDidMount() {

        const { state } = this.props.navigation;

        AsyncStorage.getItem("Cass_UserID", (error, Token_Result) => {
            if (Token_Result != "0" || Token_Result != null) {
                AsyncStorage.getItem("Cass_RoleID", (error, Token_RoleID) => {
                    if (Token_RoleID != "0" || Token_RoleID != null) {
                        this.setState({ CassUserID: Token_Result, CassRoleID: Token_RoleID, Dashboard_Fetching: false }, () => this._fetchdata(Token_Result, Token_RoleID));
                    }
                })
            }
        })

        const { AddmoreInfo_Response, UserInfo_Response } = this.props.CommonReducer
        this.setState({
            CassUserID: AddmoreInfo_Response.user_id,
            TS_ID: AddmoreInfo_Response.id,
            S1_Date: AddmoreInfo_Response.job_date,
            S1_Job_No: AddmoreInfo_Response.job_no,
            S1_Dept_Name: AddmoreInfo_Response.department_name,
            S1_Dept_ID: AddmoreInfo_Response.department_id,
            S1_Exchange: AddmoreInfo_Response.exchange,
            SubmitterName: AddmoreInfo_Response.submitter_name,
            S1_Engineer_ArrayId: AddmoreInfo_Response.users.split(","),
            S1_DateVisible: Moment(AddmoreInfo_Response.job_date).format('DD-MMMM-YY'),
        })

        this.forceUpdate()
        this.Qty_ListMethod(AddmoreInfo_Response.department_id, AddmoreInfo_Response.user_id, AddmoreInfo_Response.role_id)

    }

    async _fetchdata(Token_Result, Token_RoleID) {
        const DeptList_Response = await this._fetch_DeptInfo(Token_Result, Token_RoleID);
        const EngineerList_Response = await this._fetch_EngInfo(Token_Result);
        try {


            let EngSelectedInfo_Array = []
            let EngInfo_Array = []

            for (let j = 0; j < EngineerList_Response.User_EngInfo.length; j++) {
                for (let i = 0; i < this.state.S1_Engineer_ArrayId.length; i++) {
                    if (EngineerList_Response.User_EngInfo[j].id == this.state.S1_Engineer_ArrayId[i]) {
                        EngSelectedInfo_Array.push({
                            "id": EngineerList_Response.User_EngInfo[j].id,
                            "first_name": EngineerList_Response.User_EngInfo[j].first_name,
                            "last_name": EngineerList_Response.User_EngInfo[j].last_name,
                            "email": EngineerList_Response.User_EngInfo[j].email,
                            "username": EngineerList_Response.User_EngInfo[j].username,
                            "password": EngineerList_Response.User_EngInfo[j].password,
                            "phone": EngineerList_Response.User_EngInfo[j].phone,
                            "role_id": EngineerList_Response.User_EngInfo[j].role_id,
                            "image": EngineerList_Response.User_EngInfo[j].image,
                            "created": EngineerList_Response.User_EngInfo[j].created,
                            "modified": EngineerList_Response.User_EngInfo[j].modified,
                            "status": EngineerList_Response.User_EngInfo[j].status,
                            "department_name": EngineerList_Response.User_EngInfo[j].department_name,
                            "role": EngineerList_Response.User_EngInfo[j].role,
                            "department_ids": EngineerList_Response.User_EngInfo[j].department_ids,
                            "isClicked": true,
                        })
                    }
                }
                this.state.S1_Engineer_OverallArrayId.push(EngineerList_Response.User_EngInfo[j].id)
            }


            this.setState({
                S1_Engineer_UnArrayId: this.state.S1_Engineer_OverallArrayId.filter(n => !this.state.S1_Engineer_ArrayId.includes(n))
            })


            for (let j = 0; j < EngineerList_Response.User_EngInfo.length; j++) {
                for (let i = 0; i < this.state.S1_Engineer_UnArrayId.length; i++) {
                    if (EngineerList_Response.User_EngInfo[j].id == this.state.S1_Engineer_UnArrayId[i]) {
                        EngInfo_Array.push({
                            "id": EngineerList_Response.User_EngInfo[j].id,
                            "first_name": EngineerList_Response.User_EngInfo[j].first_name,
                            "last_name": EngineerList_Response.User_EngInfo[j].last_name,
                            "email": EngineerList_Response.User_EngInfo[j].email,
                            "username": EngineerList_Response.User_EngInfo[j].username,
                            "password": EngineerList_Response.User_EngInfo[j].password,
                            "phone": EngineerList_Response.User_EngInfo[j].phone,
                            "role_id": EngineerList_Response.User_EngInfo[j].role_id,
                            "image": EngineerList_Response.User_EngInfo[j].image,
                            "created": EngineerList_Response.User_EngInfo[j].created,
                            "modified": EngineerList_Response.User_EngInfo[j].modified,
                            "status": EngineerList_Response.User_EngInfo[j].status,
                            "department_name": EngineerList_Response.User_EngInfo[j].department_name,
                            "role": EngineerList_Response.User_EngInfo[j].role,
                            "department_ids": EngineerList_Response.User_EngInfo[j].department_ids,
                            "isClicked": false,
                        })
                    }
                }
            }


            this.setState({
                Engineer_ArrayList: Array.from(new Set(EngSelectedInfo_Array.concat(EngInfo_Array))),
            })



            for (let j = 0; j < this.state.S1_Engineer_ArrayId.length; j++) {
                for (let i = 0; i < EngineerList_Response.User_EngInfo.length; i++) {

                    if (EngineerList_Response.User_EngInfo[i].id == this.state.S1_Engineer_ArrayId[j]) {
                        this.state.S1_Engineer_DataArray.push({
                            "id": EngineerList_Response.User_EngInfo[i].id,
                            "first_name": EngineerList_Response.User_EngInfo[i].first_name,
                            "last_name": EngineerList_Response.User_EngInfo[i].last_name,
                            "email": EngineerList_Response.User_EngInfo[i].email,
                            "username": EngineerList_Response.User_EngInfo[i].username,
                            "password": EngineerList_Response.User_EngInfo[i].password,
                            "phone": EngineerList_Response.User_EngInfo[i].phone,
                            "role_id": EngineerList_Response.User_EngInfo[i].role_id,
                            "image": EngineerList_Response.User_EngInfo[i].image,
                            "created": EngineerList_Response.User_EngInfo[i].created,
                            "modified": EngineerList_Response.User_EngInfo[i].modified,
                            "status": EngineerList_Response.User_EngInfo[i].status,
                            "department_name": EngineerList_Response.User_EngInfo[i].department_name,
                            "role": EngineerList_Response.User_EngInfo[i].role,
                            "department_ids": EngineerList_Response.User_EngInfo[i].department_ids,
                            "isClicked": true,
                            "Item_Percentage": 0
                        })
                    }

                }
            }

            this.setState({
                Engineer_ArrayList: Array.from(new Set(this.state.Engineer_ArrayList)),
                Engineer_DataResponse: this.state.Engineer_ArrayList,
                DeptList_Arraylist: DeptList_Response.User_DeptInfo,
                Dashboard_Fetching: false
            })
            this.forceUpdate()

        } catch (err) {
            this.setState({ Dashboard_Fetching: false });
        }
    }

    _fetch_DeptInfo(Token_Result, Token_RoleID) {
        return new Promise((resolve, reject) => {
            let User_DeptInfo_URL = User_DepartmentsList + Token_Result + "&user_role=" + Token_RoleID;
            fetch(User_DeptInfo_URL, {
                method: 'GET',
                headers: new Headers({
                    'Authorization': "Basic " + base64.encode(Cass_AuthDetails),
                    'X-API-KEY': Cass_APIDetails,
                }),
            })
                .then((response) => response.json())
                .then((Jsonresponse) => {
                    let User_DeptInfo = ""
                    if (Jsonresponse.status != false) {
                        User_DeptInfo = Jsonresponse
                        resolve({ User_DeptInfo });
                    } else {
                        resolve(User_DeptInfo)
                    }
                })
                .catch((error) => {
                    //console.error(error,User_QtyInfo_URL)

                    this.setState({ Dashboard_Fetching: false });
                    Snackbar.show({
                        title: "Internal Server Error..!",
                        duration: Snackbar.LENGTH_SHORT,
                    });
                });
        });
    }

    _fetch_QtyInfo(Token_Result, Token_RoleID) {
        return new Promise((resolve, reject) => {
            let User_QtyInfo_URL = User_WorkItems + Token_Result + "&user_role=" + Token_RoleID;
            fetch(User_QtyInfo_URL, {
                method: 'GET',
                headers: new Headers({
                    'Authorization': "Basic " + base64.encode(Cass_AuthDetails),
                    'X-API-KEY': Cass_APIDetails,
                }),
            })
                .then((response) => response.json())
                .then((Jsonresponse) => {
                    let User_QtyInfo = ""
                    if (Jsonresponse.status != false) {
                        User_QtyInfo = Jsonresponse
                        resolve({ User_QtyInfo });
                    } else {
                        resolve(User_QtyInfo)
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


    _fetch_EngInfo(Token_Result) {
        return new Promise((resolve, reject) => {
            let User_EngInfo_URL = User_EngineersList + Token_Result;
            fetch(User_EngInfo_URL, {
                method: 'GET',
                headers: new Headers({
                    'Authorization': "Basic " + base64.encode(Cass_AuthDetails),
                    'X-API-KEY': Cass_APIDetails,
                }),
            })
                .then((response) => response.json())
                .then((Jsonresponse) => {
                    let User_EngInfo = ""
                    if (Jsonresponse.status != false) {
                        User_EngInfo = Jsonresponse
                        resolve({ User_EngInfo });
                    } else {
                        resolve(User_EngInfo)
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

    async Qty_ListMethod(Route_Data, CassUserID, CassRoleID) {

        const Quatitylist_Response = await this._fetch_QtyInfo(CassUserID, CassRoleID)
        let QtyInfo_Array = Quatitylist_Response.User_QtyInfo.filter(item => item.department_id == Route_Data)

        let QtyInfo_Arraylist = []
        let QtyInfo_TextQty = []
        let QtyInfo_TextQtyList = []

        for (let i = 0; i < QtyInfo_Array.length; i++) {
            QtyInfo_Arraylist.push({
                "id": QtyInfo_Array[i].id,
                "item_code": QtyInfo_Array[i].item_code,
                "item_description": QtyInfo_Array[i].item_description,
                "engineer_pay_price": QtyInfo_Array[i].engineer_pay_price,
                "cass_sale_price": QtyInfo_Array[i].cass_sale_price,
                "item_label": QtyInfo_Array[i].item_label,
                "department_id": QtyInfo_Array[i].department_id,
                "status": QtyInfo_Array[i].status,
                "department_name": QtyInfo_Array[i].department_name,
                "department_ids": QtyInfo_Array[i].department_ids,
                "isClicked": false,
                "Qty_Count":0
            })
            //QtyInfo_TextQty.push(0)
            QtyInfo_TextQtyList.push({ "id": 0, "qty": 0, "price": 0 })
        }

        this.setState({
            //S2_TextQty: QtyInfo_TextQty,
            S2_QtyArraylist: QtyInfo_TextQtyList,
            S2_Quatitylist_Response: Array.from(new Set(QtyInfo_Arraylist)),
        })

        this.forceUpdate()

        this.setState({
            S2_Quatitylist_Response: Array.from(new Set(this.state.S2_Quatitylist_Response)),
            S2_Quatitylist_AR: this.state.S2_Quatitylist_Response
        })

    }


    Container_Method(RouteName) {
        if (RouteName == "Goback") {
            Alert.alert(
                'Closing Timesheet..!',
                'Are you sure, You want to close this it?',
                [
                    { text: 'YES', onPress: () => this.props.navigation.goBack() },
                    { text: 'NO', style: 'cancel' },

                ],
                { cancelable: false }
            )
            return true
        } else if (RouteName == "Right_Icon") {

            if (this.state.S3_Infostatus == false) {
                this.setState({ S3_Infostatus: true })
            } else {
                this.setState({ S3_Infostatus: false })
            }

        } else if (RouteName == "Left_Icon") {
            if (this.state.Add_TimesheetScreenIndex == 4) {
                for (let i = 0; i < this.state.S1_Engineer_DataArray.length; i++) {
                    this.state.S4_CostPercentage.pop(
                        (100 / (this.state.S1_Engineer_DataArray.length)).toFixed(1)
                    )
                    this.state.S4_UserAmount.pop(
                        ((this.state.S2_Qty_Amount / this.state.S1_Engineer_ALength)).toFixed(2)
                    )
                }
                this.setState({ Add_TimesheetScreenIndex: 3, Add_TimesheetScreen: "Step 3", })
            } else if (this.state.Add_TimesheetScreenIndex == 3) {
                this.setState({ Add_TimesheetScreenIndex: 2, Add_TimesheetScreen: "Step 2", })

            } else if (this.state.Add_TimesheetScreenIndex == 2) {
                this.setState({ Add_TimesheetScreenIndex: 1, Add_TimesheetScreen: "Step 1", })

            } else {
                Alert.alert(
                    'Closing Timesheet..!',
                    'Are you sure, You want to close this it?',
                    [
                        { text: 'YES', onPress: () => this.props.navigation.goBack() },
                        { text: 'NO', style: 'cancel' },

                    ],
                    { cancelable: false }
                )
                return true
            }
        } else {
            Snackbar.show({
                title: 'Server Underconstruction..!',
                duration: Snackbar.LENGTH_SHORT,
            });
        }

    }

    S1C_ModalMethod(RouteName) {
        this.setState({
            S1C_ModalRouteName: RouteName,
            S1C_Modal: true
        })
    }

    Caleder_Model(Route_Data) {
        this.setState({ Calendar_Modal: Route_Data, })
    }

    Container_Model(Route_Data, RouteName, Response) {
        this.setState({ S1C_ModalRouteName: Route_Data, S1C_Modal: RouteName })

        if (Route_Data == "Code Items") {
            this.setState({
                Modal_Itemcode: Response.item_code,
                Modal_ItemDescription: Response.item_description,
                Modal_ItemPrice: Response.cass_sale_price,
                Modal_ItemDept: Response.department_name,
            })
        } else {
            this.setState({
                Modal_SectionNo: Response.section_no,
                Modal_Distance: Response.distance,
                Modal_Blockage: Response.blockage,
                Modal_Desiit: Response.desiit,
                Modal_Newtrack: Response.new_track,
                Modal_SlipNo: Response.slip_no,
                Modal_SlipComments: Response.slip_comments,
            })
        }
        Keyboard.dismiss()
    }


    TextInput_Method(Data_Response, RouteName) {

        const { Engineer_ArrayList, Engineer_DataResponse, S2_Quatitylist_Response, S2_Quatitylist_AR } = this.state;
        var newData = []
        let QtyInfo_TextQty = []
        let QtyInfo_TextQtyList = []
        let QtyInfo_Array = []

        try {

            if (RouteName == "Engineer") {
                newData = Engineer_DataResponse.filter(function (item) {
                    const itemData = item.username ? item.username.toUpperCase() : ''.toUpperCase();
                    const textData = Data_Response.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                })

                this.setState({
                    Engineer_ArrayList: newData,
                });
            } else {
                QtyInfo_Array = S2_Quatitylist_AR.filter(function (item,index) {
                    const itemData = item.item_code ? item.item_code.toUpperCase() : ''.toUpperCase();
                    const textData = Data_Response.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                })
               
                // for (let i = 0; i < QtyInfo_Array.length; i++) {
                //     QtyInfo_Arraylist.push({
                //         "id": QtyInfo_Array[i].id,
                //         "item_code": QtyInfo_Array[i].item_code,
                //         "item_description": QtyInfo_Array[i].item_description,
                //         "engineer_pay_price": QtyInfo_Array[i].engineer_pay_price,
                //         "cass_sale_price": QtyInfo_Array[i].cass_sale_price,
                //         "item_label": QtyInfo_Array[i].item_label,
                //         "department_id": QtyInfo_Array[i].department_id,
                //         "status": QtyInfo_Array[i].status,
                //         "department_name": QtyInfo_Array[i].department_name,
                //         "department_ids": QtyInfo_Array[i].department_ids,
                //         "isClicked": false,
                //     })
                //     // QtyInfo_TextQty.push(0)
                //     // QtyInfo_TextQtyList.push({ "id": 0, "qty": 0, "price": 0 })
                // }
        
                this.setState({
                    S2_Quatitylist_Response: QtyInfo_Array,
                   // S2_TextQty: QtyInfo_TextQty,
                    //S2_QtyArraylist: QtyInfo_TextQtyList,
                    S2_Qty_Count: 0,
                    S2_Qty_Amount: 0
                });
            }

        } catch (err) {
        }
    }

    S1C_ToggleMethod(Route_Data, RouteName) {
        const { Engineer_ArrayList, Engineer_DataResponse, Quatitylist_Response } = this.state;

        if (RouteName == "Department") {
            this.setState({
                S1_Dept_Name: Route_Data.department_name,
                S1_Dept_ID: Route_Data.id,
                S1C_Modal: false
            })

            this.Qty_ListMethod(Route_Data.id, this.state.CassUserID, this.state.CassRoleID)

        } else {

            for (i = 0; i < Engineer_ArrayList.length; i++) {
                if (Engineer_ArrayList[i].id == Route_Data.id) {
                    if (Engineer_ArrayList[i].isClicked == false) {
                        Engineer_ArrayList[i].isClicked = true
                        Engineer_DataResponse[i].isClicked = true

                        this.state.S1_Engineer_DataArray.push(Route_Data)
                        this.state.S1_Engineer_ArrayId.push(Route_Data.id)

                        this.setState({
                            S1_Engineer_DataArray: Array.from(new Set(this.state.S1_Engineer_DataArray)),
                            S1_Engineer_ArrayId: Array.from(new Set(this.state.S1_Engineer_ArrayId))
                        })


                    } else {
                        Engineer_ArrayList[i].isClicked = false;
                        Engineer_DataResponse[i].isClicked = false

                        var Id = []
                        for (hv = 0; hv < this.state.S1_Engineer_DataArray.length; hv++) {
                            Id.push(this.state.S1_Engineer_DataArray[hv].id)
                        }
                        //this.state.S1_Engineer_ArrayId
                        var Bookmark_ID = this.state.S1_Engineer_DataArray.splice(Id.indexOf(Route_Data.id), 1); // this is how to remove an item
                        var Bookmark_ArrayID = this.state.S1_Engineer_ArrayId.splice(Id.indexOf(Route_Data.id), 1); // this is how to remove an item

                        this.setState({ S1_Engineer_DataArray: Bookmark_ID, S1_Engineer_ArrayId: Bookmark_ArrayID })
                        this.setState({
                            S1_Engineer_DataArray: Array.from(new Set(this.state.S1_Engineer_DataArray)),
                            S1_Engineer_ArrayId: Array.from(new Set(this.state.S1_Engineer_ArrayId))

                        })
                    }
                }
            }
        }

        this.forceUpdate()
    }


    S1_ToggleMethod(Route_Data) {
        const { Engineer_ArrayList, Engineer_DataResponse } = this.state;

        for (i = 0; i < Engineer_ArrayList.length; i++) {
            if (Engineer_ArrayList[i].id == Route_Data) {
                if (Engineer_ArrayList[i].isClicked == false) {
                    Engineer_ArrayList[i].isClicked = true
                    Engineer_DataResponse[i].isClicked = true
                } else {
                    Engineer_ArrayList[i].isClicked = false;
                    Engineer_DataResponse[i].isClicked = false
                }
            }
        }

        var Id = []
        for (hv = 0; hv < this.state.S1_Engineer_DataArray.length; hv++) {
            Id.push(this.state.S1_Engineer_DataArray[hv].id)
        }

        var S3_InfoArrayList = this.state.S1_Engineer_DataArray.splice(Id.indexOf(Route_Data), 1);
        var S1_EngineerID = this.state.S1_Engineer_ArrayId.splice(Id.indexOf(Route_Data), 1);

        this.setState({ S1_Engineer_DataArray: S3_InfoArrayList, S1_Engineer_ArrayId: S1_EngineerID })
        this.setState({
            S1_Engineer_DataArray: Array.from(new Set(this.state.S1_Engineer_DataArray)),
            S1_Engineer_ArrayId: Array.from(new Set(this.state.S1_Engineer_ArrayId))
        })
        this.forceUpdate()
    }


    S1C_Method(RouteName) {

        if (RouteName == "Submitter") {

            if (this.state.S1_Dept_ID == "") {
                Snackbar.show({
                    title: 'Enter Dept Name..!',
                    duration: Snackbar.LENGTH_SHORT,
                });
            } else if (this.state.S1_Job_No == "") {
                Snackbar.show({
                    title: 'Enter Job No..!',
                    duration: Snackbar.LENGTH_SHORT,
                });
            } else if (this.state.S1_Exchange == "") {
                Snackbar.show({
                    title: 'Enter Exchange..!',
                    duration: Snackbar.LENGTH_SHORT,
                });
            } else {
                Snackbar.show({
                    title: 'Success and Click Next..!',
                    duration: Snackbar.LENGTH_SHORT,
                });
            }

        } else {

            if (this.state.S1_Engineer_DataArray.length == 0) {
                Snackbar.show({
                    title: 'Select Engineer..!',
                    duration: Snackbar.LENGTH_SHORT,
                });
            } else {
                Snackbar.show({
                    title: 'Success and Click Next..!',
                    duration: Snackbar.LENGTH_SHORT,
                });
            }
        }

    }

    Timesheet_Method(Route_Data) {

        if (Route_Data == "Finish") {
            this.props.navigation.navigate("Dashboard")
        } else if (Route_Data == "Submit") {
            this.setState({ Report_Success: true })
        } else {

            if (this.state.Add_TimesheetScreenIndex == 1) {
                if (this.state.S1_Dept_ID == "") {
                    Snackbar.show({
                        title: 'Enter Dept Name..!',
                        duration: Snackbar.LENGTH_SHORT,
                    });
                } else if (this.state.S1_Job_No == "") {
                    Snackbar.show({
                        title: 'Enter Job No..!',
                        duration: Snackbar.LENGTH_SHORT,
                    });
                } else if (this.state.S1_Exchange == "") {
                    Snackbar.show({
                        title: 'Enter Exchange..!',
                        duration: Snackbar.LENGTH_SHORT,
                    });
                } else if (this.state.S1_Engineer_DataArray.length == 0) {
                    Snackbar.show({
                        title: 'Select Engineer..!',
                        duration: Snackbar.LENGTH_SHORT,
                    });
                } else {
                    this.setState({
                        Add_TimesheetScreen: "Step 2",
                        Add_TimesheetScreenIndex: 2,
                        S1_Engineer_ALength: this.state.S1_Engineer_DataArray.length
                    })
                }
            } else if (this.state.Add_TimesheetScreenIndex == 2) {
                if (Route_Data == "Prev") {
                    this.setState({
                        Add_TimesheetScreen: "Step 1",
                        Add_TimesheetScreenIndex: 1
                    })
                } else {

                    if (this.state.S2_QtyArraylist.length == 0) {
                        Snackbar.show({
                            title: 'Select Work Items..!',
                            duration: Snackbar.LENGTH_SHORT,
                        });
                    } else {
                        this.setState({
                            Add_TimesheetScreen: "Step 3",
                            Add_TimesheetScreenIndex: 3
                        })
                    }
                }

            } else if (this.state.Add_TimesheetScreenIndex == 3) {
                if (Route_Data == "Prev") {
                    this.setState({
                        Add_TimesheetScreen: "Step 2",
                        Add_TimesheetScreenIndex: 2,

                    })
                } else {


                    // if (this.state.S3_InfoArray.length == 0) {
                    //     Snackbar.show({
                    //         title: 'Add Your Information..!',
                    //         duration: Snackbar.LENGTH_SHORT,
                    //     });
                    // } else if (this.state.S3_TextComments == "") {

                    //     Snackbar.show({
                    //         title: 'Enter Your Comments..!',
                    //         duration: Snackbar.LENGTH_SHORT,
                    //     });

                    // } else {
                    this.setState({
                        Add_TimesheetScreen: "Step 4",
                        Add_TimesheetScreenIndex: 4
                    })

                    for (let i = 0; i < this.state.S1_Engineer_DataArray.length; i++) {
                        this.state.S4_CostPercentage.push(
                            (100 / (this.state.S1_Engineer_DataArray.length)).toFixed(1)
                        )
                        this.state.S4_UserAmount.push(
                            ((this.state.S2_Qty_Amount / this.state.S1_Engineer_ALength)).toFixed(2)
                        )
                    }
                    // }

                }

            } else if (this.state.Add_TimesheetScreenIndex == 4) {
                if (Route_Data == "Prev") {
                    this.setState({
                        Add_TimesheetScreen: "Step 3",
                        Add_TimesheetScreenIndex: 3,

                    })
                    for (let i = 0; i < this.state.S1_Engineer_DataArray.length; i++) {
                        this.state.S4_CostPercentage.pop(
                            (100 / (this.state.S1_Engineer_DataArray.length)).toFixed(1)
                        )
                        this.state.S4_UserAmount.pop(
                            ((this.state.S2_Qty_Amount / this.state.S1_Engineer_ALength)).toFixed(2)
                        )

                    }
                } else {

                    var C2_QtyArraylist = []
                    for (let i = 0; i < this.state.S2_QtyArraylist.length; i++) {
                        if (this.state.S2_QtyArraylist[i].id != 0) {
                            C2_QtyArraylist.push({
                                "id": this.state.S2_Quatitylist_Response[i].id,
                                "item_code": this.state.S2_Quatitylist_Response[i].item_code,
                                "item_description": this.state.S2_Quatitylist_Response[i].item_description,
                                "engineer_pay_price": this.state.S2_Quatitylist_Response[i].engineer_pay_price,
                                "cass_sale_price": this.state.S2_Quatitylist_Response[i].cass_sale_price,
                                "item_label": this.state.S2_Quatitylist_Response[i].item_label,
                                "department_id": this.state.S2_Quatitylist_Response[i].department_id,
                                "status": this.state.S2_Quatitylist_Response[i].status,
                                "department_name": this.state.S2_Quatitylist_Response[i].department_name,
                                "department_ids": this.state.S2_Quatitylist_Response[i].department_ids,
                                "item_Qty": this.state.S2_QtyArraylist[i].qty,
                            })
                        }
                    }

                    this.setState({
                        Add_TimesheetScreen: "Step 5",
                        Add_TimesheetScreenIndex: 5,
                        S2_QtyArraylist_Preview: C2_QtyArraylist
                    })
                }

            } else if (this.state.Add_TimesheetScreenIndex == 5) {

                if (Route_Data == "Prev") {
                    this.setState({
                        Add_TimesheetScreen: "Step 4",
                        Add_TimesheetScreenIndex: 4,
                    })
                } else {
                    var C4_Cost = 0
                    for (let i = 0; i < this.state.S4_CostPercentage.length; i++) {
                        C4_Cost += parseFloat(this.state.S4_CostPercentage[i])
                    }

                    var C2_QtyArraylist = []
                    for (let i = 0; i < this.state.S2_QtyArraylist.length; i++) {
                        if (this.state.S2_QtyArraylist[i].id != 0) {
                            C2_QtyArraylist.push(this.state.S2_QtyArraylist[i])
                        }
                    }

                    for (let i = 0; i < this.state.S4_CostPercentage.length; i++) {
                        this.state.S4_UserAmount[i] = ((this.state.S2_Qty_Amount * this.state.S4_CostPercentage[i]) / 100).toFixed(2)
                    }


                    if (Number(C4_Cost).toFixed(0) == 100) {
                        fetch(Timesheet_Add, {
                            method: 'POST',
                            headers: new Headers({
                                'Authorization': "Basic " + base64.encode(Cass_AuthDetails),
                                'X-API-KEY': Cass_APIDetails,
                                'Content-Type': 'application/json',
                            }),
                            body: JSON.stringify({
                                "department_id": this.state.S1_Dept_ID,
                                "job_no": this.state.S1_Job_No,
                                "exchange": this.state.S1_Exchange,
                                "job_date": this.state.S1_Date,
                                "users": this.state.S1_Engineer_ArrayId.toString(),
                                "user_id": this.state.CassUserID,
                                "submitter_name": this.state.SubmitterName,
                                "work_item_id_qty": C2_QtyArraylist,
                                "comments": this.state.S3_TextComments,
                                "item_details": this.state.S3_InfoArray,
                                "user_percentage": this.state.S4_CostPercentage,
                                "user_cost": this.state.S4_UserAmount,
                            })
                        })
                            .then((response) => response.json())
                            .then((Jsonresponse) => {
                                if (Jsonresponse.status == true) {
                                    this.setState({ Dashboard_Fetching: false, Report_Success: true });
                                    Snackbar.show({
                                        title: Jsonresponse.message + "..!",
                                        duration: Snackbar.LENGTH_SHORT,
                                    });
                                } else {
                                    this.setState({ Dashboard_Fetching: false });
                                    Snackbar.show({
                                        title: Jsonresponse + "..!",
                                        duration: Snackbar.LENGTH_SHORT,
                                    });
                                }
                            })
                            .catch((error) => {
                                this.setState({ Dashboard_Fetching: false });
                                Snackbar.show({
                                    title: "Internal Server Error..!",
                                    duration: Snackbar.LENGTH_SHORT,
                                });
                            });
                    } else {
                        Snackbar.show({
                            title: 'Please Check your Cost Percentage..!',
                            duration: Snackbar.LENGTH_SHORT,
                        });
                    }

                }

            }
        }
    }


    onDateChange(Date_Index) {
        this.setState({
            S1_DateVisible: Moment(Date_Index).format('DD-MMMM-YY'),
            S1_Date: Moment(Date_Index).format('YYYY-MM-DD'),
        })
    }

    S2_ToggleMethod(Route_Data, S2_Quatitylist_Response) {
        const { S2_Quatitylist_AR, S2_QtyArraylist } = this.state;
        var Qty_count = 0
        var Qty_Amount = 0

        for (i = 0; i < S2_Quatitylist_Response.length; i++) {
            if (S2_Quatitylist_Response[i].id == Route_Data.id) {

                if (S2_Quatitylist_Response[i].isClicked == false) {
                    S2_Quatitylist_Response[i].isClicked = true
                    S2_Quatitylist_AR[i].isClicked = true
                    S2_QtyArraylist[i].id = Route_Data.id,
                        S2_QtyArraylist[i].qty = this.state.S2_TextQty[i],
                        S2_QtyArraylist[i].price = S2_Quatitylist_Response[i].cass_sale_price
                    Qty_count = parseInt(this.state.S2_TextQty[i])
                    Qty_Amount = parseFloat((this.state.S2_TextQty[i] * S2_Quatitylist_Response[i].cass_sale_price))
                    this.setState({ S2_QtyArraylist: Array.from(new Set(this.state.S2_QtyArraylist)) })
                } else {

                    S2_Quatitylist_Response[i].isClicked = false;
                    S2_Quatitylist_AR[i].isClicked = false
                    S2_QtyArraylist[i].id = 0,
                        S2_QtyArraylist[i].qty = 0,
                        S2_QtyArraylist[i].price = 0
                    Qty_count = - parseInt(this.state.S2_TextQty[i])
                    Qty_Amount = - parseFloat((this.state.S2_TextQty[i] * S2_Quatitylist_Response[i].cass_sale_price))
                    this.setState({ S2_QtyArraylist: Array.from(new Set(this.state.S2_QtyArraylist)) })
                }
            }
        }

        this.setState({
            S2_QtyArraylist: Array.from(new Set(this.state.S2_QtyArraylist)),
            S2_Qty_Count: this.state.S2_Qty_Count + Qty_count,
            S2_Qty_Amount: this.state.S2_Qty_Amount + Qty_Amount
        })
        this.forceUpdate()
    }


    TS3_Method(RouteName) {

        if (RouteName == "Open") {
            this.setState({
                S3_Infostatus: true
            })
        } else {
            if (this.state.S3_Section_No == "") {
                Snackbar.show({
                    title: 'Enter Section No..!',
                    duration: Snackbar.LENGTH_SHORT,
                });
            } else if (this.state.S3_Distance == "") {
                Snackbar.show({
                    title: 'Enter Distance..!',
                    duration: Snackbar.LENGTH_SHORT,
                });
            } else if (this.state.S3_Blockage == "") {
                Snackbar.show({
                    title: 'Enter Blockage..!',
                    duration: Snackbar.LENGTH_SHORT,
                });
            } else if (this.state.S3_Desilt == "") {
                Snackbar.show({
                    title: 'Enter Desilt..!',
                    duration: Snackbar.LENGTH_SHORT,
                });
            } else if (this.state.S3_New_Track == "") {
                Snackbar.show({
                    title: 'Enter New Track..!',
                    duration: Snackbar.LENGTH_SHORT,
                });
            } else if (this.state.S3_DFESlipNumber == "") {
                Snackbar.show({
                    title: 'Enter DEFE Slip Number..!',
                    duration: Snackbar.LENGTH_SHORT,
                });
            } else if (this.state.S3_Comments == "") {
                Snackbar.show({
                    title: 'Enter Comments..!',
                    duration: Snackbar.LENGTH_SHORT,
                });
            } else {

                this.state.S3_InfoArray.push({
                    "section_no": this.state.S3_Section_No,
                    "distance": this.state.S3_Distance,
                    "blockage": this.state.S3_Blockage,
                    "desiit": this.state.S3_Desilt,
                    "new_track": this.state.S3_New_Track,
                    "slip_no": this.state.S3_DFESlipNumber,
                    "slip_comments": this.state.S3_Comments,
                })

                if (RouteName == "More") {
                    this.setState({
                        S3_Section_No: "", S3_Distance: "", S3_Blockage: "",
                        S3_Desilt: "", S3_New_Track: "", S3_DFESlipNumber: "", S3_Comments: ""
                    })
                } else {
                    this.setState({
                        S3_Section_No: "", S3_Distance: "", S3_Blockage: "",
                        S3_Desilt: "", S3_New_Track: "", S3_DFESlipNumber: "", S3_Comments: "", S3_Infostatus: false
                    })
                }

                this.forceUpdate()
            }

        }
    }

    S3_ToggleMethod(RouteName, Route_Data) {

        var Id = []
        for (hv = 0; hv < this.state.S3_InfoArray.length; hv++) {
            Id.push(this.state.S3_InfoArray[hv].section_no)
        }

        var S3_InfoArrayList = this.state.S3_InfoArray.splice(Id.indexOf(RouteName.section_no), 1);

        this.setState({ S3_InfoArray: S3_InfoArrayList })
        this.setState({ S3_InfoArray: Array.from(new Set(this.state.S3_InfoArray)) })
        this.forceUpdate()
    }



    Total_Amountcalculation(RouteName,Route_Data) {

        const { S2_Quatitylist_Response, S2_QtyArraylist } = this.state;

        try {
            for (i = 0; i < S2_Quatitylist_Response.length; i++) {
                if (S2_Quatitylist_Response[i].isClicked == true) {
                    S2_QtyArraylist[i].qty = this.state.S2_TextQty[i]
                    S2_QtyArraylist[i].price = S2_Quatitylist_Response[i].cass_sale_price
                    this.setState({ S2_QtyArraylist: Array.from(new Set(this.state.S2_QtyArraylist)) })
                }
            }
            let Results_qty = 0
            let Results_Amount = 0
            for (let i = 0; i < S2_QtyArraylist.length; i++) {
                Results_qty += isNaN(parseInt(S2_QtyArraylist[i].qty)) == true ? 0 : parseInt(S2_QtyArraylist[i].qty)
                Results_Amount += isNaN(parseFloat(S2_QtyArraylist[i].qty * S2_QtyArraylist[i].price)) == true ? 0 : parseFloat(S2_QtyArraylist[i].qty * S2_QtyArraylist[i].price)
            }
            this.setState({
                S2_QtyArraylist: Array.from(new Set(this.state.S2_QtyArraylist)),
                S2_Qty_Count: Results_qty,
                S2_Qty_Amount: Results_Amount
            })
        } catch (err) {

        }

        this.forceUpdate()
    }


    render() {

        return (
            <LinearGradient key="background" start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[LG_BG_THEME.APPTHEME_BG_2, LG_BG_THEME.APPTHEME_BG_2]} style={{ flex: 1, justifyContent: "center" }} >

                <Mystatusbar />
                <View style={{ flex: 1 }}>
                    <AS_HeaderDesign
                        Onpress_LeftIcon={() => this.Container_Method("Left_Icon")}
                        Onpress_RightIcon={() => this.Container_Method("Right_Icon")}
                        Header_Text={"NEW TIMESHEETS"}
                        RightIcon_Status={this.state.Add_TimesheetScreen == "Step 3" && this.state.S3_Infostatus == false ? "Add" : this.state.Add_TimesheetScreen == "Step 3" && this.state.S3_Infostatus == true ? "Close" : false}
                        LeftIcon_Status={true}
                    />

                    {
                        this.state.Report_Success == true ?
                            <View style={{ flex: 1, marginTop: width / 100 * 2, marginLeft: width / 100 * 6, marginRight: width / 100 * 6 }}>
                                <View style={{ flex: 0.2 }} />
                                <View style={{ flex: 0.6, backgroundColor: LG_BG_THEME.APPTHEME_DG, borderRadius: width / 100 * 4 }}>
                                    <View style={{ flex: 0.85, justifyContent: "center", alignItems: 'center' }}>

                                        <Text style={styles.container_S5Text}>{"Details submitted"}</Text>
                                        <Text style={styles.container_S5Text}>{"Successfully"}</Text>
                                    </View>

                                    <View style={{ flex: 0.15, marginLeft: width / 100 * 1, marginRight: width / 100 * 1 }}>
                                        <CM_BoxButton
                                            CMB_BuutonColourcode={LG_BG_THEME.APPTHEME_DLG}
                                            onPress_BuutonView={() => this.Timesheet_Method("Finish")}
                                            CMB_TextHeader={"OK"}
                                        />
                                    </View>

                                </View>

                                <View style={{ flex: 0.2 }} />


                            </View>
                            :
                            <View style={{ flex: 1, marginTop: width / 100 * 2, marginLeft: width / 100 * 2, marginRight: width / 100 * 2 }}>

                                <View style={styles.Container_EP_2} />

                                <View style={{ height: width / 100 * 10, justifyContent: "center", flexDirection: "row" }}>

                                    <TS_Circleview
                                        Circle_Text={"1"}
                                        Circle_Status={true}
                                    />

                                    <TS_CircleLIne
                                        Circle_Status={this.state.Add_TimesheetScreenIndex > 1 ? true : false}
                                    />

                                    <TS_Circleview
                                        Circle_Status={this.state.Add_TimesheetScreenIndex > 1 ? true : false}
                                        Circle_Text={"2"}
                                    />

                                    <TS_CircleLIne
                                        Circle_Status={this.state.Add_TimesheetScreenIndex > 2 ? true : false}
                                    />
                                    <TS_Circleview
                                        Circle_Text={"3"}
                                        Circle_Status={this.state.Add_TimesheetScreenIndex > 2 ? true : false}
                                    />

                                    <TS_CircleLIne
                                        Circle_Status={this.state.Add_TimesheetScreenIndex > 3 ? true : false}
                                    />
                                    <TS_Circleview
                                        Circle_Text={"4"}
                                        Circle_Status={this.state.Add_TimesheetScreenIndex > 3 ? true : false}
                                    />

                                </View>


                                <View style={styles.Container_EP_2} />

                                <View style={{ flex: 1, justifyContent: 'center', marginLeft: width / 100 * 2, marginRight: width / 100 * 2 }}>

                                    {
                                        this.state.Add_TimesheetScreen == "Step 1" ?
                                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>

                                                    <View style={{ flex: 1, justifyContent: "center" }}>
                                                        <View style={styles.Container_EP_2} />

                                                        <TouchableOpacity onPress={() => this.S1C_ModalMethod("Department")} style={styles.container_TextInputOverview}>
                                                            <View style={{ height: height / 100 * 6, justifyContent: "center", borderRadius: width / 100 * 1, }}>
                                                                <View style={{ flex: 1, justifyContent: "center", }}>
                                                                    <Text style={this.state.S1_Dept_Name == "" ? styles.container_PHText : styles.container_Text}>{this.state.S1_Dept_Name == "" ? "Department/Template timesheet" : this.state.S1_Dept_Name}</Text>
                                                                </View>
                                                            </View>
                                                        </TouchableOpacity>

                                                        <View style={styles.Container_EP_2} />

                                                        <View style={styles.container_TextInputOverview}>
                                                            <View style={{ flex: 1, justifyContent: "center", }}>
                                                                <TextInput
                                                                    placeholder='Job No'
                                                                    ref='Job_No'
                                                                    selectionColor={LG_BG_THEME.APPTHEME_BLACK}
                                                                    underlineColorAndroid='transparent'
                                                                    placeholderTextColor={LG_BG_THEME.APPTHEME_GREY_2}
                                                                    style={styles.container_Text}
                                                                    onChangeText={(S1_Job_No) => this.setState({ S1_Job_No })}
                                                                    onSubmitEditing={() => this.refs.Exchange.focus()}
                                                                    value={this.state.S1_Job_No}
                                                                />
                                                            </View>
                                                        </View>

                                                        <View style={styles.Container_EP_2} />

                                                        <View style={styles.container_TextInputOverview}>
                                                            <View style={{ flex: 1, justifyContent: "center", }}>
                                                                <TextInput
                                                                    placeholder='Exchange'
                                                                    ref='Exchange'
                                                                    returnKeyType='next'
                                                                    selectionColor={LG_BG_THEME.APPTHEME_BLACK}
                                                                    underlineColorAndroid='transparent'
                                                                    placeholderTextColor={LG_BG_THEME.APPTHEME_GREY_2}
                                                                    style={styles.container_Text}
                                                                    onChangeText={(S1_Exchange) => this.setState({ S1_Exchange })}
                                                                    value={this.state.S1_Exchange}
                                                                //onSubmitEditing={() => this.refs.Date.focus()}
                                                                />
                                                            </View>
                                                        </View>

                                                        <View style={styles.Container_EP_2} />

                                                        <TouchableOpacity onPress={() => this.Caleder_Model(true)} style={styles.container_TextInputOverview}>
                                                            <View style={{ flex: 1, justifyContent: "center", }}>
                                                                <Text style={styles.container_Text}>{this.state.S1_DateVisible}</Text>
                                                            </View>
                                                        </TouchableOpacity>

                                                        <View style={styles.Container_EP_2} />


                                                        <View style={styles.container_TextInputOverview}>
                                                            <View style={{ flex: 1, justifyContent: "center", }}>
                                                                <Text style={styles.container_Text}>{"Submitter : " + this.state.SubmitterName}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={styles.Container_EP_2} />

                                                        <View style={{ height: height / 100 * 5, justifyContent: "center", flexDirection: 'row' }}>
                                                            <View style={{ flex: 0.5, justifyContent: "center", }} />
                                                            <TouchableOpacity onPress={() => this.S1C_ModalMethod("Engineer")} style={{ flex: 0.5, justifyContent: "center", flexDirection: 'row' }}>
                                                                <View style={{ flex: 0.7, justifyContent: "center" }}>
                                                                    <Text style={styles.S1C_ButtonText}>{"Add Engineer"}</Text>
                                                                </View>
                                                                <View style={{ flex: 0.3, justifyContent: "center", alignItems: "center" }}>
                                                                    <Image source={require('../../../../Asset/Icons/Circle.png')} style={{ width: width / 100 * 7, height: width / 100 * 7, tintColor: LG_BG_THEME.APPTHEME_1, position: 'absolute' }} />
                                                                    <Image source={require('../../../../Asset/Icons/PlusIcon.png')} style={{ width: width / 100 * 3, height: width / 100 * 3, tintColor: LG_BG_THEME.WHITE_THEME }} />
                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>

                                                        <View style={styles.Container_EP_2} />

                                                        {this.state.S1_Engineer_DataArray.map((item, index) => (
                                                            <TouchableOpacity onPress={() => this.S1_ToggleMethod(item.id)} style={{ height: height / 100 * 6, justifyContent: "center", elevation: Platform.OS == "android" ? width / 100 * 1 : width / 100 * 0.2, shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.2, shadowColor: LG_BG_THEME.APPTHEME_2, flexDirection: 'row', backgroundColor: LG_BG_THEME.WHITE_THEME, marginBottom: width / 100 * 3, borderColor: item.id == this.state.CassUserID ? LG_BG_THEME.APPTHEME_1 : LG_BG_THEME.WHITE_THEME, borderWidth: width / 100 * 0.2 }}>
                                                                <View style={{ flex: 0.05, justifyContent: "center", }} />
                                                                <View style={{ flex: 0.8, justifyContent: "center" }}>
                                                                    <Text style={styles.S1_EngineerList_Text}>{item.username}</Text>
                                                                </View>
                                                                <View style={{ flex: 0.15, justifyContent: "center", alignItems: "center" }}>
                                                                    <Image source={require('../../../../Asset/Icons/Delete_Icon.png')} style={{ width: width / 100 * 5, height: width / 100 * 5, tintColor: LG_BG_THEME.APPTHEME_1 }} />
                                                                </View>
                                                            </TouchableOpacity>
                                                        ))}

                                                        <View style={styles.Container_EP_2} />

                                                    </View>
                                                </ScrollView>

                                            </TouchableWithoutFeedback>
                                            : this.state.Add_TimesheetScreen == "Step 2" ?

                                                <View style={{ flex: 1, }}>

                                                    <View style={styles.Container_EP_2} />

                                                    <View style={{ height: height / 100 * 8, justifyContent: "center", backgroundColor: LG_BG_THEME.APPTHEME_2 }}>
                                                        <Text style={styles.Bar_HeaderText}>{"Total Pay for job - £ "}<Text style={styles.Bar_HeaderText}>{this.state.S2_Qty_Amount.toFixed(2)}</Text><Text style={styles.Bar_HeaderText}>{" (Qty -" + this.state.S2_Qty_Count + ")"}</Text></Text>
                                                    </View>

                                                    <View style={styles.Container_EP_3} />

                                                    <TouchableWithoutFeedback onPress={Keyboard.dismiss} onPressIn={() => this.Total_Amountcalculation()}>
                                                        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>

                                                            <View style={{ height: height / 100 * 7, justifyContent: "center", flexDirection: 'row' }}>
                                                                <View style={{ flex: 0.02, justifyContent: 'center', }} />

                                                                <View style={{ flex: 0.96, justifyContent: "center", backgroundColor: LG_BG_THEME.WHITE_THEME, borderRadius: width / 100 * 4, flexDirection: 'row', elevation: Platform.OS == "android" ? width / 100 * 1 : width / 100 * 0.1, shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.2, shadowColor: LG_BG_THEME.APPTHEME_2, }}>

                                                                    <View style={{ flex: 0.05, justifyContent: 'center', }} />
                                                                    <View style={{ flex: 0.8, justifyContent: "center", }}>
                                                                        <TextInput
                                                                            placeholder='Search..'
                                                                            returnKeyType='next'
                                                                            selectionColor={LG_BG_THEME.APPTHEME_BLACK}
                                                                            underlineColorAndroid='transparent'
                                                                            placeholderTextColor={LG_BG_THEME.APPTHEME_BLACK}
                                                                            style={styles.container_Text}
                                                                            onChangeText={(Search_Text) => this.TextInput_Method(Search_Text, "Qty")}
                                                                        />
                                                                    </View>
                                                                    <View style={{ flex: 0.15, justifyContent: 'center', }}>
                                                                        <Image source={require('../../../../Asset/Icons/search.png')} style={{ width: width / 100 * 6, height: width / 100 * 6, tintColor: LG_BG_THEME.APPTHEME_BLACK }} />
                                                                    </View>
                                                                </View>
                                                                <View style={{ flex: 0.02, justifyContent: 'center', }} />

                                                            </View>

                                                            <View style={styles.Container_EP_1} />

                                                            <View style={{ height: height / 100 * 6, justifyContent: "center", flexDirection: 'row', opacity: 0.8 }}>
                                                                <View style={{ flex: 0.3, justifyContent: 'center', }}>
                                                                    <Text style={styles.S2_container_BlackText}>{"Code Items"}</Text>
                                                                </View>
                                                                <View style={{ flex: 0.2, justifyContent: 'center', }}>
                                                                    <Text style={styles.S2_container_BlackText}>{"Qty"}</Text>
                                                                </View>
                                                                <View style={{ flex: 0.3, justifyContent: 'center', }}>
                                                                    <Text style={styles.S2_container_BlackText}>{"Price"}</Text>
                                                                </View>
                                                                <View style={{ flex: 0.2, justifyContent: 'center', }} />
                                                            </View>

                                                            {this.state.S2_Quatitylist_Response.map((item, index) => (
                                                                <View style={{ height: height / 100 * 8, justifyContent: "center", flexDirection: 'row', marginBottom: width / 100 * 3, elevation: Platform.OS == "android" ? width / 100 * 1 : width / 100 * 0.1, shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.2, shadowColor: LG_BG_THEME.APPTHEME_2, marginLeft: width / 100 * 2, marginRight: width / 100 * 2, opacity: item.isClicked == true ? 1 : 0.4 }}>

                                                                    <TouchableOpacity onPress={() => this.Container_Model("Code Items", true, item)} style={{ flex: 0.32, justifyContent: 'center', backgroundColor: item.isClicked == true ? LG_BG_THEME.APPTHEME_1 : LG_BG_THEME.WHITE_THEME, }}>
                                                                        <Text numberOfLines={2} style={item.isClicked == true ? styles.S2_Qty_WLMedium : styles.S2_Qty_BLMedium}>{" " + item.item_code}</Text>
                                                                        <Image source={require('../../../../Asset/Icons/search.png')} style={{ width: width / 100 * 3, height: width / 100 * 3, tintColor: LG_BG_THEME.APPTHEME_1, position: "absolute", marginLeft: width / 100 * 1 }} />

                                                                    </TouchableOpacity>

                                                                    <View style={{ flex: 0.2, justifyContent: 'center', backgroundColor: item.isClicked == true ? LG_BG_THEME.APPTHEME_1 : LG_BG_THEME.WHITE_THEME, opacity: 0.8 }}>
                                                                        <View style={{ flex: 1, justifyContent: "center", }}>
                                                                            <TextInput
                                                                                placeholder='Qty'
                                                                                returnKeyType="go"
                                                                                editable={(item.isClicked)}
                                                                                keyboardType={"number-pad"}
                                                                                underlineColorAndroid='transparent'
                                                                                selectionColor={LG_BG_THEME.APPTHEME_BLACK}
                                                                                placeholderTextColor={LG_BG_THEME.APPTHEME_BLACK}
                                                                                style={item.isClicked == true ? styles.container_WhiteText : styles.container_Text}
                                                                                onChangeText={text => {
                                                                                    let { S2_TextQty } = this.state;
                                                                                    S2_TextQty[index] = text;
                                                                                    this.setState({ S2_TextQty });
                                                                                    this.Total_Amountcalculation(text,item)
                                                                                }}

                                                                                //onKeyPress={({ nativeEvent }) => { this.Timesheet_QtyMethod(nativeEvent.key, "Event") }}
                                                                                onSubmitEditing={() => this.Total_Amountcalculation()}
                                                                                value={this.state.S2_TextQty}
                                                                            />
                                                                        </View>
                                                                    </View>


                                                                    <View style={{ flex: 0.33, justifyContent: 'center', backgroundColor: item.isClicked == true ? LG_BG_THEME.APPTHEME_1 : LG_BG_THEME.WHITE_THEME, }}>
                                                                        <View style={{ flex: 0.05, justifyContent: 'center' }} />
                                                                        <View style={{ flex: 0.45, justifyContent: 'center' }}>
                                                                            <Text numberOfLines={2} style={item.isClicked == true ? styles.S2_Qty_WMedium : styles.S2_Qty_BMedium}>{isNaN((item.cass_sale_price * this.state.S2_TextQty[index]).toFixed(2)) == true ? "£ 0.0" : "£ " + (item.cass_sale_price * this.state.S2_TextQty[index]).toFixed(2)}</Text>
                                                                        </View>

                                                                        <View style={{ flex: 0.45, justifyContent: 'center' }}>
                                                                            <Text numberOfLines={2} style={item.isClicked == true ? styles.S2_Qty_WSmall : styles.S2_Qty_BSmall}>{"£ " + item.cass_sale_price + " (PP)"}</Text>
                                                                        </View>

                                                                        <View style={{ flex: 0.05, justifyContent: 'center' }} />

                                                                    </View>

                                                                    <View style={{ flex: 0.03, justifyContent: 'center', }} />

                                                                    <View style={{ flex: 0.12, justifyContent: 'center', }}>
                                                                        <View style={{ flex: 0.3, justifyContent: 'center', }} />
                                                                        <TouchableOpacity onPress={() => this.S2_ToggleMethod(item, this.state.S2_Quatitylist_Response)} style={{ flex: 0.4, justifyContent: 'center', alignItems: "center", }}>
                                                                            <Image source={require('../../../../Asset/Icons/Toggle.png')} style={{ width: width / 100 * 10, height: width / 100 * 8, tintColor: item.isClicked == true ? LG_BG_THEME.APPTHEME_1 : LG_BG_THEME.APPTHEME_BLACK, transform: item.isClicked == true ? [{ rotate: '0deg' }] : [{ rotate: '180deg' }] }} />
                                                                        </TouchableOpacity>

                                                                        <View style={{ flex: 0.3, justifyContent: 'center', }} />
                                                                    </View>

                                                                </View>
                                                            ))}

                                                        </ScrollView>

                                                    </TouchableWithoutFeedback>
                                                </View>

                                                : this.state.Add_TimesheetScreen == "Step 3" ?
                                                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                                        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>

                                                            <View style={{ flex: 1, justifyContent: "center" }}>
                                                                {
                                                                    this.state.S3_Infostatus == true ?

                                                                        <View style={{ flex: 1, }}>
                                                                            <View style={styles.Container_EP_2} />

                                                                            <View style={styles.container_TextInputOverview}>
                                                                                <View style={{ flex: 1, justifyContent: "center", }}>
                                                                                    <TextInput
                                                                                        placeholder='Section No'
                                                                                        ref='Section_No'
                                                                                        returnKeyType='next'
                                                                                        //keyboardType={"numeric"}
                                                                                        selectionColor={LG_BG_THEME.APPTHEME_BLACK}
                                                                                        underlineColorAndroid='transparent'
                                                                                        placeholderTextColor={LG_BG_THEME.APPTHEME_BLACK}
                                                                                        style={styles.container_Text}
                                                                                        onChangeText={(S3_Section_No) => this.setState({ S3_Section_No })}
                                                                                        onSubmitEditing={() => this.refs.Distance.focus()}
                                                                                        value={this.state.S3_Section_No}
                                                                                    />
                                                                                </View>
                                                                            </View>
                                                                            <View style={styles.Container_EP_3} />

                                                                            <View style={styles.container_TextInputOverview}>
                                                                                <View style={{ flex: 1, justifyContent: "center", }}>
                                                                                    <TextInput
                                                                                        placeholder='Distance'
                                                                                        ref='Distance'
                                                                                        returnKeyType='next'
                                                                                        //keyboardType={"numeric"}
                                                                                        selectionColor={LG_BG_THEME.APPTHEME_BLACK}
                                                                                        underlineColorAndroid='transparent'
                                                                                        placeholderTextColor={LG_BG_THEME.APPTHEME_BLACK}
                                                                                        style={styles.container_Text}
                                                                                        onChangeText={(S3_Distance) => this.setState({ S3_Distance })}
                                                                                        onSubmitEditing={() => this.refs.Blockage.focus()}
                                                                                        value={this.state.S3_Distance}
                                                                                    />
                                                                                </View>
                                                                            </View>
                                                                            <View style={styles.Container_EP_3} />

                                                                            <View style={styles.container_TextInputOverview}>
                                                                                <View style={{ flex: 1, justifyContent: "center", }}>
                                                                                    <TextInput
                                                                                        placeholder='Blockage'
                                                                                        ref='Blockage'
                                                                                        returnKeyType='next'
                                                                                        // keyboardType={"numeric"}
                                                                                        selectionColor={LG_BG_THEME.APPTHEME_BLACK}
                                                                                        underlineColorAndroid='transparent'
                                                                                        placeholderTextColor={LG_BG_THEME.APPTHEME_BLACK}
                                                                                        style={styles.container_Text}
                                                                                        onChangeText={(S3_Blockage) => this.setState({ S3_Blockage })}
                                                                                        onSubmitEditing={() => this.refs.Desilt.focus()}
                                                                                        value={this.state.S3_Blockage}
                                                                                    />
                                                                                </View>
                                                                            </View>

                                                                            <View style={styles.Container_EP_3} />

                                                                            <View style={styles.container_TextInputOverview}>
                                                                                <View style={{ flex: 1, justifyContent: "center", }}>
                                                                                    <TextInput
                                                                                        placeholder='Desilt'
                                                                                        ref='Desilt'
                                                                                        returnKeyType='next'
                                                                                        //keyboardType={"numeric"}
                                                                                        selectionColor={LG_BG_THEME.APPTHEME_BLACK}
                                                                                        underlineColorAndroid='transparent'
                                                                                        placeholderTextColor={LG_BG_THEME.APPTHEME_BLACK}
                                                                                        style={styles.container_Text}
                                                                                        onChangeText={(S3_Desilt) => this.setState({ S3_Desilt })}
                                                                                        onSubmitEditing={() => this.refs.New_Track.focus()}
                                                                                        value={this.state.S3_Desilt}

                                                                                    />
                                                                                </View>
                                                                            </View>

                                                                            <View style={styles.Container_EP_3} />

                                                                            <View style={styles.container_TextInputOverview}>
                                                                                <View style={{ flex: 1, justifyContent: "center", }}>
                                                                                    <TextInput
                                                                                        placeholder='New Track'
                                                                                        ref='New_Track'
                                                                                        returnKeyType='next'
                                                                                        underlineColorAndroid='transparent'
                                                                                        selectionColor={LG_BG_THEME.APPTHEME_BLACK}
                                                                                        placeholderTextColor={LG_BG_THEME.APPTHEME_BLACK}
                                                                                        style={styles.container_Text}
                                                                                        onChangeText={(S3_New_Track) => this.setState({ S3_New_Track })}
                                                                                        onSubmitEditing={() => this.refs.DFESlipNumber.focus()}
                                                                                        value={this.state.S3_New_Track}

                                                                                    />
                                                                                </View>
                                                                            </View>

                                                                            <View style={styles.Container_EP_3} />

                                                                            <View style={styles.container_TextInputOverview}>
                                                                                <View style={{ flex: 1, justifyContent: "center", }}>
                                                                                    <TextInput
                                                                                        placeholder='DFE Slip Number'
                                                                                        ref='DFESlipNumber'
                                                                                        returnKeyType='next'
                                                                                        //keyboardType={"numeric"}
                                                                                        selectionColor={LG_BG_THEME.APPTHEME_BLACK}
                                                                                        underlineColorAndroid='transparent'
                                                                                        placeholderTextColor={LG_BG_THEME.APPTHEME_BLACK}
                                                                                        style={styles.container_Text}
                                                                                        onChangeText={(S3_DFESlipNumber) => this.setState({ S3_DFESlipNumber })}
                                                                                        onSubmitEditing={() => this.refs.Comments.focus()}
                                                                                        value={this.state.S3_DFESlipNumber}

                                                                                    />
                                                                                </View>
                                                                            </View>

                                                                            <View style={styles.Container_EP_3} />

                                                                            <View style={styles.container_TextInputOverview_2}>
                                                                                <View style={{ height: height / 100 * 14, justifyContent: "center", borderRadius: width / 100 * 1, }}>
                                                                                    <View style={{ flex: 1, justifyContent: "center", }}>
                                                                                        <TextInput
                                                                                            placeholder='Comments'
                                                                                            ref='Comments'
                                                                                            returnKeyType='next'
                                                                                            multiline={true}
                                                                                            selectionColor={LG_BG_THEME.APPTHEME_BLACK}
                                                                                            underlineColorAndroid='transparent'
                                                                                            placeholderTextColor={LG_BG_THEME.APPTHEME_BLACK}
                                                                                            style={styles.container_Text}
                                                                                            onChangeText={(S3_Comments) => this.setState({ S3_Comments })}
                                                                                            value={this.state.S3_Comments}
                                                                                        //onSubmitEditing={() => this.refs.Exchange.focus()}
                                                                                        />
                                                                                    </View>
                                                                                </View>
                                                                            </View>
                                                                            <View style={styles.Container_EP_4} />

                                                                            <View style={{ height: height / 100 * 16, justifyContent: "center" }}>
                                                                                <View style={{ flex: 0.45, justifyContent: "center", }}>
                                                                                    <CM_ButtonDesign
                                                                                        CMB_BuutonColourcode={LG_BG_THEME.APPTHEME_Blue}
                                                                                        onPress_BuutonView={() => this.TS3_Method("More")}
                                                                                        CMB_TextHeader={"Save & Add more"}
                                                                                    />
                                                                                </View>

                                                                                <View style={{ flex: 0.1 }} />

                                                                                <View style={{ flex: 0.45, justifyContent: "center", }}>
                                                                                    <CM_ButtonDesign
                                                                                        CMB_BuutonColourcode={LG_BG_THEME.APPTHEME_Blue}
                                                                                        onPress_BuutonView={() => this.TS3_Method("Close")}
                                                                                        CMB_TextHeader={"Save & Close"}
                                                                                    />
                                                                                </View>
                                                                            </View>

                                                                        </View>

                                                                        :

                                                                        this.state.S3_InfoArray.length == 0 ?

                                                                            <View style={{ flex: 1, justifyContent: "center", }}>
                                                                                <Text style={styles.S3_InfoText}>{"Add your other information's"}</Text>
                                                                                <View style={styles.Container_EP_2} />

                                                                                <Text style={styles.S3_InfoText}>{"To Click Add Icon in the Top "}</Text>

                                                                            </View>
                                                                            :

                                                                            <View style={{ flex: 1, }}>

                                                                                <View style={styles.Container_EP_2} />

                                                                                <View style={{ height: height / 100 * 8, justifyContent: "center", backgroundColor: LG_BG_THEME.APPTHEME_2 }}>

                                                                                    <Text style={styles.Bar_HeaderText}>{"Total Selections Added - " + this.state.S3_InfoArray.length}</Text>
                                                                                </View>

                                                                                <View style={styles.Container_EP_1} />

                                                                                <View style={{ height: height / 100 * 6, justifyContent: "center", flexDirection: 'row', opacity: 0.8 }}>
                                                                                    <View style={{ flex: 0.3, justifyContent: 'center', }}>
                                                                                        <Text style={styles.S2_container_BlackText}>{"Section No"}</Text>
                                                                                    </View>
                                                                                    <View style={{ flex: 0.2, justifyContent: 'center', }}>
                                                                                        <Text style={styles.S2_container_BlackText}>{"Dist"}</Text>
                                                                                    </View>
                                                                                    <View style={{ flex: 0.4, justifyContent: 'center', }}>
                                                                                        <Text style={styles.S2_container_BlackText}>{"Blockage"}</Text>
                                                                                    </View>
                                                                                    <View style={{ flex: 0.1, justifyContent: 'center', }} />
                                                                                </View>

                                                                                <View style={styles.Container_EP_1} />

                                                                                {this.state.S3_InfoArray.map((item, index) => (

                                                                                    <View style={{ height: height / 100 * 7, justifyContent: "center", flexDirection: 'row', marginBottom: width / 100 * 3, elevation: Platform.OS == "android" ? width / 100 * 1 : width / 100 * 0.1, shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.2, shadowColor: LG_BG_THEME.APPTHEME_2, }}>
                                                                                        <TouchableOpacity onPress={() => this.Container_Model("Info Items", true, item)} style={{ flex: 0.3, justifyContent: 'center', backgroundColor: LG_BG_THEME.WHITE_THEME, opacity: 0.8 }}>
                                                                                            <Text style={styles.S2_container_BlackText}>{item.section_no}</Text>
                                                                                            <Image source={require('../../../../Asset/Icons/search.png')} style={{ width: width / 100 * 4, height: width / 100 * 4, tintColor: LG_BG_THEME.APPTHEME_1, position: "absolute", marginLeft: width / 100 * 1 }} />

                                                                                        </TouchableOpacity>
                                                                                        <View style={{ flex: 0.2, justifyContent: 'center', backgroundColor: LG_BG_THEME.APPTHEME_GREY_2, }}>
                                                                                            <Text style={styles.S2_container_BlackText}>{item.desiit}</Text>
                                                                                        </View>
                                                                                        <View style={{ flex: 0.4, justifyContent: 'center', backgroundColor: LG_BG_THEME.WHITE_THEME, opacity: 0.8 }}>
                                                                                            <Text style={styles.S2_container_BlackText}>{item.blockage}</Text>
                                                                                        </View>
                                                                                        <TouchableOpacity onPress={() => this.S3_ToggleMethod(item, index)} style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                                                                                            <Image source={require('../../../../Asset/Icons/Delete_Icon.png')} style={{ width: width / 100 * 5, height: width / 100 * 5, tintColor: LG_BG_THEME.APPTHEME_BLACK, }} />
                                                                                        </TouchableOpacity>
                                                                                    </View>
                                                                                ))}

                                                                                <View style={styles.Container_EP_2} />

                                                                                <View style={styles.container_TextInputOverview_2}>
                                                                                    <View style={{ height: height / 100 * 14, justifyContent: "center", borderRadius: width / 100 * 1, }}>
                                                                                        <View style={{ flex: 1, justifyContent: "center", }}>
                                                                                            <TextInput
                                                                                                placeholder='Comments'
                                                                                                ref='Comments'
                                                                                                returnKeyType='next'
                                                                                                multiline={true}
                                                                                                selectionColor={LG_BG_THEME.APPTHEME_BLACK}
                                                                                                underlineColorAndroid='transparent'
                                                                                                placeholderTextColor={LG_BG_THEME.APPTHEME_BLACK}
                                                                                                style={styles.container_Text}
                                                                                                onChangeText={(S3_TextComments) => this.setState({ S3_TextComments })}
                                                                                                value={this.state.S3_TextComments}
                                                                                            //onSubmitEditing={() => this.refs.Exchange.focus()}
                                                                                            />
                                                                                        </View>
                                                                                    </View>
                                                                                </View>

                                                                            </View>


                                                                }
                                                            </View>

                                                        </ScrollView>
                                                    </TouchableWithoutFeedback>

                                                    : this.state.Add_TimesheetScreen == "Step 4" ?
                                                        <View style={{ flex: 1, }}>
                                                            <View style={styles.Container_EP_2} />

                                                            <View style={{ height: height / 100 * 8, justifyContent: "center", backgroundColor: LG_BG_THEME.APPTHEME_2 }}>
                                                                <Text style={styles.Bar_HeaderText}>{"Total Pay for job - £ "}<Text style={styles.Bar_HeaderText}>{this.state.S2_Qty_Amount.toFixed(2)}</Text><Text style={styles.Bar_HeaderText}>{" (Qty -" + this.state.S2_Qty_Count + ")"}</Text></Text>
                                                            </View>
                                                            <View style={styles.Container_EP_2} />
                                                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                                                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>

                                                                    {this.state.S4_CostPercentage.map((item, index) => (

                                                                        <View style={{ flex: 1, justifyContent: "center", }}>

                                                                            <View style={{ height: height / 100 * 6, justifyContent: "center", alignItems: "flex-start", opacity: 0.6, elevation: Platform.OS == "android" ? width / 100 * 1 : width / 100 * 0.1, shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.2, shadowColor: LG_BG_THEME.APPTHEME_2, }}>
                                                                                <Text style={styles.S2_Qty_BMedium}>{this.state.S1_Engineer_DataArray[index].username}</Text>
                                                                            </View>

                                                                            <View style={{ height: height / 100 * 7, justifyContent: "center", flexDirection: "row", marginLeft: width / 100 * 2, marginRight: width / 100 * 2 }}>
                                                                                <View style={{ flex: 1, justifyContent: 'center', backgroundColor: LG_BG_THEME.WHITE_THEME }}>

                                                                                    <TextInput
                                                                                        // placeholder={"% " + (100 / this.state.S1_Engineer_DataArray.length).toFixed(1)}
                                                                                        returnKeyType='go'
                                                                                        //editable={!(item.isClicked)}
                                                                                        maxLength={4}
                                                                                        underlineColorAndroid='transparent'
                                                                                        selectionColor={LG_BG_THEME.APPTHEME_BLACK}
                                                                                        placeholderTextColor={LG_BG_THEME.APPTHEME_BLACK}
                                                                                        style={styles.S2_Qty_BMedium}
                                                                                        onChangeText={text => {
                                                                                            let { S4_CostPercentage } = this.state;
                                                                                            if (text < 101) {
                                                                                                S4_CostPercentage[index] = text;
                                                                                                this.setState({ S4_CostPercentage });
                                                                                            } else {
                                                                                                Snackbar.show({
                                                                                                    title: 'Reached Your Limit..!',
                                                                                                    duration: Snackbar.LENGTH_SHORT,
                                                                                                });
                                                                                            }
                                                                                        }}
                                                                                        onSubmitEditing={() => this.Timesheet_Method("Next")}
                                                                                        value={item}
                                                                                    />
                                                                                </View>

                                                                                <View style={{ flex: 1, justifyContent: 'center', backgroundColor: LG_BG_THEME.APPTHEME_1 }}>
                                                                                    <Text style={styles.S2_Qty_WMedium}>{"£ " + ((this.state.S2_Qty_Amount * item) / 100).toFixed(2)}</Text>
                                                                                </View>
                                                                            </View>
                                                                        </View>
                                                                    ))}


                                                                    <View style={styles.Container_EP_2} />
                                                                </ScrollView>

                                                            </TouchableWithoutFeedback>

                                                        </View>
                                                         :<View style={{ flex: 1, justifyContent: "center" }}>


                                                            <View style={styles.Container_EP_2} />

                                                            <View style={{ flex: 1, justifyContent: 'center', marginLeft: width / 100 * 2, marginRight: width / 100 * 2 }}>

                                                                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                                                    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>

                                                                        <View style={{ flex: 1, justifyContent: "center" }}>

                                                                            <TS_HeadingView
                                                                                ASB_Text={"Dept Info"}
                                                                            />
                                                                            <View style={styles.container_TextInputOverview}>
                                                                                <View style={{ height: height / 100 * 6, justifyContent: "center", borderRadius: width / 100 * 1, }}>
                                                                                    <View style={{ flex: 1, justifyContent: "center", }}>
                                                                                        <Text style={styles.container_Text}>{this.state.S1_Dept_Name}</Text>
                                                                                    </View>
                                                                                </View>
                                                                            </View>


                                                                            <TS_HeadingView
                                                                                ASB_Text={"Job Info"}
                                                                            />

                                                                            <View style={styles.container_TextInputOverview}>
                                                                                <View style={{ height: height / 100 * 6, justifyContent: "center", borderRadius: width / 100 * 1, }}>
                                                                                    <View style={{ flex: 1, justifyContent: "center", }}>
                                                                                        <Text style={styles.container_Text}>{this.state.S1_Job_No}</Text>
                                                                                    </View>
                                                                                </View>
                                                                            </View>


                                                                            <TS_HeadingView
                                                                                ASB_Text={"Exchange"}
                                                                            />

                                                                            <View style={styles.container_TextInputOverview}>
                                                                                <View style={{ height: height / 100 * 6, justifyContent: "center", borderRadius: width / 100 * 1, }}>
                                                                                    <View style={{ flex: 1, justifyContent: "center", }}>
                                                                                        <Text style={styles.container_Text}>{this.state.S1_Exchange}</Text>
                                                                                    </View>
                                                                                </View>
                                                                            </View>


                                                                            <TS_HeadingView
                                                                                ASB_Text={"Worked On"}
                                                                            />

                                                                            <View style={styles.container_TextInputOverview}>
                                                                                <View style={{ height: height / 100 * 6, justifyContent: "center", borderRadius: width / 100 * 1, }}>
                                                                                    <View style={{ flex: 1, justifyContent: "center", }}>
                                                                                        <Text style={styles.container_Text}>{this.state.S1_DateVisible}</Text>
                                                                                    </View>
                                                                                </View>
                                                                            </View>

                                                                            <View style={{ height: height / 100 * 6, justifyContent: "center", flexDirection: 'row' }}>
                                                                                <View style={{ flex: 0.5, justifyContent: "center", }} />
                                                                                <View style={{ flex: 0.45, justifyContent: "center" }}>
                                                                                    <Text style={styles.S1C_ButtonText}>{this.state.SubmitterName}</Text>
                                                                                </View>
                                                                                <View style={{ flex: 0.05, justifyContent: "center", }} />

                                                                            </View>

                                                                            <TS_HeadingView
                                                                                ASB_Text={"Engineers List"}
                                                                            />


                                                                            {this.state.S1_Engineer_DataArray.map((item, index) => (
                                                                                <View style={{ height: height / 100 * 6, justifyContent: "center", elevation: Platform.OS == "android" ? width / 100 * 1 : width / 100 * 0.2, shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.2, shadowColor: LG_BG_THEME.APPTHEME_2, flexDirection: 'row', backgroundColor: LG_BG_THEME.WHITE_THEME, marginBottom: width / 100 * 3 }}>
                                                                                    <View style={{ flex: 0.05, justifyContent: "center", }} />
                                                                                    <View style={{ flex: 0.8, justifyContent: "center" }}>
                                                                                        <Text style={styles.S1_EngineerList_Text}>{item.username}</Text>
                                                                                    </View>
                                                                                    <View style={{ flex: 0.15, justifyContent: "center", alignItems: "center" }}>
                                                                                        {/* <Image source={require('../../../../Asset/Icons/Delete_Icon.png')} style={{ width: width / 100 * 5, height: width / 100 * 5, tintColor: LG_BG_THEME.APPTHEME_1 }} /> */}
                                                                                    </View>
                                                                                </View>
                                                                            ))}


                                                                            <View style={styles.Container_EP_2} />

                                                                            <View style={{ height: height / 100 * 8, justifyContent: "center", backgroundColor: LG_BG_THEME.APPTHEME_2 }}>
                                                                                <Text style={styles.Bar_HeaderText}>{"Total Pay for job - £ "}<Text style={styles.Bar_HeaderText}>{this.state.S2_Qty_Amount.toFixed(2)}</Text><Text style={styles.Bar_HeaderText}>{" (Qty -" + this.state.S2_Qty_Count + ")"}</Text></Text>
                                                                            </View>

                                                                            <View style={styles.Container_EP_3} />

                                                                            <View style={styles.Container_EP_1} />

                                                                            <View style={{ height: height / 100 * 6, justifyContent: "center", flexDirection: 'row', opacity: 0.8 }}>
                                                                                <View style={{ flex: 0.35, justifyContent: 'center', }}>
                                                                                    <Text style={styles.S2_container_BlackText}>{"Code Items"}</Text>
                                                                                </View>
                                                                                <View style={{ flex: 0.3, justifyContent: 'center', }}>
                                                                                    <Text style={styles.S2_container_BlackText}>{"Qty"}</Text>
                                                                                </View>
                                                                                <View style={{ flex: 0.35, justifyContent: 'center', }}>
                                                                                    <Text style={styles.S2_container_BlackText}>{"Price"}</Text>
                                                                                </View>
                                                                            </View>

                                                                            {this.state.S2_QtyArraylist_Preview.map((item, index) => (
                                                                                <View style={{ height: height / 100 * 8, justifyContent: "center", flexDirection: 'row', marginBottom: width / 100 * 3, elevation: Platform.OS == "android" ? width / 100 * 1 : width / 100 * 0.1, shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.2, shadowColor: LG_BG_THEME.APPTHEME_2, marginLeft: width / 100 * 2, marginRight: width / 100 * 2 }}>

                                                                                    <TouchableOpacity onPress={() => this.Container_Model("Code Items", true, item)} style={{ flex: 0.35, justifyContent: 'center', backgroundColor: LG_BG_THEME.APPTHEME_1 }}>
                                                                                        <Text numberOfLines={2} style={styles.S2_Qty_WLMedium}>{" " + item.item_code}</Text>
                                                                                        <Image source={require('../../../../Asset/Icons/search.png')} style={{ width: width / 100 * 3, height: width / 100 * 3, tintColor: LG_BG_THEME.WHITE_THEME, position: "absolute", marginLeft: width / 100 * 1 }} />

                                                                                    </TouchableOpacity>

                                                                                    <View style={{ flex: 0.3, justifyContent: 'center', backgroundColor: LG_BG_THEME.APPTHEME_1, opacity: 0.8 }}>
                                                                                        <Text numberOfLines={2} style={styles.S2_Qty_WMedium}>{item.item_Qty}</Text>
                                                                                    </View>

                                                                                    <View style={{ flex: 0.35, justifyContent: 'center', backgroundColor: LG_BG_THEME.APPTHEME_1 }}>
                                                                                        <View style={{ flex: 0.05, justifyContent: 'center' }} />
                                                                                        <View style={{ flex: 0.45, justifyContent: 'center' }}>
                                                                                            <Text numberOfLines={2} style={styles.S2_Qty_WMedium}>{isNaN((item.cass_sale_price * item.item_Qty).toFixed(2)) == true ? "£ 0.0" : "£ " + (item.cass_sale_price * item.item_Qty).toFixed(2)}</Text>
                                                                                        </View>

                                                                                        <View style={{ flex: 0.45, justifyContent: 'center' }}>
                                                                                            <Text numberOfLines={2} style={styles.S2_Qty_WSmall}>{"£ " + item.cass_sale_price + " (PP)"}</Text>
                                                                                        </View>

                                                                                        <View style={{ flex: 0.05, justifyContent: 'center' }} />

                                                                                    </View>


                                                                                </View>
                                                                            ))}

                                                                            <View style={{ flex: 1, justifyContent: "center" }}>

                                                                                {

                                                                                    this.state.S3_InfoArray.length == 0 ?

                                                                                        <View style={{ flex: 1, justifyContent: "center", }}>
                                                                                            {/* <Text style={styles.S3_InfoText}>{"No other information's Found..!"}</Text> */}
                                                                                            <View style={styles.Container_EP_2} />
                                                                                        </View>
                                                                                        :
                                                                                        <View style={{ flex: 1, }}>

                                                                                            <View style={styles.Container_EP_2} />

                                                                                            <View style={{ height: height / 100 * 8, justifyContent: "center", backgroundColor: LG_BG_THEME.APPTHEME_2 }}>

                                                                                                <Text style={styles.Bar_HeaderText}>{"Total Selections Added - " + this.state.S3_InfoArray.length}</Text>
                                                                                            </View>

                                                                                            <View style={styles.Container_EP_1} />

                                                                                            <View style={{ height: height / 100 * 6, justifyContent: "center", flexDirection: 'row', opacity: 0.8 }}>
                                                                                                <View style={{ flex: 0.3, justifyContent: 'center', }}>
                                                                                                    <Text style={styles.S2_container_BlackText}>{"Section No"}</Text>
                                                                                                </View>
                                                                                                <View style={{ flex: 0.2, justifyContent: 'center', }}>
                                                                                                    <Text style={styles.S2_container_BlackText}>{"Dist"}</Text>
                                                                                                </View>
                                                                                                <View style={{ flex: 0.4, justifyContent: 'center', }}>
                                                                                                    <Text style={styles.S2_container_BlackText}>{"Blockage"}</Text>
                                                                                                </View>
                                                                                                <View style={{ flex: 0.1, justifyContent: 'center', }} />
                                                                                            </View>

                                                                                            <View style={styles.Container_EP_1} />

                                                                                            {this.state.S3_InfoArray.map((item, index) => (

                                                                                                <View style={{ height: height / 100 * 7, justifyContent: "center", flexDirection: 'row', marginBottom: width / 100 * 3, elevation: Platform.OS == "android" ? width / 100 * 1 : width / 100 * 0.1, shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.2, shadowColor: LG_BG_THEME.APPTHEME_2 }}>
                                                                                                    <TouchableOpacity onPress={() => this.Container_Model("Info Items", true, item)} style={{ flex: 0.35, justifyContent: 'center', backgroundColor: LG_BG_THEME.WHITE_THEME, opacity: 0.8 }}>
                                                                                                        <Text style={styles.S2_container_BlackText}>{item.section_no}</Text>

                                                                                                        <Image source={require('../../../../Asset/Icons/search.png')} style={{ width: width / 100 * 4, height: width / 100 * 4, tintColor: LG_BG_THEME.APPTHEME_1, position: "absolute", marginLeft: width / 100 * 1 }} />

                                                                                                    </TouchableOpacity>
                                                                                                    <View style={{ flex: 0.25, justifyContent: 'center', backgroundColor: LG_BG_THEME.APPTHEME_GREY_2, }}>
                                                                                                        <Text style={styles.S2_container_BlackText}>{item.desiit}</Text>
                                                                                                    </View>
                                                                                                    <View style={{ flex: 0.4, justifyContent: 'center', backgroundColor: LG_BG_THEME.WHITE_THEME, opacity: 0.8 }}>
                                                                                                        <Text style={styles.S2_container_BlackText}>{item.blockage}</Text>
                                                                                                    </View>


                                                                                                </View>
                                                                                            ))}

                                                                                            <View style={styles.Container_EP_2} />

                                                                                            <View style={styles.container_TextInputOverview_2}>
                                                                                                <View style={{ height: height / 100 * 12, justifyContent: "center", borderRadius: width / 100 * 1, }}>
                                                                                                    <View style={{ flex: 1, justifyContent: "center", }}>
                                                                                                        <TextInput
                                                                                                            placeholder='Comments'
                                                                                                            ref='Comments'
                                                                                                            returnKeyType='next'
                                                                                                            multiline={true}
                                                                                                            editable={false}
                                                                                                            underlineColorAndroid='transparent'
                                                                                                            placeholderTextColor={LG_BG_THEME.APPTHEME_BLACK}
                                                                                                            style={styles.container_Text}
                                                                                                            onChangeText={(S3_TextComments) => this.setState({ S3_TextComments })}
                                                                                                            value={this.state.S3_TextComments}
                                                                                                        />
                                                                                                    </View>
                                                                                                </View>
                                                                                            </View>

                                                                                        </View>
                                                                                }

                                                                            </View>

                                                                            <View style={{ flex: 1, }}>
                                                                                <View style={styles.Container_EP_2} />

                                                                                <View style={{ height: height / 100 * 8, justifyContent: "center", backgroundColor: LG_BG_THEME.APPTHEME_2 }}>
                                                                                    <Text style={styles.Bar_HeaderText}>{"Total Pay for job - £ "}<Text style={styles.Bar_HeaderText}>{this.state.S2_Qty_Amount.toFixed(2)}</Text><Text style={styles.Bar_HeaderText}>{" (Qty -" + this.state.S2_Qty_Count + ")"}</Text></Text>
                                                                                </View>
                                                                                <View style={styles.Container_EP_2} />

                                                                                {this.state.S4_CostPercentage.map((item, index) => (

                                                                                    <View style={{ flex: 1, justifyContent: "center", }}>

                                                                                        <View style={{ height: height / 100 * 6, justifyContent: "center", alignItems: "flex-start", opacity: 0.6, elevation: Platform.OS == "android" ? width / 100 * 1 : width / 100 * 0.1, shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.2, shadowColor: LG_BG_THEME.APPTHEME_2, }}>
                                                                                            <Text style={styles.S2_Qty_BMedium}>{this.state.S1_Engineer_DataArray[index].username}</Text>
                                                                                        </View>

                                                                                        <View style={{ height: height / 100 * 6, justifyContent: "center", flexDirection: "row", marginLeft: width / 100 * 2, marginRight: width / 100 * 2 }}>
                                                                                            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: LG_BG_THEME.WHITE_THEME }}>
                                                                                                <Text style={styles.S2_Qty_BMedium}>{"% " + (item)}</Text>
                                                                                            </View>

                                                                                            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: LG_BG_THEME.APPTHEME_1 }}>
                                                                                                <Text style={styles.S2_Qty_WMedium}>{"£ " + ((this.state.S2_Qty_Amount * item) / 100).toFixed(2)}</Text>
                                                                                            </View>
                                                                                        </View>
                                                                                    </View>
                                                                                ))}


                                                                                <View style={styles.Container_EP_2} />

                                                                            </View>

                                                                        </View>
                                                                    </ScrollView>

                                                                </TouchableWithoutFeedback>


                                                                <View style={styles.Container_EP_2} />


                                                            </View>

                                                        </View>


                                    }

                                    <View style={styles.Container_EP_2} />

                                    {
                                        this.state.Add_TimesheetScreen == "Step 1" ?
                                            <CM_ButtonDesign
                                                CMB_BuutonColourcode={LG_BG_THEME.APPTHEME_Blue}
                                                onPress_BuutonView={() => this.Timesheet_Method("Next")}
                                                CMB_TextHeader={"Next"}
                                            />
                                            : this.state.Add_TimesheetScreen == "Step 2" ?
                                                <View style={{ height: height / 100 * 8, justifyContent: "center", flexDirection: 'row' }}>
                                                    <View style={{ flex: 0.47, justifyContent: "center", }}>
                                                        <CM_BoxButton
                                                            CMB_BuutonColourcode={LG_BG_THEME.APPTHEME_Blue}
                                                            onPress_BuutonView={() => this.Timesheet_Method("Prev")}
                                                            CMB_TextHeader={"Previous"}
                                                        />
                                                    </View>

                                                    <View style={{ flex: 0.06 }} />

                                                    <View style={{ flex: 0.47, justifyContent: "center", }}>
                                                        <CM_BoxButton
                                                            CMB_BuutonColourcode={LG_BG_THEME.APPTHEME_Blue}
                                                            onPress_BuutonView={() => this.Timesheet_Method("Next")}
                                                            CMB_TextHeader={"Next"}
                                                        />
                                                    </View>
                                                </View>

                                                : this.state.Add_TimesheetScreen == "Step 3" && this.state.S3_Infostatus == false ?
                                                    <View style={{ height: height / 100 * 8, justifyContent: "center", flexDirection: 'row' }}>
                                                        <View style={{ flex: 0.47, justifyContent: "center", }}>
                                                            <CM_BoxButton
                                                                CMB_BuutonColourcode={LG_BG_THEME.APPTHEME_Blue}
                                                                onPress_BuutonView={() => this.Timesheet_Method("Prev")}
                                                                CMB_TextHeader={"Previous"}
                                                            />
                                                        </View>

                                                        <View style={{ flex: 0.06 }} />

                                                        <View style={{ flex: 0.47, justifyContent: "center", }}>
                                                            <CM_BoxButton
                                                                CMB_BuutonColourcode={LG_BG_THEME.APPTHEME_Blue}
                                                                onPress_BuutonView={() => this.Timesheet_Method("Next")}
                                                                CMB_TextHeader={"Next"}
                                                            />
                                                        </View>
                                                    </View>
                                                    : this.state.Add_TimesheetScreen == "Step 4" ?
                                                        <View style={{ height: height / 100 * 8, justifyContent: "center", flexDirection: 'row' }}>


                                                            <View style={{ flex: 0.47, justifyContent: "center", }}>
                                                                <CM_BoxButton
                                                                    CMB_BuutonColourcode={LG_BG_THEME.APPTHEME_Blue}
                                                                    onPress_BuutonView={() => this.Timesheet_Method("Prev")}
                                                                    CMB_TextHeader={"Previous"}
                                                                />
                                                            </View>

                                                            <View style={{ flex: 0.06 }} />
                                                            <View style={{ flex: 0.47, justifyContent: "center", }}>
                                                                <CM_BoxButton
                                                                    CMB_BuutonColourcode={LG_BG_THEME.APPTHEME_DG}
                                                                    onPress_BuutonView={() => this.Timesheet_Method("Preview")}
                                                                    CMB_TextHeader={"Preview"}
                                                                />
                                                            </View>

                                                        </View>


                                                        : this.state.Add_TimesheetScreen == "Step 5" ?
                                                            <View style={{ height: height / 100 * 8, justifyContent: "center", flexDirection: 'row' }}>


                                                                <View style={{ flex: 0.47, justifyContent: "center", }}>
                                                                    <CM_BoxButton
                                                                        CMB_BuutonColourcode={LG_BG_THEME.APPTHEME_Blue}
                                                                        onPress_BuutonView={() => this.Timesheet_Method("Prev")}
                                                                        CMB_TextHeader={"Previous"}
                                                                    />
                                                                </View>

                                                                <View style={{ flex: 0.06 }} />
                                                                <View style={{ flex: 0.47, justifyContent: "center", }}>
                                                                    <CM_BoxButton
                                                                        CMB_BuutonColourcode={LG_BG_THEME.APPTHEME_DG}
                                                                        onPress_BuutonView={() => this.Timesheet_Method("Next")}
                                                                        CMB_TextHeader={"Submit"}
                                                                    />
                                                                </View>

                                                            </View>
                                                            : null
                                    }


                                    <View style={styles.Container_EP_2} />

                                </View>

                            </View>

                    }

                </View>

                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={this.state.S1C_Modal}
                    animationType="slide"
                    onRequestClose={() => { this.setState({ S1C_Modal: false }) }}>

                    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <View style={{ height: "100%", justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: width / 100 * 2, flexDirection: "row" }}>

                                <View style={{ flex: 0.1, }} />
                                <View style={{ flex: 0.8, justifyContent: 'center' }}>

                                    <View style={{ height: width / 100 * 12, justifyContent: 'center', backgroundColor: LG_BG_THEME.APPTHEME_1, borderTopLeftRadius: width / 100 * 2, borderTopRightRadius: width / 100 * 2, }}>
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text numberOfLines={1} style={{ fontSize: fontSize.Medium, fontFamily: fontFamily.Poppins_Bold, letterSpacing: width / 100 * 0.2, color: color.Font_Whitecolor, textAlign: "center" }}>{this.state.S1C_ModalRouteName == "Engineer" ? "Select Engineer" : this.state.S1C_ModalRouteName}</Text>
                                        </View>
                                    </View>

                                    <View style={{ height: height / 100 * 2, backgroundColor: this.state.S1C_ModalRouteName == "Engineer" ? LG_BG_THEME.APPTHEME_BG_2 : LG_BG_THEME.WHITE_THEME }} />

                                    {this.state.S1C_ModalRouteName == "Engineer" ?

                                        <View style={{ height: width / 100 * 10, justifyContent: 'center', backgroundColor: LG_BG_THEME.APPTHEME_BG_2 }}>
                                            <View style={{ flex: 1, justifyContent: 'center', marginLeft: width / 100 * 2, marginRight: width / 100 * 2 }}>
                                                <TextInput
                                                    placeholder='Search...'
                                                    returnKeyType='next'
                                                    underlineColorAndroid='transparent'
                                                    placeholderTextColor={LG_BG_THEME.APPTHEME_BLACK}
                                                    style={styles.container_Text}
                                                    onChangeText={(Search_Text) => this.TextInput_Method(Search_Text, "Engineer")}
                                                />
                                            </View>
                                        </View>
                                        : null

                                    }


                                    <View style={{ height: width / 100 * 70, justifyContent: 'center', backgroundColor: LG_BG_THEME.WHITE_THEME, }}>

                                        {
                                            this.state.S1C_ModalRouteName == "Department" ?
                                                <FlatList style={{ flex: 1 }}
                                                    data={this.state.DeptList_Arraylist}
                                                    showsVerticalScrollIndicator={false}
                                                    keyExtractor={(item, index) => item.key}
                                                    renderItem={({ item, index }) =>
                                                        <TouchableOpacity onPress={() => this.S1C_ToggleMethod(item, "Department")} style={{ flex: 1, justifyContent: "center", marginLeft: height / 100 * 2, marginRight: height / 100 * 2, marginTop: width / 100 * 5, borderBottomColor: LG_BG_THEME.APPTHEME_GREY_2, borderBottomWidth: width / 100 * 0.2 }}>
                                                            <View style={{ flex: 0.05, justifyContent: 'center' }} />
                                                            <View style={{ flex: 0.9, justifyContent: 'center', flexDirection: "row" }}>
                                                                <View style={{ flex: 0.15, justifyContent: 'center', alignItems: "center" }}>
                                                                    <Text numberOfLines={1} style={{ fontSize: fontSize.Medium, fontFamily: fontFamily.Poppins_Regular, letterSpacing: width / 100 * 0.1, color: color.Font_Black, textAlign: "center", marginLeft: width / 100 * 2 }}>{index + 1 + ". "}</Text>
                                                                </View>

                                                                <View style={{ flex: 0.85, justifyContent: 'center' }}>
                                                                    <Text numberOfLines={1} style={{ fontSize: fontSize.Medium, fontFamily: fontFamily.Poppins_Regular, letterSpacing: width / 100 * 0.1, color: color.Font_Black, textAlign: "left", marginLeft: width / 100 * 2 }}>{item.department_name}</Text>
                                                                </View>
                                                            </View>
                                                            <View style={{ flex: 0.05, justifyContent: 'center', alignItems: "center" }} />
                                                        </TouchableOpacity>
                                                    }
                                                />

                                                : this.state.S1C_ModalRouteName == "Engineer" ?

                                                    <FlatList style={{ flex: 1 }}
                                                        data={this.state.Engineer_ArrayList}
                                                        showsVerticalScrollIndicator={false}
                                                        keyExtractor={(item, index) => item.key}
                                                        renderItem={({ item, index }) =>

                                                            <TouchableOpacity onPress={() => this.S1C_ToggleMethod(item, "Engineer")} style={{ flex: 1, justifyContent: "center", marginLeft: height / 100 * 2, marginRight: height / 100 * 2, marginTop: width / 100 * 5, borderBottomColor: LG_BG_THEME.APPTHEME_GREY_2, borderBottomWidth: width / 100 * 0.2 }}>
                                                                <View style={{ flex: 0.05, justifyContent: 'center' }} />
                                                                <View style={{ flex: 0.9, justifyContent: 'center', flexDirection: "row" }}>
                                                                    <View style={{ flex: 0.15, justifyContent: 'center', alignItems: "center" }}>
                                                                        <Text numberOfLines={1} style={{ fontSize: fontSize.Medium, fontFamily: fontFamily.Poppins_Regular, letterSpacing: width / 100 * 0.1, color: color.Font_Black, textAlign: "center", marginLeft: width / 100 * 2 }}>{index + 1 + ". "}</Text>
                                                                    </View>

                                                                    <View style={{ flex: 0.7, justifyContent: 'center' }}>
                                                                        <Text numberOfLines={2} style={{ fontSize: fontSize.Medium, fontFamily: fontFamily.Poppins_Regular, letterSpacing: width / 100 * 0.1, color: color.Font_Black, textAlign: "left", marginLeft: width / 100 * 2 }}>{item.username}</Text>
                                                                    </View>

                                                                    <View style={{ flex: 0.15, justifyContent: 'center', alignItems: "center" }}>
                                                                        <Image source={require('../../../../Asset/Icons/Toggle.png')} style={{ width: width / 100 * 6, height: width / 100 * 6, tintColor: item.isClicked == true ? LG_BG_THEME.APPTHEME_1 : LG_BG_THEME.APPTHEME_BLACK, transform: item.isClicked == true ? [{ rotate: '0deg' }] : [{ rotate: '180deg' }] }} />
                                                                    </View>

                                                                </View>
                                                                <View style={{ flex: 0.05, justifyContent: 'center', alignItems: "center" }} />
                                                            </TouchableOpacity>


                                                        }
                                                    />
                                                    : this.state.S1C_ModalRouteName == "Code Items" ?
                                                        <View style={{ flex: 1, justifyContent: "center", opacity: 0.6, marginLeft: width / 100 * 2 }}>

                                                            <View style={{ height: height / 100 * 6, justifyContent: 'center' }}>
                                                                <Text numberOfLines={2} style={styles.Modal_TextStyle}>{"Code Items : " + this.state.Modal_Itemcode}</Text>
                                                            </View>
                                                            <View style={{ height: height / 100 * 8, justifyContent: 'center' }}>
                                                                <Text numberOfLines={2} style={styles.Modal_TextStyle}>{"Items Description : " + this.state.Modal_ItemDescription}</Text>
                                                            </View>
                                                            <View style={{ height: height / 100 * 6, justifyContent: 'center' }}>
                                                                <Text numberOfLines={2} style={styles.Modal_TextStyle}>{"Items Department : " + this.state.Modal_ItemDept}</Text>
                                                            </View>
                                                            <View style={{ height: height / 100 * 6, justifyContent: 'center' }}>
                                                                <Text numberOfLines={2} style={styles.Modal_TextStyle}>{"Items Price : " + this.state.Modal_ItemPrice + "  (Per Piece)"}</Text>
                                                            </View>

                                                        </View>

                                                        : this.state.S1C_ModalRouteName == "Info Items" ?
                                                            <View style={{ flex: 1, justifyContent: "center", opacity: 0.6, marginLeft: width / 100 * 2 }}>

                                                                <View style={{ height: width / 100 * 8, justifyContent: 'center' }}>
                                                                    <Text numberOfLines={2} style={styles.Modal_TextStyle}>{"Section No : " + this.state.Modal_SectionNo}</Text>
                                                                </View>
                                                                <View style={{ height: width / 100 * 8, justifyContent: 'center' }}>
                                                                    <Text numberOfLines={2} style={styles.Modal_TextStyle}>{"Distance : " + this.state.Modal_Distance}</Text>
                                                                </View>
                                                                <View style={{ height: width / 100 * 8, justifyContent: 'center' }}>
                                                                    <Text numberOfLines={2} style={styles.Modal_TextStyle}>{"Blockage : " + this.state.Modal_Blockage}</Text>
                                                                </View>
                                                                <View style={{ height: width / 100 * 8, justifyContent: 'center' }}>
                                                                    <Text numberOfLines={2} style={styles.Modal_TextStyle}>{"Desiit : " + this.state.Modal_Desiit}</Text>
                                                                </View>
                                                                <View style={{ height: width / 100 * 8, justifyContent: 'center' }}>
                                                                    <Text numberOfLines={2} style={styles.Modal_TextStyle}>{"New Track : " + this.state.Modal_Newtrack}</Text>
                                                                </View>
                                                                <View style={{ height: width / 100 * 8, justifyContent: 'center' }}>
                                                                    <Text numberOfLines={2} style={styles.Modal_TextStyle}>{"Slip No : " + this.state.Modal_SlipNo}</Text>
                                                                </View>
                                                                <View style={{ height: width / 100 * 8, justifyContent: 'center' }}>
                                                                    <Text numberOfLines={2} style={styles.Modal_TextStyle}>{"Slip Comments : " + this.state.Modal_SlipComments}</Text>
                                                                </View>
                                                            </View>

                                                            : null
                                        }

                                    </View>

                                    <View style={{ height: width / 100 * 12, justifyContent: 'center', backgroundColor: LG_BG_THEME.APPTHEME_1, borderBottomLeftRadius: width / 100 * 2, borderBottomRightRadius: width / 100 * 2, flexDirection: 'row', borderWidth: width / 100 * 0.2, borderColor: LG_BG_THEME.APPTHEME_1 }}>
                                        <TouchableOpacity onPress={() => this.Container_Model("", false, "")} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text numberOfLines={1} style={{ fontSize: fontSize.Medium, fontFamily: fontFamily.Poppins_Bold, letterSpacing: width / 100 * 0.2, color: color.Font_Whitecolor, textAlign: "center" }}>{"Submit"}</Text>
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
                    visible={this.state.Calendar_Modal}
                    animationType="slide"
                    onRequestClose={() => { this.setState({ Calendar_Modal: false }) }}>

                    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <View style={{ height: "100%", justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: width / 100 * 2, flexDirection: "row" }}>

                                <View style={{ flex: 0.1, }} />
                                <View style={{ flex: 0.8, justifyContent: 'center' }}>

                                    <View style={{ height: width / 100 * 12, justifyContent: 'center', alignSelf: 'center', backgroundColor: LG_BG_THEME.APPTHEME_1, borderTopLeftRadius: width / 100 * 2, borderTopRightRadius: width / 100 * 2, flexDirection: 'row' }}>
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text numberOfLines={1} style={{ fontSize: fontSize.Medium, fontFamily: fontFamily.Poppins_Regular, letterSpacing: width / 100 * 0.1, color: color.Font_Whitecolor, textAlign: "center" }}>{this.state.S1_DateVisible}</Text>
                                        </View>

                                    </View>

                                    <View style={{ height: width / 100 * 80, justifyContent: 'center', backgroundColor: LG_BG_THEME.WHITE_THEME, }}>

                                        <CalendarPicker
                                            startFromMonday={false}
                                            allowRangeSelection={false}
                                            // format={"DD-MMMM-YY"}
                                            selectedStartDate={this.state.S1_Date}
                                            //initialDate={this.state.Leave_StartDate}
                                            minDate={new Date(new Date().getTime() - (86400000 * 30))}
                                            maxDate={new Date(new Date().getTime())}
                                            // weekdays={['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']}
                                            // months={['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']}
                                            previousTitle="<"
                                            nextTitle=">"
                                            enableSwipe={true}
                                            dayShape={"square"}
                                            todayBackgroundColor={LG_BG_THEME.APPTHEME_1}
                                            selectedDayColor={LG_BG_THEME.APPTHEME_2}
                                            selectedDayTextColor={LG_BG_THEME.WHITE_THEME}
                                            scaleFactor={375}
                                            width={width / 100 * 70}
                                            height={height / 100 * 50}
                                            textStyle={{
                                                fontFamily: fontFamily.Poppins_Regular,
                                                color: LG_BG_THEME.APPTHEME_BLACK,
                                            }}
                                            onDateChange={(Date) => this.onDateChange(Date)}
                                        />



                                    </View>

                                    <View style={{ height: width / 100 * 12, justifyContent: 'center', alignSelf: 'center', backgroundColor: LG_BG_THEME.APPTHEME_1, borderBottomLeftRadius: width / 100 * 2, borderBottomRightRadius: width / 100 * 2, flexDirection: 'row' }}>

                                        <TouchableOpacity onPress={() => this.Caleder_Model(false)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text numberOfLines={1} style={{ fontSize: fontSize.Medium, fontFamily: fontFamily.Poppins_Bold, letterSpacing: width / 100 * 0.1, color: color.Font_Whitecolor, textAlign: "center", }}>{"Submit"}</Text>
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

    Container_EP_1: {
        height: height / 100 * 1
    },
    Container_EP_3: {
        height: height / 100 * 3
    },
    Container_EP_2: {
        height: height / 100 * 2
    },
    Container_EP_4: {
        height: height / 100 * 4
    },

    container_Text: {
        fontSize: fontSize.lightMedium,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.APPTHEME_BLACK,
        marginLeft: width / 100 * 2
    },
    container_WhiteText: {
        fontSize: fontSize.lightMedium,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.WHITE_THEME,
        marginLeft: width / 100 * 2
    },
    container_TextInputOverview: {
        height: height / 100 * 8,
        justifyContent: "center",
        backgroundColor: LG_BG_THEME.WHITE_THEME,
        elevation: Platform.OS == "android" ? width / 100 * 1 : width / 100 * 0.2,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowColor: LG_BG_THEME.APPTHEME_2,
    },
    container_TextInputOverview_2: {
        height: height / 100 * 16,
        justifyContent: "center",
        backgroundColor: LG_BG_THEME.WHITE_THEME,
        elevation: Platform.OS == "android" ? width / 100 * 1 : width / 100 * 0.2,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowColor: LG_BG_THEME.APPTHEME_2,
    },
    container_HeaderText: {
        fontSize: fontSize.Large,
        fontFamily: fontFamily.Poppins_SemiBold,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.APPTHEME_BLACK,
        textAlign: "center"
    },
    S1C_ButtonText: {
        fontSize: fontSize.lightMedium,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.APPTHEME_BLACK,
        textAlign: "right"
    },
    S1_EngineerList_Text: {
        fontSize: fontSize.Medium,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.APPTHEME_BLACK,
        textAlign: "left",
    },

    // Header_container: {
    //     zIndex: 1000,
    //     justifyContent: "center",
    //     alignItems: "center",
    //     position: 'absolute',
    //     bottom: height / 100 * 5,
    //     right: width / 100 * 5
    // },
    // Header_Innercontainer: {
    //     backgroundColor: LG_BG_THEME.APPTHEME_1,
    //     justifyContent: 'center',
    //     alignItems: "center",
    //     height: height / 100 * 6,
    //     width: height / 100 * 6,
    //     borderRadius: height / 100 * 3,
    //     elevation: Platform.OS == "android" ? width / 100 * 1 : width / 100 * 0.1,
    //     shadowOffset: { width: 2, height: 2 },
    //     shadowOpacity: 0.2,
    //     shadowColor: LG_BG_THEME.APPTHEME_2,
    // },



    S2_Qty_WSmall: {
        fontSize: fontSize.verySmall_75,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.WHITE_THEME,
        textAlign: 'center',

    },
    S2_Qty_BSmall: {
        fontSize: fontSize.verySmall_75,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.APPTHEME_BLACK,
        textAlign: 'center',

    },
    S2_Qty_WMedium: {
        fontSize: fontSize.Medium,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.WHITE_THEME,
        textAlign: 'center',

    },
    S2_Qty_BMedium: {
        fontSize: fontSize.Medium,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.APPTHEME_BLACK,
        textAlign: 'center',

    },
    S2_Qty_WLMedium: {
        fontSize: fontSize.lightMedium,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.WHITE_THEME,
        textAlign: 'center',

    },
    S2_Qty_BLMedium: {
        fontSize: fontSize.lightMedium,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.APPTHEME_BLACK,
        textAlign: 'center',

    },
    S2_container_BlackText: {
        fontSize: fontSize.lightMedium,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.APPTHEME_BLACK,
        textAlign: 'center',

    },


    Bar_HeaderText: {
        fontSize: fontSize.Medium,
        fontFamily: fontFamily.Poppins_SemiBold,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.WHITE_THEME,
        textAlign: 'center',
    },
    S3_container_Blockage: {
        fontSize: fontSize.lightMedium_50,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.WHITE_THEME,
        textAlign: 'center',

    },
    S3_InfoText: {
        fontSize: fontSize.Large,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.2,
        color: LG_BG_THEME.APPTHEME_BLACK,
        textAlign: 'center',
    },

    S4_InfoPercentage: {
        fontSize: fontSize.Medium,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.APPTHEME_BLACK,
        textAlign: 'center',
    },
    S4_InfoName: {
        fontSize: fontSize.Medium,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.WHITE_THEME,
        textAlign: 'center',
    },
    container_S5Text: {
        fontSize: fontSize.ExtraLarge_plus,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.WHITE_THEME,
        textAlign: 'center',
    },
    Modal_TextStyle: {
        fontSize: fontSize.lightMedium,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.1,
        color: color.Font_Black,
        textAlign: "left",
        marginLeft: width / 100 * 2
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
export default connect(mapStateToProps, mapDispatchToProps)(AddMore_Timesheet);

//Edit Timesheets..

 // S2_ToggleMethod(Route_Data, S2_Quatitylist_Response) {
    //     const { S2_Quatitylist_AR, S2_QtyArraylist } = this.state;
    //     var Qty_count = 0
    //     var Qty_Amount = 0

    //     for (i = 0; i < S2_Quatitylist_Response.length; i++) {
    //         if (S2_Quatitylist_Response[i].id == Route_Data.id) {
    //             if (S2_Quatitylist_Response[i].isClicked == false) {
    //                 S2_Quatitylist_Response[i].isClicked = true
    //                 S2_Quatitylist_AR[i].isClicked = true
    //                 S2_QtyArraylist[i].id = Route_Data.id

    //                 if (this.state.S2_TextQty[i] != undefined) {
    //                     S2_QtyArraylist[i].qty = (this.state.S2_TextQty[i] == undefined ? 0 : this.state.S2_TextQty[i]),
    //                         S2_QtyArraylist[i].price = (S2_Quatitylist_Response[i].cass_sale_price)
    //                     Qty_count = parseInt(this.state.S2_TextQty[i])
    //                     Qty_Amount = parseFloat((this.state.S2_TextQty[i] * S2_Quatitylist_Response[i].cass_sale_price))
    //                 }

    //                 this.setState({ S2_QtyArraylist: Array.from(new Set(this.state.S2_QtyArraylist)) })
    //             } else {

    //                 S2_Quatitylist_Response[i].isClicked = false;
    //                 S2_Quatitylist_AR[i].isClicked = false
    //                 S2_QtyArraylist[i].id = "0",
    //                     S2_QtyArraylist[i].qty = "0",
    //                     S2_QtyArraylist[i].price = "0.0"
    //                 if (this.state.S2_TextQty[i] != undefined) {

    //                     Qty_count = - parseInt((this.state.S2_TextQty[i] == undefined ? 0 : this.state.S2_TextQty[i]))
    //                     Qty_Amount = - parseFloat(((this.state.S2_TextQty[i] == undefined ? 0 : this.state.S2_TextQty[i]) * S2_Quatitylist_Response[i].cass_sale_price))
    //                 }
    //                 this.setState({ S2_QtyArraylist: Array.from(new Set(this.state.S2_QtyArraylist)) })
    //             }
    //         }
    //     }

    //     // var C2_QtyArraylist = []
    //     // for (let i = 0; i < this.state.S2_QtyArraylist.length; i++) {
    //     //     if (this.state.S2_QtyArraylist[i].id != 0) {
    //     //         C2_QtyArraylist.push(this.state.S2_QtyArraylist[i])
    //     //     }
    //     // }

    //     var C2_QtyArraylistFinal = []
    //     // for (let i = 0; i < C2_QtyArraylist.length; i++) {
    //     //     if (C2_QtyArraylist[i].qty != undefined) {
    //     //         C2_QtyArraylistFinal.push(C2_QtyArraylist[i])
    //     //     }
    //     // }

    //     this.setState({
    //         S2_QtyArraylist: Array.from(new Set(this.state.S2_QtyArraylist)),
    //         S2_Qty_Count: this.state.S2_Qty_Count + (isNaN(parseInt(Qty_count)) == true ? 0 : parseInt(Qty_count)),
    //         S2_Qty_Amount: this.state.S2_Qty_Amount + (isNaN(parseFloat(Qty_Amount)) == true ? 0.0 : parseFloat(Qty_Amount)),
    //         //Total_IteamCount:C2_QtyArraylistFinal.length
    //     })



    //     this.forceUpdate()
    // }


    // Total_Amountcalculation() {

    //     const { S2_Quatitylist_Response, S2_QtyArraylist } = this.state;

    //     try {
    //         for (i = 0; i < S2_Quatitylist_Response.length; i++) {
    //             if (S2_Quatitylist_Response[i].isClicked == true) {
    //                 S2_QtyArraylist[i].qty = this.state.S2_TextQty[i]
    //                 S2_QtyArraylist[i].price = S2_Quatitylist_Response[i].cass_sale_price
    //                 this.setState({ S2_QtyArraylist: Array.from(new Set(this.state.S2_QtyArraylist)) })
    //             }
    //         }
    //         let Results_qty = 0
    //         let Results_Amount = 0
    //         for (let i = 0; i < S2_QtyArraylist.length; i++) {
    //             Results_qty += isNaN(parseInt(S2_QtyArraylist[i].qty)) == true ? 0 : parseInt(S2_QtyArraylist[i].qty)
    //             Results_Amount += isNaN(parseFloat(S2_QtyArraylist[i].qty * S2_QtyArraylist[i].price)) == true ? 0 : parseFloat(S2_QtyArraylist[i].qty * S2_QtyArraylist[i].price)
    //         }

    //         // var C2_QtyArraylist = []
    //         // for (let i = 0; i < this.state.S2_QtyArraylist.length; i++) {
    //         //     if (this.state.S2_QtyArraylist[i].id != 0) {
    //         //         C2_QtyArraylist.push(this.state.S2_QtyArraylist[i])
    //         //     }
    //         // }

    //         var C2_QtyArraylistFinal = []
    //         // for (let i = 0; i < C2_QtyArraylist.length; i++) {
    //         //     if (C2_QtyArraylist[i].qty != undefined) {
    //         //         C2_QtyArraylistFinal.push(C2_QtyArraylist[i])
    //         //     }
    //         // }

    //         this.setState({
    //             S2_QtyArraylist: Array.from(new Set(this.state.S2_QtyArraylist)),
    //             S2_Qty_Count: Results_qty,
    //             S2_Qty_Amount: Results_Amount,
    //             //Total_IteamCount:C2_QtyArraylistFinal.length
    //         })
    //     } catch (err) {

    //     }

    //     this.forceUpdate()
    // }


    // async Qty_ListMethod(Route_Data, CassUserID, CassRoleID) {

    //     const Quatitylist_Response = await this._fetch_QtyInfo(CassUserID, CassRoleID)
    //     let QtyInfo_Array = Quatitylist_Response.User_QtyInfo.filter(item => item.department_id == Route_Data)

    //     let QtyInfo_Arraylist = []
    //     let QtyInfo_TextQty = []
    //     let QtyInfo_TextQtyList = []

    //     let Sel_QtyInfo_Arraylist = []
    //     let Sel_QtyInfo_TextQty = []
    //     let Sel_QtyInfo_TextQtyList = []


    //     for (let j = 0; j < this.state.S2_QtyArraylist_Response.length; j++) {
    //         for (let i = 0; i < QtyInfo_Array.length; i++) {
    //             if (QtyInfo_Array[i].id == this.state.S2_QtyArraylist_Response[j].id) {
    //                 Sel_QtyInfo_Arraylist.push({
    //                     "id": QtyInfo_Array[i].id,
    //                     "item_code": QtyInfo_Array[i].item_code,
    //                     "item_description": QtyInfo_Array[i].item_description,
    //                     "engineer_pay_price": QtyInfo_Array[i].engineer_pay_price,
    //                     "cass_sale_price": QtyInfo_Array[i].cass_sale_price,
    //                     "item_label": QtyInfo_Array[i].item_label,
    //                     "department_id": QtyInfo_Array[i].department_id,
    //                     "status": QtyInfo_Array[i].status,
    //                     "department_name": QtyInfo_Array[i].department_name,
    //                     "department_ids": QtyInfo_Array[i].department_ids,
    //                     "isClicked": true,
    //                     "Is_QtyCount": this.state.S2_QtyArraylist_Response[j].qty
    //                 })
    //                 this.state.S2_Selected_QuantityId.push(QtyInfo_Array[i].id)
    //                 Sel_QtyInfo_TextQty.push(this.state.S2_QtyArraylist_Response[j].qty)
    //                 Sel_QtyInfo_TextQtyList.push({
    //                     "id": this.state.S2_QtyArraylist_Response[j].id,
    //                     "qty": this.state.S2_QtyArraylist_Response[j].qty,
    //                     "price": this.state.S2_QtyArraylist_Response[j].price
    //                 })
    //             }
    //             this.state.S2_Overall_QuantityId.push(QtyInfo_Array[i].id)
    //         }
    //     }

    //     this.setState({
    //         S2_UnSelected_QuantityId: this.state.S2_Overall_QuantityId.filter(n => !this.state.S2_Selected_QuantityId.includes(n))
    //     })

    //     for (let j = 0; j < this.state.S2_UnSelected_QuantityId.length; j++) {
    //         for (let i = 0; i < QtyInfo_Array.length; i++) {
    //             if (QtyInfo_Array[i].id == this.state.S2_UnSelected_QuantityId[j]) {
    //                 QtyInfo_Arraylist.push({
    //                     "id": QtyInfo_Array[i].id,
    //                     "item_code": QtyInfo_Array[i].item_code,
    //                     "item_description": QtyInfo_Array[i].item_description,
    //                     "engineer_pay_price": QtyInfo_Array[i].engineer_pay_price,
    //                     "cass_sale_price": QtyInfo_Array[i].cass_sale_price,
    //                     "item_label": QtyInfo_Array[i].item_label,
    //                     "department_id": QtyInfo_Array[i].department_id,
    //                     "status": QtyInfo_Array[i].status,
    //                     "department_name": QtyInfo_Array[i].department_name,
    //                     "department_ids": QtyInfo_Array[i].department_ids,
    //                     "isClicked": false,
    //                     "Is_QtyCount": 0
    //                 })
    //                 QtyInfo_TextQty.push(0)
    //                 QtyInfo_TextQtyList.push({ "id": 0, "qty": 0, "price": 0 })
    //             }

    //         }
    //     }


    //     this.setState({
    //         S2_Quatitylist_Response: Array.from(new Set(Sel_QtyInfo_Arraylist.concat(QtyInfo_Arraylist))),
    //         S2_TextQty: Array.from(new Set(Sel_QtyInfo_TextQty.concat(QtyInfo_TextQty))),
    //         S2_QtyArraylist: Array.from(new Set(Sel_QtyInfo_TextQtyList.concat(QtyInfo_TextQtyList))),
    //     })

    //     this.setState({
    //         S2_TextQty: Array.from(new Set(this.state.S2_TextQty)),
    //         S2_QtyArraylist: Array.from(new Set(this.state.S2_QtyArraylist)),
    //         S2_Quatitylist_Response: Array.from(new Set(this.state.S2_Quatitylist_Response)),
    //     })

    //     this.forceUpdate()

    //     this.setState({
    //         S2_Quatitylist_Response: Array.from(new Set(this.state.S2_Quatitylist_Response)),
    //         S2_Quatitylist_AR: this.state.S2_Quatitylist_Response
    //     })

    // }



    // var C2_QtyArraylist = []
    // for (let i = 0; i < this.state.S2_QtyArraylist.length; i++) {
    //     if (this.state.S2_QtyArraylist[i].id != 0) {
    //         C2_QtyArraylist.push(this.state.S2_QtyArraylist[i])
    //     }
    // }

    // var C2_QtyArraylistFinal = []
    // for (let i = 0; i < C2_QtyArraylist.length; i++) {
    //     if (C2_QtyArraylist[i].qty != undefined) {
    //         C2_QtyArraylistFinal.push({
    //             "id": this.state.S2_Quatitylist_Response[i].id,
    //             "item_code": this.state.S2_Quatitylist_Response[i].item_code,
    //             "item_description": this.state.S2_Quatitylist_Response[i].item_description,
    //             "engineer_pay_price": this.state.S2_Quatitylist_Response[i].engineer_pay_price,
    //             "cass_sale_price": this.state.S2_Quatitylist_Response[i].cass_sale_price,
    //             "item_label": this.state.S2_Quatitylist_Response[i].item_label,
    //             "department_id": this.state.S2_Quatitylist_Response[i].department_id,
    //             "status": this.state.S2_Quatitylist_Response[i].status,
    //             "department_name": this.state.S2_Quatitylist_Response[i].department_name,
    //             "department_ids": this.state.S2_Quatitylist_Response[i].department_ids,
    //             "item_Qty": this.state.S2_QtyArraylist[i].qty,
    //         })
    //     }
    // }



    // var C2_QtyArraylist = []
    // for (let i = 0; i < this.state.S2_QtyArraylist.length; i++) {
    //     if (this.state.S2_QtyArraylist[i].id != 0) {
    //         C2_QtyArraylist.push(this.state.S2_QtyArraylist[i])
    //     }
    // }

    // var C2_QtyArraylistFinal = []
    // for (let i = 0; i < C2_QtyArraylist.length; i++) {
    //     if (C2_QtyArraylist[i].qty != undefined) {
    //         C2_QtyArraylistFinal.push(C2_QtyArraylist[i])
    //     }
    // }