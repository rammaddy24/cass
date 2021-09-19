
export function Timesheets_DraftEditAction(TSDE_Response) {
    return (dispatch) => {
        dispatch(getService(TSDE_Response))
    }
}

export function getService(TSDE_Response) {
    return {
        type: 'Timesheets_DraftEditAction',
        TSDE_Response
    }
}

