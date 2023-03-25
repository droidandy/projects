import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import PropTypes from 'prop-types';
import { mount, configure } from 'enzyme';
import { fromJS, Map } from 'immutable';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { Loader } from 'semantic-ui-react';
import configureStore from 'redux-mock-store';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import { stateRFPReducerFiles, RfpReducerState } from '@benrevo/benrevo-react-rfp';
import Carrier from './../Carrier';

configure({ adapter: new Adapter() });

describe('<Carrier />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  const carrierState = fromJS({
    loading: false,
    submitting: false,
    rfpSuccessfullySubmitted: false,
    rfpSubmitDate: null,
    alertMsg: null,
    censusType: Map({}),
    standard: Map({}),
    statusLoaded: false,
    plansLoaded: false,
    clearValue: Map({}),
    qualificationClearValue: Map({}),
    showClearValueBanner: false,
    selected: {
      medical: true,
      dental: true,
      vision: true,
      life: true,
      std: true,
      ltd: true,
    },
  });
  const routes = [
    {},
    {
      childRoutes: [],
    },
    {
      childRoutes: [
        {
          path: 'medical',
        },
        {
          path: 'medical',
        },
        {
          path: 'test3',
        },
      ],
    },
    {
      path: 'medical',
    },
  ];
  beforeAll(() => {
    const initialState = fromJS({
      rfp: RfpReducerState,
      rfpFiles: stateRFPReducerFiles,
      clients: clientsReducerState,
      carrier: carrierState,
    });
    store = mockStore(initialState);
  });

  it('should render the Loader with text: Validating RFP Data', () => {
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = () => {};
    }
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Carrier routes={routes} />
        </IntlProvider>
      </Provider>, {
        context: { mixpanel: { track: jest.fn() } },
        childContextTypes: { mixpanel: PropTypes.object } },
    );

    expect(renderedComponent.contains(<Loader indeterminate>Validating RFP Data</Loader>)).toBe(true);
  });
});
