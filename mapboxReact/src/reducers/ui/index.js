import {
    initialState as initialNotificationState,
    reducer as reducerNotification
} from './notification';

export const initialState = {
    notifications: initialNotificationState
};

export function reducer(state, action) {
    const nextNotification = reducerNotification(state.notifications, action);

    if (
        state.notifications === nextNotification
    ) {
        return state;
    }

    return {
        notifications: nextNotification
    };
}
