import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { CompareData } from '@benrevo/benrevo-react-core';
import { initialPresentationMasterState } from './../../reducer/state';
import Compare from '../';
import {
  COMPARE_GET_SUCCESS,
} from '../../constants';

configure({ adapter: new Adapter() });

describe('<Compare />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      presentation: initialPresentationMasterState,
    });
    store = mockStore(initialState);
  });


  it('should render the Compare Options page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Compare
            section="medical"
            changePage={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );

    store.dispatch({ type: COMPARE_GET_SUCCESS, payload: CompareData, meta: { section: 'medical' } });

    renderedComponent.find('a').forEach((node) => {
      node.simulate('click');
    });

    expect(renderedComponent.find('.compare-table').length).toBe(0);
  });
});
