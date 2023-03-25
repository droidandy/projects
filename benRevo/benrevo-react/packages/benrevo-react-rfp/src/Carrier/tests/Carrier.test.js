import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import PropTypes from 'prop-types';
import { mount, configure } from 'enzyme';
import { fromJS } from 'immutable';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { Loader } from 'semantic-ui-react';
import configureStore from 'redux-mock-store';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import { initialState as stateRFPReducerFiles } from './../../reducerFiles';
import { initialState as stateCarrier } from './../reducer';
import { submitRfp } from './../actions';
import { initialRfpMasterState } from './../../reducer/state';
import Carrier from '../';

configure({ adapter: new Adapter() });

describe('<Carrier />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      rfp: initialRfpMasterState,
      rfpFiles: stateRFPReducerFiles,
      clients: clientsReducerState,
      carrier: stateCarrier,
    });
    store = mockStore(initialState);
  });

  it('should render the Loader with text: Validating RFP Data', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Carrier />
        </IntlProvider>
      </Provider>, {
        context: { mixpanel: { track: jest.fn() } },
        childContextTypes: { mixpanel: PropTypes.object } },
    );

    expect(renderedComponent.contains(<Loader indeterminate>Validating RFP Data</Loader>)).toBe(true);
  });

  it('should render the Loader with text Sending RFP after clicking submit', () => {
    store.dispatch(submitRfp());
    const editedStateCarrier = stateCarrier.set('submitting', true);
    const editedState = fromJS({
      rfp: initialRfpMasterState,
      rfpFiles: stateRFPReducerFiles,
      clients: clientsReducerState,
      carrier: editedStateCarrier,
    });
    store = mockStore(editedState);

    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Carrier />
        </IntlProvider>
      </Provider>, {
        context: { mixpanel: { track: jest.fn() } },
        childContextTypes: { mixpanel: PropTypes.object } },
    );

    expect(renderedComponent.contains(<Loader indeterminate>Sending RFP</Loader>)).toBe(true);
  });
});
