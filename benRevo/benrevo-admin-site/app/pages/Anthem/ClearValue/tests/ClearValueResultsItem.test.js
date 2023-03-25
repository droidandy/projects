import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from '../../../../store';
import ClearValueResultsItem from '../components/ClearValueResultsItem';

describe('<ClearValueResultsItem />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the ClearValueResultsItem component', () => {
    const data = {
      planName: '123',
      tier1Rate: '123213',
      tier2Rate: '12312312',
      tier3Rate: '123124',
      tier4Rate: '12421421',
    };
    const index = 0;
    const title = '123';
    const rfpQuoteNetwork = '123123';
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <ClearValueResultsItem data={data} index={index} title={title} rfpQuoteNetwork={rfpQuoteNetwork} />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.tableCell').length).toBe(7);
  });

  it('should render the ClearValueResultsItem title', () => {
    const data = {
      planName: '123',
      tier1Rate: '123213',
      tier2Rate: '12312312',
      tier3Rate: '123124',
      tier4Rate: '12421421',
    };
    const index = 0;
    const title = 'Title';
    const rfpQuoteNetwork = '234';
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <ClearValueResultsItem data={data} index={index} title={title} rfpQuoteNetwork={rfpQuoteNetwork} />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.title').text()).toBe('Title');
  });

  it('should render the ClearValueResultsItem rfpQuoteNetwork', () => {
    const data = {
      planName: '123',
      tier1Rate: '123213',
      tier2Rate: '12312312',
      tier3Rate: '123124',
      tier4Rate: '12421421',
    };
    const index = 0;
    const title = 'Title';
    const rfpQuoteNetwork = 'RfpQuoteNetwork';
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <ClearValueResultsItem data={data} index={index} title={title} rfpQuoteNetwork={rfpQuoteNetwork} />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.rfpQuoteNetwork').text()).toBe('RfpQuoteNetwork');
  });
});

describe('<ClearValueResultsItem />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  const plan = {
    planName: '',
    tier1Rate: '',
    tier2Rate: '',
    tier3Rate: '',
    tier4Rate: '',
  };

  it('should render the ClearValueResultsItem page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <ClearValueResultsItem
            key={0}
            data={plan}
            title="Medical"
            index={0}
            rfpQuoteNetwork={'Network'}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.data-table-body').length).toBe(1);
  });
});
