import React from 'react';
import { shallow } from 'enzyme';
import StatusChangeModal from '../components/StatusChangeModal';

describe('<StatusChangeModal />', () => {
  it('should render StatusChangeModal', () => {
    window.requestAnimationFrame = jest.fn();

    const renderedComponent = shallow(
      <StatusChangeModal
        modalOpen
        modalClose={() => {}}
        selectedClient={{}}
        handleStatusChange={() => {}}
        stateOfInterest={''}
      />
    );

    expect(renderedComponent.find('Modal').length).toBe(1);

    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });
  });
});
