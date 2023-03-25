import React from 'react';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from '../../../../../store';
import Activity from '../Activity';
import { TYPE_COMPETITIVE_INFO } from '../../constants';

configure({ adapter: new Adapter() });

describe('<Activity />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the Activity component with TYPE_PROBABILITY activity', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Activity
            activities={[{ created: 1111111111, type: TYPE_COMPETITIVE_INFO, value: '11' }]}
            carriersList={{ medcal: [], dental: [], vision: [] }}
            sort={{ prop: 'created', order: 'ascending' }}
            productsList={[]}
            currentActivity={{}}
            mainCarrier={{}}
            changeActivitySort={jest.fn()}
            getActivity={jest.fn()}
            getActivityByType={jest.fn()}
            changeActivity={jest.fn()}
            updateActivity={jest.fn()}
            createActivity={jest.fn()}
            removeActivity={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );

    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });

    expect(renderedComponent.find('table.inner-table').text()).toEqual('01.13.70+11');
  });
});
