import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import HoursPerWeekTitle from '../questions/anthem/eligibility/HoursPerWeekTitle';
configure({ adapter: new Adapter() });

describe('<HoursPerWeekTitle />', () => {
  it('should render the HoursPerWeekTitle page', () => {
    const renderedComponent = shallow(
      <HoursPerWeekTitle />
    );
    expect(renderedComponent.find('.rfpPageFormSetHeadingBlue').length).toBe(1);
  });
});
