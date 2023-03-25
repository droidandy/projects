import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from '../../../store';
import App from '../';

describe('<App />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  const location = {
    pathname: '/client/plans/files',
  };

  it('should render the Header', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <App location={location} />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.container-center').length).toBe(0);
  });
});
