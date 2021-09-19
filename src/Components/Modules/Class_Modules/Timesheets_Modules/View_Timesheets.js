import React, { Component, PureComponent } from 'react'
import {
    StyleSheet, Text, Keyboard, AsyncStorage, FlatList,
    View, TouchableOpacity, Image, SafeAreaView, ImageBackground, BackHandler, Alert, Platform, Modal, TextInput, ScrollView, TouchableWithoutFeedback
} from 'react-native'
import { color, width, fontSize, fontFamily, height, LG_BG_THEME } from '../../../Constants/fontsAndColors'
import { Container, Content, connect, Picker, Header, LinearGradient, Snackbar, Moment, base64 } from '../../../../Asset/Libraries/NpmList';
import { Mystatusbar } from '../../../../Asset/Libraries/index'

import { AS_HeaderDesign } from '../../CommonView_Modules/AS_HeaderDesign'
import { CM_ButtonDesign } from '../../CommonView_Modules/CM_ButtonDesign'
import { CM_BoxButton } from '../../CommonView_Modules/CM_BoxButton'
import { TS_Circleview } from '../../CommonView_Modules/TS_Circleview'
import { TS_CircleLIne } from '../../CommonView_Modules/TS_CircleLIne'
import { TS_CodeitemsView } from '../../CommonView_Modules/TS_CodeitemsView'



import { TS_HeadingView } from '../../CommonView_Modules/TS_HeadingView'

import { Spinner } from '../../../Config/Spinner';

import { Cass_APIDetails, Cass_AuthDetails, User_EngineersList, User_DepartmentsList, User_WorkItems, Timesheet_Add } from '././../../../Config/Server'

class View_Timesheets extends Component {

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


