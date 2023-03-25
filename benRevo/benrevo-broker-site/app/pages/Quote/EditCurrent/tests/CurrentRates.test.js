import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import CurrentRates from '../components/Rates';

configure({ adapter: new Adapter() });
const middlewares = [];
const mockStore = configureStore(middlewares);
let store;

beforeAll(() => {
  const initialState = fromJS({});
  store = mockStore(initialState);
});

describe('<CurrentRates />', () => {
  test('should render Current Rates)', () => {
    const wrapper = shallow(
      <CurrentRates
        section="medical"
        store={store}
      />).dive();
    expect(wrapper.find('TabPane').text()).toBe('<TabPane />');
  });
});
