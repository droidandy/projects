import {
    SET_STATUS
} from 'actions/ui/hamburger';

export const initialState = {
    active: false
};

export function reducer(state, action) {
    const { type } = action;
    switch (type) {
        case SET_STATUS: {
            return {
                ...state,
                active: !state.active
            };
        }

        default: {
            return state;
        }
    }
}
