import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from '../../../store';
import PlanSubmit from '../Submit/PlanSubmit';

describe('<PlanSubmit />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the PlanSubmit page', () => {
    const summaryDate = '';
    const quoteDates = {};
    const quotesFiles = { DPPO: [] };
    const previewFiles = { DPPO: [] };
    const quoteFileName = { dental: '', kaiser: '', medical: '', vision: '' };
    const sentDate = '';
    const approveDate = '';
    const currentBroker = {};
    const selectedClient = {};
    const loadingQuotes = {};
    const quoteNetworks = {};
    const clientPlans = [];
    const summaries = {};
    const quoteIsEasy = {};
    const option1 = {};
    const quotesLatest = {};
    const option1Difference = {
      medical: [],
      dental: [],
      vision: [],
    };
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <PlanSubmit
            loadingSummary={false}
            currentPlanValid={{}}
            option1Difference={option1Difference}
            loadingOption1={false}
            loadingNotification={false}
            loadingApproveOnBoarding={false}
            summaryDate={summaryDate}
            quoteDates={quoteDates}
            quotesFiles={quotesFiles}
            previewFiles={previewFiles}
            quoteFileName={quoteFileName}
            sentDate={sentDate}
            approveDate={approveDate}
            currentBroker={currentBroker}
            selectedClient={selectedClient}
            loadingQuotes={loadingQuotes}
            quoteNetworks={quoteNetworks}
            clientPlans={clientPlans}
            summaries={summaries}
            quoteIsEasy={quoteIsEasy}
            option1={option1}
            quotesLatest={quotesLatest}
            uploadQuote={jest.fn()}
            changeUsage={jest.fn()}
            uploadDentalQuote={jest.fn()}
            previewQuote={jest.fn()}
            deleteQuote={jest.fn()}
            getQuoteNetworks={jest.fn()}
            getSummary={jest.fn()}
            saveSummary={jest.fn()}
            sendNotification={jest.fn()}
            approveOnBoarding={jest.fn()}
            changeOption1={jest.fn()}
            saveOption1={jest.fn()}
            changeOption1Match={jest.fn()}
            changeQuoteType={jest.fn()}
            changeOption1Group={jest.fn()}
            getDifference={jest.fn()}
            showInfo={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('button.not-link-button').forEach((node) => {
      node.simulate('click');
    });
    expect(renderedComponent.find('.plans-submit').length).toBe(1);
  });

  it('should render the PlanSubmit summaryCell blocks', () => {
    const summaryDate = '';
    const quoteDates = {};
    const quotesFiles = { DPPO: [] };
    const previewFiles = { DPPO: [] };
    const quoteFileName = { dental: '', kaiser: '', medical: '', vision: '' };
    const sentDate = '';
    const approveDate = '';
    const currentBroker = {};
    const selectedClient = {};
    const loadingQuotes = {};
    const quoteNetworks = {};
    const clientPlans = [];
    const summaries = {
      medical: '123',
      dental: '234',
      vision: '345',
      kaiser: '456',
    };
    const option1Difference = {
      medical: [],
      dental: [],
      vision: [],
    };
    const quoteIsEasy = {};
    const option1 = {};
    const quotesLatest = {};

    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <PlanSubmit
            loadingSummary={false}
            loadingOption1={false}
            loadingNotification={false}
            loadingApproveOnBoarding={false}
            summaryDate={summaryDate}
            currentPlanValid={{}}
            option1Difference={option1Difference}
            quoteDates={quoteDates}
            quotesFiles={quotesFiles}
            previewFiles={previewFiles}
            quoteFileName={quoteFileName}
            sentDate={sentDate}
            approveDate={approveDate}
            currentBroker={currentBroker}
            selectedClient={selectedClient}
            loadingQuotes={loadingQuotes}
            quoteNetworks={quoteNetworks}
            clientPlans={clientPlans}
            summaries={summaries}
            quoteIsEasy={quoteIsEasy}
            option1={option1}
            quotesLatest={quotesLatest}
            uploadQuote={jest.fn()}
            getSummary={jest.fn()}
            changeUsage={jest.fn()}
            uploadDentalQuote={jest.fn()}
            previewQuote={jest.fn()}
            deleteQuote={jest.fn()}
            getQuoteNetworks={jest.fn()}
            saveSummary={jest.fn()}
            sendNotification={jest.fn()}
            approveOnBoarding={jest.fn()}
            changeOption1={jest.fn()}
            saveOption1={jest.fn()}
            changeOption1Match={jest.fn()}
            changeQuoteType={jest.fn()}
            changeOption1Group={jest.fn()}
            getDifference={jest.fn()}
            showInfo={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('button.not-link-button').forEach((node) => {
      node.simulate('click');
    });
    renderedComponent.find('TextArea').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.summaryCell').length).toBe(4);
  });

  it('should render the PlanSubmit OptionNetworkItems', () => {
    const summaryDate = '';
    const quoteDates = {};
    const quotesFiles = { DPPO: [] };
    const previewFiles = { DPPO: [] };
    const quoteFileName = { dental: '', kaiser: '', medical: '', vision: '' };
    const sentDate = '';
    const approveDate = '';
    const currentBroker = {};
    const selectedClient = {};
    const loadingQuotes = {};
    const option1Difference = {
      medical: [],
      dental: [],
      vision: [],
    };
    const quoteNetworks = {
      medical: [
        { rfpQuoteNetwork: 1 },
        { rfpQuoteNetwork: 2 },
        { rfpQuoteNetwork: 3 },
      ],
      dental: [
        { rfpQuoteNetwork: 1 },
        { rfpQuoteNetwork: 2 },
        { rfpQuoteNetwork: 3 },
      ],
      vision: [
        { rfpQuoteNetwork: 1 },
        { rfpQuoteNetwork: 2 },
        { rfpQuoteNetwork: 3 },
      ],
      kaiser: [
        { rfpQuoteNetwork: 1 },
        { rfpQuoteNetwork: 2 },
        { rfpQuoteNetwork: 3 },
      ],
    };
    const clientPlans = [
      {
        planType: 'HMO',
        planName: 'AAA',
        client_plan_id: 123,
        option_id: 1,
        pnn_id: 1,
        isKaiser: false,
      }, {
        planType: 'PPO',
        planName: 'BBB',
        client_plan_id: 234,
        option_id: 2,
        pnn_id: 2,
        isKaiser: true,
      }, {
        planType: 'DPPO',
        planName: 'CCC',
        client_plan_id: 345,
        option_id: 3,
        pnn_id: 3,
        isKaiser: false,
      }, {
        planType: 'VISION',
        planName: 'DDD',
        client_plan_id: 456,
        option_id: 4,
        pnn_id: 4,
        isKaiser: false,
      },
    ];
    const summaries = {
      medical: '123',
      dental: '234',
      vision: '345',
      kaiser: '456',
    };
    const quoteIsEasy = {};
    const option1 = {
      medical: '123',
      dental: '234',
      vision: '345',
      kaiser: '456',
    };
    const quotesLatest = {
      medical: '123',
      dental: '234',
      vision: '345',
      kaiser: '456',
    };

    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <PlanSubmit
            loadingSummary={false}
            loadingOption1={false}
            loadingNotification={false}
            loadingApproveOnBoarding={false}
            summaryDate={summaryDate}
            currentPlanValid={{}}
            option1Difference={option1Difference}
            quoteDates={quoteDates}
            quotesFiles={quotesFiles}
            previewFiles={previewFiles}
            quoteFileName={quoteFileName}
            sentDate={sentDate}
            approveDate={approveDate}
            currentBroker={currentBroker}
            selectedClient={selectedClient}
            loadingQuotes={loadingQuotes}
            quoteNetworks={quoteNetworks}
            clientPlans={clientPlans}
            summaries={summaries}
            quoteIsEasy={quoteIsEasy}
            option1={option1}
            quotesLatest={quotesLatest}
            uploadQuote={jest.fn()}
            getSummary={jest.fn()}
            changeUsage={jest.fn()}
            uploadDentalQuote={jest.fn()}
            previewQuote={jest.fn()}
            deleteQuote={jest.fn()}
            getQuoteNetworks={jest.fn()}
            saveSummary={jest.fn()}
            sendNotification={jest.fn()}
            approveOnBoarding={jest.fn()}
            changeOption1={jest.fn()}
            saveOption1={jest.fn()}
            changeOption1Match={jest.fn()}
            changeQuoteType={jest.fn()}
            changeOption1Group={jest.fn()}
            getDifference={jest.fn()}
            showInfo={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('button.not-link-button').forEach((node) => {
      node.simulate('click');
    });
    renderedComponent.find('TextArea').forEach((node) => {
      node.simulate('change');
    });
    renderedComponent.find('Checkbox').forEach((node) => {
      node.simulate('change');
    });
    renderedComponent.find('Dropdown').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('OptionNetworkItem').length).toBe(4);
  });
});
