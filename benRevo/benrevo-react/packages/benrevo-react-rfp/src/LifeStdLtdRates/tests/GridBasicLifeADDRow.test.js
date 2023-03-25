import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { fromJS } from 'immutable';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import GridBasicLifeADDRow from '../components/GridBasicLifeADDRow';

configure({ adapter: new Adapter() });

describe('<GridBasicLifeADDRow />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
    });
    store = mockStore(initialState);
  });

  it('should render the GridBasicLifeADDRow component', () => {
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
          <GridBasicLifeADDRow
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
    expect(renderedComponent.find('.rfpColumnPadding').length).toBe(4);
  });
});
