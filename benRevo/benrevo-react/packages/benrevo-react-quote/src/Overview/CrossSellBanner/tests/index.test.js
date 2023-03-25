import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import CrossSellBanner from '../index';

configure({ adapter: new Adapter() });

describe('<CrossSellBanner />', () => {
  const totalAnnualPremium = 1;
  it('should render its heading', () => {
    const renderedComponent = shallow(
      <CrossSellBanner
        totalAnnualPremium={totalAnnualPremium}
      />
    );
    expect(renderedComponent.find('Grid').length).toBeGreaterThan(0);
  });
});
