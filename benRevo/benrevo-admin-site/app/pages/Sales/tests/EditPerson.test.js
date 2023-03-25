import React from 'react';
import { shallow } from 'enzyme';
import EditPerson from '../Persons/components/EditPerson';

describe('<EditPerson  />', () => {
  it('should render Edit Person Modal', () => {
    window.requestAnimationFrame = jest.fn();

    const renderedComponent = shallow(
      <EditPerson
        modalOpen
        modalClose={() => {}}
        handleSaveClick={() => {}}
        updatePerson={() => {}}
        person={{ brokerageList: [{ test: 'test' }], carrierId: 3, newBrokerageList: [], type: 'hello' }}
        sales={[]}
        presales={[]}
        allBrokerages={[]}
        allPeople={[]}
        currentChildren={[]}
        currentRole=""
        cancelClick={() => {}}
        fullBrokerageList={[]}
        updateChildren={() => {}}
        removeChildren={() => {}}
      />
    );

    expect(renderedComponent.find('Modal').length).toBe(1);

    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });
  });
});
