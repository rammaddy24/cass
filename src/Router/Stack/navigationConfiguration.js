import SplashScreen from "../../Components/Modules/Class_Modules/Registration_Modules/SplashScreen";
import Login_Screen from "../../Components/Modules/Class_Modules/Registration_Modules/Login_Screen";
import Forget_Password from "../../Components/Modules/Class_Modules/Registration_Modules/Forget_Password";

import Drawer from './../Drawer/DrawerConfiguration';

import { fromLeft,fromTop, fromBottom, zoomIn ,fromRight,flipX} from "../../Asset/Libraries/Transition";


import RightToLeftTransition from '../../Asset/Libraries/RightToLeftTransition';
import { StackNavigator, DrawerItems } from 'react-navigation';

// const handleCustomTransition = ({ scenes }) => {
//   const prevScene = scenes[scenes.length - 2];
//   const nextScene = scenes[scenes.length - 1];

//   // Custom transitions go there
//   if (prevScene
//     && prevScene.route.routeName === 'Login_Screen'
//     && nextScene.route.routeName === 'Landing_Screens') {
//     return zoomIn();
//   } else if (prevScene
//     && prevScene.route.routeName === 'Registration'
//     && nextScene.route.routeName === 'Registration_Step2') {
//     return zoomOut();
//   }
//   return fromLeft();
// }

export const Stack = StackNavigator({
  SplashScreen: {
    screen: SplashScreen,
    navigationOptions: ({ navigation }) => ({
      header: null,
    })
  },
  Login_Screen: {
    screen: Login_Screen,
    navigationOptions: ({ navigation }) => ({
      header: null,
    })
  },

  Forget_Password: {
    screen: Forget_Password,
    navigationOptions: {
      header: null
    }
  },

  Drawer: {
    screen: Drawer,
    navigationOptions: {
      header: null
    }
  },
  

},
  {
    initialRouteName: 'SplashScreen',
    transitionConfig: () => fromBottom(),
    navigationOptions: {
      gesturesEnabled: false
    },
  }
);
