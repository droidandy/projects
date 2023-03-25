import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { MedicalPlans } from '@benrevo/benrevo-react-core';
import { initialPresentationMasterState } from './../../reducer/state';
import ExtRxTotal from './../components/ExtRxTotal';

configure({ adapter: new Adapter() });

describe('<ExtRxTotal />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      presentation: initialPresentationMasterState,
    });
    store = mockStore(initialState);
  });
  const currentRxPlan = MedicalPlans.rx[0];
  const selectedMatchIcon = '/123.jpg/';
  const selectedIcon = '/234.jpg/';
  it('should render the ExtRxTotal', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <ExtRxTotal
            type={currentRxPlan.type}
            setBorderRxColor={jest.fn()}
            plan={currentRxPlan}
            selectedIcon={selectedIcon}
            selectNtRxPlan={jest.fn()}
            selectedMatchIcon={selectedMatchIcon}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.alt-table-column').length).toBe(2);
    renderedComponent.find('.alt-table-column').forEach((node) => {
      expect(node.html().indexOf('∞')).toBe(-1);
    });
  });
});
