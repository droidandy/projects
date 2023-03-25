import {
    FIRST_LAUNCH,
} from '../constants/ActionTypes'

export function firstLaunch(state = false, action = {}) {
    const { type } = action;

    switch (type) {
        case FIRST_LAUNCH: {
            return true;
        }
    }
    return state
}
