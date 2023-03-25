import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import PrivacyAnthem from './../';
import configureStore from '../../../../app/store';
configure({ adapter: new Adapter() });

describe('<PrivacyAnthem />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the Anthem Privicy page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <PrivacyAnthem />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.privacy').hostNodes().length).toBe(1);
  });
});
