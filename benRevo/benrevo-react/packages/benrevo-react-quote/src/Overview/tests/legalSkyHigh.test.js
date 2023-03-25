import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import LegalG2 from '../PlanDetails/legal/legal-SkyHigh';

configure({ adapter: new Adapter() });

describe('<LegalG2 />', () => {
  it('should render the LegalSkyHigh page', () => {
    const renderedComponent = shallow(
      <LegalG2 />
    );
    expect(renderedComponent.find('p').length).toBeGreaterThan(0);
  });
});
