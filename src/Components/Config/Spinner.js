import React from 'react';
import { View, ActivityIndicator, Modal, Text, Image } from 'react-native';

import { fontSize, color, width, height, fontFamily, LG_BG_THEME, Runs_Indicatorcolor } from '../Constants/fontsAndColors'
const Spinner = ({ size, visibility }) => {

    return (

        <Modal
            animationType={"none"}
            transparent
            visible={visibility}
            onRequestClose={() => { }}>

            <View style={styles.spinnerStyle}>
                <View style={{ flex: 0.3 }} />

                <View style={{ flex: 0.2, justifyContent: "center", alignItems: "center" }}>
                    {/* <Image source={require('../../Asset/Images/KKR_logo.png')}  style={{width:width/100*16,height:width/100*25}}/> */}
                </View>

                <View style={{ flex: 0.1, justifyContent: "center", alignItems: "center" }}>

                    <ActivityIndicator
                        visible={true}
                        animating={true}
                        color={color.Font_Whitecolor} size={size || 'large'}
                        style={[styles.activityIndicator, { transform: [{ scale: 1.7 }] }]}
                    />
                </View>
                <View style={{ flex: 0.1, justifyContent: "center", alignItems: "center" }}>


                    <Text style={{ fontWeight: "400", fontFamily: fontFamily.SourceSansProBold, fontSize: fontSize.Medium, letterSpacing: width / 100 * 0.5, color: color.Font_Whitecolor }}> {"Loading..!"} </Text>
                </View>
                <View style={{ flex: 0.3 }} />

            </View>

        </Modal>
    )
}

const styles = {

    spinnerStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'

    },
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 80,
    }
}
export { Spinner };