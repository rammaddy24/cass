import { StyleSheet } from 'react-native';
import { fontSize, color, width, height,fontFamily, LG_BG_THEME } from '../Constants/fontsAndColors';
import { Platform_isIOS } from '../Utils/index';





const drawerComponentStyle = StyleSheet.create({
  View: {
      height: height/100*6,
      flexDirection: 'row'
  },
  iconView: {
      flex: 2.2,
      justifyContent: 'center',
      alignItems: 'center'
  },
  textView: {
      flex: 7.8,
      justifyContent: 'center',
     // alignItems:"center"
  },
  IconStyle:{
    width: width/100*6.5,
    height: width/100*6.5,
   tintColor:LG_BG_THEME.WHITE_THEME

  }
})

const Matchcenterstyle = StyleSheet.create({
  MatchcenterExtra_Space: {
    height: width / 100 * 2
  },
  MatchcenterExtra_Space_100: {
    height: width / 100 * 3
  },
  MatchcenterExtra_Space_200: {
    height: width / 100 * 4
  },
  MatchcenterExtra_Space_400: {
    height: width / 100 * 8
  },
})

const HeaderComponentStyle = StyleSheet.create({
  headerView: {
    backgroundColor: LG_BG_THEME.APPTHEME_1,flexDirection: "row" ,
    height: height / 100 * 8,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    elevation: 3
  },
  headerTitleStyle: {
    fontFamily: fontFamily.PoppinsRegular ,
    color: color.PRIMARY_DARK,
    fontSize: fontSize.Small,
    fontWeight: '600'
  },
})

const DefaultHeaderComponentStyle = StyleSheet.create({
  headerView: {
    backgroundColor: LG_BG_THEME.APPTHEME_1,
    height: height / 100 * 1,
  },
})



export {drawerComponentStyle ,HeaderComponentStyle,DefaultHeaderComponentStyle,Matchcenterstyle};
