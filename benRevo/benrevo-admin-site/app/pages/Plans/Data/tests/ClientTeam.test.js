import React from 'react';
import { shallow } from 'enzyme';
import ClientTeam from '../components/ClientTeam';

describe('<ClientTeam />', () => {
  it('should render ClientTeam', () => {
    window.requestAnimationFrame = jest.fn();

    const renderedComponent = shallow(
      <ClientTeam
        title={'test'}
        team={[]}
        onChange={jest.fn()}
        addMember={jest.fn()}
        removeMember={jest.fn()}
      />
    );

    expect(renderedComponent.find('.page-section-heading').length).toBe(1);

    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });
  });
});
