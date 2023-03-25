import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from '../../../../app/store';
import PrivicyUHC from '../';

configure({ adapter: new Adapter() });

describe('<PrivicyUHC />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the Uhc Privicy page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <PrivicyUHC />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.privacy').length).toBe(2);
  });
});
