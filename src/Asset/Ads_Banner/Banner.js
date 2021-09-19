// import React from 'react';
// import { View ,StyleSheet, Text, Platform} from 'react-native';
// import {CARD_BG_COLOR} from '../config/colors';
// import { AdMobBanner } from 'react-native-admob';

// class Banner extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       display: true
//     };
//   }

//   _bannerErrorHandler = err => {
//     if (err) {
//       this.setState({ display: false });
//     }
//   };

//   // _basicExample(errr){
//   // }
//   render() {
//     if (this.state.display) {
//       return (
//         <AdMobBanner
//        // adUnitID="ca-app-pub-3940256099942544/2934735716"

//            adUnitID={this.props.adUnitID}
//             bannerSize={this.props.size}
//            // testDeviceID="EMULATOR"
//             didFailToReceiveAdWithError={this._bannerErrorHandler}
//             //ref={el => (this._basicExample(el))}

//           />
//       );
//     }
//     return <View />;
//   }
// }

// export default Banner;
