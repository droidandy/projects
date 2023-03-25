import {
    initialState as initialNotificationState,
    reducer as reducerNotification
} from './notification';
import {
    initialState as initialGoogleMapState,
    reducer as reducerGoogleMap
} from './googleMap';
import {
    initialState as initialDateRangePicker,
    reducer as reducerDateRangePicker
} from './dateRangePicker';
import {
    initialState as initialHamburger,
    reducer as reducerHamburger
} from './hamburger';

export const initialState = {
    notifications: initialNotificationState,
    googlemap: initialGoogleMapState,
    dateRangePicker: initialDateRangePicker,
    hamburger: initialHamburger
};

export function reducer(state, action) {
    const nextNotification = reducerNotification(state.notifications, action);
    const nextGoogleMap = reducerGoogleMap(state.googlemap, action);
    const nextDateRangePicker = reducerDateRangePicker(state.dateRangePicker, action);
    const nextHamburger = reducerHamburger(state.hamburger, action);

    if (
        state.notifications === nextNotification &&
        state.googlemap === nextGoogleMap &&
        state.dateRangePicker === nextDateRangePicker &&
        state.hamburger === nextHamburger
    ) {
        return state;
    }

    return {
        notifications: nextNotification,
        googlemap: nextGoogleMap,
        dateRangePicker: nextDateRangePicker,
        hamburger: nextHamburger
    };
}
