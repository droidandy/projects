import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from '../../../store';
import { getAsyncInjectors } from '../../../utils/asyncInjectors';
import CarrierFiles from '../';

describe('<CarrierFiles />', () => {
  let store;

  beforeAll((done) => {
    store = configureStore({}, browserHistory);
    const { injectReducer } = getAsyncInjectors(store);
    Promise.all([
      import('pages/CarrierFiles/reducerFiles'),
    ]).then(([reducer]) => {
      injectReducer('carrierFilesBlob', reducer.default);
      done();
    });
  });

  it('should render the CarrierFiles page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <CarrierFiles />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });
    renderedComponent.find('select').forEach((node) => {
      node.simulate('change');
    });
    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });
    expect(renderedComponent.find('.carrierFiles').length).toBe(1);
  });
});
