
import React, { Component } from 'react';
import { View, Dimensions, Image, PixelRatio, TouchableOpacity, Text } from 'react-native';

import { DrawerNavigator, DrawerItems } from 'react-navigation';
import DrawerComponent from './DrawerComponent';
import DrawerApps from './DrawerStack/DrawerApps';
const SCREEN_WIDTH = Dimensions.get('window').width;
const { width, height } = Dimensions.get("window");

const Drawer = DrawerNavigator(
    {
        DrawerApps: {
            screen: DrawerApps,
            navigationOptions: ({ navigation }) => ({
            }),
        }, 
        // Settings: {
        //     screen: Settings,
        //     navigationOptions: ({ navigation }) => ({
        //     }),
        // }, 
    },
    {
      // initialRouteName: 'DrawerApps',
        contentOptions: {
            activeTintColor: '#548ff7',
            activeBackgroundColor: 'transparent',
            inactiveTintColor: '#000',
            inactiveBackgroundColor: 'transparent',
            labelStyle: {
                fontSize: height / 100 * 2.2,
                marginLeft: width / 100 * 1, fontWeight: '400'
            },
            style: { justifyContent: 'center' }
        },
        
        drawerWidth: SCREEN_WIDTH * 0.8,
        contentComponent: DrawerComponent,
        drawerOpenRoute: 'DrawerOpen',
        drawerCloseRoute: 'DrawerClose',
        drawerToggleRoute: 'DrawerToggle'
    }
)


export default Drawer;