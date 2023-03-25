import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import CurrentEnrollment from '../components/Enrollment';

configure({ adapter: new Adapter() });
const middlewares = [];
const mockStore = configureStore(middlewares);
let store;

beforeAll(() => {
  const initialState = fromJS({});
  store = mockStore(initialState);
});

describe('<CurrentEnrollment />', () => {
  test('should render Current Enrollment)', () => {
    const wrapper = shallow(
      <CurrentEnrollment
        section="medical"
        store={store}
      />).dive();
    expect(wrapper.find('TabPane').text()).toBe('<TabPane />');
  });
});
