
import React, { Component, PureComponent } from 'react'
import {
    StyleSheet, Text, Keyboard, AsyncStorage, FlatList,PermissionsAndroid,
    View, TouchableOpacity, Image, SafeAreaView, ImageBackground, BackHandler, Alert, Platform, Modal, TextInput, ScrollView, TouchableWithoutFeedback
} from 'react-native'
import { color, width, fontSize, fontFamily, height, LG_BG_THEME } from '../../../Constants/fontsAndColors'
import { Container, Content, connect, Picker, Header, LinearGradient, Snackbar, Moment, base64, CalendarPicker, SignatureCapture, DocumentPicker,RNFetchBlob,RNFS } from '../../../../Asset/Libraries/NpmList';
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

var Image_Sign = ""

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

            S2_Qty_Count: 0,
            S2_Qty_Amount: 0,

            S3_InfoArray: [],
            S3_InfoArrayTemp:[],
            activeIndex:0,
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
            S2_Qty_Results_Units: 0,

            AddionalInfo_Modal: false,
            S6_Docsupload: [],
            Signature_Image:'',
            SignatureSaved:false,

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
            SubmitterName: UserInfo_Response.first_name.concat(" " + UserInfo_Response.last_name),
            S1_Engineer_ArrayId: AddmoreInfo_Response.users.split(","),
            S1_DateVisible: Moment(AddmoreInfo_Response.job_date).format('DD-MMMM-YY'),
            Signature_Image:AddmoreInfo_Response.signature
        })

        this.forceUpdate()
        this.Qty_ListMethod(AddmoreInfo_Response.department_id, AddmoreInfo_Response.user_id, AddmoreInfo_Response.role_id)

    }

    async _fetchdata(Token_Result, Token_RoleID) {
        const DeptList_Response = await this._fetch_DeptInfo(Token_Result, Token_RoleID);
        try {
            this.setState({
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


    _fetch_EngInfo(Token_Result, Token_DeptID) {
        return new Promise((resolve, reject) => {
            let User_EngInfo_URL = User_EngineersList + Token_Result + "&department_id=" + Token_DeptID;
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
        const EngineerList_Response = await this._fetch_EngInfo(CassUserID, Route_Data);

        let QtyInfo_Array = Quatitylist_Response.User_QtyInfo.filter(item => item.department_ids == Route_Data)
        let QtyInfo_Arraylist = []

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
                "additional_info": QtyInfo_Array[i].additional_info,
                "Is_QtyCount": 0
            })
        }


        let EngSelectedInfo_Array = []
        let EngInfo_Array = []
        let Engineer_ArrayList = []
        let S1_Engineer_DataArray = []
        let S1_Engineer_OverallArrayID = []
        let S1_Engineer_UnArrayId = []

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
                        "full_name": EngineerList_Response.User_EngInfo[j].full_name,
                        "isClicked": true,
                    })
                }
            }
            S1_Engineer_OverallArrayID.push(EngineerList_Response.User_EngInfo[j].id)
        }

        S1_Engineer_UnArrayId = S1_Engineer_OverallArrayID.filter(n => !this.state.S1_Engineer_ArrayId.includes(n))

        for (let j = 0; j < EngineerList_Response.User_EngInfo.length; j++) {
            for (let i = 0; i < S1_Engineer_UnArrayId.length; i++) {
                if (EngineerList_Response.User_EngInfo[j].id == S1_Engineer_UnArrayId[i]) {
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
                        "full_name": EngineerList_Response.User_EngInfo[j].full_name,
                        "isClicked": false,
                    })
                }
            }
        }


        Engineer_ArrayList = Array.from(new Set(EngSelectedInfo_Array.concat(EngInfo_Array)))

        for (let j = 0; j < this.state.S1_Engineer_ArrayId.length; j++) {
            for (let i = 0; i < EngineerList_Response.User_EngInfo.length; i++) {

                if (EngineerList_Response.User_EngInfo[i].id == this.state.S1_Engineer_ArrayId[j]) {
                    S1_Engineer_DataArray.push({
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
                        "isClicked": true,
                        "Item_Percentage": 0
                    })
                }

            }
        }

        this.setState({
            S2_Quatitylist_Response: Array.from(new Set(QtyInfo_Arraylist)),
            Engineer_ArrayList: Array.from(new Set(this.state.Engineer_ArrayList)),
            S1_Engineer_OverallArrayId: Array.from(new Set(S1_Engineer_OverallArrayID)),
            S1_Engineer_UnArrayId: Array.from(new Set(S1_Engineer_UnArrayId)),
            Engineer_ArrayList: Array.from(new Set(Engineer_ArrayList)),
            S1_Engineer_DataArray: Array.from(new Set(S1_Engineer_DataArray)),

        })

        this.forceUpdate()
        this.setState({
            S2_Quatitylist_Response: Array.from(new Set(this.state.S2_Quatitylist_Response)),
            S2_Quatitylist_AR: this.state.S2_Quatitylist_Response,
            Engineer_DataResponse: this.state.Engineer_ArrayList,
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
                        (100 / (this.state.S1_Engineer_DataArray.length)).toFixed(2)
                    )
                    this.state.S4_UserAmount.pop(
                        ((this.state.S2_Qty_Amount / this.state.S1_Engineer_ALength)).toFixed(2)
                    )
                }
                this.setState({ Add_TimesheetScreenIndex: 3, Add_TimesheetScreen: "Step 3", })
            } else if (this.state.Add_TimesheetScreenIndex == 3) {
                this.setState({
                    Add_TimesheetScreenIndex: 2, Add_TimesheetScreen: "Step 2",
                    S2_Quatitylist_Response: this.state.S2_Quatitylist_AR
                })
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

        if (this.state.S1_Dept_ID != "" || RouteName == "Department") {
            this.setState({
                S1C_ModalRouteName: RouteName,
                S1C_Modal: true
            })
        } else {
            Snackbar.show({
                title: 'Enter Dept Name..!',
                duration: Snackbar.LENGTH_SHORT,
            });
        }
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


    TextInput_Method(Data_Response, RouteName) {

        const { Engineer_ArrayList, Engineer_DataResponse, S2_Quatitylist_Response, S2_Quatitylist_AR } = this.state;
        var newData = []
        let QtyInfo_Array = []

        try {

            if (RouteName == "Engineer") {
                newData = Engineer_DataResponse.filter(function (item) {
                    const itemData = item.full_name ? item.full_name.toUpperCase() : ''.toUpperCase();
                    const textData = Data_Response.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                })

                this.setState({
                    Engineer_ArrayList: newData,
                });
            } else {
                QtyInfo_Array = S2_Quatitylist_AR.filter(function (item, index) {
                    const itemData = item.item_code ? item.item_code.toUpperCase() : ''.toUpperCase();
                    const textData = Data_Response.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                })

                if (QtyInfo_Array.length != 0) {
                    for (let i = 0; i < QtyInfo_Array.length; i++) {
                        QtyInfo_Array[i].Is_QtyCount = QtyInfo_Array[i].Is_QtyCount == 0 ? 0 : QtyInfo_Array[i].Is_QtyCount
                        QtyInfo_Array[i].isClicked = QtyInfo_Array[i].Is_QtyCount == 0 ? false : true
                    }
                }

                this.setState({
                    S2_Quatitylist_Response: QtyInfo_Array,
                });
                this.forceUpdate()
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
    async Imagesupload_Server(Image_Path) {
       
        const encoded = Image_Path.encoded;
        const fileTye= 'image/png;base64,';
        if(!Image_Path.encoded){
 
            // if (Image_Path.startsWith('content://')) {
     
             //const filePath = Image_Path.split('raw%3A')[1].replace(/\%2F/gm, '/');
           
             
             const absolutePath = await RNFetchBlob.fs.stat(Image_Path)
             .then((stats) => {
                 console.log("##Imagestatus",stats.path);
                 return stats.path;
             })
             .catch((err) => {
                 console.log("Error",err);
             });
             await RNFetchBlob.fs.readFile(absolutePath, 'base64')
             .then((base64) => {
                 this.setState({Signature_Image:`${fileTye}${base64}`});
             })
             .catch((err) => {
                 console.log("Error",err);
             }); 
        // } 
       }  else {
         this.setState({Signature_Image:`${fileTye}${encoded}`});
        }       
     }

    async Timesheet_Method(Route_Data) {

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
                    let C2_QtyArraylist = 0
                    for (let i = 0; i < this.state.S2_Quatitylist_Response.length; i++) {
                        if (this.state.S2_Quatitylist_Response[i].Is_QtyCount != 0 && this.state.S2_Quatitylist_Response[i].additional_info == "1") {
                            C2_QtyArraylist++
                        }
                    }
                    if (this.state.S2_Qty_Count == 0) {
                        Snackbar.show({
                            title: 'Select Work Items..!',
                            duration: Snackbar.LENGTH_SHORT,
                        });
                    }  else if (C2_QtyArraylist != this.state.S3_InfoArray.length) {
                        Snackbar.show({
                            title: 'Enter Additional Info..!',
                            duration: Snackbar.LENGTH_SHORT,
                        });
                    } 
                    else {
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
                        S2_Quatitylist_Response: this.state.S2_Quatitylist_AR
                    })
                } else {

                    this.setState({
                        Add_TimesheetScreen: "Step 4",
                        Add_TimesheetScreenIndex: 4
                    })

                    for (let i = 0; i < this.state.S1_Engineer_DataArray.length; i++) {
                        this.state.S4_CostPercentage.push(
                            (100 / (this.state.S1_Engineer_DataArray.length)).toFixed(2)
                        )
                        this.state.S4_UserAmount.push(
                            ((this.state.S2_Qty_Amount / this.state.S1_Engineer_ALength)).toFixed(2)
                        )
                    }

                }

            } else if (this.state.Add_TimesheetScreenIndex == 4) {
                if (Route_Data == "Prev") {
                    this.setState({
                        Add_TimesheetScreen: "Step 3",
                        Add_TimesheetScreenIndex: 3,

                    })
                    for (let i = 0; i < this.state.S1_Engineer_DataArray.length; i++) {
                        this.state.S4_CostPercentage.pop(
                            (100 / (this.state.S1_Engineer_DataArray.length)).toFixed(2)
                        )
                        this.state.S4_UserAmount.pop(
                            ((this.state.S2_Qty_Amount / this.state.S1_Engineer_ALength)).toFixed(2)
                        )

                    }
                } else {

                    var C2_QtyArraylist = []
                    for (let i = 0; i < this.state.S2_Quatitylist_AR.length; i++) {
                        if (this.state.S2_Quatitylist_AR[i].Is_QtyCount != 0) {
                            C2_QtyArraylist.push({
                                "id": this.state.S2_Quatitylist_AR[i].id,
                                "item_code": this.state.S2_Quatitylist_AR[i].item_code,
                                "item_description": this.state.S2_Quatitylist_AR[i].item_description,
                                "engineer_pay_price": this.state.S2_Quatitylist_AR[i].engineer_pay_price,
                                "cass_sale_price": this.state.S2_Quatitylist_AR[i].cass_sale_price,
                                "item_label": this.state.S2_Quatitylist_AR[i].item_label,
                                "department_id": this.state.S2_Quatitylist_AR[i].department_id,
                                "status": this.state.S2_Quatitylist_AR[i].status,
                                "department_name": this.state.S2_Quatitylist_AR[i].department_name,
                                "department_ids": this.state.S2_Quatitylist_AR[i].department_ids,
                                "isClicked": this.state.S2_Quatitylist_AR[i].isClicked,
                                "Is_QtyCount": this.state.S2_Quatitylist_AR[i].Is_QtyCount,
                            })
                        }
                    }

                    this.setState({
                        Add_TimesheetScreen: "Step 6",
                        Add_TimesheetScreenIndex: 5,
                        S2_QtyArraylist_Preview: C2_QtyArraylist
                    })
                }

            }
             else if (this.state.Add_TimesheetScreenIndex == 5) {
                if (Route_Data == "Prev") {
                    this.setState({
                        Add_TimesheetScreen: "Step 4",
                        Add_TimesheetScreenIndex: 4,
                    })
                } 
                else {
                    if (Image_Sign == "" && this.state.Signature_Image=='') {
                        Snackbar.show({
                            title: 'Upload E-Signature..!',
                            duration: Snackbar.LENGTH_SHORT,
                        });
                    } else {

                        this.setState({
                            Add_TimesheetScreen: "Step 5",
                            Add_TimesheetScreenIndex: 5,
                        });
                        this.Imagesupload_Server(Image_Sign);
                    }
                }
            }
             else if (this.state.Add_TimesheetScreenIndex == 6) {
                if (Route_Data == "Prev") {
                    this.setState({
                        Add_TimesheetScreen: "Step 5",
                        Add_TimesheetScreenIndex: 5,
                    })
                } else {
                    // if (this.state.S6_Docsupload.length == 0) {
                    //     Snackbar.show({
                    //         title: 'Upload Xlsx Document..!',
                    //         duration: Snackbar.LENGTH_SHORT,
                    //     });
                    // } else {
                        this.setState({
                            Add_TimesheetScreen: "Step 7",
                            Add_TimesheetScreenIndex: 7,
                        })
                  //  }

                }
            } 
            else if (this.state.Add_TimesheetScreenIndex == 7) {

                if (Route_Data == "Prev") {
                    this.setState({
                        Add_TimesheetScreen: "Step 6",
                        Add_TimesheetScreenIndex: 6,
                    })
                } else {
                    var C4_Cost = 0
                    for (let i = 0; i < this.state.S4_CostPercentage.length; i++) {
                        C4_Cost += parseFloat(this.state.S4_CostPercentage[i])
                    }

                    var C2_QtyArraylist = []
                    for (let i = 0; i < this.state.S2_QtyArraylist_Preview.length; i++) {
                        C2_QtyArraylist.push({
                            "id": this.state.S2_QtyArraylist_Preview[i].id,
                            "qty": this.state.S2_QtyArraylist_Preview[i].Is_QtyCount,
                            "price": this.state.S2_QtyArraylist_Preview[i].engineer_pay_price,
                        })
                    }

                    for (let i = 0; i < this.state.S4_CostPercentage.length; i++) {
                        this.state.S4_UserAmount[i] = ((this.state.S2_Qty_Amount * this.state.S4_CostPercentage[i]) / 100).toFixed(2)
                    }
                    let docs_data=[];
                    for (let i = 0; i<this.state.S6_Docsupload.length; i++){
                        const fileUri = this.state.S6_Docsupload[i].Docs_URL;
                        const fileName = this.state.S6_Docsupload[i].Docs_Name;
                        const fileType =  this.state.S6_Docsupload[i].Docs_Type;
                        const downloadPath =  `${RNFS.DownloadDirectoryPath}/${fileName}`;
                   
                             const absolutePath = await RNFetchBlob.fs.stat(downloadPath)
                             .then((stats) => {
                                 console.log("##stats",stats);
                                 return stats.path;
                             })
                             .catch((err) => {
                                 console.log("Error",err);
                             });
                             await RNFetchBlob.fs.readFile(absolutePath, 'base64')
                             .then((base64) => {

                                const fileData= {
                                    file:`${fileType},${base64}`,
                                    title:fileName
                                }
                               
                                 //console.log("##excel",base64);
                                 docs_data.push(JSON.stringify(fileData)); 
                             })
                             .catch((err) => {
                                 console.log("Error",err);
                             });   
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
                               // "item_details": this.state.S3_InfoArray,
                               "item_details": [...this.state.S3_InfoArray,...this.state.S3_InfoArrayTemp],
                                "user_percentage": this.state.S4_CostPercentage,
                                "user_cost": this.state.S4_UserAmount,
                                "signature": this.state.Signature_Image,
                                "files":docs_data
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
        const { S2_Quatitylist_AR } = this.state;
        var Results_qty = 0
        var Results_Amount = 0
        let Results_Units = 0

        for (i = 0; i < S2_Quatitylist_AR.length; i++) {
            if (S2_Quatitylist_AR[i].id == Route_Data.id) {

                if (S2_Quatitylist_AR[i].isClicked == false) {
                    S2_Quatitylist_AR[i].isClicked = true
                    S2_Quatitylist_AR[i].Is_QtyCount = Route_Data.Is_QtyCount
                } else {
                    S2_Quatitylist_AR[i].isClicked = false
                    S2_Quatitylist_AR[i].Is_QtyCount = 0
                }
            }
        }

        for (let i = 0; i < S2_Quatitylist_AR.length; i++) {
            if (S2_Quatitylist_AR[i].Is_QtyCount != 0) {
                Results_qty += isNaN(parseInt(S2_Quatitylist_AR[i].Is_QtyCount)) == true ? 0 : parseInt(S2_Quatitylist_AR[i].Is_QtyCount)
                Results_Amount += isNaN(parseFloat(S2_Quatitylist_AR[i].Is_QtyCount * S2_Quatitylist_AR[i].engineer_pay_price)) == true ? 0 : parseFloat(S2_Quatitylist_AR[i].Is_QtyCount * S2_Quatitylist_AR[i].engineer_pay_price)
                Results_Units = ++Results_Units
            }
        }
        this.setState({
            S2_Qty_Count: Results_qty,
            S2_Qty_Amount: Results_Amount,
            S2_Qty_Results_Units: Results_Units
        })

        this.forceUpdate()
    }

    S2_InfoMethod(Route_Data, S2_Quatitylist_Response) {
        var addInfoData= S2_Quatitylist_Response.filter((data)=>{
            return data.additional_info=='1';
        });
 
 
        const activeIndex= addInfoData.findIndex((item)=>{
            return item["id"]===Route_Data.id;
        });

        this.setState({
            AddionalInfo_Modal: true,
            activeIndex
        })

        console.log(Route_Data, S2_Quatitylist_Response)
    }

    TS3_Method(RouteName, Route_Data) {
        let C2_QtyArraylist = 0
        for (let i = 0; i < this.state.S2_Quatitylist_Response.length; i++) {
            if (this.state.S2_Quatitylist_Response[i].Is_QtyCount != 0 && this.state.S2_Quatitylist_Response[i].additional_info == "1") {
                C2_QtyArraylist++;
                
            }
        }
        if (RouteName == "Open") {
            this.setState({
                S3_Infostatus: true
            })
        } else {
            if ((this.state.S3_InfoArray.length!==C2_QtyArraylist) && this.state.S3_Section_No == "" && this.state.S3_Distance == "" && this.state.S3_Blockage == "" && this.state.S3_Desilt == "" && this.state.S3_New_Track == "" && this.state.S3_DFESlipNumber == "" && this.state.S3_Comments == "") {
                Snackbar.show({
                    title: 'Enter any one of the info..!',
                    duration: Snackbar.LENGTH_SHORT,
                });
            } else {
                let C2_QtyArraylist = 0
                for (let i = 0; i < this.state.S2_Quatitylist_Response.length; i++) {
                    if (this.state.S2_Quatitylist_Response[i].Is_QtyCount != 0 && this.state.S2_Quatitylist_Response[i].additional_info == "1") {
                        C2_QtyArraylist++;
                    }
                }
                const S3_Info_activeIndex = this.state.activeIndex;
                const InfoArrExist = this.state.S3_InfoArray[S3_Info_activeIndex];
                
                if(!InfoArrExist || Route_Data!==true){
                    if( Route_Data===true){
                        this.state.S3_InfoArray.push({
                            "section_no": this.state.S3_Section_No,
                            "distance": this.state.S3_Distance,
                            "blockage": this.state.S3_Blockage,
                            "desiit": this.state.S3_Desilt,
                            "new_track": this.state.S3_New_Track,
                            "slip_no": this.state.S3_DFESlipNumber,
                            "slip_comments": this.state.S3_Comments,
                            "Is_Status": Route_Data,
                         });
                    } else {
                        this.state.S3_InfoArrayTemp.push({
                            "section_no": this.state.S3_Section_No,
                            "distance": this.state.S3_Distance,
                            "blockage": this.state.S3_Blockage,
                            "desiit": this.state.S3_Desilt,
                            "new_track": this.state.S3_New_Track,
                            "slip_no": this.state.S3_DFESlipNumber,
                            "slip_comments": this.state.S3_Comments,
                            "Is_Status": Route_Data,
                         });
                    }
                }
                else {

                    let S3_InfoArray = [...this.state.S3_InfoArray];
                    // 2. Make a shallow copy of the item you want to mutate
                    let item = {...S3_InfoArray[S3_Info_activeIndex]};
                    // 3. Replace the property you're intested in

                    item.section_no= this.state.S3_Section_No?this.state.S3_Section_No: S3_InfoArray[S3_Info_activeIndex].section_no ,
                    item.distance= this.state.S3_Distance?this.state.S3_Distance:S3_InfoArray[S3_Info_activeIndex].distance,
                    item.blockage= this.state.S3_Blockage?this.state.S3_Blockage:S3_InfoArray[S3_Info_activeIndex].blockage,
                    item.desiit= this.state.S3_Desilt?this.state.S3_Desilt:S3_InfoArray[S3_Info_activeIndex].desiit,
                    item.new_track= this.state.S3_New_Track?this.state.S3_New_Track:S3_InfoArray[S3_Info_activeIndex].new_track,
                    item.slip_no= this.state.S3_DFESlipNumber?this.state.S3_DFESlipNumber:S3_InfoArray[S3_Info_activeIndex].slip_no,
                    item.slip_comments= this.state.S3_Comments?this.state.S3_Comments:S3_InfoArray[S3_Info_activeIndex].slip_comments,
                    item.Is_Status= Route_Data,

                    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
                    S3_InfoArray[S3_Info_activeIndex] = item;
                    // 5. Set the state to our new copy
                    this.setState({S3_InfoArray});
                }
                if (RouteName == "More") {
                    this.setState({
                        S3_Section_No: "", S3_Distance: "", S3_Blockage: "",
                        S3_Desilt: "", S3_New_Track: "", S3_DFESlipNumber: "", S3_Comments: ""
                    })
                } else {
                    this.setState({
                        S3_Section_No: "", S3_Distance: "", S3_Blockage: "",
                        S3_Desilt: "", S3_New_Track: "", S3_DFESlipNumber: "", S3_Comments: "",
                         S3_Infostatus: false,
                         AddionalInfo_Modal: false,
                         activeIndex:''
                    })
                }

                this.forceUpdate()
            }

        }
    }

    S3_ToggleMethod(RouteName, Route_Data) {
        if (RouteName.Is_Status == true) {
            Snackbar.show({
                title: 'Cant Delete this info.!',
                duration: Snackbar.LENGTH_SHORT,
            });
        } else {
            for (hv = 0; hv < this.state.S3_InfoArrayTemp.length; hv++) {
                Id.push(this.state.S3_InfoArrayTemp[hv].section_no)
            }

            var S3_InfoArrayList = this.state.S3_InfoArrayTemp.splice(Id.indexOf(RouteName.section_no), 1);

            this.setState({ S3_InfoArrayTemp: S3_InfoArrayList })
            this.setState({ S3_InfoArrayTemp: Array.from(new Set(this.state.S3_InfoArrayTemp)) })
        }
        this.forceUpdate()
    }



    Total_Amountcalculation(RouteName, Route_Data) {

        const { S2_Quatitylist_Response, S2_Quatitylist_AR } = this.state;

        let Results_qty = 0
        let Results_Amount = 0
        let Results_Units = 0

        try {
            for (i = 0; i < S2_Quatitylist_AR.length; i++) {
                if (S2_Quatitylist_AR[i].isClicked == true && Route_Data.id == S2_Quatitylist_AR[i].id) {
                    if (RouteName > 0) {
                        S2_Quatitylist_AR[i].Is_QtyCount = RouteName
                    } else if (RouteName == 0) {
                        S2_Quatitylist_AR[i].Is_QtyCount = 0
                    }
                }
            }

            for (i = 0; i < S2_Quatitylist_Response.length; i++) {
                if (S2_Quatitylist_Response[i].isClicked == true && Route_Data.id == S2_Quatitylist_Response[i].id) {
                    if (RouteName > 0) {
                        S2_Quatitylist_Response[i].Is_QtyCount = RouteName
                    } else if (RouteName == 0) {
                        S2_Quatitylist_Response[i].Is_QtyCount = 0
                    }
                }
            }

            for (let i = 0; i < S2_Quatitylist_AR.length; i++) {
                if (S2_Quatitylist_AR[i].Is_QtyCount != 0) {
                    Results_qty += isNaN(parseInt(S2_Quatitylist_AR[i].Is_QtyCount)) == true ? 0 : parseInt(S2_Quatitylist_AR[i].Is_QtyCount)
                    Results_Amount += isNaN(parseFloat(S2_Quatitylist_AR[i].Is_QtyCount * S2_Quatitylist_AR[i].engineer_pay_price)) == true ? 0 : parseFloat(S2_Quatitylist_AR[i].Is_QtyCount * S2_Quatitylist_AR[i].engineer_pay_price)
                    Results_Units = ++Results_Units
                }
            }
            this.setState({
                S2_Qty_Count: Results_qty,
                S2_Qty_Amount: Results_Amount,
                S2_Qty_Results_Units: Results_Units
            })
        } catch (err) {

        }
        this.forceUpdate()
    }


    Total_Qtycalculation() {
        const { S2_Quatitylist_AR } = this.state;

        let Results_qty = 0
        let Results_Amount = 0
        let Results_Units = 0

        for (let i = 0; i < S2_Quatitylist_AR.length; i++) {
            if (S2_Quatitylist_AR[i].Is_QtyCount != 0) {
                Results_qty += isNaN(parseInt(S2_Quatitylist_AR[i].Is_QtyCount)) == true ? 0 : parseInt(S2_Quatitylist_AR[i].Is_QtyCount)
                Results_Amount += isNaN(parseFloat(S2_Quatitylist_AR[i].Is_QtyCount * S2_Quatitylist_AR[i].engineer_pay_price)) == true ? 0 : parseFloat(S2_Quatitylist_AR[i].Is_QtyCount * S2_Quatitylist_AR[i].engineer_pay_price)
                Results_Units = ++Results_Units
            }
        }
        this.setState({
            S2_Qty_Count: Results_qty,
            S2_Qty_Amount: Results_Amount,
            S2_Qty_Results_Units: Results_Units
        })
        this.forceUpdate()

    }


    async Open_Docsupload() {
        try {
            const res = await DocumentPicker.pickMultiple({
                type: [DocumentPicker.types.xls,DocumentPicker.types.xlsx,DocumentPicker.types.csv],
            });
            let Docs = []
            for (hv = 0; hv < res.length; hv++) {
                let ext= res[hv].name.match(/\.[0-9a-z]+$/i)[0];
                
                const fileExtension = ext.replace('.','');
                Docs = ({
                    "Docs_Name": res[hv].name,
                    "Docs_URL": res[hv].uri,
                    "Docs_ID": [hv],
                    "Docs_Type":fileExtension
                })
            }

            this.setState({ S6_Docsupload: this.state.S6_Docsupload.concat(Docs) });
            this.forceUpdate()
            Snackbar.show({
                title: 'Document Uploaded..!',
                duration: Snackbar.LENGTH_SHORT,
            });
        } catch (err) {

            if (DocumentPicker.isCancel(err)) {
                Snackbar.show({
                    title: 'User Canceled..!',
                    duration: Snackbar.LENGTH_SHORT,
                });
            } else {
                console.log(err)
                Snackbar.show({
                    title: 'Please try again later..!',
                    duration: Snackbar.LENGTH_SHORT,
                });
            }
        }
    }



    Signature_Method(Route_Data, Sign_OP) {
        if (Route_Data == "Save") {
            if(this.refs["sign"] ){
                this.refs["sign"].saveImage();
                this.setState({SignatureSaved:true});
             }
        } else if (Route_Data == "Reset") {
           
            if(this.refs["sign"]){
                this.refs["sign"].resetImage();
            }
            this.setState({Signature_Image:''});
            Snackbar.show({
                title: 'Image Reset..!',
                duration: Snackbar.LENGTH_SHORT,
            });
        }
    }

   async _onSaveEvent(Sign_OP) {

        //this.Signature_Method("Output", Sign_OP)
        Snackbar.show({
            title: 'Image Uploaded..!',
            duration: Snackbar.LENGTH_SHORT,
        });
        Image_Sign = Sign_OP;
        try {
            const granted = await PermissionsAndroid.requestMultiple(
              [
                  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                 PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
              ]
            );
           
            if (granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
                granted['android.permission.WRITE_EXTERNAL_STORAGE']
                ) {
                    
              var path = `${RNFS.DownloadDirectoryPath}/signature.png`;
            console.log("##ImageSign",Image_Sign); 
             var imgsource = Image_Sign.pathName;
              RNFS.copyFile(imgsource, path).then((success) => {
                  console.log('Success');
                 
                })
                .catch((err) => {
                  console.log("##errorPermission",err.message);
                });
               
            } else {
              console.log("Camera permission denied");
            }
          } catch (err) {
            console.warn(err);
          }
         
    }



    DelteImage_Method(RouteName) {
        var Id = []
        for (hv = 0; hv < this.state.S6_Docsupload.length; hv++) {
            if (RouteName.Docs_ID == hv) {
                Id.push(this.state.S6_Docsupload[hv.Docs_ID])
            }
        }
        this.state.S6_Docsupload.splice(Id.indexOf(RouteName.Docs_ID), 1)
        Snackbar.show({
            title: 'File Deleted..!',
            duration: Snackbar.LENGTH_SHORT,
        });
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

                                    <TS_CircleLIne
                                        Circle_Status={this.state.Add_TimesheetScreenIndex > 4 ? true : false}
                                    />
                                    <TS_Circleview
                                        Circle_Text={"5"}
                                        Circle_Status={this.state.Add_TimesheetScreenIndex > 4 ? true : false}
                                    />

                                    <TS_CircleLIne
                                        Circle_Status={this.state.Add_TimesheetScreenIndex > 5 ? true : false}
                                    />
                                    <TS_Circleview
                                        Circle_Text={"6"}
                                        Circle_Status={this.state.Add_TimesheetScreenIndex > 5 ? true : false}
                                    />

                                    <TS_CircleLIne
                                        Circle_Status={this.state.Add_TimesheetScreenIndex > 6 ? true : false}
                                    />
                                    <TS_Circleview
                                        Circle_Text={"7"}
                                        Circle_Status={this.state.Add_TimesheetScreenIndex > 6 ? true : false}
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
                                                                   // keyboardType={"numeric"}
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
                                                                    <Text style={styles.S1_EngineerList_Text}>{item.full_name}</Text>
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
                                                        <Text style={styles.Bar_HeaderText}>{"Total Pay for job - ?? "}<Text style={styles.Bar_HeaderText}>{this.state.S2_Qty_Amount.toFixed(2)}</Text><Text style={styles.Bar_HeaderText}>{" (Units - " + this.state.S2_Qty_Results_Units + ")"}</Text></Text>
                                                    </View>

                                                    <View style={styles.Container_EP_3} />

                                                    <TouchableWithoutFeedback onPress={Keyboard.dismiss} onPressIn={() => this.Total_Qtycalculation()}>
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
                                                                <View style={{ height: height / 100 * 8, justifyContent: "center", }}>

                                                                    <View style={{ flex: 1,zIndex:-999, justifyContent: "center", flexDirection: 'row', marginBottom: width / 100 * 3, shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.2, shadowColor: LG_BG_THEME.APPTHEME_2, marginLeft: width / 100 * 2, marginRight: width / 100 * 2, opacity: item.isClicked == true ? 1 : 0.4 }}>

                                                                        <TouchableOpacity onPress={() => this.Container_Model("Code Items", true, item)} style={{ flex: 0.32, justifyContent: 'center', backgroundColor: item.isClicked == true ? LG_BG_THEME.APPTHEME_1 : LG_BG_THEME.WHITE_THEME, }}>
                                                                            <Text numberOfLines={2} style={item.isClicked == true ? styles.S2_Qty_WLMedium : styles.S2_Qty_BLMedium}>{" " + item.item_code}</Text>
                                                                            <Image source={require('../../../../Asset/Icons/search.png')} style={{ width: width / 100 * 3, height: width / 100 * 3, tintColor: item.isClicked == false ? LG_BG_THEME.APPTHEME_1 : LG_BG_THEME.WHITE_THEME, position: "absolute", marginLeft: width / 100 * 1 }} />
                                                                        </TouchableOpacity>

                                                                        <View style={{ flex: 0.2, justifyContent: 'center', backgroundColor: item.isClicked == true ? LG_BG_THEME.APPTHEME_1 : LG_BG_THEME.WHITE_THEME, opacity: 0.8 }}>
                                                                            <View style={{ flex: 1, justifyContent: "center", }}>
                                                                                <TextInput
                                                                                    placeholder={"0"}
                                                                                    returnKeyType="go"
                                                                                    editable={(item.isClicked)}
                                                                                    keyboardType={"number-pad"}
                                                                                    underlineColorAndroid='transparent'
                                                                                    selectionColor={LG_BG_THEME.APPTHEME_BLACK}
                                                                                    placeholderTextColor={item.isClicked == true ? LG_BG_THEME.WHITE_THEME : LG_BG_THEME.APPTHEME_BLACK}
                                                                                    style={item.isClicked == true ? styles.container_WhiteText : styles.container_Text}
                                                                                    onChangeText={text => { this.Total_Amountcalculation(text, item) }}
                                                                                    onSubmitEditing={() => this.Total_Qtycalculation()}
                                                                                    value={this.state.S2_Quatitylist_Response[index].Is_QtyCount}
                                                                                />
                                                                            </View>
                                                                        </View>


                                                                        <View style={{ flex: 0.33, justifyContent: 'center', backgroundColor: item.isClicked == true ? LG_BG_THEME.APPTHEME_1 : LG_BG_THEME.WHITE_THEME, }}>
                                                                            <View style={{ flex: 0.05, justifyContent: 'center' }} />
                                                                            <View style={{ flex: 0.45, justifyContent: 'center' }}>
                                                                                <Text numberOfLines={2} style={item.isClicked == true ? styles.S2_Qty_WMedium : styles.S2_Qty_BMedium}>{isNaN((item.engineer_pay_price * item.Is_QtyCount).toFixed(2)) == true ? "?? 0.0" : "?? " + (item.engineer_pay_price * item.Is_QtyCount).toFixed(2)}</Text>
                                                                            </View>

                                                                            <View style={{ flex: 0.45, justifyContent: 'center' }}>
                                                                                <Text numberOfLines={2} style={item.isClicked == true ? styles.S2_Qty_WSmall : styles.S2_Qty_BSmall}>{"?? " + item.engineer_pay_price + " (PP)"}</Text>
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

                                                                    {item.additional_info == "1" ?
                                                                        <View style={{ flex: 1, justifyContent: 'center',zIndex:1000000, position: "absolute", flexDirection: "row", top: - (width / 100 * 1) }}>
                                                                            <View style={{ flex: 0.8, justifyContent: 'center', }} />
                                                                            <TouchableOpacity onPress={() => this.S2_InfoMethod(item, this.state.S2_Quatitylist_Response)} style={{ flex: 0.2, justifyContent: "flex-start", alignItems: "flex-start", }}>
                                                                                <Image source={require('../../../../Asset/Icons/Ball_Info.png')} style={{ width: width / 100 * 5, height: width / 100 * 5, tintColor: LG_BG_THEME.LIGHTGREY_THEME, transform: [{ rotate: '0deg' }] }} />
                                                                            </TouchableOpacity>

                                                                        </View>
                                                                        :

                                                                        null
                                                                    }
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
                                                                                       // keyboardType={"numeric"}
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
                                                                                       // keyboardType={"numeric"}
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
                                                                                      //  keyboardType={"numeric"}
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
                                                                                      //  keyboardType={"numeric"}
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
                                                                                       // keyboardType={"numeric"}
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
                                                                            <View style={styles.Container_EP_4} />

                                                                            <View style={{ height: height / 100 * 16, justifyContent: "center" }}>
                                                                                <View style={{ flex: 0.45, justifyContent: "center", }}>
                                                                                    <CM_ButtonDesign
                                                                                        CMB_BuutonColourcode={LG_BG_THEME.APPTHEME_Blue}
                                                                                        onPress_BuutonView={() => this.TS3_Method("More", false)}
                                                                                        CMB_TextHeader={"Save & Add more"}
                                                                                    />
                                                                                </View>

                                                                                <View style={{ flex: 0.1 }} />

                                                                                <View style={{ flex: 0.45, justifyContent: "center", }}>
                                                                                    <CM_ButtonDesign
                                                                                        CMB_BuutonColourcode={LG_BG_THEME.APPTHEME_Blue}
                                                                                        onPress_BuutonView={() => this.TS3_Method("Close", false)}
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

                                                                                <View style={styles.Container_EP_4} />

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
                                                                                                placeholderTextColor={LG_BG_THEME.APPTHEME_GREY_2}
                                                                                                style={styles.container_Text}
                                                                                                onChangeText={(S3_TextComments) => this.setState({ S3_TextComments })}
                                                                                                value={this.state.S3_TextComments}
                                                                                            //onSubmitEditing={() => this.refs.Exchange.focus()}
                                                                                            />
                                                                                        </View>
                                                                                    </View>
                                                                                </View>
                                                                            </View>
                                                                            :

                                                                            <View style={{ flex: 1, }}>

                                                                                <View style={styles.Container_EP_2} />

                                                                                <View style={{ height: height / 100 * 8, justifyContent: "center", backgroundColor: LG_BG_THEME.APPTHEME_2 }}>

                                                                                   
                                                                                    <Text style={styles.Bar_HeaderText}>{"Total Selections Added - " + (this.state.S3_InfoArray.length + this.state.S3_InfoArrayTemp.length)}</Text>
                                                                                </View>

                                                                                <View style={styles.Container_EP_1} />

                                                                                <View style={{ height: height / 100 * 6, justifyContent: "center", flexDirection: 'row', opacity: 0.8 }}>
                                                                                    <View style={{ flex: 0.3, justifyContent: 'center', }}>
                                                                                        <Text style={styles.S2_container_BlackText}>{"Section No / Chamber ID"}</Text>
                                                                                    </View>
                                                                                    <View style={{ flex: 0.2, justifyContent: 'center', }}>
                                                                                        <Text style={styles.S2_container_BlackText}>{"Distance (m)"}</Text>
                                                                                    </View>
                                                                                    <View style={{ flex: 0.4, justifyContent: 'center', }}>
                                                                                        <Text style={styles.S2_container_BlackText}>{"Blockage / Per A55"}</Text>
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
                                                                                            <Text style={styles.S2_container_BlackText}>{item.distance}</Text>
                                                                                        </View>
                                                                                        <View style={{ flex: 0.4, justifyContent: 'center', backgroundColor: LG_BG_THEME.WHITE_THEME, opacity: 0.8 }}>
                                                                                            <Text style={styles.S2_container_BlackText}>{item.blockage}</Text>
                                                                                        </View>
                                                                                        {item.Is_Status !==true &&
                                                                                        <TouchableOpacity onPress={() => this.S3_ToggleMethod(item, index)} style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                                                                                            <Image source={require('../../../../Asset/Icons/Delete_Icon.png')} style={{ width: width / 100 * 5, height: width / 100 * 5, tintColor: LG_BG_THEME.APPTHEME_BLACK, }} />
                                                                                        </TouchableOpacity>
                                                                                        }
                                                                                    </View>
                                                                                ))}


                                                                                {this.state.S3_InfoArrayTemp.map((item, index) => (

                                                                                <View style={{ height: height / 100 * 7, justifyContent: "center", flexDirection: 'row', marginBottom: width / 100 * 3, elevation: Platform.OS == "android" ? width / 100 * 1 : width / 100 * 0.1, shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.2, shadowColor: LG_BG_THEME.APPTHEME_2, }}>
                                                                                    <TouchableOpacity onPress={() => this.Container_Model("Info Items", true, item)} style={{ flex: 0.3, justifyContent: 'center', backgroundColor: LG_BG_THEME.WHITE_THEME, opacity: 0.8 }}>
                                                                                        <Text style={styles.S2_container_BlackText}>{item.section_no}</Text>
                                                                                        <Image source={require('../../../../Asset/Icons/search.png')} style={{ width: width / 100 * 4, height: width / 100 * 4, tintColor: LG_BG_THEME.APPTHEME_1, position: "absolute", marginLeft: width / 100 * 1 }} />

                                                                                    </TouchableOpacity>
                                                                                    <View style={{ flex: 0.2, justifyContent: 'center', backgroundColor: LG_BG_THEME.APPTHEME_GREY_2, }}>
                                                                                        <Text style={styles.S2_container_BlackText}>{item.distance}</Text>
                                                                                    </View>
                                                                                    <View style={{ flex: 0.4, justifyContent: 'center', backgroundColor: LG_BG_THEME.WHITE_THEME, opacity: 0.8 }}>
                                                                                        <Text style={styles.S2_container_BlackText}>{item.blockage}</Text>
                                                                                    </View>
                                                                                    {item.Is_Status !==true &&
                                                                                    <TouchableOpacity onPress={() => this.S3_ToggleMethod(item, index)} style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                                                                                        <Image source={require('../../../../Asset/Icons/Delete_Icon.png')} style={{ width: width / 100 * 5, height: width / 100 * 5, tintColor: LG_BG_THEME.APPTHEME_BLACK, }} />
                                                                                    </TouchableOpacity>
                                                                                    }
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
                                                                <Text style={styles.Bar_HeaderText}>{"Total Pay for job - ?? "}<Text style={styles.Bar_HeaderText}>{this.state.S2_Qty_Amount.toFixed(2)}</Text><Text style={styles.Bar_HeaderText}>{" (Units - " + this.state.S2_Qty_Results_Units + ")"}</Text></Text>
                                                            </View>
                                                            <View style={styles.Container_EP_2} />
                                                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                                                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>

                                                                    {this.state.S4_CostPercentage.map((item, index) => (

                                                                        <View style={{ flex: 1, justifyContent: "center", }}>

                                                                            <View style={{ height: height / 100 * 6, justifyContent: "center", alignItems: "flex-start", opacity: 0.6, elevation: Platform.OS == "android" ? width / 100 * 1 : width / 100 * 0.1, shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.2, shadowColor: LG_BG_THEME.APPTHEME_2, }}>
                                                                                <Text style={styles.S2_Qty_BMedium}>{this.state.S1_Engineer_DataArray[index].full_name}</Text>
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
                                                                                        value={item?parseInt(item).toFixed(0):''}
                                                                                    />
                                                                                </View>

                                                                                <View style={{ flex: 1, justifyContent: 'center', backgroundColor: LG_BG_THEME.APPTHEME_1 }}>
                                                                                    <Text style={styles.S2_Qty_WMedium}>{"?? " + ((this.state.S2_Qty_Amount * item) / 100).toFixed(2)}</Text>
                                                                                </View>
                                                                            </View>
                                                                        </View>
                                                                    ))}


                                                                    <View style={styles.Container_EP_2} />
                                                                </ScrollView>

                                                            </TouchableWithoutFeedback>

                                                        </View>
                                                        : this.state.Add_TimesheetScreen == "Step 6" ?

                                                            <View style={{ flex: 1}}>
                                                                <ScrollView  contentContainerStyle= {{justifyContent: "center" }}>


                                                                <View style={styles.Container_EP_2} />


                                                                <TS_HeadingView
                                                                    ASB_Text={"Signature Capture"}
                                                                />
                                                                <View style={styles.Container_EP_1} />
                                                                {!this.state.Signature_Image? 
                                                                <SignatureCapture
                                                                    style={{ flex: 1,height:350, borderColor: '#000033', borderWidth: 1 }}
                                                                    ref="sign"
                                                                    //rotateClockwise={true}
                                                                    onSaveEvent={this._onSaveEvent}
                                                                    onDragEvent={this._onDragEvent}
                                                                    saveImageFileInExtStorage={true}
                                                                    showNativeButtons={false}
                                                                    showTitleLabel={false}
                                                                    backgroundColor={LG_BG_THEME.WHITE_THEME}
                                                                    strokeColor={LG_BG_THEME.APPTHEME_1}
                                                                    minStrokeWidth={4}
                                                                    maxStrokeWidth={4}
                                                                    viewMode={"portrait"} />
                                                                    :
                                                                    this.state.SignatureSaved ? 
                                                                    <Image style={{width: 320, height: 400}} source={{uri: `data:${this.state.Signature_Image}`}}/> 
                                                                    :<Image style={{width: 320, height: 400}} source={{uri: `https://appbox.website/casstimesheet_beta/${this.state.Signature_Image}`}}/> 
                                                                    }

                                                                <View style={styles.Container_EP_2} />


                                                                <View style={{ height: height / 100 * 8, justifyContent: "center", flexDirection: 'row' }}>


                                                                    <View style={{ flex: 0.47, justifyContent: "center", }}>
                                                                        <CM_BoxButton
                                                                            CMB_BuutonColourcode={LG_BG_THEME.WHITE_THEME}
                                                                            onPress_BuutonView={() => this.Signature_Method("Reset", "")}
                                                                            CMB_TextHeader={"Reset"}
                                                                            Image_Status={true}
                                                                        />
                                                                    </View>

                                                                    <View style={{ flex: 0.06 }} />
                                                                    <View style={{ flex: 0.47, justifyContent: "center", }}>
                                                                        <CM_BoxButton
                                                                            CMB_BuutonColourcode={LG_BG_THEME.WHITE_THEME}
                                                                            onPress_BuutonView={() => this.Signature_Method("Save", "")}
                                                                            CMB_TextHeader={"Save"}
                                                                            Image_Status={true}
                                                                        />
                                                                    </View>

                                                                </View>

                                                                <View style={styles.Container_EP_2} />
                                                                </ScrollView>
                                                            </View>

                                                            : this.state.Add_TimesheetScreen == "Step 5" ?

                                                                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                                                    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>

                                                                        <View style={{ flex: 1, flexDirection: "column" }}>

                                                                            <View style={styles.Container_EP_2} />

                                                                            <TS_HeadingView
                                                                                ASB_Text={"Document Upload"}
                                                                            />

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

                                                                                            <TouchableOpacity onPress={() => this.DelteImage_Method(item)} style={{ flex: 0.1, justifyContent: "center" }}>
                                                                                                <Image source={require('../../../../Asset/Icons/Delete_Icon.png')} style={{ width: width / 100 * 5, height: width / 100 * 5, tintColor: LG_BG_THEME.APPTHEME_BLACK, }} />
                                                                                            </TouchableOpacity>
                                                                                        </View>
                                                                                    ))}
                                                                                    <View style={styles.Container_EP_2} />

                                                                                </View>
                                                                            }


                                                                            <CM_BoxButton
                                                                                CMB_BuutonColourcode={LG_BG_THEME.APPTHEME_1}
                                                                                onPress_BuutonView={() => this.Open_Docsupload("Next")}
                                                                                CMB_TextHeader={"Document Upload"}
                                                                            />
                                                                        </View>


                                                                    </ScrollView>

                                                                </TouchableWithoutFeedback>

                                                                : <View style={{ flex: 1, justifyContent: "center" }}>


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
                                                                                                <Text style={styles.container_Text}>{this.state.S2_Qty_Count}</Text>
                                                                                            </View>
                                                                                        </View>
                                                                                    </View>

                                                                                    <View style={styles.Container_EP_2} />

                                                                                    <View style={{ height: height / 100 * 8, justifyContent: "center", backgroundColor: LG_BG_THEME.APPTHEME_2 }}>
                                                                                        <Text style={styles.Bar_HeaderText}>{"Total Pay for job - ?? "}<Text style={styles.Bar_HeaderText}>{this.state.S2_Qty_Amount.toFixed(2)}</Text><Text style={styles.Bar_HeaderText}>{" (Units -" + this.state.S2_QtyArraylist_Preview.length + ")"}</Text></Text>
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
                                                                                                <Text numberOfLines={2} style={styles.S2_Qty_WMedium}>{item.Is_QtyCount}</Text>
                                                                                            </View>

                                                                                            <View style={{ flex: 0.35, justifyContent: 'center', backgroundColor: LG_BG_THEME.APPTHEME_1 }}>
                                                                                                <View style={{ flex: 0.05, justifyContent: 'center' }} />
                                                                                                <View style={{ flex: 0.45, justifyContent: 'center' }}>
                                                                                                    <Text numberOfLines={2} style={styles.S2_Qty_WMedium}>{isNaN((item.engineer_pay_price * item.Is_QtyCount).toFixed(2)) == true ? "?? 0.0" : "?? " + (item.engineer_pay_price * item.Is_QtyCount).toFixed(2)}</Text>
                                                                                                </View>

                                                                                                <View style={{ flex: 0.45, justifyContent: 'center' }}>
                                                                                                    <Text numberOfLines={2} style={styles.S2_Qty_WSmall}>{"?? " + item.engineer_pay_price + " (PP)"}</Text>
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

                                                                                                    <Text style={styles.Bar_HeaderText}>{"Total Selections Added - " + (this.state.S3_InfoArray.length +this.state.S3_InfoArrayTemp.length )}</Text>
                                                                                                    </View>

                                                                                                    <View style={styles.Container_EP_1} />

                                                                                                    <View style={{ height: height / 100 * 6, justifyContent: "center", flexDirection: 'row', opacity: 0.8 }}>
                                                                                                        <View style={{ flex: 0.3, justifyContent: 'center', }}>
                                                                                                            <Text style={styles.S2_container_BlackText}>{"Section No / Chamber ID"}</Text>
                                                                                                        </View>
                                                                                                        <View style={{ flex: 0.2, justifyContent: 'center', }}>
                                                                                                            <Text style={styles.S2_container_BlackText}>{"Distance (m)"}</Text>
                                                                                                        </View>
                                                                                                        <View style={{ flex: 0.4, justifyContent: 'center', }}>
                                                                                                            <Text style={styles.S2_container_BlackText}>{"Blockage / Per A55"}</Text>
                                                                                                        </View>
                                                                                                        <View style={{ flex: 0.1, justifyContent: 'center', }} />
                                                                                                    </View>

                                                                                                    <View style={styles.Container_EP_1} />

                                                                                                    {this.state.S3_InfoArray.map((item, index) => (

                                                                                                        <View style={{ height: height / 100 * 7, justifyContent: "flex-start", flexDirection: 'row', marginBottom: width / 100 * 3, elevation: Platform.OS == "android" ? width / 100 * 1 : width / 100 * 0.1, shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.2, shadowColor: LG_BG_THEME.APPTHEME_2 }}>
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

                                                                                                    {this.state.S3_InfoArrayTemp.map((item, index) => (

                                                                                                    <View style={{ height: height / 100 * 7, justifyContent: "flex-start", flexDirection: 'row', marginBottom: width / 100 * 3, elevation: Platform.OS == "android" ? width / 100 * 1 : width / 100 * 0.1, shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.2, shadowColor: LG_BG_THEME.APPTHEME_2 }}>
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
                                                                                            <Text style={styles.Bar_HeaderText}>{"Total Pay for job - ?? "}<Text style={styles.Bar_HeaderText}>{this.state.S2_Qty_Amount.toFixed(2)}</Text><Text style={styles.Bar_HeaderText}>{" (Units -" + this.state.S2_QtyArraylist_Preview.length + ")"}</Text></Text>
                                                                                        </View>
                                                                                        <View style={styles.Container_EP_2} />

                                                                                        {this.state.S4_CostPercentage.map((item, index) => (

                                                                                            <View style={{ flex: 1, justifyContent: "center", }}>

                                                                                                <View style={{ height: height / 100 * 6, justifyContent: "center", alignItems: "flex-start", opacity: 0.6, elevation: Platform.OS == "android" ? width / 100 * 1 : width / 100 * 0.1, shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.2, shadowColor: LG_BG_THEME.APPTHEME_2, }}>
                                                                                                    <Text style={styles.S2_Qty_BMedium}>{this.state.S1_Engineer_DataArray[index].full_name}</Text>
                                                                                                </View>

                                                                                                <View style={{ height: height / 100 * 6, justifyContent: "center", flexDirection: "row", marginLeft: width / 100 * 2, marginRight: width / 100 * 2 }}>
                                                                                                    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: LG_BG_THEME.WHITE_THEME }}>
                                                                                                        <Text style={styles.S2_Qty_BMedium}>{"% " + (item)}</Text>
                                                                                                    </View>

                                                                                                    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: LG_BG_THEME.APPTHEME_1 }}>
                                                                                                        <Text style={styles.S2_Qty_WMedium}>{"?? " + ((this.state.S2_Qty_Amount * item) / 100).toFixed(2)}</Text>
                                                                                                    </View>
                                                                                                </View>
                                                                                            </View>
                                                                                        ))}


                                                                                        <View style={styles.Container_EP_2} />

                                                                                    </View>
                                                                                    <TS_HeadingView  ASB_Text={"Document Uploaded"}  />
                                                                                    {this.state.S6_Docsupload.length == 0 ? null :
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
                                                                                    {this.state.SignatureSaved ?
                                                                                    <Image style={{width: 320, height: 400}} source={{uri: `data:${this.state.Signature_Image}`}}/> 
                                                                                   : <Image style={{width: 320, height: 400}} source={{uri: `https://appbox.website/casstimesheet_beta/${this.state.Signature_Image}`}}/> 
                                                                                }
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
                                                                    CMB_BuutonColourcode={LG_BG_THEME.APPTHEME_Blue}
                                                                    onPress_BuutonView={() => this.Timesheet_Method("Preview")}
                                                                    CMB_TextHeader={"Next"}
                                                                />
                                                            </View>

                                                        </View>


                                                        : this.state.Add_TimesheetScreen == "Step 6" ?
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
                                                                        CMB_TextHeader={"Next"}
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
                                                                            CMB_TextHeader={"Preview"}
                                                                        />
                                                                    </View>

                                                                </View>
                                                                : this.state.Add_TimesheetScreen == "Step 7" ?
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
                                                                        <Text numberOfLines={2} style={{ fontSize: fontSize.Medium, fontFamily: fontFamily.Poppins_Regular, letterSpacing: width / 100 * 0.1, color: color.Font_Black, textAlign: "left", marginLeft: width / 100 * 2 }}>{item.full_name}</Text>
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
                                                                    <Text numberOfLines={2} style={styles.Modal_TextStyle}>{"Section No / Chamber ID : " + this.state.Modal_SectionNo}</Text>
                                                                </View>
                                                                <View style={{ height: width / 100 * 8, justifyContent: 'center' }}>
                                                                    <Text numberOfLines={2} style={styles.Modal_TextStyle}>{"Distance (m) : " + this.state.Modal_Distance}</Text>
                                                                </View>
                                                                <View style={{ height: width / 100 * 8, justifyContent: 'center' }}>
                                                                    <Text numberOfLines={2} style={styles.Modal_TextStyle}>{"Blockage / Per A55 : " + this.state.Modal_Blockage}</Text>
                                                                </View>
                                                                <View style={{ height: width / 100 * 8, justifyContent: 'center' }}>
                                                                    <Text numberOfLines={2} style={styles.Modal_TextStyle}>{"CBTs : " + this.state.Modal_Desiit}</Text>
                                                                </View>
                                                                <View style={{ height: width / 100 * 8, justifyContent: 'center' }}>
                                                                    <Text numberOfLines={2} style={styles.Modal_TextStyle}>{"Bars: " + this.state.Modal_Newtrack}</Text>
                                                                </View>
                                                                <View style={{ height: width / 100 * 8, justifyContent: 'center' }}>
                                                                    <Text numberOfLines={2} style={styles.Modal_TextStyle}>{"Mobras : " + this.state.Modal_SlipNo}</Text>
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
                                            // minDate={new Date(new Date().getTime() - (86400000 * 30))}
                                            // maxDate={new Date(new Date().getTime())}
                                            // weekdays={['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']}
                                            // months={['Janeiro', 'Fevereiro', 'Mar??o', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']}
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


                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={this.state.AddionalInfo_Modal}
                    animationType="slide"
                    onRequestClose={() => { this.setState({ AddionalInfo_Modal: false }) }}>

                    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>

                        <TouchableOpacity onPress={() => this.setState({ AddionalInfo_Modal: false })} style={{ flex: 0.2 }} />

                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                                <View style={{ flex: 0.8, backgroundColor: LG_BG_THEME.WHITE_THEME, flexDirection: 'row' }}>
                                    <View style={{ flex: 0.05 }} />

                                    <View style={{ flex: 0.9, backgroundColor: LG_BG_THEME.WHITE_THEME }}>
                                        <View style={styles.Container_EP_2} />

                                        <TS_HeadingView
                                            ASB_Text={"Additional Info"}
                                        />


                                        <View style={styles.Container_EP_2} />

                                        <View style={styles.container_TextInputOverview}>
                                            <View style={{ flex: 1, justifyContent: "center", }}>
                                                <TextInput
                                                    placeholder='Section No / Chamber ID'
                                                    ref='Section_No'
                                                    returnKeyType='next'
                                                   // keyboardType={"numeric"}
                                                    selectionColor={LG_BG_THEME.APPTHEME_BLACK}
                                                    underlineColorAndroid='transparent'
                                                    placeholderTextColor={LG_BG_THEME.APPTHEME_GREY_2}
                                                    style={styles.container_Text}
                                                    onChangeText={(S3_Section_No) => this.setState({ S3_Section_No })}
                                                    onSubmitEditing={() => this.refs.Distance.focus()}
                                                    value={
                                                        this.state.S3_Section_No? this.state.S3_Section_No:
                                                       (this.state.S3_InfoArray.length>0&&
                                                        this.state.S3_InfoArray[this.state.activeIndex]?this.state.S3_InfoArray[this.state.activeIndex].section_no:'')}
                                                />
                                            </View>
                                        </View>
                                        <View style={styles.Container_EP_3} />

                                        <View style={styles.container_TextInputOverview}>
                                            <View style={{ flex: 1, justifyContent: "center", }}>
                                                <TextInput
                                                    placeholder='Distance (m)'
                                                    ref='Distance'
                                                    returnKeyType='next'
                                                   // keyboardType={"numeric"}
                                                    selectionColor={LG_BG_THEME.APPTHEME_BLACK}
                                                    underlineColorAndroid='transparent'
                                                    placeholderTextColor={LG_BG_THEME.APPTHEME_GREY_2}
                                                    style={styles.container_Text}
                                                    onChangeText={(S3_Distance) => this.setState({ S3_Distance })}
                                                    onSubmitEditing={() => this.refs.Blockage.focus()}
                                                    value={
                                                        this.state.S3_Distance? this.state.S3_Distance:
                                                        (this.state.S3_InfoArray.length>0&&
                                                        this.state.S3_InfoArray[this.state.activeIndex]?this.state.S3_InfoArray[this.state.activeIndex].distance:'')}
                                                />
                                            </View>
                                        </View>
                                        <View style={styles.Container_EP_3} />

                                        <View style={styles.container_TextInputOverview}>
                                            <View style={{ flex: 1, justifyContent: "center", }}>
                                                <TextInput
                                                    placeholder='Blockage / Per A55'
                                                    ref='Blockage'
                                                    returnKeyType='next'
                                                    //keyboardType={"numeric"}
                                                    selectionColor={LG_BG_THEME.APPTHEME_BLACK}
                                                    underlineColorAndroid='transparent'
                                                    placeholderTextColor={LG_BG_THEME.APPTHEME_GREY_2}
                                                    style={styles.container_Text}
                                                    onChangeText={(S3_Blockage) => this.setState({ S3_Blockage })}
                                                    onSubmitEditing={() => this.refs.Desilt.focus()}
                                                    value={
                                                        this.state.S3_Blockage? this.state.S3_Blockage:
                                                        (this.state.S3_InfoArray.length>0&&
                                                        this.state.S3_InfoArray[this.state.activeIndex]?this.state.S3_InfoArray[this.state.activeIndex].blockage:'')}
                                                />
                                            </View>
                                        </View>

                                        <View style={styles.Container_EP_3} />

                                        <View style={styles.container_TextInputOverview}>
                                            <View style={{ flex: 1, justifyContent: "center", }}>
                                                <TextInput
                                                    placeholder='CBTs'
                                                    ref='Desilt'
                                                    returnKeyType='next'
                                                    //keyboardType={"numeric"}
                                                    selectionColor={LG_BG_THEME.APPTHEME_BLACK}
                                                    underlineColorAndroid='transparent'
                                                    placeholderTextColor={LG_BG_THEME.APPTHEME_GREY_2}
                                                    style={styles.container_Text}
                                                    onChangeText={(S3_Desilt) => this.setState({ S3_Desilt })}
                                                    onSubmitEditing={() => this.refs.New_Track.focus()}
                                                    value={
                                                        this.state.S3_Desilt? this.state.S3_Desilt:
                                                        (this.state.S3_InfoArray.length>0&&
                                                        this.state.S3_InfoArray[this.state.activeIndex]?this.state.S3_InfoArray[this.state.activeIndex].desiit:'')}

                                                />
                                            </View>
                                        </View>

                                        <View style={styles.Container_EP_3} />

                                        <View style={styles.container_TextInputOverview}>
                                            <View style={{ flex: 1, justifyContent: "center", }}>
                                                <TextInput
                                                    placeholder='Bars'
                                                    ref='New_Track'
                                                    returnKeyType='next'
                                                  //  keyboardType={"numeric"}
                                                    underlineColorAndroid='transparent'
                                                    selectionColor={LG_BG_THEME.APPTHEME_BLACK}
                                                    placeholderTextColor={LG_BG_THEME.APPTHEME_GREY_2}
                                                    style={styles.container_Text}
                                                    onChangeText={(S3_New_Track) => this.setState({ S3_New_Track })}
                                                    onSubmitEditing={() => this.refs.DFESlipNumber.focus()}
                                                    value={
                                                        this.state.S3_New_Track? this.state.S3_New_Track:
                                                        (this.state.S3_InfoArray.length>0&&
                                                        this.state.S3_InfoArray[this.state.activeIndex]?this.state.S3_InfoArray[this.state.activeIndex].new_track:'')}

                                                />
                                            </View>
                                        </View>

                                        <View style={styles.Container_EP_3} />

                                        <View style={styles.container_TextInputOverview}>
                                            <View style={{ flex: 1, justifyContent: "center", }}>
                                                <TextInput
                                                    placeholder='Mobras'
                                                    ref='DFESlipNumber'
                                                    returnKeyType='next'
                                                    //keyboardType={"numeric"}
                                                    selectionColor={LG_BG_THEME.APPTHEME_BLACK}
                                                    underlineColorAndroid='transparent'
                                                    placeholderTextColor={LG_BG_THEME.APPTHEME_GREY_2}
                                                    style={styles.container_Text}
                                                    onChangeText={(S3_DFESlipNumber) => this.setState({ S3_DFESlipNumber })}
                                                    onSubmitEditing={() => this.refs.Comments.focus()}
                                                    value={
                                                        this.state.S3_DFESlipNumber? this.state.S3_DFESlipNumber:
                                                        (this.state.S3_InfoArray.length>0&&
                                                        this.state.S3_InfoArray[this.state.activeIndex]?this.state.S3_InfoArray[this.state.activeIndex].slip_no:'')}

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
                                                        placeholderTextColor={LG_BG_THEME.APPTHEME_GREY_2}
                                                        style={styles.container_Text}
                                                        onChangeText={(S3_Comments) => this.setState({ S3_Comments })}
                                                        value={
                                                            this.state.S3_Comments? this.state.S3_Comments:
                                                            (this.state.S3_InfoArray.length>0&&
                                                            this.state.S3_InfoArray[this.state.activeIndex]?this.state.S3_InfoArray[this.state.activeIndex].slip_comments:'')}
                                                    //onSubmitEditing={() => this.refs.Exchange.focus()}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                        <View style={styles.Container_EP_4} />

                                        <View style={{ height: height / 100 * 10, justifyContent: "center" }}>

                                            <View style={{ flex: 1, justifyContent: "center", }}>
                                                <CM_ButtonDesign
                                                    CMB_BuutonColourcode={LG_BG_THEME.APPTHEME_Blue}
                                                    onPress_BuutonView={() => this.TS3_Method("Close", true)}
                                                    CMB_TextHeader={"Save & Close"}
                                                />
                                            </View>
                                        </View>

                                        <View style={styles.Container_EP_4} />
                                        <View style={styles.Container_EP_4} />

                                    </View>

                                    <View style={{ flex: 0.05 }} />

                                </View>
                            </ScrollView>
                        </TouchableWithoutFeedback>
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
