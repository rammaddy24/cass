import React, { Component, PureComponent } from 'react'
import {
    StyleSheet, Text, Keyboard, AsyncStorage, FlatList,
    View, TouchableOpacity, Image, SafeAreaView, ImageBackground, BackHandler, Alert, Platform, Modal, TextInput, ScrollView, TouchableWithoutFeedback
} from 'react-native'
import { color, width, fontSize, fontFamily, height, LG_BG_THEME } from '../../../Constants/fontsAndColors'
import { Container, Content, connect, Picker, Header, LinearGradient, Snackbar, CalendarPicker, Moment, base64 } from '../../../../Asset/Libraries/NpmList';
import { Mystatusbar, isIOS } from '../../../../Asset/Libraries/index'

import Sample_json from '../Extra_Modules/Screenlist.json'

import { AS_HeaderDesign } from '../../CommonView_Modules/AS_HeaderDesign'
import { ButtonDesign } from '../../CommonView_Modules/ButtonDesign'

import { Cass_APIDetails, Cass_AuthDetails, Leave_Add } from '././../../../Config/Server'

import { Spinner } from '../../../Config/Spinner';

class Add_Leave extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Reason_Text: '',
            Leave_StartDate: "",
            Leave_EndDate: "",
            Leave_SD: "",
            Leave_ED: "",
            Leave_Count: 0,
            User_ID: "",
            Submitter_ID: "",
            Calendar_Modal: false,
            Dashboard_Fetching: false,
            Calendar_Routename: "From"
        };

    }

    componentDidMount() {
        const { state } = this.props.navigation;
        let Calendar_Date = state.params.CalendarDate
        this.setState({
            Leave_SD: Moment(Calendar_Date).format('YYYY-MM-DD'),
            Leave_StartDate: Moment(Calendar_Date).format('DD-MMMM-YY')
        })
    }


    Container_Method(RouteName) {

        if (RouteName == "Goback") {
            this.props.navigation.goBack()
        } else {
            if (this.state.Leave_EndDate == "") {
                Snackbar.show({
                    title: 'Select End Date..!',
                    duration: Snackbar.LENGTH_SHORT,
                });
            } else if (this.state.Reason_Text == "") {
                Snackbar.show({
                    title: 'Enter Reason..!',
                    duration: Snackbar.LENGTH_SHORT,
                });
            } else {
                const { UserInfo_Response } = this.props.CommonReducer
                this.setState({ Dashboard_Fetching: true })
                fetch(Leave_Add, {
                    method: 'POST',
                    headers: new Headers({
                        'Authorization': "Basic " + base64.encode(Cass_AuthDetails),
                        'X-API-KEY': Cass_APIDetails,
                        'Content-Type': 'application/json',
                    }),
                    body: JSON.stringify({
                        "leave_from": this.state.Leave_SD,
                        "leave_till": this.state.Leave_ED,
                        "no_of_days": this.state.Leave_Count,
                        "reason": this.state.Reason_Text,
                        "user_id": UserInfo_Response.id,
                        "submitter_id": UserInfo_Response.id,
                    })
                })
                    .then((response) => response.json())
                    .then((Jsonresponse) => {
                        if (Jsonresponse.status == true) {
                            this.setState({ Dashboard_Fetching: false })
                            this.props.navigation.navigate("Dashboard")
                            setTimeout(() => {
                                Snackbar.show({
                                    title: Jsonresponse.message + "..!",
                                    duration: Snackbar.LENGTH_SHORT,
                                });
                             }, 1000)
                        } else {
                            this.setState({ Dashboard_Fetching: false })
                            setTimeout(() => {
                                Snackbar.show({
                                    title: Jsonresponse.message + "..!",
                                    duration: Snackbar.LENGTH_SHORT,
                                });
                             }, 1000)
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
    }

    Container_Model(RouteName, Routedata) {
        this.setState({
            Calendar_Modal: RouteName,
            Calendar_Routename: Routedata
        })
    }

    onDateChange(Date_Index) {

        if (this.state.Calendar_Routename == "From") {
            this.setState({
                Leave_StartDate: Moment(Date_Index).format('DD-MMMM-YY'),
                Leave_SD: Moment(Date_Index).format('YYYY-MM-DD'),
                Leave_EndDate: "",
                Leave_ED: "",
                Leave_Count: 0
            })
        } else {
            var msDiff = new Date(Date_Index).getTime() - new Date(this.state.Leave_SD).getTime()    //Future date - current date
            this.setState({
                Leave_Count: (parseInt((msDiff / 86400000).toFixed(0))) + 1,
            })
            this.setState({
                Leave_EndDate: Moment(Date_Index).format('DD-MMMM-YY'),
                Leave_ED: Moment(Date_Index).format('YYYY-MM-DD'),
            })

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
                        Onpress_RightIcon={() => this.Container_Method("Goback")}
                        Header_Text={"ADD LEAVE/ABSENCE"}
                        RightIcon_Status={false}
                        LeftIcon_Status={true}
                    />


                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                        <View style={{ flex: 1, margin: width / 100 * 4, marginLeft: width / 100 * 6, marginRight: width / 100 * 6, }}>

                            <View style={{ flex: 0.05, justifyContent: "center" }} />

                            <View style={{ flex: 0.2, justifyContent: "center" }}>

                                <View style={{ flex: 0.3, justifyContent: "center", flexDirection: 'row' }}>
                                    <View style={styles.Container_TStab}>
                                        <Text style={styles.container_TabText}>{"From"}</Text>
                                    </View>

                                    <View style={{ flex: 0.01, justifyContent: "center" }} />
                                    <View style={styles.Container_TStab}>
                                        <Text style={styles.container_TabText}>{"To"}</Text>
                                    </View>

                                </View>

                                <View style={{ flex: 0.4, justifyContent: "center", backgroundColor: LG_BG_THEME.WHITE_THEME, borderWidth: width / 100 * 0.3, borderColor: LG_BG_THEME.APPTHEME_1, borderRadius: width / 100 * 2, flexDirection: 'row' }}>

                                    <TouchableOpacity onPress={() => this.Container_Model(true, "From")} style={{ flexDirection: "row", flex: 0.495, justifyContent: 'center', alignItems: 'center' }}>

                                        <View style={{ flex: 0.7, justifyContent: 'center', alignItems: "center" }}>
                                            <Text style={styles.container_TabText}>{this.state.Leave_StartDate}</Text>
                                        </View>

                                        <View style={{ flex: 0.3, justifyContent: 'center', alignItems: "center" }}>
                                            <Image source={require('../../../../Asset/Icons/Calendar_Icon.png')} style={{ width: width / 100 * 3.5, height: width / 100 * 3.5, tintColor: LG_BG_THEME.APPTHEME_1, }} />
                                        </View>

                                    </TouchableOpacity>

                                    {/* <TouchableOpacity style={{ flex: 0.495, justifyContent: 'center', alignItems: "flex-start" }}>
                                        <Text style={styles.container_TabText}>{this.state.Leave_StartDate}</Text>
                                    </TouchableOpacity> */}

                                    <View style={{ flex: 0.01, justifyContent: "center", backgroundColor: LG_BG_THEME.APPTHEME_1 }} />

                                    <TouchableOpacity onPress={() => this.Container_Model(true, "To")} style={{ flexDirection: "row", flex: 0.495, justifyContent: 'center', alignItems: 'center' }}>

                                        <View style={{ flex: 0.7, justifyContent: 'center', alignItems: "center" }}>
                                            <Text style={styles.container_TabText}>{this.state.Leave_EndDate}</Text>
                                        </View>

                                        <View style={{ flex: 0.3, justifyContent: 'center', alignItems: "center" }}>
                                            <Image source={require('../../../../Asset/Icons/Calendar_Icon.png')} style={{ width: width / 100 * 3.5, height: width / 100 * 3.5, tintColor: LG_BG_THEME.APPTHEME_1, }} />
                                        </View>

                                    </TouchableOpacity>

                                </View>

                                <View style={{ flex: 0.3, justifyContent: "center", alignItems: "flex-end" }}>
                                    <Text style={styles.container_TabText}>{this.state.Leave_Count + " Days"}</Text>
                                </View>

                            </View>

                            <View style={{ flex: 0.45, justifyContent: 'center', }}>

                                <View style={{ height: height / 100 * 22, backgroundColor: LG_BG_THEME.WHITE_THEME, borderRadius: width / 100 * 2, elevation: isIOS ? width / 100 * 0.1 : width / 100 * 1, shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.2, shadowColor: LG_BG_THEME.APPTHEME_2, justifyContent: "center" }}>

                                    <TextInput
                                        placeholder={"Enter Reason"}
                                        returnKeyType="next"
                                        underlineColorAndroid='transparent'
                                        placeholderTextColor={LG_BG_THEME.APPTHEME_GREY_2}
                                        style={styles.Product_TextCode}
                                        multiline={true}
                                        selectionColor={LG_BG_THEME.APPTHEME_GREY_2}
                                        onChangeText={(Reason_Text) => this.setState({ Reason_Text })}
                                    />
                                </View>
                            </View>

                            <View style={{ flex: 0.3, justifyContent: "center", }}>

                                <View style={{ flex: 0.5, justifyContent: "center", }} />


                                <View style={{ flex: 0.4, justifyContent: "center" }}>

                                    <ButtonDesign
                                        CMB_BuutonColourcode={LG_BG_THEME.APPTHEME_Blue}
                                        onPress_BuutonView={() => this.Container_Method("SUBMIT")}
                                        CMB_TextHeader={"SUBMIT"}
                                    />
                                </View>
                                <View style={{ flex: 0.1, justifyContent: "center", }} />


                            </View>

                        </View>
                    </TouchableWithoutFeedback>

                </View>



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
                                            <Text numberOfLines={1} style={{ fontSize: fontSize.Medium, fontFamily: fontFamily.Poppins_Regular, letterSpacing: width / 100 * 0.1, color: color.Font_Whitecolor, textAlign: "center" }}>{this.state.Calendar_Routename == "From" ? this.state.Leave_StartDate : this.state.Leave_EndDate}</Text>
                                        </View>

                                    </View>

                                    <View style={{ height: width / 100 * 80, justifyContent: 'center', backgroundColor: LG_BG_THEME.WHITE_THEME, }}>

                                        <CalendarPicker
                                            startFromMonday={false}
                                            allowRangeSelection={false}
                                            // format={"DD-MMMM-YY"}
                                            selectedStartDate={this.state.Timesheet_Date}
                                            //initialDate={this.state.Leave_StartDate}
                                            minDate={this.state.Calendar_Routename == "From" ? new Date(new Date().getTime() - (86400000 * 30)) : new Date(new Date(this.state.Leave_StartDate).getTime())}
                                            maxDate={new Date(new Date().getTime() + (86400000 * 30))}
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

                                        <TouchableOpacity onPress={() => this.Container_Model(false)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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

    Product_TextCode: {
        fontSize: fontSize.Medium,
        fontFamily: fontFamily.Poppins_Regular,
        letterSpacing: width / 100 * 0.1,
        color: color.Font_Black_Light,
        textAlign: "auto",
        marginLeft: width / 100 * 2
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

    Container_TStab: {
        flex: 0.495,
        justifyContent: 'center',
        //alignItems: 'center',

    },
    container_TabText: {
        fontSize: fontSize.lightMedium,
        fontFamily: fontFamily.Poppins_Regular,
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
        // DashboardAction : () => { dispatch(DashboardAction()) },

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Add_Leave);
