import React from 'react';
import {render} from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import {AppContainer} from 'react-hot-loader';

import {Provider} from 'react-redux';

import configureStore from './src/redux/store';
import rootSaga from './src/redux/store/sagas';

import App from './src/components/App';

import ons from 'onsenui';
import 'onsenui/css/onsenui.css';
import './src/stylus/index.styl';

const store = configureStore();
store.runSaga(rootSaga);

const rootElement = document.getElementById('root');

injectTapEventPlugin();
ons.ready(() => {
  render(
  <AppContainer>
    <MuiThemeProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </MuiThemeProvider>
  </AppContainer>,
  rootElement
 );
});

if (module.hot) {
  module.hot.accept('./src/components/App', () => {
    const NextApp = require('./src/components/App').default;
    render(
      <AppContainer>
        <MuiThemeProvider>
          <Provider store={store}>
            <NextApp />
          </Provider>
        </MuiThemeProvider>
      </AppContainer>,
      rootElement
    );
  });
}
