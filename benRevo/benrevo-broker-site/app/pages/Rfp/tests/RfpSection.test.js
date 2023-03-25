import React from 'react';
import { configure, mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from './../../../store';
import Section from '../Section';

configure({ adapter: new Adapter() });

describe('<Section />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  const params = {
    clientId: '123',
  };
  const route = {
    name: 'rfpMedical',
    childRoutes: [
      {
        path: 'options',
      },
    ],
  };
  it('should render the Section component', () => {
    const renderedComponent = mount( // eslint-disable-line function-paren-newline
      <Provider store={store}>
        <IntlProvider locale="en">
          <Section params={params} route={route} routes={[]} />
        </IntlProvider>
      </Provider>);
    expect(renderedComponent.find(Section).length).toBe(1);
  });
});
