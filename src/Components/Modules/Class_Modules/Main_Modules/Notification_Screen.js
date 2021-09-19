import React, { Component, PureComponent } from 'react'
import {
    StyleSheet, Text, Keyboard, AsyncStorage, FlatList,
    View, TouchableOpacity, Image, SafeAreaView, ImageBackground, BackHandler, Alert, Platform, Modal, TextInput, ScrollView, TouchableWithoutFeedback
} from 'react-native'
import { color, width, fontSize, fontFamily, height, LG_BG_THEME, Notify_THEME } from '../../../Constants/fontsAndColors'
import { Container, Content, connect, Picker, Header, LinearGradient, Snackbar, Splash_screen, base64,Moment } from '../../../../Asset/Libraries/NpmList';
import { Mystatusbar } from '../../../../Asset/Libraries/index'

import Notification_list from '../Extra_Modules/Notification_list.json'

import { AS_HeaderDesign } from '../../CommonView_Modules/AS_HeaderDesign'
import { CardList_Design } from '../../CommonView_Modules/CardList_Design'
import { Modal_Text } from '../../CommonView_Modules/Modal_Text'
import { Notification_Count } from '../../../../Redux/Actions/Notification_Count'

import { Cass_AuthDetails, Cass_APIDetails, User_Readstatus, Notification_List } from '././../../../Config/Server'
import { Spinner } from '../../../Config/Spinner';

class Notification_Screen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Notify_ResponseArray: [],
            Info_Modal: false,
            CassUserID: "",
            CassRoleID: "",
            Dashboard_Fetching: false,
            Notification_count: 0
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
    }

    async _fetchdata(Token_Result, Token_RoleID) {
        const NotifyInfo_Response = await this._fetch_NotifyInfo(Token_Result, Token_RoleID);

        try {
            this.setState({
                Notify_ResponseArray: NotifyInfo_Response.Notify_Info == undefined ? [] : NotifyInfo_Response.Notify_Info,
                Dashboard_Fetching: false,
            })
            let count = 0
            for (let i = 0; i < NotifyInfo_Response.Notify_Info.length; i++) {
                if (NotifyInfo_Response.Notify_Info[i].status == 1) {
                    count = ++count
                }
            }
            this.setState({ Notification_count: count })
            this.props.Notification_Count(Count)

        } catch (err) {
            this.setState({ Dashboard_Fetching: false });
        }
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
                    resolve("")
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
            this.props.navigation.navigate("Dashboard")
        } else {

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

                        this.props.navigation.navigate("Timesheet_List", {
                            CalendarDate: "",
                            Job_Number: "",
                            Job_IDNumber: RouteName.from_table_id
                        });
                        this.componentDidMount()
                    } else {
                        Snackbar.show({
                            title: Jsonresponse.message + "..!",
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
        }

    }

    Container_Model(RouteName) {
        this.setState({ Info_Modal: RouteName })
    }

    async Container_Reset() {

        this.setState({
            Notify_ResponseArray: [],
            Notification_count: 0,
            Dashboard_Fetching: true
        });
        setTimeout(() => {
            this._fetchdata(this.state.CassUserID, this.state.CassRoleID)
        }, 1000)
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
            <LinearGradient key="background" start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[LG_BG_THEME.APPTHEME_BG_2, LG_BG_THEME.APPTHEME_BG_2]} style={{ flex: 1, justifyContent: "center" }} >
                {spinner}
                <Mystatusbar />
                <View style={{ flex: 1 }}>
                    <AS_HeaderDesign
                        Onpress_LeftIcon={() => this.Container_Method("Goback")}
                        Onpress_RightIcon={() => this.Container_Model(true)}
                        Header_Text={"NOTIFICATIONS"}
                        RightIcon_Status={"Info"}
                        LeftIcon_Status={true}
                    />

                    <View style={{ flex: 0.05 }} />

                    <View style={{ flex: 0.95, marginTop: width / 100 * 2 }}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                            {this.state.Notify_ResponseArray.length == 0 ?
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={styles.container_EmptyText}>{"No Notification Found..!"}</Text>
                                </View>
                                :
                                <FlatList style={{ flex: 1, }}
                                    data={this.state.Notify_ResponseArray}
                                    showsVerticalScrollIndicator={false}
                                    keyExtractor={(item, index) => item.key}
                                    onRefresh={() => this.Container_Reset()}
                                    refreshing={this.state.Dashboard_Fetching}
                                    renderItem={({ item, index }) =>
                                        <CardList_Design
                                            CardList_Method={() => this.Container_Method(item)}
                                            Card_BG={parseInt(item.notify_color_status) == 1 ? Notify_THEME.AW_SUPERADMIN :
                                                parseInt(item.notify_color_status) == 2 ? Notify_THEME.AW_ADMIN :
                                                    parseInt(item.notify_color_status) == 3 ? Notify_THEME.AW_FINANCE :
                                                        parseInt(item.notify_color_status) == 4 ? Notify_THEME.AW_APPROVED : Notify_THEME.AW_REJECTED}
                                            CardText_Header1={"Job No : "}
                                            CardText_1={item.job_no}
                                            CardText_ID={item.from_table_id}
                                            CardText_HeaderID={"Timesheet Id : "}
                                            CardText_Header2={"Status : "}
                                            CardText_status={item.status == 1 ? true : false}
                                            CardText_2={item.notify_message}
                                            CardText_Header3={item.reason == null ? "By :" : "Reason : "}
                                            CardText_3={item.reason == null ? item.submitter_name : item.reason}
                                            CardText_Header4={"Date : "}
                                            CardText_4={Moment(item.created_at).format('D-MMMM-YY') + " at " + Moment(item.created_at).format("h A")}
                                        />
                                    }
                                />
                            }
                        </TouchableWithoutFeedback>
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
                                            <Text numberOfLines={1} style={{ fontSize: fontSize.Medium, fontFamily: fontFamily.Poppins_Bold, letterSpacing: width / 100 * 0.1, color: color.Font_Whitecolor, textAlign: "center" }}>{"COLOUR INFO"}</Text>
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

    Container_EP_2: {
        height: height / 100 * 2
    },
    container_EmptyText: {
        fontSize: fontSize.Medium,
        fontFamily: fontFamily.Poppins_Bold,
        letterSpacing: width / 100 * 0.1,
        color: LG_BG_THEME.APPTHEME_BLACK,
        marginLeft: width / 100 * 2,
    },

});

const mapStateToProps = (state) => {
    return {
        CommonReducer: state.CommonReducer
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        Notification_Count: (NotificationCount) => { dispatch(Notification_Count(NotificationCount)); },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Notification_Screen);
