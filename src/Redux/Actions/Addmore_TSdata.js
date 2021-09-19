
export function Addmore_TSdata(AddmoreInfo_Response) {
    return (dispatch) => {
        dispatch(getService(AddmoreInfo_Response))
    }
}

export function getService(AddmoreInfo_Response) {
    return {
        type: 'Addmore_TSdata',
        AddmoreInfo_Response
    }
}

