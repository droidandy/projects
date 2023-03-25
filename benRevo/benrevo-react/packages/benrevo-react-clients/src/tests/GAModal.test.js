import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import GAModal from '../components/GAModal';

configure({ adapter: new Adapter() });

describe('<GAModal  />', () => {
  it('should render GAModal', () => {
    window.requestAnimationFrame = jest.fn();

    const renderedComponent = shallow(
      <GAModal modalOpen modalToggle={() => {}} action={() => {}} brokerages={[]} />
    );

    expect(renderedComponent.find('Modal').length).toBe(1);

    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });
  });
});
