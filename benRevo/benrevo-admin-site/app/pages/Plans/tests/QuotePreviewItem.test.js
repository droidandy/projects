import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from '../../../store';
import QuotePreviewItem from '../QuotePreview/components/QuotePreviewItem';

describe('<QuotePreviewItem />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  const data = {
    currentRates: [1, 2, 3, 4],
    newRates: [1, 2, 3, 4],
  };

  it('should render the QuotePreviewItem page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <QuotePreviewItem
            key={0}
            data={data}
            title="Rate change"
          />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.data-table-body').length).toBe(1);
  });
});
