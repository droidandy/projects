import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import CurrentContribution from '../components/Contribution';

configure({ adapter: new Adapter() });
const middlewares = [];
const mockStore = configureStore(middlewares);
let store;

beforeAll(() => {
  const initialState = fromJS({});
  store = mockStore(initialState);
});

describe('<CurrentContribution />', () => {
  test('should render Current Contribution)', () => {
    const wrapper = shallow(
      <CurrentContribution
        section="medical"
        store={store}
      />).dive();
    expect(wrapper.find('TabPane').text()).toBe('<TabPane />');
  });
});
