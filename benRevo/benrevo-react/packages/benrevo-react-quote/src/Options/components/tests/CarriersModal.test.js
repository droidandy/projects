import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import CarriersModal from '../CarriersModal';

configure({ adapter: new Adapter() });

describe('<CardItem />', () => {
  const CARRIER = 'ANTHEM';
  const uhc = CARRIER === 'UHC';
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
  const hasClearValue = true;
  it('should render the CarriersModal component', () => {
    const renderedComponent = shallow(
      <CarriersModal
        section={'medical'}
        mainCarrier={mainCarrier}
        current={{ carrier: 'UHC' }}
        clearValueCarrier={mainCarrier}
        hasClearValue={hasClearValue}
        open
        carrierList={carrierList}
        quotes={[]}
        showEmptyOption={false}
        modalToggle={jest.fn()}
        changePage={jest.fn()}
      />
    );

    renderedComponent.find('a').forEach((node) => {
      node.simulate('click');
    });

    renderedComponent.find('Button').forEach((node) => {
      node.simulate('click');
    });

    renderedComponent.setState({ start: 6, limit: 10 });

    renderedComponent.find('a').forEach((node) => {
      node.simulate('click');
    });

    renderedComponent.find('Button').forEach((node) => {
      node.simulate('click');
    });

    expect(renderedComponent.find('.carrier-content-item').length).toBe((uhc) ? 4 : 4);
  });
});
