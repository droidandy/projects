import React from 'react';
import {
  shallow,
  // mount,
  configure,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Presentation from '../Presentation';


configure({ adapter: new Adapter() });

describe('<Presentation />', () => {
  it('should render the Presentation component ', () => {
    const wrapper = shallow(
      <Presentation
        routes={[{}, {}, {}, {}, { path: 'medical' }]}
        section="medical"
        params={{ clientId: 205 }}
        client={
          {
            current: {
            },
          }
        }
        changeLoadReset={() => {}}
      >TestChildren
      </Presentation>
    );
    expect(wrapper.find('div').last().text()).toEqual('TestChildren');
    // const connect = wrapper.find('div').first();
    // expect(connect.find('Connect').length).toBe(3);
  });
});
