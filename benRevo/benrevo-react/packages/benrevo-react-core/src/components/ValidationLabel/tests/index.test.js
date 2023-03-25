import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import ValidationLabel from '../index';

configure({ adapter: new Adapter() });

describe('<ValidationLabel />', () => {
  it('ValidationLabel renders the text inside it', () => {
    const wrapper = mount(
      <ValidationLabel show error={{ msg: 'test' }} />
    );
    const label = wrapper.find('Label');
    expect(label.text()).toBe('test');
  });
});
