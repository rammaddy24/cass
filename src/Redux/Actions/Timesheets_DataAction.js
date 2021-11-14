
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

export function Draft_DataAction(TSInfo_Response) {
    return (dispatch) => {
        dispatch(getDraftService(TSInfo_Response))
    }
}

export function getDraftService(TSInfo_Response) {
    return {
        type: 'Draft_DataAction',
        TSInfo_Response
    }
}

