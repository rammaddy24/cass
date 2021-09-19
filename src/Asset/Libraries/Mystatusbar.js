import React from 'react';
import { StatusBar, View, Dimensions, Platform } from 'react-native';
import { LinearGradient } from './NpmList';
import { fontSize, color, width, height, BG_THEMECOLOUR, fontFamily, LG_BG_THEME } from '../../Components/Constants/fontsAndColors';

const MyStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[{ height: height / 100 * 4, justifyContent: 'center' }, { backgroundColor }]}>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
);

const Mystatusbar = () => {
    return (
        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[LG_BG_THEME.APPTHEME_1, LG_BG_THEME.APPTHEME_1]} >
            <MyStatusBar backgroundColor={LG_BG_THEME.APPTHEME_1}
                barStyle="light-content" />
        </LinearGradient>
    )
}

export { Mystatusbar };