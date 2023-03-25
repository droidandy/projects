import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import { initialPresentationMasterState } from './../../../reducer/state';
import RiderCard from '../RiderCard';

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
    riders: [
      { riderCode: '123', riderDescription: '123123', selected: true, riderId: '123' },
    ],
    carrier: 'ANTHEM',
    selectable: true,
    administrativeFee: false,
  };
  const riderFees = [
    { administrativeFeeId: 1, name: '123' },
  ];
  const section = 'medical';
  const optionId = 1;

  it('should render the RiderCard page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <RiderCard
            rider={rider}
            section={section}
            riderFees={riderFees}
            saveRiderFee={jest.fn()}
            optionRiderSelect={jest.fn()}
            optionRiderUnSelect={jest.fn()}
            optionId={optionId}
          />
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
    expect(renderedComponent.find('.card-contributions-row.card-rider-row-selectable').length).toBe(4);
  });
});
