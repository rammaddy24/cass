
export function UserInfo_Action(UserInfo_Response) {
  return (dispatch) => {
      dispatch(getService(UserInfo_Response))
  }
}

export function getService(UserInfo_Response) {
  return {
      type: 'UserInfo_Action',
      UserInfo_Response
  }
}

