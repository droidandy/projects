import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import RfpMessages from './messages';
import SubNavigation from '../../../components/SubNavigation';

configure({ adapter: new Adapter() });

describe('<SubNavigation />', () => {
  it('should render the first medical tab', () => {
    const route = { childRoutes: [{ path: 'information' }], path: '/medical', name: 'rfpMedical' };
    const renderedComponent = shallow(
      <SubNavigation route={route} messages={RfpMessages} parent="rfp" virginCoverage={{}} />
    );
    expect(renderedComponent.find('Menu').length).toBe(1);
  });
});
