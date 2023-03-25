import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import { initialPresentationMasterState } from './../../reducer/state';
import RiderCard from '../PlanDetails/RiderCard';

configure({ adapter: new Adapter() });

describe('<RiderCard />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      clients: clientsReducerState,
      presentation: initialPresentationMasterState,
    });
    store = mockStore(initialState);
  });

  const rider = {
    networkType: 'HSA',
    riders: [],
    carrier: 'anthem',
  };

  const section = 'medical';

  it('should render the RiderCard page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <RiderCard rider={rider} section={section} />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });
    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.card-contributions-container').length).toBe(2);
  });
});
