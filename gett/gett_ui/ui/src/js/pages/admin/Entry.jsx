import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'js/redux/store/configureStore';
import reducer from 'js/redux/admin/reducer';
import App from './App';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import 'utils/initializers';

const store = configureStore(reducer);

export default function Entry() {
  if (process.env.NODE_ENV === 'production') {
    return (
      <Provider store={ store }>
        <LocaleProvider locale={ enUS }>
          <App />
        </LocaleProvider>
      </Provider>
    );
  } else {
    const DevTools = require('utils/dev-tools').default;

    return (
      <Provider store={ store }>
        <div>
          <LocaleProvider locale={ enUS }>
            <App />
          </LocaleProvider>
          <DevTools />
        </div>
      </Provider>
    );
  }
}
