// export const HELVETICA = 'HelveticaNeue';
// export const SQUARE721 = 'Square721BT-BoldExtended';
// export const VAGROUND = 'VAGRoundedBold';

import { Dimensions, StyleSheet, Platform } from 'react-native'
const { width, height } = Dimensions.get("window");

const fontFamily = {
    Poppins_SemiBold: 'Poppins-SemiBold',
    Poppins_Bold: 'Poppins-Bold',
    Poppins_Regular: 'Poppins-Regular',
}


const fontSize = {
    verySmall_50: Platform.OS == "android" ? width / 100 * 2.4 : width / 100 * 2.1,
    veryverySmall: Platform.OS == "android" ? width / 100 * 2.6 : width / 100 * 2.3,
    verySmall: Platform.OS == "android" ? width / 100 * 2.8 : width / 100 * 2.6,
    verySmall_75: Platform.OS == "android" ? width / 100 * 3.0 : width / 100 * 2.8,
    Small: Platform.OS == "android" ? width / 100 * 3.2 : width / 100 * 3.1,
    lightMedium_50: Platform.OS == "android" ? width / 100 * 3.5 : width / 100 * 3.3,
    lightMedium: Platform.OS == "android" ? width / 100 * 3.7 : width / 100 * 3.5,
    Medium: Platform.OS == "android" ? width / 100 * 4.2 : width / 100 * 4,
    Large_50: Platform.OS == "android" ? width / 100 * 4.5 : width / 100 * 4.3,
    Large: Platform.OS == "android" ? width / 100 * 4.7 : width / 100 * 4.5,
    ExtraLarge_50: Platform.OS == "android" ? width / 100 * 5 : width / 100 * 4.7,
    ExtraLarge: Platform.OS == "android" ? width / 100 * 5.2 : width / 100 * 5,
    ExtraLarge_plus: Platform.OS == "android" ? width / 100 * 6.2 : width / 100 * 6,
    ExtraLarge_plus_50: Platform.OS == "android" ? width / 100 * 7.2 : width / 100 * 7
}

const color = {
    Font_Whitecolor: "#ffffff",
    Font_lightWhitecolor: "#696969",
    Font_Black: "#000000",
    Font_lightgrey: "#515158",
    Font_Theme: "#2A364A",
    Font_LightBlue: "#0D4A70",
    Font_LoginTheme: "#78B7F9",
    Font_Black_Light: "#001124",
}

const LG_BG_THEME = {
    APPTHEME_1: "#0474EB",
    APPTHEME_2: "#000B6A",
    APPTHEME_BG:"#F3F3F3",
    APPTHEME_BG_2:"#EFEFEF",
APPTHEME_DG:"#004000",
APPTHEME_DLG:"#17B917",
    APPTHEME_GREY: "#707070",
    APPTHEME_GREY_2: "#b8b8b8",
    APPTHEME_GREY_3: "#e8e8e8",
    APPTHEME_BLACK: "#000000",
    WHITE_THEME: "#FFFFFF",
    APPTHEME_Green:"#209F00",
    APPTHEME_Blue:"#010066",    
    LIGHTWHITE_THEME: "#EDEDED",
    APPTHEME_FONT: "#898989",
    APPTHEME_RED: "#FC4961",
    PLACEHOLDER_THEME: "#E8F0FE",
    FP_THEME: "#278CF2",

    LIGHTGREY_THEME: "#343434",

}

const Notify_THEME = {
    AW_SUPERADMIN: "#FFFF00",
    AW_ADMIN: "#FFA500",
    AW_FINANCE: "#0000FF",
    AW_APPROVED: "#008000",
    AW_REJECTED: "#FF0000",
    AW_EngineerLeave:"#ADD8E6"
}

export { fontSize, color, width, height, fontFamily, LG_BG_THEME,Notify_THEME }
