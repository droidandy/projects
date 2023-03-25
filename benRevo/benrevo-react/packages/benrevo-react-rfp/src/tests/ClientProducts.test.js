import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import { initialRfpMasterState } from './../reducer/state';
import Products from '../Client/Products';

configure({ adapter: new Adapter() });

describe('<Products />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      rfp: initialRfpMasterState,
      clients: clientsReducerState,
    });
    store = mockStore(initialState);
  });

  const routes = [
    {
      path: '',
    },
    {
      path: '',
    },
    {
      path: 'medical',
    },
  ];

  const showDeclined = true;

  it('should render the Products', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Products
            showDeclined={showDeclined}
            routes={routes}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('input').forEach((node) => {
      node.simulate('click');
    });
    expect(renderedComponent.find('.gridSegment').length).toBe(3);
    if (!showDeclined) {
      expect(renderedComponent.find('.rfpRowDivider.uhc').length).toBe(1);
    } else {
      expect(renderedComponent.find('.anthem').length).toBe(4);
      expect(renderedComponent.find('.rfpRowDivider.anthem').length).toBe(2);
    }
  });
});
