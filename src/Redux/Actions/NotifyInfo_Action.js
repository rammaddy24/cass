
export function NotifyInfo_Action(NotifyInfo_Response) {
    return (dispatch) => {
        dispatch(getService(NotifyInfo_Response))
    }
}

export function getService(NotifyInfo_Response) {
    return {
        type: 'NotifyInfo_Action',
        NotifyInfo_Response
    }
}

