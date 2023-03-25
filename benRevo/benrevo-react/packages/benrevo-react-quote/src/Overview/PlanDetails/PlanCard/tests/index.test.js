import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import Immutable from 'immutable';
import PlanCard from '../index';

configure({ adapter: new Adapter() });

describe('<PlanCard />', () => {
  it('should render an <Grid> tag', () => {
    const map = Immutable.Map()
      .set('dollarDifference', 1)
      .set('percentDifference', 2)
      .set('newPlan', {})
      .set('currentPlan', {});

    const renderedComponent = shallow(
      <PlanCard
        loading
        plan={map}
        deleteNetwork={jest.fn()}
        viewAlternatives={() => {}}
        carrier={{ carrier: { name: 'test' } }}
        networks={['test', 'test1']}
      />
    );
    expect(renderedComponent.find('Grid').length).toBeGreaterThan(0);
  });
});
