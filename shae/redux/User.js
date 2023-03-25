/**
 * Created by konstantin on 29.07.16.
 */

const TYPES = {
    USER_SIGN_IN: 'USER_SIGN_IN',
    USER_CHANGE_DATA: 'USER_CHANGE_DATA',
    USER_TOKEN: 'USER_TOKEN'
};

export let userSignIn = userInfo => ({
    type: TYPES.USER_SIGN_IN,
    userInfo
});

export let userToken = token => ({
    type: TYPES.USER_TOKEN,
    token
});

export default (_state = {user: null, token: null}, action = {}) => {

    let state = {..._state};
    
    switch(action.type) {
        case TYPES.USER_SIGN_IN:
            state.user = action.userInfo.user;
            state.token = action.userInfo.token;
            return state;
        
        case TYPES.USER_TOKEN:
            state.token = action.token;
            break;
    }

    return state;

};