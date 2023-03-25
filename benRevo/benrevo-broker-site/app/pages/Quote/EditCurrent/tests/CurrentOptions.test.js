import React from 'react';
import { configure, shallow } from 'enzyme';
import { browserHistory } from 'react-router';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from './../../../../store';
import CurrentOptions from '../components/Options';

configure({ adapter: new Adapter() });
let store;

beforeAll(() => {
  store = configureStore({}, browserHistory);
});

describe('<CurrentOptions />', () => {
  test('should render Current Options)', () => {
    const wrapper = shallow(
      <CurrentOptions
        section="medical"
        containerId="test"
        carrierList={[]}
        formErrors={{}}
        modal={{ ref: { parentNode: { id: '' } } }}
        showErrors={false}
        changeShowErrors={jest.fn()}
        store={store}
      />).dive();
    wrapper.setProps({ formErrors: { plans: { msg: 'test', meta: null } }, showErrors: true });

    expect(wrapper.find('TabPane').text()).toBe('<TabPane />');

    wrapper.setProps({ formErrors: { test: 'test' }, showErrors: true, modal: { ref: { parentNode: { id: 1 } } } });
  });

  test('should not have reassignment', () => {
    const wrapper = shallow(
      <CurrentOptions
        section="medical"
        containerId="test"
        carrierList={[]}
        formErrors={{}}
        modal={{ ref: {} }}
        showErrors={false}
        changeShowErrors={jest.fn()}
        store={store}
      />).dive();
    wrapper.setProps({ formErrors: { plans: { msg: 'test', meta: null } }, showErrors: true });
  });
});
