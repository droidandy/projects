import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import PlanOptionAdder from '../index';

configure({ adapter: new Adapter() });

describe('<PlanOptionAdder />', () => {
  it('should render its heading', () => {
    const renderedComponent = shallow(
      <PlanOptionAdder
        networks={[]}
        optionId={1}
        section={'medical'}
        addNetwork={jest.fn()}
      />
    );

    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });

    expect(renderedComponent.find('Grid').length).toBeGreaterThan(0);
  });
});
