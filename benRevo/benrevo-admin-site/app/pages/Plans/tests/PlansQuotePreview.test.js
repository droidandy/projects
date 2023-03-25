import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from '../../../store';
import PlansQuotePreview from '../PlansQuotePreview';

describe('<PlansQuotePreview />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the PlansQuotePreview page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <PlansQuotePreview />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.plans').length).toBe(1);
  });
});
