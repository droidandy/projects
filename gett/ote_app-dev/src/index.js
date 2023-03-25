import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { createStore } from 'store';
import { capitalize } from 'lodash';
import { ReduxNetworkProvider } from 'react-native-offline';
import 'utils/fixAndroidElements';
import App from 'containers/App';
import axios, { GettApi } from 'utils/axios';

// import { whyDidYouUpdate } from 'why-did-you-update';
// leave it here for future performance debugging
// if (process.env.NODE_ENV !== 'production') {
//   whyDidYouUpdate(React, {
//     include: [/./],
//     exclude: [/^Connect|YellowBox|TouchableText|Path|Svg|Transitioner|Circle|Rect|Ellipse/]
//   });
// }

const { store, persistor } = createStore();

axios.interceptors.request.use((config) => {
  const token = store.getState().session.token;

  if (token) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

GettApi.interceptors.request.use((config) => {
  const gettOauth = store.getState().app.gett.oAuth;

  if (gettOauth.accessToken) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `${capitalize(gettOauth.tokenType) || 'Bearer'} ${gettOauth.accessToken}`;
  }

  return config;
});

function wrapper() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ReduxNetworkProvider pingInterval={5000} pingOnlyIfOffline pingInBackground>
          <App />
        </ReduxNetworkProvider>
      </PersistGate>
    </Provider>
  );
}

export default wrapper;
