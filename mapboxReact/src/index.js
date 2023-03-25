import React from 'react';
import {
    render
} from 'react-dom';
import {
    Provider
} from 'react-redux';
import {
    Router,
    browserHistory
} from 'react-router';

import './base.css';
import 'react-select/dist/react-select.css';


import Root from 'containers/Root';
import App from 'containers/App';
import Login from 'containers/Login';
import RecoveryPassword from 'containers/RecoveryPassword';
import NotificationContainer from 'containers/Notification';
import Overview from 'containers/Overview';
import {
    createStore
} from 'store';

const store = createStore();

const routes = {
    path: '/',
    component: Root,
    childRoutes: [
        {
            childRoutes: [
                {
                    path: 'login',
                    component: Login
                },
                {
                    path: 'restore-password(/:code)',
                    component: RecoveryPassword
                }
            ]
        },
        {
            component: App,
            indexRoute: {
                onEnter(nextState, replace) {
                    replace('/overview');
                }
            },
            childRoutes: [
                {
                    path: 'logout',
                    onEnter: () => {}
                },
                {
                    path: 'overview',
                    component: props => (
                        <Overview {...props} />
                    )
                }
            ]
        }
    ]
};

const DevTools = __PRODUCTION__ ? () => null : require('containers/DevTools').default;

render(
    (
        <Provider store={store}>
            <div>
                <Router history={browserHistory} routes={routes} />
                <NotificationContainer />
                <DevTools />
            </div>
        </Provider>
    ),
    document.getElementById('mount')
);
