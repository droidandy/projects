import {
    curry
} from 'lodash/fp';

export const SET_STATUS = 'UI/HAMBURGER/SET_STATUS';

export const setStatus = curry(
    () => ({
        type: SET_STATUS
    })
);
