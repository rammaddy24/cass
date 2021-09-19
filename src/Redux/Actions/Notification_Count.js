
export function Notification_Count(NotificationCount) {
    return (dispatch) => {
        dispatch(getService(NotificationCount))
    }
}

export function getService(NotificationCount) {
    return {
        type: 'Notification_Count',
        NotificationCount
    }
}

