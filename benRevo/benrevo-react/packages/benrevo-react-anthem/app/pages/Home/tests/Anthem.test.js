import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { useRouterHistory } from 'react-router';
import { createHistory } from 'history';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { BENREVO_PATH, HomeReducer } from '@benrevo/benrevo-react-core';
import configureStore from '../../../store';
import Anthem from './../';
import { getAsyncInjectors } from '../../../utils/asyncInjectors';

configure({ adapter: new Adapter() });

describe('<Anthem />', () => {
  const browserHistory = useRouterHistory(createHistory)({
    basename: BENREVO_PATH,
  });
  const initialState = {};
  let store = {};
  beforeAll(() => {
    store = configureStore(initialState, browserHistory, {}, true);
    const { injectReducer } = getAsyncInjectors(store);
    injectReducer('home', HomeReducer);
  });
  it('should render the Anthem page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Anthem
            location={{ pathname: '/' }}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });

    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });

    expect(renderedComponent.find('input').length).toBe(6);
  });
});
