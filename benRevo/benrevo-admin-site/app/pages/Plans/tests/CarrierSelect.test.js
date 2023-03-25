import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from '../../../store';
import CarrierSelect from '../CarrierSelect';

describe('<CarrierSelect />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the CarrierSelect component', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <CarrierSelect />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('button').simulate('click');
    expect(renderedComponent.find('.carrier-select').length).toBe(1);
  });
});
