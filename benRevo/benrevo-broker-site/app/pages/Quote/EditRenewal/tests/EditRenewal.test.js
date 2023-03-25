import React from 'react';
import { configure, shallow } from 'enzyme';

import Adapter from 'enzyme-adapter-react-16';


import EditRenewal from '../EditRenewal';

configure({ adapter: new Adapter() });

describe('<EditRenewal />', () => {
  test('should render EditRenewal component for testing ', () => {
    const wrapper = shallow(
      <EditRenewal
        loading={false}
        requestError={false}
        section="medical"
        optionId={200}
        openModal
        closeModal={jest.fn()}
        getCurrentOption={jest.fn()}
        saveCurrentOption={jest.fn()}
        changeLoad={jest.fn()}
      />);
    expect(wrapper.find('Tab').text()).toBe('<Tab />');
  });
});
