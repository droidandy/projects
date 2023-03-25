import React from 'react';
import { shallow } from 'enzyme';
import ContributionTable from '../components/ContributionTable';

describe('<ContributionTable />', () => {
  it('should render ContributionTable', () => {
    window.requestAnimationFrame = jest.fn();

    const renderedComponent = shallow(
      <ContributionTable
        plan={{}}
        changedPlans={[]}
        index={0}
        updateSelectedPlan={jest.fn()}
        resetPlanChanges={jest.fn()}
        selectedTiers={[[]]}
      />
    );

    expect(renderedComponent.find('Grid').length).toBe(1);

    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });
  });
});
