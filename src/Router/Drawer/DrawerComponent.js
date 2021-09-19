import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    ScrollView,
    Image,
    Alert,
    TouchableWithoutFeedback,
    Platform,
    AsyncStorage, Share, Linking, Modal, Dimensions,
} from 'react-native';

import { NavigationActions, connect, LinearGradient } from './../../Asset/Libraries/NpmList';
import { fontSize, color, width, height, fontFamily, LG_BG_THEME } from './../../Components/Constants/fontsAndColors';
// import { checkNetworkPermission, CheckRuntimePermission } from './../../Components/Utils';
import { drawerComponentStyle } from './../../Components/Commons/Styles';

import { debounce } from 'lodash';

export class DrawerComponent extends Component {
    constructor(props) {
        console.disableYellowBox = true;
        super(props);
        this.state = {
            Token: "",
            Alert_Design_isVisible: false,
            Alert_Design_Appupdate: "0_Start",
            KKR_User_Name:""

        }
        this.navigateToScreen = debounce(this.navigateToScreen.bind(this), 1000, {
            leading: true,
            trailing: false,
        });
    }

    componentDidMount() {
       
    }


    navigateToScreen(route) {
       
            if (route == "Login_Screen") {

                Alert.alert(
                    'Closing App..!',
                    'Are you sure, You want to Logout ?',
                    [
                      { text: 'YES', onPress: () => this.onLogout_Exit(route) },
                      { text: 'NO', style: 'cancel' },
            
                    ],
                    { cancelable: false }
                  )
                  return true
 
            } else {
                const navigateAction = NavigationActions.navigate({
                    routeName: route
                });
                this.props.navigation.dispatch(navigateAction);
                this.props.navigation.navigate("DrawerClose");

            }



    }

    onLogout_Exit(route){
        // const navigateAction = NavigationActions.navigate({
        //     routeName: route
        // });
        // this.props.navigation.dispatch(navigateAction);
        // this.props.navigation.navigate("DrawerClose");
        // AsyncStorage.setItem('KKR_User_ID', "0", () => {

        // });
    }
   


    render() {

        return (
            <View style={{ flex: 1, backgroundColor: LG_BG_THEME.APPTHEME_1 }}>
            </View>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        // CommonReducer: state.CommonReducer
    };
}

const mapDispatchToProps = (dispatch) => {
    return {


    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DrawerComponent);
