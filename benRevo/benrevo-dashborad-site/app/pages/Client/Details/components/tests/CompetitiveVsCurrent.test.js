import React from 'react';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from '../../../../../store';
import CompetitiveVsCurrent from '../CompetitiveVsCurrent';

configure({ adapter: new Adapter() });

const fakeRole = ['SALES'];

describe('<CompetitiveVsCurrent />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the CompetitiveVsCurrent', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <CompetitiveVsCurrent
            client={{
              quoteType: 'KAISER',
              probability: 'HIGH',
              differences: [{ type: 'COMPETITIVE_INFO', value: 6 }, { type: 'OPTION1_RELEASED', value: 5 }],
              effectiveDate: '111111111111',
              options: [{ quoteType: 'STANDARD', carrier: 'Anthem Blue Cross', planTypes: ['HMO', 'PPO'], id: 111 }],
            }}
            clients={[
              { competitiveVsCurrent: 11 },
              { competitiveVsCurrent: -10 },
            ]}
            role={fakeRole}
          />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('div.big-round').text()).toEqual('+5.0');
    expect(renderedComponent.find('.mark-icon').length).toBe(1);
  });

  it('should render the CompetitiveVsCurrent', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <CompetitiveVsCurrent
            client={{
              quoteType: 'KAISER',
              probability: 'HIGH',
              differences: [{ type: 'COMPETITIVE_INFO', value: -17 }, { type: 'COMPETITIVE_INFO', value: -22 }, { type: 'OPTION1_RELEASED', value: -7 }],
              effectiveDate: '111111111111',
              options: [{ quoteType: 'STANDARD', carrier: 'Anthem Blue Cross', planTypes: ['HMO', 'PPO'], id: 111 }],
            }}
            clients={[
              { competitiveVsCurrent: 20 },
              { competitiveVsCurrent: -17 },
            ]}
            role={fakeRole}
          />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('div.big-round').text()).toEqual('-7.0');
    expect(renderedComponent.find('.mark-icon').length).toBe(2);
    const ruleMarkers = renderedComponent.find('.mini-round-number');
    expect(ruleMarkers.length).toBe(11);
    expect(ruleMarkers.first().text()).toBe('25');
    expect(ruleMarkers.last().text()).toBe('-25');
  });
});
