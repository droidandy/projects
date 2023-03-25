import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { fromJS } from 'immutable';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from 'redux-mock-store';
import Contact from '../';
import { changeForm } from '../actions';
import { initialState as contactReducerState } from '../reducer';

configure({ adapter: new Adapter() });

describe('<Contact />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      contactPage: contactReducerState,
    });
    store = mockStore(initialState);
  });

  it('should render the Contact page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Contact />
        </IntlProvider>
      </Provider>
    );

    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });

    renderedComponent.find('textarea').forEach((node) => {
      node.simulate('change');
    });

    store.dispatch(changeForm('name', '1'));
    store.dispatch(changeForm('companyName', '1'));
    store.dispatch(changeForm('email', '1'));
    store.dispatch(changeForm('message', '1'));

    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });

    expect(renderedComponent.find('input').length).toBe(3);
  });
});
