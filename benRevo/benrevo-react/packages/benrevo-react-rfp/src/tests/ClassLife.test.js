import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { fromJS } from 'immutable';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from 'redux-mock-store';
import ClassLife from '../LifeStdLtdOptions/components/ClassLife';

configure({ adapter: new Adapter() });

describe('<ClassLife />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
    });
    store = mockStore(initialState);
  });

  const item = {};
  const section = 'life';
  const i = 0;

  it('should render the ClassLife', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <ClassLife key={i} section={section} type="basicPlan" item={item} updatePlan={jest.fn()} index={i} />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.life-std-ltd-class').hostNodes().length).toBe(1);
  });
});
