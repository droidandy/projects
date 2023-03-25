import {
    initialState as initialUIState,
    reducer as reducerUI
} from './ui';

export const initialState = {
    ui: initialUIState
};

export function reducer(state, action) {
    const nextUI = reducerUI(state.ui, action);
    if (state.ui === nextUI) {
        return state;
    }

    return {
        ui: nextUI
    };
}
