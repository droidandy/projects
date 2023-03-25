import {
    AsyncStorage,
} from 'react-native';
import {
    applyMiddleware,
    createStore,
    compose
} from 'redux';
import {
    persistStore,
    autoRehydrate
} from 'redux-persist';
import {
    createLogger
} from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';


let middlewareApplied;
const logger = createLogger();

// console.log('process.env.NODE_ENV', process.env.NODE_ENV);
process.env.NODE_ENV === 'production'
    ? middlewareApplied = applyMiddleware(thunk, /* logger */)
    : middlewareApplied = applyMiddleware(thunk, logger);


const store = createStore(rootReducer, {},
    compose(
        autoRehydrate(),
        middlewareApplied,
        (typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
    ));
persistStore(store, {
    storage: AsyncStorage,
    whitelist: ['autoRehydrated', 'firstLaunch']
    // whitelist: ['autoRehydrated']
}, () => {
}).purge([]);

export default store;