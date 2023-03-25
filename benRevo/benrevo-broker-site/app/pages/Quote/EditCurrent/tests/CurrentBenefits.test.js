import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import CurrentBenefits from '../components/Benefits';

configure({ adapter: new Adapter() });
const middlewares = [];
const mockStore = configureStore(middlewares);
let store;

beforeAll(() => {
  const initialState = fromJS({});
  store = mockStore(initialState);
});

describe('<CurrentBenefits />', () => {
  test('should render Current Benefits)', () => {
    const wrapper = shallow(
      <CurrentBenefits
        section="medical"
        store={store}
      />).dive();
    expect(wrapper.find('TabPane').text()).toBe('<TabPane />');
  });
});
