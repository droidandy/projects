import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import CardItem from '../CardItem';

configure({ adapter: new Adapter() });

describe('<CardItem />', () => {
  const mainCarrier = {
    id: '7',
    carrier: {
      name: 'UHC',
    },
  };
  const carrierList = [
    {
      id: '1',
      carrier: {
        name: 'Anthem',
      },
    },
    {
      id: '2',
      carrier: {
        name: 'Kaiser Permanente',
      },
    },
    {
      id: '3',
      carrier: {
        name: 'Blue of California',
      },
    },
    {
      id: '4',
      carrier: {
        name: 'HealthNet',
      },
    },
    {
      id: '5',
      carrier: {
        name: 'Cigna',
      },
    },
    {
      id: '6',
      carrier: {
        name: 'Cigna',
      },
    },
  ];
  const data = {
    percentDifference: 1,
    totalAnnualPremium: 1,
    id: 1,
  };

  it('should render the CardItem component with CheckOptions', () => {
    const renderedComponent = shallow(
      <CardItem
        section="medical"
        data={data}
        mainCarrier={mainCarrier}
        carrierList={carrierList}
        index={1}
        checkedOptions={[1]}
        changePage={jest.fn()}
        optionsSelect={jest.fn()}
        optionCheck={jest.fn()}
        optionsDelete={jest.fn()}
        selected={2}
      />
    );

    renderedComponent.find('Checkbox').simulate('change');
    renderedComponent.find('a').forEach((node) => {
      node.simulate('click');
    });

    expect(renderedComponent.find('Card').length).toBe(1);
  });

  it('should render the CardItem component without CheckOptions', () => {
    const renderedComponent = shallow(
      <CardItem
        section="medical"
        data={data}
        index={1}
        mainCarrier={mainCarrier}
        carrierList={carrierList}
        checkedOptions={[2]}
        changePage={jest.fn()}
        optionsSelect={jest.fn()}
        optionCheck={jest.fn()}
        optionsDelete={jest.fn()}
        selected={1}
      />
    );

    expect(renderedComponent.find('.added-to-cart').length).toBe(1);
  });
});
