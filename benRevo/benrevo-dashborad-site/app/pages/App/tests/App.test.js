import React from 'react';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from '../../../store';
import App from './../';

configure({ adapter: new Adapter() });

describe('<App />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  it('should render the App', () => {
    const location = {
      pathname: '/client/1',
    };
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <App location={location} />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.container-center').length).toBe(1);
  });
});
