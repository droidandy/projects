import React from 'react';
import { shallow } from 'enzyme';
import { Loader } from 'semantic-ui-react';
import BrokerageData from '../components/BrokerageData';
import { LIST_CLIENTS } from '../constants';

describe('<BrokerageData />', () => {
  it('should render BrokerageData', () => {
    window.requestAnimationFrame = jest.fn();

    const renderedComponent = shallow(
      <BrokerageData
        changedBrokerage={{}}
        updateBrokerage={() => {}}
        selectedBroker={{}}
        revertChanges={() => {}}
        saveChanges={() => {}}
        loading={false}
        getClients={() => {}}
        changeBrokers={() => {}}
        clients={[]}
        changeClients={() => {}}
        listType={''}
        peopleLoading={false}
        clientsLoading={false}
        seeAuth0={() => {}}
        auth0List={[]}
        selectedCarrier={{}}
      />
    );

    expect(renderedComponent.find('.data-table').length).toBe(3);

    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });

    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });
  });

  it('should render BrokerageData with loader', () => {
    window.requestAnimationFrame = jest.fn();
    const renderedComponent = shallow(
      <BrokerageData
        changedBrokerage={{}}
        updateBrokerage={() => {}}
        selectedBroker={{}}
        revertChanges={() => {}}
        saveChanges={() => {}}
        loading={false}
        getClients={() => {}}
        changeBrokers={() => {}}
        clients={[]}
        changeClients={() => {}}
        listType={LIST_CLIENTS}
        peopleLoading={false}
        clientsLoading
        seeAuth0={() => {}}
        auth0List={[]}
        selectedCarrier={{}}
      />
    );

    expect(renderedComponent.contains(<Loader active />)).toBe(true);
    expect(renderedComponent.find('.selected-broker-empty').length).toBe(1);
  });

  it('should render selectedBroker', () => {
    window.requestAnimationFrame = jest.fn();
    const clients = [
      {
        brokerId: '1',
      },
    ];
    const selectedBroker = {
      id: '1',
      salesFirstName: '123213',
      presalesFirstName: '2324242',
    };
    const renderedComponent = shallow(
      <BrokerageData
        changedBrokerage={{}}
        updateBrokerage={() => {}}
        selectedBroker={selectedBroker}
        revertChanges={() => {}}
        saveChanges={() => {}}
        loading={false}
        getClients={() => {}}
        changeBrokers={() => {}}
        clients={clients}
        changeClients={() => {}}
        listType={LIST_CLIENTS}
        peopleLoading={false}
        clientsLoading={false}
        seeAuth0={() => {}}
        auth0List={[]}
        selectedCarrier={{}}
      />
    );
    expect(renderedComponent.find('.selected-broker').length).toBe(1);
    expect(renderedComponent.find('.p-client').length).toBe(1);
  });

  it('should render selectedBroker', () => {
    window.requestAnimationFrame = jest.fn();
    const clients = [
      {
        brokerId: '1',
      },
    ];
    const selectedBroker = {
      id: '1',
      salesFirstName: '123213',
      presalesFirstName: '2324242',
    };
    const auth0List = [
      {
        brokerageId: '1',
      },
    ];
    const renderedComponent = shallow(
      <BrokerageData
        changedBrokerage={{}}
        updateBrokerage={() => {}}
        selectedBroker={selectedBroker}
        revertChanges={() => {}}
        saveChanges={() => {}}
        loading={false}
        getClients={() => {}}
        changeBrokers={() => {}}
        clients={clients}
        changeClients={() => {}}
        listType={'LIST_AUTH0'}
        peopleLoading={false}
        clientsLoading={false}
        seeAuth0={() => {}}
        auth0List={auth0List}
        selectedCarrier={{}}
      />
    );
    expect(renderedComponent.find('.auth-list').length).toBe(1);
  });
});
