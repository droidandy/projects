import React from 'react';
import { shallow } from 'enzyme';
import QuoteDeleteModal from '../Submit/components/QuoteDeleteModal';

describe('<QuoteDeleteModal  />', () => {
  it('should render QuoteDeleteModal', () => {
    window.requestAnimationFrame = jest.fn();

    const renderedComponent = shallow(
      <QuoteDeleteModal
        modalOpen
        modalClose={() => {}}
        fileToDelete=""
        quoteType=""
        deleteQuote={() => {}}
      />
    );

    expect(renderedComponent.find('Modal').length).toBe(1);

    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });
  });
});
