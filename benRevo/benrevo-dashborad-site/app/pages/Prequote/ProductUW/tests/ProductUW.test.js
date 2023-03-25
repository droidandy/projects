import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';


import ProductUW from '../ProductUW';

configure({ adapter: new Adapter() });

describe('<RateProduct />', () => {
  it('should render the ProductUW component', () => {
    const renderedComponent = shallow(
      <ProductUW
        attributes={{
          attributes: {
            KAISER_OR_SIMNSA: 'Alongside Kaiser/SIMNSA',
            INVALID_WAIVERS: '9',
            FIXED_UW_COMMENTS: 'Known Disabilities',
            TEXT_UW_COMMENTS: '',
          },
        }}
        section={'medical'}
        title={'medical'}
        client={{ id: 200 }}
        updateAttribute={jest.fn()}
        updateClient={jest.fn()}
      />
    );
    expect(renderedComponent.find('div').length).toBe(3);
    expect(renderedComponent.find('div').first().text()).toBe("Let's go over everything you need to get a quote for your client");
    expect(renderedComponent.find('div').last().text()).toBe('First-Adjustment Factor Load (attributes): ');

    const factorHolder = renderedComponent.find('.factors-holder');
    expect(factorHolder.find('div').length).toBe(2);
  });
});
