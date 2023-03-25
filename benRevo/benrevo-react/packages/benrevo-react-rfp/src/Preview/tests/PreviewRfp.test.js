import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import { initialState as stateRFPReducerFiles } from './../../reducerFiles';
import { initialState as stateCarrier } from './../../Carrier/reducer';
import { initialRfpMasterState } from './../../reducer/state';
import PreviewRfp from '../';

configure({ adapter: new Adapter() });

describe('<PreviewRfp />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      rfp: initialRfpMasterState,
      rfpFiles: stateRFPReducerFiles,
      clients: clientsReducerState,
      carrier: stateCarrier,
    });
    store = mockStore(initialState);
  });

  it('should render the PreviewRfp', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <PreviewRfp />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });
    expect(renderedComponent.find('.medicalRfpMainContainer').length).toBe(2);
  });
});
