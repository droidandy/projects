import React from 'react';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from '../../../../store';

import RateProduct from '..';

configure({ adapter: new Adapter() });

describe('<RateProduct />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
    store.dispatch({ type: 'app/Info/RATE_BANK_SUCCESS',
      payload: {
        wellnessBudget: 12120,
        communicationBudget: 12,
        implementationBudget: 12,
        rateBankAmountRequested: 0,
        totalPremium: 0,
        costVsCurrent: -408,
        costVsCurrentPercentage: -100,
        costVsRenewal: -168,
        costVsRenewalPercentage: -100,
        totalDollarDifference: -34,
        totalRenewalDollarDifference: -14,
        carrierName: 'Anthem Blue Cross',
        enrollment: 15,
        quoteType: null,
        plans: [
          {
            planType: 'HMO',
            networkName: 'Vivity Network',
            networkRateBank: null,
            rateBankApplied: false,
            planName: 'V-Premier HMO 15/100% Rx:Essential Formulary $5/$15/$25/$45/30%',
            kaiserNetwork: false,
            outOfState: false,
            rfpQuoteNetworkPlanId: 342731,
            enrollment: 0,
            dollarDifference: -34,
            percentDifference: -100,
            renewalDollarDifference: -14,
            renewalPercentDifference: -100,
          },
          {
            planType: 'PPO',
            networkName: 'CV HSA Network',
            networkRateBank: null,
            rateBankApplied: false,
            planName: 'V-Premier HMO 15/100% Rx:Essential Formulary $5/$15/$25/$45/30%',
            kaiserNetwork: false,
            outOfState: false,
            rfpQuoteNetworkPlanId: 342732,
            enrollment: 0,
            dollarDifference: -50,
            percentDifference: -25,
            renewalDollarDifference: -19,
            renewalPercentDifference: -80,
          },
          {
            planType: 'HMO',
            networkName: 'Select Network',
            networkRateBank: null,
            rateBankApplied: false,
            planName: null,
            kaiserNetwork: false,
            outOfState: false,
            rfpQuoteNetworkPlanId: null,
            enrollment: 0,
            dollarDifference: null,
            percentDifference: null,
            renewalDollarDifference: null,
            renewalPercentDifference: null,
          },
        ],
        pepy: 0,
        eligibleForDiscount: false,
      },
    });
    store.dispatch(
      {
        type: 'app/Info/RATE_HISTORY_SUCCESS',
        payload: [
          {
            name: 'STANDARD_RATE_BANK_REQUEST',
            date: 'TEST__START__DATE',
            type: null,
            fileName: null,
          },
          {
            name: 'STANDARD_RATE_BANK_REQUEST',
            date: '2018-05-30 08:30:26.0',
            type: null,
            fileName: null,
          },
          {
            name: 'STANDARD_RATE_BANK_REQUEST',
            date: 'TEST__LAST__DATE',
            type: null,
            fileName: null,
          },
        ],
      }
    );
  });
  it('should render the RateProduct component', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <RateProduct
            routes={[{}, {}, {}, {}, {}, { path: 'medical' }, {}]}
          />
        </IntlProvider>
      </Provider>
    );

    const rfp = store.getState().get('rfp');
    const rateBank = rfp.getIn(['bank', 'rateBank']);
    expect(rateBank.toJS().plans.length).toBe(3);

    const table = renderedComponent.find('table');
    expect(table.find('tr').length).toBe(5);

    const filteredTableCells = table.find('td').filterWhere((cell) => cell.text().length > 1);
    expect(filteredTableCells.first().text()).toBe('MONTHLY DIFFERENCES');
    expect(filteredTableCells.last().text()).toBe('$-19');
    const cells = renderedComponent.find('td');
    expect(cells.length).toBe(16);

    const historyList = renderedComponent.find('.history-list').find('div');
    const historyListFiltered = historyList.filterWhere((div) => div.text().length > 1);
    expect(historyListFiltered.first().text()).toBe('History of request(s):TEST__START__DATE2018-05-30 08:30:26.0TEST__LAST__DATE');
    expect(historyListFiltered.last().text()).toBe('TEST__LAST__DATE');

    expect(renderedComponent.find('.totals-true').first().text()).toBe('$-408');
    expect(renderedComponent.find('.totals-true').last().text()).toBe('-100%');

    renderedComponent.find('.rate-bank__editButton').first().simulate('click');
    const saveButton = renderedComponent.find('.rate-bank__editButton');
    expect(saveButton.length).toBe(4);
  });
});
