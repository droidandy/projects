import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import { initialRfpMasterState } from './../../reducer/state';
import GridBasicLifeRow from '../components/GridBasicLifeRow';

configure({ adapter: new Adapter() });

describe('<GridBasicLifeRow />', () => {
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


  it('should render the GridBasicLifeRow component', () => {
    const section = 'life';
    const basicRates = {
      ages: [],
      currentADD: null,
      currentLife: null,
      renewalADD: null,
      renewalLife: null,
    };
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <GridBasicLifeRow
            section={section}
            basicRates={basicRates}
            updateForm={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('NumberFormat').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.rateRow').length).toBe(2);
  });
});
