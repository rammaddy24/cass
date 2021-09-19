import {addNavigationHelpers, NavigationActions, TabNavigator,createSwitchNavigator as createStackNavigator,DrawerNavigator } from 'react-navigation';
import { connect, Provider } from 'react-redux';
import { combineReducers } from 'redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import PropTypes from 'prop-types';
import { Container, Content, Header, Picker,Root,Icon,ActionSheet,Toast,Tab, Tabs,ScrollableTab} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import Moment from 'moment';
import Snackbar from 'react-native-snackbar';
import Splash_screen from 'react-native-splash-screen';
import CalendarPicker from 'react-native-calendar-picker';
import base64 from 'base-64';

import SignatureCapture from 'react-native-signature-capture';
import DocumentPicker from 'react-native-document-picker'; 


import RNFetchBlob from 'react-native-fetch-blob'
import ImgToBase64 from 'react-native-image-base64';
var RNFS = require('react-native-fs');

export {
    createStackNavigator,Tab, Tabs,ScrollableTab, connect, Provider,LinearGradient,DrawerNavigator,addNavigationHelpers,Snackbar,Moment,Splash_screen,CalendarPicker,
    combineReducers, createStore, applyMiddleware, PropTypes,Container, Content,Header, Picker,Root,Icon,ActionSheet,Toast,thunk,NavigationActions,base64,
    SignatureCapture,DocumentPicker,ImgToBase64,RNFS,RNFetchBlob
}