            Total_QtyCost: 0,
            Total_QtyCount: 0,
            TS_ID: "",
            S4_CostInfo: [],
            Total_IteamCount: 0,
            S6_Docsupload: [],
            Signature_Image:'',
        };

    }

    componentDidMount() {


        AsyncStorage.getItem("Cass_UserID", (error, Token_Result) => {
            if (Token_Result != "0" || Token_Result != null) {
                AsyncStorage.getItem("Cass_RoleID", (error, Token_RoleID) => {
                    if (Token_RoleID != "0" || Token_RoleID != null) {
                        this.setState({ CassUserID: Token_Result, CassRoleID: Token_RoleID, Dashboard_Fetching: false }, () => this._fetchdata(Token_Result, Token_RoleID));
                    }
                })
            }
        })

        const { TSInfo_Response } = this.props.CommonReducer
        console.log("##ResponseData",JSON.stringify(TSInfo_Response));
        this.setState({
            CassUserID: TSInfo_Response.user_id,
            TS_ID: TSInfo_Response.id,

            S1_Date: TSInfo_Response.job_date,
            S1_Job_No: TSInfo_Response.job_no,
            S1_Dept_Name: TSInfo_Response.department_name,
            S1_Dept_ID: TSInfo_Response.department_id,
            S1_Exchange: TSInfo_Response.exchange,
            SubmitterName: TSInfo_Response.submitter_name,
            S1_DateVisible: Moment(TSInfo_Response.job_date).format('DD-MMMM-YY'),

            S3_TextComments: TSInfo_Response.comments,

            S1_Engineer_ArrayId: TSInfo_Response.users.split(","),
            S2_QtyArraylist: JSON.parse(TSInfo_Response.work_item_id_qty.replace(/'/g, '"')),
            S3_InfoArray: JSON.parse(TSInfo_Response.item_details.replace(/'/g, '"')),
            S4_CostPercentage: JSON.parse(TSInfo_Response.user_percentage.replace(/'/g, '"')),
            S4_UserAmount: JSON.parse(TSInfo_Response.user_cost.replace(/'/g, '"')),
            Signature_Image:TSInfo_Response.signature,
            S6_Docsupload:[]
        })
        this.forceUpdate()

    }

    async _fetchdata(Token_Result, Token_RoleID) {
        const EngineerList_Response = await this._fetch_EngInfo(Token_Result);
        const Quatitylist_Response = await this._fetch_QtyInfo(Token_Result, Token_RoleID);

        try {

            this.setState({
                Dashboard_Fetching: false
            })

            for (let j = 0; j < this.state.S2_QtyArraylist.length; j++) {

                for (let i = 0; i < Quatitylist_Response.User_QtyInfo.length; i++) {

                    if (Quatitylist_Response.User_QtyInfo[i].id == this.state.S2_QtyArraylist[j].id) {

                        this.state.S2_Quatitylist_Response.push({
                            "id": Quatitylist_Response.User_QtyInfo[i].id,
                            "item_code": Quatitylist_Response.User_QtyInfo[i].item_code,
                            "item_description": Quatitylist_Response.User_QtyInfo[i].item_description,
                            "engineer_pay_price": Quatitylist_Response.User_QtyInfo[i].engineer_pay_price,
                            "cass_sale_price": Quatitylist_Response.User_QtyInfo[i].cass_sale_price,
                            "item_label": Quatitylist_Response.User_QtyInfo[i].item_label,
                            "department_id": Quatitylist_Response.User_QtyInfo[i].department_id,
                            "status": Quatitylist_Response.User_QtyInfo[i].status,
                            "department_name": Quatitylist_Response.User_QtyInfo[i].department_name,
                            "department_ids": Quatitylist_Response.User_QtyInfo[i].department_ids,
                            "isClicked": true,
                            "item_Qty": this.state.S2_QtyArraylist[j].qty
                        })

                        this.setState({
                            Total_QtyCost: this.state.Total_QtyCost + (this.state.S2_QtyArraylist[j].qty * Quatitylist_Response.User_QtyInfo[i].engineer_pay_price),
                            Total_QtyCount: this.state.Total_QtyCount + parseInt(this.state.S2_QtyArraylist[j].qty),
                        })

                    }
                }

            }

            this.setState({
                Total_IteamCount: this.state.S2_QtyArraylist.length
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
                            "full_name": EngineerList_Response.User_EngInfo[i].full_name,
                            "isClicked": false,
                        })
                    }
                }

            }

            for (let j = 0; j < this.state.S1_Engineer_ArrayId.length; j++) {
                for (let i = 0; i < EngineerList_Response.User_EngInfo.length; i++) {
                    if (EngineerList_Response.User_EngInfo[i].id == this.state.S1_Engineer_ArrayId[j]) {
                        this.state.S4_CostInfo.push({
                            "username": EngineerList_Response.User_EngInfo[i].full_name,
                            "user_percentage": this.state.S4_CostPercentage[j],
                            "user_cost": this.state.S4_UserAmount[j],
                        })
                    }
                }
            }

            this.setState({
                S2_Quatitylist_AR: this.state.S2_Quatitylist_Response
            })

        } catch (err) {
            this.setState({ Dashboard_Fetching: false });
        }
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


    S1C_ModalMethod(RouteName) {

        this.setState({
            S1C_ModalRouteName: RouteName,
            S1C_Modal: true
        })
    }

    Container_Model(Route_Data, RouteName, Response) {
        this.setState({ S1C_ModalRouteName: Route_Data, S1C_Modal: RouteName })

        if (Route_Data == "Code Items") {
            this.setState({
                Modal_Itemcode: Response.item_code,
                Modal_ItemDescription: Response.item_description,
                Modal_ItemPrice: Response.engineer_pay_price,
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



    Timesheet_Method(Route_Data) {
        this.props.navigation.goBack()
    }

    render() {

        return (
            <LinearGradient key="background" start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[LG_BG_THEME.APPTHEME_BG_2, LG_BG_THEME.APPTHEME_BG_2]} style={{ flex: 1, justifyContent: "center" }} >

                <Mystatusbar />
                <View style={{ flex: 1 }}>
                    <AS_HeaderDesign
                        Onpress_LeftIcon={() => this.Timesheet_Method("Left_Icon")}
                        Header_Text={"VIEW TIMESHEETS"}
                        RightIcon_Status={false}
                        LeftIcon_Status={true}
                    />

                    <View style={{ flex: 1, marginTop: width / 100 * 2, marginLeft: width / 100 * 2, marginRight: width / 100 * 2 }}>

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
                                                    <Text style={styles.S1_EngineerList_Text}>{item.full_name}</Text>
                                                </View>
                                                <View style={{ flex: 0.15, justifyContent: "center", alignItems: "center" }}>
                                                    {/* <Image source={require('../../../../Asset/Icons/Delete_Icon.png')} style={{ width: width / 100 * 5, height: width / 100 * 5, tintColor: LG_BG_THEME.APPTHEME_1 }} /> */}
                                                </View>
                                            </View>
                                        ))}

                                        <View style={styles.Container_EP_1} />

                                        <TS_HeadingView
                                            ASB_Text={"Total Quantity"}
                                        />

                                        <View style={styles.container_TextInputOverview}>
                                            <View style={{ height: height / 100 * 6, justifyContent: "center", borderRadius: width / 100 * 1, }}>
                                                <View style={{ flex: 1, justifyContent: "center", }}>
                                                    <Text style={styles.container_Text}>{this.state.Total_QtyCount}</Text>
                                                </View>
                                            </View>
                                        </View>

                                        <View style={styles.Container_EP_2} />

                                        <View style={{ height: height / 100 * 8, justifyContent: "center", backgroundColor: LG_BG_THEME.APPTHEME_2 }}>
                                            <Text style={styles.Bar_HeaderText}>{"Total Pay for job - £ "}<Text style={styles.Bar_HeaderText}>{this.state.Total_QtyCost.toFixed(2)}</Text><Text style={styles.Bar_HeaderText}>{" (Units - " + this.state.Total_IteamCount + ")"}</Text></Text>
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

                                        {this.state.S2_Quatitylist_Response.map((item, index) => (
                                            <View style={{ height: height / 100 * 8, justifyContent: "center", flexDirection: 'row', marginBottom: width / 100 * 3, elevation: Platform.OS == "android" ? width / 100 * 1 : width / 100 * 0.1, shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.2, shadowColor: LG_BG_THEME.APPTHEME_2, marginLeft: width / 100 * 2, marginRight: width / 100 * 2 }}>

                                                <TouchableOpacity onPress={() => this.Container_Model("Code Items", true, item)} style={{ flex: 0.35, justifyContent: 'center', backgroundColor: item.isClicked == true ? LG_BG_THEME.APPTHEME_1 : LG_BG_THEME.WHITE_THEME, }}>
                                                    <Text numberOfLines={2} style={item.isClicked == true ? styles.S2_Qty_WLMedium : styles.S2_Qty_BLMedium}>{" " + item.item_code}</Text>
                                                    <Image source={require('../../../../Asset/Icons/search.png')} style={{ width: width / 100 * 3, height: width / 100 * 3, tintColor: LG_BG_THEME.WHITE_THEME, position: "absolute", marginLeft: width / 100 * 1 }} />

                                                </TouchableOpacity>

                                                <View style={{ flex: 0.3, justifyContent: 'center', backgroundColor: item.isClicked == true ? LG_BG_THEME.APPTHEME_1 : LG_BG_THEME.WHITE_THEME, opacity: 0.8 }}>
                                                    <View style={{ flex: 1, justifyContent: "center", }}>
                                                        <TextInput
                                                            placeholder='Qty'
                                                            returnKeyType='next'
                                                            editable={!(item.isClicked)}
                                                            underlineColorAndroid='transparent'
                                                            placeholderTextColor={LG_BG_THEME.APPTHEME_BLACK}
                                                            style={item.isClicked == true ? styles.container_WhiteText : styles.container_Text}
                                                            onChangeText={text => {
                                                                let { S2_TextQty } = this.state;
                                                                S2_TextQty[index] = text;
                                                                this.setState({ S2_TextQty });
                                                            }}
                                                            value={item.item_Qty}
                                                        //onChangeText={(S2_TextQty) => this.setState({ S2_TextQty })}
                                                        />
                                                    </View>
                                                </View>

                                                <View style={{ flex: 0.35, justifyContent: 'center', backgroundColor: item.isClicked == true ? LG_BG_THEME.APPTHEME_1 : LG_BG_THEME.WHITE_THEME, }}>
                                                    <View style={{ flex: 0.05, justifyContent: 'center' }} />
                                                    <View style={{ flex: 0.45, justifyContent: 'center' }}>
                                                        <Text numberOfLines={2} style={item.isClicked == true ? styles.S2_Qty_WMedium : styles.S2_Qty_BMedium}>{isNaN((item.engineer_pay_price * item.item_Qty).toFixed(2)) == true ? "£ 0.0" : "£ " + (item.engineer_pay_price * item.item_Qty).toFixed(2)}</Text>
                                                    </View>

                                                    <View style={{ flex: 0.45, justifyContent: 'center' }}>
                                                        <Text numberOfLines={2} style={item.isClicked == true ? styles.S2_Qty_WSmall : styles.S2_Qty_BSmall}>{"£ " + item.engineer_pay_price + " (PP)"}</Text>
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
                                                                    <Text style={styles.S2_container_BlackText}>{item.distance}</Text>
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
                                                <Text style={styles.Bar_HeaderText}>{"Total Pay for job - £ "}<Text style={styles.Bar_HeaderText}>{this.state.Total_QtyCost.toFixed(2)}</Text><Text style={styles.Bar_HeaderText}>{" (Units - " + this.state.Total_IteamCount + ")"}</Text></Text>
                                            </View>
                                            <View style={styles.Container_EP_2} />

                                            {this.state.S4_CostInfo.map((item, index) => (

                                                <View style={{ flex: 1, justifyContent: "center", }}>

                                                    <View style={{ height: height / 100 * 6, justifyContent: "center", alignItems: "flex-start", opacity: 0.6, elevation: Platform.OS == "android" ? width / 100 * 1 : width / 100 * 0.1, shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.2, shadowColor: LG_BG_THEME.APPTHEME_2, }}>
                                                        <Text style={styles.S2_Qty_BMedium}>{item.username}</Text>
                                                    </View>

                                                    <View style={{ height: height / 100 * 6, justifyContent: "center", flexDirection: "row", marginLeft: width / 100 * 2, marginRight: width / 100 * 2 }}>
                                                        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: LG_BG_THEME.WHITE_THEME }}>
                                                            <Text style={styles.S2_Qty_BMedium}>{"% " + (item.user_percentage)}</Text>
                                                        </View>

                                                        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: LG_BG_THEME.APPTHEME_1 }}>
                                                            <Text numberOfLines={1} style={styles.S2_Qty_WMedium}>{"£ " + (item.user_cost)}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            ))}

                                            <View style={styles.Container_EP_2} />

                                        </View>

                                        <TS_HeadingView  ASB_Text={"Document Uploaded"}  />
                                        {this.state.S6_Docsupload.length == 0 ?
                                                                                null
                                                                                :
                                        <View style={{ flex: 1, flexDirection: "column" }}>
                                            <View style={styles.Container_EP_2} />

                                            {this.state.S6_Docsupload.map((item, index) => (
                                                <View style={{ flex: 1, justifyContent: "center", flexDirection: 'row', marginBottom: width / 100 * 3, elevation: Platform.OS == "android" ? width / 100 * 1 : width / 100 * 0.1, shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.2, shadowColor: LG_BG_THEME.APPTHEME_2, marginLeft: width / 100 * 2, marginRight: width / 100 * 2 }}>
                                                    <View style={{ flex: 0.1, justifyContent: "center" }} />
                                                    <View style={{ flex: 0.1, justifyContent: "center" }}>
                                                        <Text numberOfLines={2} style={styles.S6_BMedium}>{(index + 1 + ". ")}</Text>
                                                    </View>

                                                    <View style={{ flex: 0.7, justifyContent: "center", alignItems: "flex-start" }}>
                                                        <Text numberOfLines={2} style={styles.S6_BMedium}>{item.Docs_Name}</Text>
                                                    </View>

                                                    <View style={{ flex: 0.1, justifyContent: "center" }} />

                                                </View>
                                            ))}
                                            <View style={styles.Container_EP_2} />

                                        </View>
                                        }
                                        <TS_HeadingView
                                            ASB_Text={"Signature"}
                                        />
                                        {/* <Image style={{width: 320, height: 400}} source={{uri: `data:${this.state.Signature_Image}`}}/> */}
                                        <Image style={{width: 320, height: 400}} source={{uri: `https://appbox.website/casstimesheet_beta/${this.state.Signature_Image}`}}/> 
                                    </View>
                                </ScrollView>

                            </TouchableWithoutFeedback>


                            <View style={styles.Container_EP_2} />

                            <CM_ButtonDesign
                                CMB_BuutonColourcode={LG_BG_THEME.APPTHEME_Blue}
                                onPress_BuutonView={() => this.Timesheet_Method("Finish")}
                                CMB_TextHeader={"Close"}
                            />

                            <View style={styles.Container_EP_2} />

                        </View>

                    </View>



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

                                    <View style={{ height: width / 100 * 70, justifyContent: 'center', backgroundColor: LG_BG_THEME.WHITE_THEME, }}>

                                        {
                                            this.state.S1C_ModalRouteName == "Code Items" ?
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
                                            <Text numberOfLines={1} style={{ fontSize: fontSize.Medium, fontFamily: fontFamily.Poppins_Bold, letterSpacing: width / 100 * 0.2, color: color.Font_Whitecolor, textAlign: "center" }}>{"Close"}</Text>
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
export default connect(mapStateToProps, mapDispatchToProps)(View_Timesheets);
