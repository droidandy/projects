import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import { ContributionData } from '@benrevo/benrevo-react-core';
import SubscriptionCard from '../index';

configure({ adapter: new Adapter() });

describe('<SubscriptionCard />', () => {
  it('should render an <Grid> tag', () => {
    const renderedComponent = shallow(
      <SubscriptionCard
        loading
        newPlan={{ nameByNetwork: 'test' }}
        carrier={{ carrier: { name: 'test' } }}
        contributions={ContributionData[0]}
        changeContributionType={jest.fn()}
        changeContribution={jest.fn()}
        saveContributions={jest.fn()}
      />
    );
    expect(renderedComponent.find('GridColumn').length).toBeGreaterThan(0);
  });
});
