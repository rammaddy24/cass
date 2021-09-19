export * from './Mystatusbar'
export * from './MyStatusBar_Light'
export * from "./MyStatusBar_Theme"



import { Platform} from 'react-native';
export const isIOS = (Platform.OS == 'ios') ? true : false