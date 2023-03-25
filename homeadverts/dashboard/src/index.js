import React from 'react';
import ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import { App } from 'containers';
import createStore from 'store/create-store';

const { store, persistor } = createStore();

const rootElement = window.document.getElementById('root');

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Arial',
      'sans-serif',
    ].join(','),
    useNextVariants: true,
  },
  props: {
    MuiButtonBase: {
      // disableRipple: true,
    },
  },
  overrides: {
    MuiButton: {
      containedPrimary: {
        color: 'white',
        borderRadius: 3,
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
      },
    },
  },
});

const render = (Component) => {
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MuiThemeProvider theme={theme}>
          <Component />
        </MuiThemeProvider>
      </PersistGate>
    </Provider>,
    rootElement,
  );
};

render(process.env.NODE_ENV === 'development' ? hot(module)(App) : App);
