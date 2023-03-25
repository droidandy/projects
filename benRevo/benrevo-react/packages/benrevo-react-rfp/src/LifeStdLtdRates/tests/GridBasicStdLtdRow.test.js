import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { fromJS } from 'immutable';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import GridBasicStdLtdRow from '../components/GridBasicStdLtdRow';

configure({ adapter: new Adapter() });

describe('<GridBasicStdLtdRow />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
    });
    store = mockStore(initialState);
  });

  it('should render the GridBasicStdLtdRow component', () => {
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
          <GridBasicStdLtdRow
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
