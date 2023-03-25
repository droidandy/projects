import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { fromJS, Map } from 'immutable';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { Carriers } from '@benrevo/benrevo-react-core';
import configureStore from 'redux-mock-store';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import { initialPresentationMasterState } from './../../reducer/state';
import { quotesStatusGetSuccess } from './../../reducer/common';
import { optionsGetSuccess } from './../../reducer/options';
import Options from '../';
import {
  OPTIONS_GET_SUCCESS,
  CARRIERS_GET_SUCCESS,
  QUOTES_STATUS_GET_SUCCESS,
} from '../../constants';

configure({ adapter: new Adapter() });

function carriersGetSuccess(state, action) {
  let data = fromJS([]);
  let mainCarrier = {};
  let kaiserCarrier = initialPresentationMasterState.get(action.meta.section).get('kaiserCarrier');
  let clearValueCarrier = initialPresentationMasterState.get(action.meta.section).get('clearValueCarrier');

  action.payload.map((item) => {
    if (item.carrier.name === 'ANTHEM_BLUE_CROSS') {
      mainCarrier = Map(item);
    } else if (item.carrier.name === 'ANTHEM_CLEAR_VALUE') {
      clearValueCarrier = Map(item);
    } else {
      if (item.carrier.name === 'KAISER') {
        kaiserCarrier = Map(item);
      }

      data = data.push(item);
    }

    return true;
  });

  return state
    .setIn([action.meta.section, 'mainCarrier'], mainCarrier)
    .setIn([action.meta.section, 'clearValueCarrier'], clearValueCarrier)
    .setIn([action.meta.section, 'kaiserCarrier'], kaiserCarrier)
    .setIn([action.meta.section, 'carrierList'], data);
}


describe('<Options />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      clients: clientsReducerState,
      presentation: initialPresentationMasterState,
    });
    const action1 = { type: CARRIERS_GET_SUCCESS, payload: Carriers, meta: { section: 'medical' } };
    const action2 = { type: OPTIONS_GET_SUCCESS, payload: data, meta: { section: 'medical' } };
    const action3 = { type: QUOTES_STATUS_GET_SUCCESS, payload: [{ carrierName: 'test', status: 'AVAILABLE' }], meta: { section: 'medical' } };
    store = mockStore(carriersGetSuccess(initialState, action1));
    store = mockStore(optionsGetSuccess(store.getState(), action2));
    store = mockStore(quotesStatusGetSuccess(store.getState(), action3));
    // store.dispatch({ type: CARRIERS_GET_SUCCESS, payload: Carriers, meta: { section: 'medical' } });
    // const actions = store.getActions();
    window.requestAnimationFrame = jest.fn();
    window.cancelAnimationFrame = jest.fn();
  });
  const data = {
    currentOption: {
      planTypes: ['HMO'],
      carrier: 'Test',
      percentDifference: 0,
      totalAnnualPremium: 0,
    },
    options: [
      {
        planTypes: [],
        carrier: 'Test',
        percentDifference: 0,
        totalAnnualPremium: 0,
      },
    ],
  };

  const showEmptyOption = true;
  const hasClearValue = true;
  const showQuotes = true;
  const showDtp = true;

  it('should render the Options page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Options
            showEmptyOption={showEmptyOption}
            hasClearValue={hasClearValue}
            showQuotes={showQuotes}
            showDtp={showDtp}
            section={'medical'}
            changePage={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );

    // store.dispatch({ type: OPTIONS_GET_SUCCESS, payload: data, meta: { section: 'medical' } });
    // store.dispatch({ type: QUOTES_STATUS_GET_SUCCESS, payload: [{ carrierName: 'test', status: 'AVAILABLE' }], meta: { section: 'medical' } });

    renderedComponent.find('.action-button').forEach((node) => {
      node.simulate('click');
    });
    renderedComponent.find('.card-add').forEach((node) => {
      node.simulate('click');
    });
    // expect(renderedComponent.find('CardItem').length).toBe(2);
    expect(renderedComponent.find('CardItem').length).toBe(0);
  });
});
