import React from 'react';
import { configure, mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from './../../../store';
import Carrier from '../Carrier';

configure({ adapter: new Adapter() });

describe('<Carrier />', () => {
  let store;
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

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  it('should render the Carrier component', () => {
    const renderedComponent = mount( // eslint-disable-line function-paren-newline
      <Provider store={store}>
        <IntlProvider locale="en">
          <Carrier routes={routes} route={routes[1]} />
        </IntlProvider>
      </Provider>);
    expect(renderedComponent.find(Carrier).length).toBe(1);
  });
});
