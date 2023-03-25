import React from 'react';
import { configure, mount } from 'enzyme';
import { fromJS } from 'immutable';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import { RfpReducerState as initialRfpMasterState } from '@benrevo/benrevo-react-rfp';
import configureStore from 'redux-mock-store';
import LifeStdLtdRates from '../LifeStdLtdRates';

configure({ adapter: new Adapter() });

describe('<LifeStdLtdRates />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      rfp: initialRfpMasterState,
      clients: clientsReducerState,
    });
    store = mockStore(initialState);
  });

  const params = {
    clientId: '123',
  };
  const routes = [
    {
      path: '',
    }, {
      path: '',
    }, {
      path: '',
    }, {
      path: 'life',
    }, {
      path: 'std',
    }, {
      path: 'ltd',
    },
  ];
  it('should render the LifeStdLtdRates component', () => {
    const renderedComponent = mount( // eslint-disable-line function-paren-newline
      <Provider store={store}>
        <IntlProvider locale="en">
          <LifeStdLtdRates params={params} routes={routes} />
        </IntlProvider>
      </Provider>);
    expect(renderedComponent.find(LifeStdLtdRates).length).toBe(1);
  });
});
