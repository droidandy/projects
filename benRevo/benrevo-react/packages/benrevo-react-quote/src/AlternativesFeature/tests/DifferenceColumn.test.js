import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { MedicalPlans } from '@benrevo/benrevo-react-core';
import { initialPresentationMasterState } from './../../reducer/state';
import DifferenceColumn from './../components/DifferenceColumn';

configure({ adapter: new Adapter() });

describe('<DifferenceColumn />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      presentation: initialPresentationMasterState,
    });
    store = mockStore(initialState);
  });
  const currentPlan = MedicalPlans.plans[0];
  it('should render the DifferenceColumn', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <DifferenceColumn plan={currentPlan} borderClass={'border-class-name'} />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.border-class-name').length).toBe(2);
  });
});
