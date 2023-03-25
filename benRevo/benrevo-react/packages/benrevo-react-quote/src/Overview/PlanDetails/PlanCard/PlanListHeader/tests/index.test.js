import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import PlanListHeader from '../index';

configure({ adapter: new Adapter() });

describe('<PlanListHeader />', () => {
  it('should render an <Grid> tag', () => {
    const renderedComponent = shallow(
      <PlanListHeader />
    );
    expect(renderedComponent.find('Grid').length).toBe(1);
  });
});
