import React from 'react';
import {
  mount, configure,
  //  shallow
} from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from '../../../../store';

import Setup from '..';


configure({ adapter: new Adapter() });

describe('<Setup />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
    store.dispatch({
      type: 'app/setupPresentation/GET_PRESENTATION_OPTIONS_SUCCESS',
      payload: {
        currents: [
          {
            id: null,
            name: 'Current',
            displayName: null,
            carrier: 'Blue Shield',
            totalAnnualPremium: 26760,
            percentDifference: 0,
            planTypes: [
              'HMO',
              'HMO',
              'HMO',
              'PPO',
              'HSA',
            ],
            plans: [
              {
                name: 'test',
                type: 'HMO',
              },
              {
                name: 'test',
                type: 'HMO',
              },
              {
                name: 'test5',
                type: 'HMO',
              },
              {
                name: 'test3',
                type: 'PPO',
              },
              {
                name: 'test5',
                type: 'HSA',
              },
            ],
            selected: false,
            quoteType: 'STANDARD',
            quoteState: null,
            optionType: 'OPTION',
            complete: false,
            category: 'MEDICAL',
          },
        ],
        renewals: [
          {
            id: 61,
            name: 'Renewal',
            displayName: 'Renewal',
            carrier: 'Blue Shield',
            totalAnnualPremium: 14894.4,
            percentDifference: -44.3,
            planTypes: [
              'HMO',
              'HMO',
              'PPO',
              'HSA',
            ],
            plans: [
              {
                name: 'test',
                type: 'HMO',
              },
              {
                name: 'test5',
                type: 'HMO',
              },
              {
                name: 'test3',
                type: 'PPO',
              },
              {
                name: 'test5',
                type: 'HSA',
              },
            ],
            selected: false,
            quoteType: 'STANDARD',
            quoteState: null,
            optionType: 'RENEWAL',
            complete: false,
            category: 'MEDICAL',
          },
        ],
        alternatives: [
          {
            name: 'Alternative 99',
            presentationOptionId: '374',
            productsOptions: [],
            bundlingDiscounts: [
              {
                product: null,
                discount: null,
              },
            ],
            total: 0,
            percentage: -100,
          },
        ],
        currentTotal: 41160,
        renewalTotal: 24494.4,
        renewalPercentage: -40.5,
      },
    });
  });
  it('should render the Setup component', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Setup />
        </IntlProvider>
      </Provider>
    );

    const stateAlternatives = store.getState().get('setupPresentation').get('alternatives').toJS();
    expect(renderedComponent.find('.eight').last().text()).toBe(`${stateAlternatives[0].percentage.toString()}%`);

    expect(renderedComponent.find('div').length).toBe(121);

    expect(renderedComponent.find('span').length).toBe(18);
    const totals = renderedComponent.find('span').filterWhere((n) => n.text().length > 1);
    expect(totals.first().text()).toBe('Showing 1 - 3 of 3 PLANS');
    expect(totals.last().text()).toBe('ADD BUNDLE DISCOUNT');

    expect(renderedComponent.find('img').length).toEqual(6);
    const beforeToggle = renderedComponent.html();
    renderedComponent.find('.toggle-button').simulate('click');
    const afterToogle = renderedComponent.html();
    expect(beforeToggle !== afterToogle).toBe(true);
  });
});
