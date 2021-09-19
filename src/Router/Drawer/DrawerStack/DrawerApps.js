import React, { Component } from 'react';
import { View, Dimensions, Image, ScrollView} from 'react-native';
import RightToLeftTransition from '../../../Asset/Libraries/RightToLeftTransition';
import { StackNavigator, TabNavigator } from 'react-navigation';
import { fontSize, color, width, height, BG_THEMECOLOUR, fontFamily, LG_BG_THEME } from '../../../Components/Constants/fontsAndColors';


////.......Registration_Modules......./////
import Login_Screen from '../../../Components/Modules/Class_Modules/Registration_Modules/Login_Screen'

////.......Main_Modules......./////
import Dashboard from '../../../Components/Modules/Class_Modules/Main_Modules/Dashboard'
import Notification_Screen from '../../../Components/Modules/Class_Modules/Main_Modules/Notification_Screen'
import Edit_Settings from '../../../Components/Modules/Class_Modules/Settings_Modules/Edit_Settings'
import Change_Password from '../../../Components/Modules/Class_Modules/Settings_Modules/Change_Password'

////.......Timesheets_Modules......./////
import Add_Leave from '../../../Components/Modules/Class_Modules/Timesheets_Modules/Add_Leave'
import Add_Timesheet from '../../../Components/Modules/Class_Modules/Timesheets_Modules/Add_Timesheet'
import AddMore_Timesheet from '../../../Components/Modules/Class_Modules/Timesheets_Modules/AddMore_Timesheet'
import View_Timesheets from '../../../Components/Modules/Class_Modules/Timesheets_Modules/View_Timesheets'

import Timesheet_List from '../../../Components/Modules/Class_Modules/Timesheets_Modules/Timesheet_List'
import Edit_Timesheet from '../../../Components/Modules/Class_Modules/Timesheets_Modules/Edit_Timesheet'
import LeaveTaken_List from '../../../Components/Modules/Class_Modules/Timesheets_Modules/LeaveTaken_List'


const DrawerApps = StackNavigator({
    Dashboard: {
        screen: Dashboard,
        navigationOptions: {
            header: null,
            drawerLockMode: 'locked-closed'
        },
    },

    ////.......Main_Modules......./////

    Notification_Screen: {
        screen: Notification_Screen,
        navigationOptions: {
            header: null,
            drawerLockMode: 'locked-closed'
        },
    },
    Edit_Settings: {
        screen: Edit_Settings,
        navigationOptions: {
            header: null,
            drawerLockMode: 'locked-closed'
        },
    },
    
    Change_Password: {
        screen: Change_Password,
        navigationOptions: {
            header: null,
            drawerLockMode: 'locked-closed'
        },
    },
    
    ////.......Timesheets_Modules......./////

    Add_Leave: {
        screen: Add_Leave,
        navigationOptions: {
            header: null,
            drawerLockMode: 'locked-closed'
        },
    },
    Add_Timesheet: {
        screen: Add_Timesheet,
        navigationOptions: {
            header: null,
            drawerLockMode: 'locked-closed'
        },
    },
    Timesheet_List: {
        screen: Timesheet_List,
        navigationOptions: {
            header: null,
            drawerLockMode: 'locked-closed'
        },
    },

    Edit_Timesheet: {
        screen: Edit_Timesheet,
        navigationOptions: {
            header: null,
            drawerLockMode: 'locked-closed'
        },
    },
    View_Timesheets: {
        screen: View_Timesheets,
        navigationOptions: {
            header: null,
            drawerLockMode: 'locked-closed'
        },
    },
    AddMore_Timesheet: {
        screen: AddMore_Timesheet,
        navigationOptions: {
            header: null,
            drawerLockMode: 'locked-closed'
        },
    },
    LeaveTaken_List: {
        screen: LeaveTaken_List,
        navigationOptions: {
            header: null,
            drawerLockMode: 'locked-closed'
        },
    },
    
    ////.......Registration_Modules......./////

    Login_Screen: {
        screen: Login_Screen,
        navigationOptions: {
            header: null,
            drawerLockMode: 'locked-closed'
        },
    },



},
    {
        initialRouteName: 'Dashboard',
        transitionConfig: RightToLeftTransition,
        navigationOptions: {
            gesturesEnabled: false
        },
    }
)
export default DrawerApps;
