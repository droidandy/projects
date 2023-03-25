import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { HomeReducer } from '@benrevo/benrevo-react-core';
import configureStore from '../../../store';
import UHC from './../';
import { getAsyncInjectors } from '../../../utils/asyncInjectors';

configure({ adapter: new Adapter() });

describe('<UHC />', () => {
  let store;
  beforeAll((done) => {
    store = configureStore({}, browserHistory);
    const { injectReducer } = getAsyncInjectors(store);
    injectReducer('home', HomeReducer);
    done();
  });
  it('should render the UHC page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <UHC
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
