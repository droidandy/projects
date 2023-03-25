import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'js/redux/store/configureStore';
import reducer from 'js/redux/admin/reducer';
import App from './App';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

const store = configureStore(reducer);

export default function Entry() {
  return (
    <Provider store={ store }>
      <LocaleProvider locale={ enUS }>
        <App />
      </LocaleProvider>
    </Provider>
  );
}
