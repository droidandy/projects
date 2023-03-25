import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MedicalPlans, MedicalPresentationPlans } from '@benrevo/benrevo-react-core';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import Alternatives from './../';
import { initialPresentationMasterState } from './../../reducer/state';
import { PLANS_GET_SUCCESS, DATA_REFRESHED } from '../../constants';

configure({ adapter: new Adapter() });

describe('<Alternatives />', () => {
  const uhcCarrier = {
    id: '7',
    carrier: {
      name: 'UHC',
      carrierId: 1,
    },
  };
  const anthemCarrier = {
    id: '5',
    carrier: {
      name: 'ANTHEM',
      carrierId: 3,
    },
  };
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      presentation: initialPresentationMasterState,
    });
    store = mockStore(initialState);
    store.dispatch({ type: DATA_REFRESHED, data: MedicalPresentationPlans, meta: { section: 'medical' } });
  });

  const section = 'medical';

  it('should render the Alternatives for UHC', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Alternatives
            section={section}
            index={0}
            changePage={jest.fn()}
            selectPlan={jest.fn()}
            carrier={uhcCarrier}
          />
        </IntlProvider>
      </Provider>
    );
    store.dispatch({ type: PLANS_GET_SUCCESS, payload: MedicalPlans, meta: { section: 'medical' } });
    renderedComponent.find('.breadcrumb a').forEach((node) => {
      node.simulate('click');
    });
    renderedComponent.find('.buttonRow .button').forEach((node) => {
      node.simulate('click');
    });
    expect(renderedComponent.find('.presentation-alternatives').length).toBe(1);
  });
  it('should render the Alternatives for Anthem', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Alternatives
            section={section}
            index={0}
            changePage={jest.fn()}
            selectPlan={jest.fn()}
            carrier={anthemCarrier}
          />
        </IntlProvider>
      </Provider>
    );
    store.dispatch({ type: PLANS_GET_SUCCESS, payload: MedicalPlans, meta: { section: 'medical' } });
    renderedComponent.find('.breadcrumb a').forEach((node) => {
      node.simulate('click');
    });
    renderedComponent.find('.buttonRow .button').forEach((node) => {
      node.simulate('click');
    });
    expect(renderedComponent.find('.presentation-alternatives').length).toBe(1);
  });
});
