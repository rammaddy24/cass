import { httpRequest } from '../../Components/Utils';
import { Snackbar } from '../../Asset/Libraries/NpmList';
import { Alert } from 'react-native';
import { User_Login } from '../../Components/Config/Server';

export function Cass_UserLogin(Email, Password) {
    return (dispatch) => {
        dispatch(getService())
        return httpRequest({

        }).then((JsonResponse) => {
            // if (JsonResponse.ResultStatus == "true") {
           // dispatch(getServiceSuccess())
            // } else {
            //     //For Banned Profiles
            //     if (JsonResponse.Message == "Invalid User") {
            //         Alert.alert(
            //             '',
            //             "You are profile has been banned by our support team. Due to few reports raised by our cuddler community.",

            //             [
            //                 { text: 'OK', onPress: () => dispatch(BannedUser_Profile()) },
            //             ],
            //             { cancelable: false }
            //         )
            //     }
            //     dispatch(getServiceFailure())
            // }
            // Snackbar.show({
            //     title: JsonResponse.Message,
            //     duration: Snackbar.LENGTH_SHORT,
            // });

        }).catch((error) => {
            // Snackbar.show({
            //     title: "Please try again,Later",
            //     duration: Snackbar.LENGTH_SHORT
            // });

           // dispatch(getServiceFailure())
        });
    }
}
export function getService() {
    return {
        type: 'Cass_UserLogin',

    }
}
export function getServiceSuccess() {
    return {
        type: 'Cass_UserLogin_SUCCESS',

    }
}
export function getServiceFailure() {
    return {
        type: 'Cass_UserLogin_FAILURE',
    }
}
