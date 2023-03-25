import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { Provider } from 'react-redux';
import { Dropzone } from '@benrevo/benrevo-react-core';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import { initialRfpMasterState } from './../../reducer/state';
import { initialState as stateRFPReducerFiles } from './../../reducerFiles';
import Quote from '../';

configure({ adapter: new Adapter() });

describe('<Quote />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      rfp: initialRfpMasterState,
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

    renderedComponent.find('button.primary').simulate('click');
    renderedComponent.find('input[type="radio"]').forEach((node) => {
      node.simulate('change');
    });

    renderedComponent.find('input[type="checkbox"]').forEach((node) => {
      node.simulate('change');
    });

    renderedComponent.find('select').forEach((node) => {
      node.simulate('change');
    });

    renderedComponent.find('textarea').forEach((node) => {
      node.simulate('change');
    });

    renderedComponent.find(Dropzone).forEach((node) => {
      node.prop('onRemove')(0);
      node.prop('onDrop')([]);
    });

    expect(renderedComponent.find('.drop-zone').length).toBe(2);
  });

  /* it('should render the Quote page for dental', () => {
    routes[2].path = 'dental';
    const renderedComponent = mount(
      <Provider store={store}>
        <Quote
          diagnosisHeader={jest.fn()}
          fileNote={jest.fn()}
          showAlongSidePopup={true}
          claimsHeader={jest.fn()}
          routes={routes}
        />
      </Provider>
    );


    renderedComponent.find('input[type="radio"]').forEach((node) => {
      node.simulate('change');
    });

    renderedComponent.find('input[value="yes"][name="alternativeQuote"]').simulate('click');

    renderedComponent.find('textarea').simulate('change');

    renderedComponent.find(Dropzone).prop('onRemove')(0);
    renderedComponent.find(Dropzone).prop('onDrop')([{ name: 'test' }]);

    expect(renderedComponent.find('DentalAndVision').length).toBe(1);
  }); */
});
