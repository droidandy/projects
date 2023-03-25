import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import PresentationListHeader from '../index';

configure({ adapter: new Adapter() });

describe('<PresentationListHeader />', () => {
  it('should render an <Grid> tag', () => {
    const renderedComponent = shallow(
      <PresentationListHeader />
    );
    expect(renderedComponent.find('Grid').length).toBe(1);
  });
});
