import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { render, configure } from 'enzyme';
import LoadingIndicator from '../index';

configure({ adapter: new Adapter() });

describe('<LoadingIndicator />', () => {
  it('should render 12 divs', () => {
    const renderedComponent = render(
      <LoadingIndicator />
    );
    expect(renderedComponent.find('div').length).toBe(12);
  });
});
