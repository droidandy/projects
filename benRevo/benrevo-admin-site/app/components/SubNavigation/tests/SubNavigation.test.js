import React from 'react';
import { shallow } from 'enzyme';
import messages from '../../../pages/Plans/messages';
import SubNavigation from '../../../components/SubNavigation';

describe('<SubNavigation />', () => {
  it('should render the first medical tab', () => {
    const route = { childRoutes: [{ path: 'information' }], path: '/medical', name: 'rfpMedical' };
    const renderedComponent = shallow(
      <SubNavigation route={route} messages={messages} parent="rfp" />
    );
    expect(renderedComponent.find('Menu').length).toBe(1);
  });
});
