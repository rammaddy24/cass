
export function Timesheets_EditAction(TSEdit_Response) {
    return (dispatch) => {
        dispatch(getService(TSEdit_Response))
    }
}

export function getService(TSEdit_Response) {
    return {
        type: 'Timesheets_EditAction',
        TSEdit_Response
    }
}

export function Draft_EditAction(TSEdit_Response) {
    return (dispatch) => {
        dispatch(getDraftService(TSEdit_Response))
    }
}

export function getDraftService(TSEdit_Response) {
    return {
        type: 'Draft_EditAction',
        TSEdit_Response
    }
}

