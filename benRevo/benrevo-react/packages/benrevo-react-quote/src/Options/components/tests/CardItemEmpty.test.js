import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import CardItemEmpty from '../CardItemEmpty';
import { initialPresentationMasterState } from './../../../reducer/state';

configure({ adapter: new Adapter() });

describe('<CardItemEmpty />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      presentation: initialPresentationMasterState,
    });
    store = mockStore(initialState);
  });

  it('should render the CardItemEmpty component', () => {
    const mainCarrier = {
      carrier: {
        name: 'anthem',
      },
    };
    const section = 'medical';
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <CardItemEmpty mainCarrier={mainCarrier} section={section} />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.card-empty').hostNodes().length).toBe(1);
  });
});
