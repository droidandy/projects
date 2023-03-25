import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import { RfpReducerState, stateRFPReducerFiles } from '@benrevo/benrevo-react-rfp';
import Quote from './../Quote';

configure({ adapter: new Adapter() });

describe('<Quote />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      rfp: RfpReducerState,
      clients: clientsReducerState,
      rfpFiles: stateRFPReducerFiles,
    });
    store = mockStore(initialState);
  });

  const routes = [
    {},
    {
      childRoutes: [],
    },
    {
      path: 'medical',
    },
  ];
  const showAlongSidePopup = true;
  it('should render the Quote page for medical', () => {
    routes[2].path = 'medical';
    const renderedComponent = mount(
      <Provider store={store}>
        <Quote
          diagnosisHeader={jest.fn()}
          fileNote={jest.fn()}
          showAlongSidePopup={showAlongSidePopup}
          claimsHeader={jest.fn()}
          benefitsHeader={jest.fn()}
          routes={routes}
        />
      </Provider>
    );

    expect(renderedComponent.find(Quote).length).toBe(1);
  });
});
