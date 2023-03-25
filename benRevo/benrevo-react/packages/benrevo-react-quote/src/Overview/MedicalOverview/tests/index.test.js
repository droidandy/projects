import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import MedicalOverview from '../index';

configure({ adapter: new Adapter() });

describe('<MedicalOverview />', () => {
  it('should render its heading', () => {
    const renderedComponent = shallow(
      <MedicalOverview
        totalAnnualPremium={99999}
        percentDifference={0.033}
        dollarDifference={123}
        overviewPlans={[]}
        carrier={{ carrier: { name: 'test', displayName: 'test' } }}
      />
    );
    expect(renderedComponent.find('Grid').length).toBeGreaterThan(0);
  });

  it('should present the medical overview component', () => {
    const renderedComponent = mount(
      <IntlProvider locale="en">
        <MedicalOverview
          loading={false}
          totalAnnualPremium={99999}
          percentDifference={0.033}
          dollarDifference={123}
          overviewPlans={[]}
          carrier={{ carrier: { name: 'test', displayName: 'test' } }}
        />
      </IntlProvider>
    );
    expect(renderedComponent.find('div').length).toBeGreaterThan(0);
  });
});
