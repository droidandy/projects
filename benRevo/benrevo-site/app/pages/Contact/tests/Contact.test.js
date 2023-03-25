import React from 'react';
import { mount } from 'enzyme';
import MaskedInput from 'react-text-mask';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from '../../../store';
import Contact from '../';
import { getAsyncInjectors } from '../../../utils/asyncInjectors';
import {
  changeForm,
} from '../actions';

describe('<Contact />', () => {
  let store;

  beforeAll((done) => {
    store = configureStore({}, browserHistory);
    const { injectReducer, injectSagas } = getAsyncInjectors(store);
    Promise.all([
      import('pages/Contact/reducer'),
      import('pages/Contact/sagas'),
    ]).then(([reducer, sagas]) => {
      injectReducer('contactPage', reducer.default);
      injectSagas(sagas.default, 'contactPage');
      done();
    });
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

    renderedComponent.find(MaskedInput).forEach((node) => {
      node.simulate('change');
    });

    store.dispatch(changeForm('name', '1'));
    store.dispatch(changeForm('phoneNumber', '1'));
    store.dispatch(changeForm('email', '1'));
    store.dispatch(changeForm('message', '1'));

    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });

    expect(renderedComponent.find('input').length).toBe(3);
  });
});
