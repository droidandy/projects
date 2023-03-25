import React from 'react';
import { shallow } from 'enzyme';
import ClientGAs from '../components/ClientGAs';

describe('<ClientGAs />', () => {
  it('should render ClientGAs', () => {
    window.requestAnimationFrame = jest.fn();

    const renderedComponent = shallow(
      <ClientGAs
        GAList={[[]]}
        fullGAList={[]}
        gaClientTeamAdd={jest.fn()}
        gaClientTeamAddMember={jest.fn()}
        gaClientTeamRemoveMember={jest.fn()}
        gaClientTeamChangeMember={jest.fn()}
      />
    );

    expect(renderedComponent.find('.page-section-heading').length).toBe(1);

    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });
  });
});
