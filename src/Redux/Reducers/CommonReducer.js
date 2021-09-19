const initialState = {
  NotifyInfo_Response: [],
  UserInfo_Response: [],
  TSInfo_Response: [],
  TSEdit_Response: [],
  AddmoreInfo_Response: "",
  NotificationCount: 0
};

export default function CommonReducer(state = initialState, action) {
  switch (action.type) {

    // ----------------------------------- Registration_Modules ----------------------------------------//

    // --------------------onLoginAction--------------------

    case "NotifyInfo_Action":
      return {
        ...state,
        NotifyInfo_Response: action.NotifyInfo_Response,
      };

    case "UserInfo_Action":
      return {
        ...state,
        UserInfo_Response: action.UserInfo_Response,
      };


    case "Timesheets_DataAction":
      return {
        ...state,
        TSInfo_Response: action.TSInfo_Response,
      };

    case "Timesheets_EditAction":
      return {
        ...state,
        TSEdit_Response: action.TSEdit_Response,
      };

    case "Addmore_TSdata":
      return {
        ...state,
        AddmoreInfo_Response: action.AddmoreInfo_Response,
      };

    case "Notification_Count":
      return {
        ...state,
        NotificationCount: action.NotificationCount,
      };

    default:
      return state;
  }
}





