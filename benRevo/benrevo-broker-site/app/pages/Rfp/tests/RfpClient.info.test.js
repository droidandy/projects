import React from 'react';
import { configure, mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from './../../../store';
import ClientInfo from '../Client/Info';

configure({ adapter: new Adapter() });

describe('<ClientInfo />', () => {
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
  it('should render the ClientInfo component', () => {
    const renderedComponent = mount( // eslint-disable-line function-paren-newline
      <Provider store={store}>
        <IntlProvider locale="en">
          <ClientInfo params={params} routes={routes} />
        </IntlProvider>
      </Provider>);
    expect(renderedComponent.find(ClientInfo).length).toBe(1);
  });
});
