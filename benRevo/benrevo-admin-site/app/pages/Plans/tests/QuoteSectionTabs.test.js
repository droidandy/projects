import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from '../../../store';
import QuoteSectionTabs from '../Submit/components/QuoteSectionTabs';

describe('<QuoteSectionTabs />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the OptionNetworkItem page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <QuoteSectionTabs
            quoteFileName={{}}
            quotesFiles={{}}
            previewFiles={{}}
            quoteDates={{}}
            loadingQuotes={{}}
            selectedClient={{}}
            uploadQuote={jest.fn()}
            showInfo={jest.fn()}
            uploadDentalQuote={jest.fn()}
            previewQuote={jest.fn()}
            deleteQuote={jest.fn()}
            loadingOption1={false}
            loadingPlans={false}
            quotesLatest={{}}
            quoteNetworks={{}}
            changeOption1Group={jest.fn()}
            changeOption1={jest.fn()}
            saveOption1={jest.fn()}
            option1={{}}
            changeOption1Match={jest.fn()}
            changeUsage={jest.fn()}
            option1Difference={{}}
            getQuoteNetworks={jest.fn()}
            getDifference={jest.fn()}
            clientPlans={[]}
            medicalUsage={false}
            kaiserUsage={false}
            dentalUsage={false}
            visionUsage={false}
            medicalRenewalUsage={false}
            dentalRenewalUsage={false}
            visionRenewalUsage={false}
            selectedQuoteType={''}
            changeSelectedQuoteType={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.plans-review-tabs').length).toBe(1);
  });
});
