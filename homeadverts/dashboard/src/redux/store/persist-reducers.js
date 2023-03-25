import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './reducers';

const whitelist = ['session'];
const persistConfig = { key: 'root', storage, whitelist };

export default asyncReducers => persistReducer(persistConfig, rootReducer(asyncReducers));
