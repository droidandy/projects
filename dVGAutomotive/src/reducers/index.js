import {
    combineReducers
} from 'redux'
import {
    autoRehydrated
} from './persist'
import {
    netinfo
} from './netinfo'
import {
    firstLaunch
} from './firstLaunch'

const rootReducer = combineReducers({
    autoRehydrated,
    netinfo,
    firstLaunch
});

export default rootReducer;
