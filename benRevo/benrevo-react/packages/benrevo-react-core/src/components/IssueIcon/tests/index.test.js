import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import IssueIcon from '../index';

configure({ adapter: new Adapter() });

describe('<IssueIcon />', () => {
  it('should render a SVG', () => {
    const renderedComponent = shallow(
      <IssueIcon />
    );
    expect(renderedComponent.find('svg').length).toBe(1);
  });
});
