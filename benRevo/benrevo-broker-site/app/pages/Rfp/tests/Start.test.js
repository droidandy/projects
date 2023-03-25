import React from 'react';
import { configure, mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from './../../../store';
import Start from '../Start';

configure({ adapter: new Adapter() });

describe('<Start />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  const params = {
    clientId: '123',
  };
  const routes = [
    {},
    {
      childRoutes: [],
    },
    {
      childRoutes: [
        {
          path: 'medical',
        },
        {
          path: 'medical',
        },
        {
          path: 'test3',
        },
      ],
    },
    {
      path: 'medical',
    },
    {
      path: 'medical',
    },
    {
      path: 'medical',
    },
  ];
  it('should render the Start component', () => {
    const renderedComponent = mount( // eslint-disable-line function-paren-newline
      <Provider store={store}>
        <IntlProvider locale="en">
          <Start params={params} routes={routes} />
        </IntlProvider>
      </Provider>);
    expect(renderedComponent.find(Start).length).toBe(1);
  });
});
