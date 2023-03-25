import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { fromJS } from 'immutable';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from 'redux-mock-store';
import CardHeader from './../';

configure({ adapter: new Adapter() });

describe('<CardHeader />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({});
    store = mockStore(initialState);
  });

  it('should render an <div> tag', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <CardHeader />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('div').length).toBeGreaterThan(0);
  });

  // it('should have a className attribute', () => {
  //   const renderedComponent = shallow(<CardHeader />);
  //   expect(renderedComponent.prop('className')).toBeDefined();
  // });
  //
  // it('should adopt a valid attribute', () => {
  //   const id = 'test';
  //   const renderedComponent = shallow(<CardHeader id={id} />);
  //   expect(renderedComponent.prop('id')).toEqual(id);
  // });
  //
  // it('should not adopt an invalid attribute', () => {
  //   const renderedComponent = shallow(<CardHeader attribute={'test'} />);
  //   expect(renderedComponent.prop('attribute')).toBeUndefined();
  // });
});
