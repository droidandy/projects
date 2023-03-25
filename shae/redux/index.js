/**
 * Created by konstantin on 29.07.16.
 */

import {createStore, combineReducers} from 'redux'

import user from './User'

export default createStore(combineReducers({
    user,
}))