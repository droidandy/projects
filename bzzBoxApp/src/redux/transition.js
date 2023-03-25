/**
 * Created by konstantin on 27.08.16.
 */

const TYPES = {
    SET_TRANSITION: 'SET_TRANSITION',
    SET_VISIBLE_SPINNER: 'SET_VISIBLE_SPINNER'
};

export let setTransition = transition => ({
    type: TYPES.SET_TRANSITION,
    transition
});

export let setVisibleSpinner = transition => ({
    type: TYPES.SET_VISIBLE_SPINNER,
    transition
});

export default (_state = {transition: null, visibleSpinner: false}, action = {}) => {

    let state = {..._state};
    //console.log('transition', action.transition)
    switch(action.type) {
        case TYPES.SET_TRANSITION:
            state.dashboardFlag = action.transition.dashboardFlag;
            state.WebViewPage2Flag = action.transition.WebViewPage2Flag;
            state.WebViewPage3Flag = action.transition.WebViewPage3Flag;
            return state;
        case TYPES.SET_VISIBLE_SPINNER:
            state.visibleSpinner = action.transition.visibleSpinner;
            return state;
    }

    return state;
};
