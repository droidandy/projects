import React from 'react';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from '../../../store';
import List from '../List';
import { QUOTED_STATE, ON_BOARDING_STATE, PENDING_APPROVAL_STATE, SOLD_STATE } from '../../../pages/Home/constants';

configure({ adapter: new Adapter() });

describe('<List />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the Filters component', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <List
            filters={{
              difference: [0, 7],
              effectiveDate: [0, 7],
              carriers: [{
                carrierId: 1,
                displayName: 'test',
              }],
              sales: [{
                fullName: 'test',
              }],
              competitiveInfoCarrier: {
                name: 'test',
              },
              presales: [{
                fullName: 'test',
              }],
              brokers: [{
                name: 'test',
              }],
              clientStates: [QUOTED_STATE, ON_BOARDING_STATE, PENDING_APPROVAL_STATE, SOLD_STATE],
            }}
            changeFilter={jest.fn()}
            clearFilter={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );

    renderedComponent.find('button.filter-button-toggle').forEach((node) => {
      node.simulate('click');
    });

    renderedComponent.find('a').forEach((node) => {
      node.simulate('click');
    });

    expect(renderedComponent.find('a.filter-item').length).toBe(9);
  });
});
