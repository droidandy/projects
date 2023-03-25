import React from 'react';
import { shallow } from 'enzyme';
import ChangeBrokerageModal from '../components/ChangeBrokerageModal';

describe('<ChangeBrokerageModal />', () => {
  it('should render ChangeBrokerageModal', () => {
    window.requestAnimationFrame = jest.fn();

    const renderedComponent = shallow(
      <ChangeBrokerageModal
        modalOpen
        modalClose={() => {}}
        selectedClient={{}}
        selectedBrokerage={{}}
        brokerages={[]}
        changeBrokerage={() => {}}
        moveReason={''}
        changeReason={() => {}}
        moveCheck
        changeMoveCheck={() => {}}
        moveClient={() => {}}
        currentBroker={{}}
      />
    );

    expect(renderedComponent.find('Modal').length).toBe(1);

    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });
  });
});
