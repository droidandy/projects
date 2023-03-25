import React from 'react';
import { configure, mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from './../../../store';
import AppPage from './../';

configure({ adapter: new Adapter() });

describe('<AppPage />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  const location = { pathname: '/somepath' };
  it('should render the AppPage component', () => {
    const renderedComponent = mount( // eslint-disable-line function-paren-newline
      <Provider store={store}>
        <IntlProvider locale="en">
          <AppPage location={location} />
        </IntlProvider>
      </Provider>);
    expect(renderedComponent.find('.app-container').length).toBe(1);
  });
});
