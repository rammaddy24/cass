import React, { Component, PureComponent } from 'react'
import {
    StyleSheet, Text, Keyboard, AsyncStorage, FlatList,
    View, TouchableOpacity, Image, SafeAreaView, ImageBackground, BackHandler, Alert, Platform, Modal, TextInput, ScrollView, TouchableWithoutFeedback
} from 'react-native'
import { color, width, fontSize, fontFamily, height, LG_BG_THEME, Notify_THEME } from '../../../Constants/fontsAndColors'
import { Container, Content, connect, Picker, Header, LinearGradient, Snackbar, Splash_screen, Moment, base64 } from '../../../../Asset/Libraries/NpmList';
import { Mystatusbar } from '../../../../Asset/Libraries/index'

import { AS_HeaderDesign } from '../../CommonView_Modules/AS_HeaderDesign'
import { Card_leavelist } from '../../CommonView_Modules/Card_leavelist'
import { Modal_Text } from '../../CommonView_Modules/Modal_Text'

import { Cass_APIDetails, Cass_AuthDetails, List_Leave } from '././../../../Config/Server'
import { Spinner } from '../../../Config/Spinner';

class LeaveTaken_List extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Leavelist_ResponseArray: [],
            TimeSheets_Array: [],
            StartDate: '',
            CassUserID: "",
            CassRoleID: '',
            Leave_SD: "",
            Dashboard_Fetching: false,
            JobNumber: "",
            Pagination_Status:1
        };
        this.onEndReachedCalledDuringMomentum = true;

    }

    componentDidMount() {
        const { state } = this.props.navigation;
        let Calendar_Date = state.params.CalendarDate

        this.setState({
            StartDate: Calendar_Date == "" ? "" : Moment(Calendar_Date).format('DD-MMM-YY'),
            Leave_SD: Calendar_Date == "" ? "" : Moment(Calendar_Date).format('YYYY-MM-DD'),
        })
        AsyncStorage.getItem("Cass_UserID", (error, Token_Result) => {
            if (Token_Result != "0" || Token_Result != null) {
                AsyncStorage.getItem("Cass_RoleID", (error, Token_RoleID) => {
                    if (Token_RoleID != "0" || Token_RoleID != null) {
                        this.setState({ CassUserID: Token_Result, CassRoleID: Token_RoleID, Dashboard_Fetching: true }, () => this._fetchdata(Token_Result, Token_RoleID,1));
                    }
                })
            }
        })
    }


    async _fetchdata(Token_Result, Token_RoleID,Pagination_Status) {
        const Timesheets_Response = await this._fetch_TSInfo(Token_Result, Token_RoleID,Pagination_Status);
        try {

            this.setState({
                Leavelist_ResponseArray: Timesheets_Response.TS_Info == undefined ? [] : Timesheets_Response.TS_Info,
                Dashboard_Fetching: false
            })
        } catch (err) {
            this.setState({ Dashboard_Fetching: false });
        }
    }


    async _fetchEnddata(Token_Result, Token_RoleID,Pagination_Status) {
        const Timesheets_Response = await this._fetch_TSInfo(Token_Result, Token_RoleID,Pagination_Status);
        try {

            this.setState({
                Leavelist_ResponseArray: Array.from(new Set(Array.from(new Set(this.state.Leavelist_ResponseArray)).concat(Array.from(new Set(Timesheets_Response.TS_Info == undefined ? [] : Timesheets_Response.TS_Info))))),
                Dashboard_Fetching: false
            })
        } catch (err) {
            this.setState({ Dashboard_Fetching: false });
        }
    }


    _fetch_TSInfo(Token_Result, Token_RoleID,Pagination_Status) {
        return new Promise((resolve, reject) => {
            let TSDate_URL = (List_Leave + Token_Result + "&user_role=" + Token_RoleID + "&date=" + this.state.Leave_SD +"&pagination="+Pagination_Status);

            fetch(TSDate_URL, {
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
                        this.setState({ Dashboard_Fetching: false });
                        Snackbar.show({
                            title: Jsonresponse.message,
                            duration: Snackbar.LENGTH_SHORT,
                        });
                        resolve(TS_Info)
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

    Container_Method(RouteName, Route_Data) {
        if (RouteName == "Goback") {
            this.props.navigation.goBack()
        }
    }

    onRefresh_End() {
        this.setState({ Dashboard_Fetching: true , Pagination_Status : ++this.state.Pagination_Status}, () => this._fetchEnddata(this.state.CassUserID, this.state.CassRoleID,++this.state.Pagination_Status));
    }

    async Container_Reset() {

        this.setState({
            Leavelist_ResponseArray: [],
            Pagination_Status: 1,
            Dashboard_Fetching: true
        });
        setTimeout(() => {
            this.setState({ Dashboard_Fetching: true }, () => this._fetchEnddata(this.state.CassUserID, this.state.CassRoleID,1));
        }, 1000)
        this.forceUpdate()

    }
    Floating_Button() {
        this.props.navigation.navigate("Add_Leave", {
            CalendarDate: Moment(new Date(new Date().getTime())).format('YYYY-MM-DD'),
        });
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

                <Mystatusbar />
                <View style={{ flex: 1 }}>
                    <AS_HeaderDesign
                        Onpress_LeftIcon={() => this.Container_Method("Goback")}
                        Header_Text={"LEAVE TAKEN"}
                        RightIcon_Status={false}
                        LeftIcon_Status={true}
                    />

                    <View style={{ flex: 0.02 }} />
                    <View style={styles.Container_EP_2} />

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
                            <Text style={styles.container_TabText}>{"Total Leave - " + this.state.Leavelist_ResponseArray.length}</Text>
                        </View>
                    </View>

                    <View style={{ flex: 0.9, marginTop: width / 100 * 2, marginLeft: width / 100 * 6, marginRight: width / 100 * 6 }}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                            {this.state.Leavelist_ResponseArray.length == 0 ?
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={styles.container_EmptyText}>{"No Leave Found..!"}</Text>
                                </View>
                                :
                                <FlatList style={{ flex: 1, }}
                                    data={this.state.Leavelist_ResponseArray}
                                    showsVerticalScrollIndicator={false}
                                    onRefresh={() => this.Container_Reset()}
                                    refreshing={this.state.Dashboard_Fetching}
                                    keyExtractor={(item, index) => item.key}
                                    onEndReached={this.onEndReached.bind(this)}
                                    onEndReachedThreshold={0.5}
                                    onMomentumScrollEnd={() => { this.onEndReachedCalledDuringMomentum = false }}
                                    renderItem={({ item, index }) =>

                                        <Card_leavelist
                                            CardText_Header1={"Name : "}
                                            CardText_1={item.first_name + " " + item.last_name}
                                            CardText_Header2={"Leave From : "}
                                            CardText_2={Moment(item.leave_from).format('DD -MMMM-YY')}
                                            CardText_Header3={"Leave Till : "}
                                            CardText_3={Moment(item.leave_till).format('DD -MMMM-YY')}
                                            CardText_Header4={"No.of.Days : "}
                                            CardText_4={item.no_of_days}
                                            CardText_Header5={"Reason : "}
                                            CardText_5={item.reason}

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

});

const mapStateToProps = (state) => {
    return {
        CommonReducer: state.CommonReducer
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(LeaveTaken_List);
