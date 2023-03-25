import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { MedicalPlans } from '@benrevo/benrevo-react-core';
import { initialPresentationMasterState } from './../../reducer/state';
import ExtRXColumn from './../components/ExtRXColumn';

configure({ adapter: new Adapter() });

describe('<ExtRXColumn />', () => {
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
  const section = 'medical';
  const carrier = {
    carrier: {
      name: 'Anthem',
    },
  };
  const multiMode = false;
  const activeIndex = [];
  const bottomSeparatedRxSysName = [];
  it('should render the ExtRXColumn', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <ExtRXColumn
            setBorderRxColor={jest.fn()}
            plan={currentRxPlan}
            carrier={carrier}
            index={0}
            editPlan={jest.fn()}
            section={section}
            downloadPlanBenefitsSummary={jest.fn()}
            multiMode={multiMode}
            activeIndex={activeIndex}
            accordionClick={jest.fn()}
            bottomSeparatedRxSysName={bottomSeparatedRxSysName}
            selectNtRxPlan={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.alternatives-table-column').html().indexOf('∞')).toBe(-1);
    expect(renderedComponent.find('.alternatives-table-column').length).toBe(1);
  });
});
