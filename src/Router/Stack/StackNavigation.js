import React, { Component } from 'react';
import { addNavigationHelpers, NavigationActions, PropTypes, connect } from './../../Asset/Libraries/NpmList';
import { BackHandler, Alert ,View} from 'react-native';
import { Stack } from './navigationConfiguration';
const getCurrentScreen = (navigationState) => {
  if (!navigationState) {
    return null
  }
  const route = navigationState.routes[navigationState.index]
  if (route.routes) {
    return getCurrentScreen(route)
  }
  return route.routeName
}

// ------------------------------------------------
class StackNavigation extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    navigation: PropTypes.shape().isRequired,
  };

  // ---------------------------------------------------
  constructor(props) {
    super(props)
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
  }

  backAction = () => {
    const { dispatch, navigation } = this.props;
    const currentScreen = getCurrentScreen(navigation)
    if (currentScreen === 'Dashboard' || currentScreen == "Login_Screen" || currentScreen == "Landing_Screens") {
      Alert.alert(
        'Closing App..!',
        'Are you sure, You want to close this App ?',
        [
          { text: 'YES', onPress: () => this.onExit() },
          { text: 'NO', style: 'cancel' },
        ],
        { cancelable: false }
      )
      return true
    }
    dispatch(NavigationActions.back());
    return true;
  };
  onExit() {
    BackHandler.exitApp()
  }

  // -------------------------------------------------------

  render() {

    const { dispatch, navigation } = this.props;
    return (
    
      <Stack
        ref={(ref) => { this.navigator = ref; }}
        navigation={
          addNavigationHelpers({ dispatch, state: navigation })}
      />

      
    );


  }
}

const mapStateToProps = (state) => {
  return {
    navigation: state.stack
  };
}

export default connect(mapStateToProps)(StackNavigation);

