/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import 'babel-polyfill';
// import 'classlist-polyfill';

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyRouterMiddleware, Router, useRouterHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import FontFaceObserver from 'fontfaceobserver';
import { useScroll } from 'react-router-scroll';
import { loggedIn, checkVersion, LanguageProvider, makeSelectLocationState, translationMessages, MIXPANEL_KEY } from '@benrevo/benrevo-react-core';
import mixpanel from 'mixpanel-browser';
import MixpanelProvider from 'react-mixpanel';

// import { makeSelectLocationState } from 'pages/App/selectors';

// Import CSS reset and Global Styles
import 'react-select/dist/react-select.css';
import 'sanitize.css/sanitize.css';
import 'semantic-ui-css/semantic.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import '@benrevo/benrevo-react-core/src/assets/styles/semantic-ui-custom.scss';
import '@benrevo/benrevo-react-core/src/assets/styles/semantic-ui-modules/message.scss';
import '@benrevo/benrevo-react-core/src/assets/styles/global-styles.scss';
import '@benrevo/benrevo-react-core/src/assets/styles/pages/presentation.scss';
import '@benrevo/benrevo-react-core/src/assets/styles/pages/rfp.scss';
import '@benrevo/benrevo-react-core/src/assets/styles/components/toggle-button.scss';
import '@benrevo/benrevo-react-core/src/assets/styles/styles.scss';

import { createHistory } from 'history';

// Load the favicon, the manifest.json file and the .htaccess file
/* eslint import/no-unresolved: [2, { ignore: ['\.img$', '\.ico$', '\.json$', '\.css', '\.htaccess$'] }] */
import '!file-loader?name=[name].[ext]!@benrevo/benrevo-react-core/src/favicon.ico'; // eslint-disable-line import/extensions
import '!file-loader?name=[name].[ext]!@benrevo/benrevo-react-core/src/manifest.json'; // eslint-disable-line import/extensions
import 'file-loader?name=[name].[ext]!@benrevo/benrevo-react-core/src/.htaccess'; // eslint-disable-line import/extensions
import '!!style-loader!css-loader!./vendor/css/font-awesome.css'; // eslint-disable-line import/extensions
/* eslint-enable import/no-webpack-loader-syntax */

// Import root app
import App from './pages/App';
import configureStore from './store';
import { BENREVO_PATH } from './config';

// Import routes
import createRoutes from './routes';

if (process.env.NODE_ENV === 'production') {
  Promise.all([
    require('./vendor/ga/uhc.js'), // eslint-disable-line global-require
  ]);
}
if (loggedIn()) {
  Promise.all([
    require('@benrevo/benrevo-react-core/src/vendor/zopim'), // eslint-disable-line global-require
  ]);

  if (process.env.NODE_ENV === 'production') {
    Promise.all([
      require('@benrevo/benrevo-react-core/src/vendor/fullstory'), // eslint-disable-line global-require
    ]).then((result) => {
      result[0].default();
    });
  }
}

mixpanel.init(MIXPANEL_KEY);

/* eslint-disable no-console */
// console.log('Environment:', process.env);

// Observe loading of Open Sans (to remove open sans, remove the <link> tag in
// the index.html file and this observer)
const openSansObserver = new FontFaceObserver('Open Sans', {});

// When Open Sans is loaded, add a font-family using Open Sans to the body
openSansObserver.load().then(() => {
  document.body.classList.add('fontLoaded');
}, () => {
  document.body.classList.remove('fontLoaded');
});

// Create redux store with history
// this uses the singleton browserHistory provided by react-router
// Optionally, this could be changed to leverage a created history
// e.g. `const browserHistory = useRouterHistory(createBrowserHistory)();`
const browserHistory = useRouterHistory(createHistory)({
  basename: BENREVO_PATH,
});
const initialState = {};

export const store = configureStore(initialState, browserHistory, (storeItem) => {
// Sync history and storeItem, as the react-router-redux reducer
// is under the non-default key ("routing"), selectLocationState
// must be provided for resolving how to retrieve the "route" in the state
  const history = syncHistoryWithStore(browserHistory, storeItem, {
    selectLocationState: makeSelectLocationState(),
  });

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      import('./reducers').then((reducerModule) => {
        const createReducers = reducerModule.default;
        const nextReducers = createReducers(storeItem.asyncReducers);
        storeItem.replaceReducer(nextReducers);
      });
    });
  }

  storeItem.dispatch(checkVersion());

// Set up the router, wrapping all Routes in the App component
  const rootRoute = {
    component: App,
    childRoutes: createRoutes(storeItem),
  };

  const render = (messages) => {
    ReactDOM.render(
      <MixpanelProvider mixpanel={mixpanel}>
        <Provider store={storeItem}>
          <LanguageProvider messages={messages}>
            <Router
              history={history}
              routes={rootRoute}
              render={
                // Scroll to top when going to a new page, imitating default browser
                // behaviour
                applyRouterMiddleware(useScroll())
              }
            />
          </LanguageProvider>
        </Provider>
      </MixpanelProvider>,
      document.getElementById('app')
    );
  };

// Hot reloadable translation json files
  if (module.hot) {
    // modules.hot.accept does not accept dynamic dependencies,
    // have to be constants at compile-time
    module.hot.accept('@benrevo/benrevo-react-core/src/i18n', () => {
      render(translationMessages);
    });
  }

// Chunked polyfill for browsers without Intl support
  if (!window.Intl) {
    (new Promise((resolve) => {
      resolve(import('intl'));
    }))
      .then(() => Promise.all([
        import('intl/locale-data/jsonp/en.js'),
        import('intl/locale-data/jsonp/de.js'),
      ]))
      .then(() => render(translationMessages))
      .catch((err) => {
        throw err;
      });
  } else {
    render(translationMessages);
  }
// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
  // if (process.env.NODE_ENV === 'production') {
  //   require('offline-plugin/runtime').install(); // eslint-disable-line global-require
  // }
}, true);
