
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

