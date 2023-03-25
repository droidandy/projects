import {
    initialState as initialUIState,
    reducer as reducerUI
} from './ui';
import {
    initialState as initialQueryDataState,
    reducer as reducerQueryData
} from './queryData';

export const initialState = {
    ui: initialUIState,
    queryData: initialQueryDataState
};

export function reducer(state, action) {
    const nextUI = reducerUI(state.ui, action);
    const nextQueryData = reducerQueryData(state.queryData, action);
    if (
        state.ui === nextUI &&
        state.queryData === reducerQueryData
    ) {
        return state;
    }

    return {
        ui: nextUI,
        queryData: nextQueryData
    };
}
