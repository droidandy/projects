import React from 'react';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from '../../../store';
import BrokerVolume from './../components/BrokerVolume';

configure({ adapter: new Adapter() });

describe('<BrokerVolume />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the BrokerVolume Card', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <BrokerVolume
            volumeGroups={[]}
            volumeGroup={'TEST'}
            changeVolumeGroup={jest.fn()}
            productsList={[]}
            volumeProduct={'TEST123'}
            changeVolumeProduct={jest.fn()}
            groupsTotal={1337}
            membersTotal={1337}
            brokerVolume={[]}
          />
        </IntlProvider>
      </Provider>
    );

    // .hostNodes() makes sure the test only checks DOM, which eliminates duplicates
    expect(renderedComponent.find('.card-main').hostNodes().length).toBe(1);
    expect(renderedComponent.find('.card-sub-title').hostNodes().length).toBe(6);
    expect(renderedComponent.find('.card-count-item').hostNodes().length).toBe(2);
  });
});
