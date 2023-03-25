import React from 'react';
import { mount, configure, ReactWrapper } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from '../../../store';
import Filters from '../';
import { SET_PROFILE, ROLE_CARRIER_MANAGER } from '../../../utils/authService/constants';

configure({ adapter: new Adapter() });

describe('<Filters />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
    global.requestAnimationFrame = (callback) => {
      setTimeout(callback, 0);
    };
    window.cancelAnimationFrame = jest.fn();
    store.dispatch({ type: SET_PROFILE,
      profile: {
        app_metadata: {
          roles: ROLE_CARRIER_MANAGER,
        },
      },
    });
  });

  it('should render the Filters component', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Filters
            maxDiff={22}
            minDiff={-22}
            filters={{
              difference: [],
              effectiveDate: [],
              carriers: [],
              sales: [],
              brokers: [],
              clientStates: [],
            }}
            carriers={[{
              displayName: 'test',
              id: 1,
            }]}
            sae={[{
              fullName: 'test',
              id: 1,
            }]}
            brokers={[{
              text: 'test',
              value: 1,
            }]}
            changeFilter={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );

    renderedComponent.find('button.filter-button-toggle').forEach((node) => {
      node.simulate('click');
    });

    const dialog = renderedComponent.find('Portal');
    const portalWrapper = new ReactWrapper(dialog.instance().props.children);

    portalWrapper.find('input[type="text"]').forEach((node) => {
      node.simulate('change');
    });

    portalWrapper.find('input[type="checkbox"]').forEach((node) => {
      node.simulate('change');
    });

    portalWrapper.find('Dropdown').forEach((node) => {
      node.simulate('change');
    });

    portalWrapper.find('button').forEach((node) => {
      node.simulate('click');
    });

    expect(portalWrapper.find('div.filter-title').length).toBe(5);
  });
});
