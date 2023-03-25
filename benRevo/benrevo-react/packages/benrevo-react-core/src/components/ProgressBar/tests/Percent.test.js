import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import Percent from '../Percent';

configure({ adapter: new Adapter() });

it('should render an <div> tag', () => {
  const renderedComponent = shallow(<Percent />);
  expect(renderedComponent.type()).toEqual('div');
});
