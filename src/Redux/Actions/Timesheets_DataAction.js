
export function Timesheets_DataAction(TSInfo_Response) {
    return (dispatch) => {
        dispatch(getService(TSInfo_Response))
    }
}

export function getService(TSInfo_Response) {
    return {
        type: 'Timesheets_DataAction',
        TSInfo_Response
    }
}

