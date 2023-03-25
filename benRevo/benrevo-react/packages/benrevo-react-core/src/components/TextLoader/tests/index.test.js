import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import TextLoader from '../index';

configure({ adapter: new Adapter() });

describe('<TextLoader />', () => {
  it('should render a <div> tag', () => {
    const renderedComponent = shallow(
      <TextLoader />
    );
    expect(renderedComponent.find('div').length).toBe(1);
  });
});

