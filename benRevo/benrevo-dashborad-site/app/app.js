/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import 'babel-polyfill';

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyRouterMiddleware, Router, useRouterHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import FontFaceObserver from 'fontfaceobserver';
import { useScroll } from 'react-router-scroll';
import watchAuth from 'utils/authService/sagas';
import 'sanitize.css/sanitize.css';
import 'semantic-ui-css/semantic.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import 'slick-carousel/slick/slick.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import '@benrevo/benrevo-react-core/dist/assets/styles/pages/presentation.scss';
import '@benrevo/benrevo-react-core/dist/assets/styles/parts/section-wrap.scss';
import '@benrevo/benrevo-react-core/dist/assets/styles/parts/submit-success.scss';
import '@benrevo/benrevo-react-core/dist/assets/styles/semantic-ui-modules/button.scss';
import '@benrevo/benrevo-react-core/dist/assets/styles/semantic-ui-modules/toggle-button.scss';
import '@benrevo/benrevo-react-core/dist/assets/styles/semantic-ui-modules/count.scss';
import '@benrevo/benrevo-react-core/dist/assets/styles/semantic-ui-modules/rates.scss';
import '@benrevo/benrevo-react-core/dist/assets/styles/semantic-ui-modules/datepicker.scss';
import '@benrevo/benrevo-react-core/dist/assets/styles/semantic-ui-modules/textarea.scss';
import '@benrevo/benrevo-react-core/dist/assets/styles/components/side-navigation.scss';
import '@benrevo/benrevo-react-core/dist/assets/styles/components/toggle-button.scss';
import '@benrevo/benrevo-react-core/dist/assets/styles/semantic-ui-modules/tabs.scss';
import '@benrevo/benrevo-react-core/dist/assets/styles/pages/match.scss';
// import 'slick-carousel/slick/slick-theme.css';

// Import root app
import App from 'pages/App';

// Import selector for `syncHistoryWithStore`
import { makeSelectLocationState } from 'pages/App/selectors';

// Import Language Provider
import LanguageProvider from 'containers/LanguageProvider';
import { createHistory } from 'history';

// Load the favicon, the manifest.json file and the .htaccess file
/* eslint-disable import/no-webpack-loader-syntax */
import '!file-loader?name=[name].[ext]!./favicon.ico';
import '!file-loader?name=[name].[ext]!./manifest.json';
import 'file-loader?name=[name].[ext]!./.htaccess'; // eslint-disable-line import/extensions
import '!!style-loader!css-loader!./vendor/css/font-awesome.css';
/* eslint-enable import/no-webpack-loader-syntax */

import configureStore from './store';
import { BENREVO_PATH, carriers, CARRIER } from './config';

// Import i18n messages
import { translationMessages } from './i18n';

// Import CSS reset and Global Styles
import './assets/styles/semantic-ui-custom.scss';
import './assets/styles/styles.scss';

// Import routes
import createRoutes from './routes';
import { checkVersion } from './pages/App/actions';

if (process.env.NODE_ENV === 'production') {
  Promise.all([
    require(`./vendor/ga/${carriers[CARRIER]}.js`), // eslint-disable-line global-require
  ]);
}

/* eslint-disable no-console */
console.log('Environment:', process.env);

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
// not sure if this is the correct place for this, but it works. Refactor if better patter for loading app level sagas emerges.

  storeItem.runSaga(watchAuth);

// Sync history and storeItem, as the react-router-redux reducer
// is under the non-default key ("routing"), selectLocationState
// must be provided for resolving how to retrieve the "route" in the state
  const history = syncHistoryWithStore(browserHistory, storeItem, {
    selectLocationState: makeSelectLocationState(),
  });

  store.dispatch(checkVersion());

// Set up the router, wrapping all Routes in the App component
  const rootRoute = {
    component: App,
    childRoutes: createRoutes(storeItem),
  };

  const render = (messages) => {
    ReactDOM.render(
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
      </Provider>,
      document.getElementById('app')
    );
  };

  // Hot reloadable translation json files
  if (module.hot) {
    // modules.hot.accept does not accept dynamic dependencies,
    // have to be constants at compile-time
    module.hot.accept('./i18n', () => {
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
