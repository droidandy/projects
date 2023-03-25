import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import MedicalPlans2 from './medicalPlans2.json';
import { initialPresentationMasterState } from './../../reducer/state';
import RXBody from './../components/RXBody';

configure({ adapter: new Adapter() });

describe('<RXBody />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;
  beforeAll(() => {
    const initialState = fromJS({
      presentation: initialPresentationMasterState,
    });
    store = mockStore(initialState);
  });
  const bottomSeparatedRxSysName = [
    'MEMBER_COPAY_TIER_1',
    'MEMBER_COPAY_TIER_4',
  ];
  it('should render the RXBody', () => {
    const planTemplate = MedicalPlans2.plans[0];
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <RXBody
            plan={planTemplate}
            rxClassName={'alt-table-column first first-column'}
            rxColumnClassName={'one-col-benefits row-name content-col'}
            rxRowType={'name'}
            bottomSeparatedRxSysName={bottomSeparatedRxSysName}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.alt-table-column.first.first-column').length).toBe(2);
  });
  it('should render the RXBody', () => {
    const planTemplate = MedicalPlans2.plans[1];
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <RXBody
            plan={planTemplate}
            rxClassName={'alt-table-column first-plan white'}
            rxColumnClassName={'on-col-rx content-col'}
            rxRowType={'name'}
            bottomSeparatedRxSysName={bottomSeparatedRxSysName}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.alt-table-column.first-plan.white').length).toBe(2);
  });
});
