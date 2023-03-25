import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from '../../../store';
import PlanQuoteReview from '../QuotePreview';

describe('<PlanQuoteReview />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  const routes = [
    {
      path: 'medical',
    }, {
      path: 'dental',
    }, {
      path: 'vision',
    },
  ];

  it('should render the PlanQuoteReview page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <PlanQuoteReview
            routes={routes}
          />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.plans-review.section-wrap').length).toBe(1);
  });
});
