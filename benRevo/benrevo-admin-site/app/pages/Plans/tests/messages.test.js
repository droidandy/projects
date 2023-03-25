import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider, FormattedMessage } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from '../../../store';
import messages from '../messages';


describe('<Plans />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the FormattedMessage component', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <FormattedMessage {...messages.files} />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('FormattedMessage').text()).toBe('Files');
  });
});
