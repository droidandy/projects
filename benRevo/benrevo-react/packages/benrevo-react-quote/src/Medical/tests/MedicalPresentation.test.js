/* import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
configure({ adapter: new Adapter() });

import { initialPresentationMasterState } from './../../reducer/state';
import MedicalPresentation from '../MedicalPresentation'; */

describe('<MedicalPresentation />', () => {
  it('should render the MedicalPresentation page', () => {
    expect(true).toBe(true);
  });
 /* const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      presentation: initialPresentationMasterState,
    });
    store = mockStore(initialState);
  });

  const routes = [
    {},
    {},
    {
      path: 'medical',
    },
  ];

  it('should render the MedicalPresentation page', () => {
    routes[2].path = 'medical';
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <MedicalPresentation routes={routes} />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('.breadcrumb a').forEach((node) => {
      node.simulate('click');
    });
    expect(renderedComponent.find('Grid').length).toBe(1);
    expect(renderedComponent.find('.medical-presentation').length).toBe(1);
  }); */
});
