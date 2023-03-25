import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import Wrapper from '../Wrapper';

configure({ adapter: new Adapter() });

it('should render an <div> tag', () => {
  const renderedComponent = shallow(<Wrapper />);
  expect(renderedComponent.type()).toEqual('div');
});
