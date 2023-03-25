import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import PlanDetails from '../index';

configure({ adapter: new Adapter() });

describe('<PlanDetails />', () => {
  it('should render its heading', () => {
    const renderedComponent = shallow(
      <PlanDetails
        loading
        detailedPlans={[]}
        contributions={[]}
        disclaimer={{}}
        viewAlternatives={() => {}}
        activatePlans={() => {}}
        getDisclaimer={() => {}}
        changeContributionType={() => {}}
        changeContribution={() => {}}
        saveContributions={() => {}}
        addNetwork={() => {}}
        deleteNetwork={() => {}}
      />
    );
    expect(renderedComponent.find('Grid').length).toEqual(1);
  });

  it('should present the plan details component', () => {
    const renderedComponent = mount(
      <IntlProvider locale="en">
        <PlanDetails
          loading
          disclaimer={{}}
          detailedPlans={[]}
          contributions={[]}
          viewAlternatives={() => {}}
          activatePlans={() => {}}
          getDisclaimer={() => {}}
          changeContributionType={() => {}}
          changeContribution={() => {}}
          saveContributions={() => {}}
          addNetwork={() => {}}
          deleteNetwork={() => {}}
        />
      </IntlProvider>
    );
    expect(renderedComponent.find('div').length).toBeGreaterThan(0);
  });
});
