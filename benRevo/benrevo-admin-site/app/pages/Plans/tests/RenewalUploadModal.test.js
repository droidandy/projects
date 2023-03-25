import React from 'react';
import { shallow } from 'enzyme';
import RenewalUploadModal from '../Submit/components/RenewalUploadModal';

describe('<RenewalUploadModal  />', () => {
  it('should render RenewalUploadModal', () => {
    window.requestAnimationFrame = jest.fn();

    const renderedComponent = shallow(
      <RenewalUploadModal
        modalOpen
        modalClose={jest.fn()}
        uploadQuote={jest.fn()}
      />
    );

    expect(renderedComponent.find('Modal').length).toBe(1);

    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });
  });
});
