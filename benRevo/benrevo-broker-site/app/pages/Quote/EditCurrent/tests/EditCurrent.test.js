import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import EditCurrent from '../EditCurrent';

configure({ adapter: new Adapter() });

describe('<EditCurrent />', () => {
  const correctData = {
    plans: [
      {
        title: 'title',
        name: 'title2',
        selectedCarrier: { carrierId: 1 },
        selectedNetwork: { networkId: 1 },
      },
    ],
  };
  test('should render EditCurrent component (validation error)', () => {
    const sectionState = {
      plans: [
        {
          title: 'title',
          name: '',
          selectedCarrier: { carrierId: 1 },
          selectedNetwork: { networkId: 1 },
        },
      ],
    };
    const wrapper = shallow(
      <EditCurrent
        loading={false}
        requestError={false}
        section="medical"
        optionId={200}
        openModal
        closeModal={jest.fn()}
        getCurrentOption={jest.fn()}
        saveCurrentOption={jest.fn()}
        changeLoad={jest.fn()}
        changeShowErrors={jest.fn()}
        sectionState={sectionState}
        setError={jest.fn()}
        deleteError={jest.fn()}
        plansLoaded
        otherCarrier={{}}
        virginCoverage={{}}
      />);

    expect(wrapper.instance().saveOption()).toEqual(false);
    expect(wrapper.find('Tab').text()).toBe('<Tab />');
  });

  test('should render EditCurrent component (validation success)', () => {
    const wrapper = shallow(
      <EditCurrent
        loading={false}
        requestError={false}
        section="medical"
        optionId={200}
        openModal
        closeModal={jest.fn()}
        getCurrentOption={jest.fn()}
        saveCurrentOption={jest.fn()}
        changeLoad={jest.fn()}
        changeShowErrors={jest.fn()}
        sectionState={correctData}
        setError={jest.fn()}
        deleteError={jest.fn()}
        plansLoaded
        otherCarrier={{}}
        virginCoverage={{}}
      />);

    expect(wrapper.instance().saveOption()).toEqual(true);
  });

  test('should render EditCurrent component (change page)', () => {
    const wrapper = shallow(
      <EditCurrent
        loading={false}
        requestError={false}
        section="medical"
        optionId={200}
        openModal
        closeModal={jest.fn()}
        getCurrentOption={jest.fn()}
        saveCurrentOption={jest.fn()}
        changeLoad={jest.fn()}
        changeShowErrors={jest.fn()}
        sectionState={correctData}
        setError={jest.fn()}
        deleteError={jest.fn()}
        plansLoaded
        otherCarrier={{}}
        virginCoverage={{}}
      />);

    wrapper.setProps({ loading: true });
    expect(wrapper.find('Dimmer').prop('active')).toBe(true);

    wrapper.setProps({ loading: false });
    expect(wrapper.find('Dimmer').prop('active')).toBe(false);
    expect(wrapper.state().currentTab).toBe(1);
  });
});
