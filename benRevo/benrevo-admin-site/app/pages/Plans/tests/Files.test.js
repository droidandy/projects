import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from '../../../store';
import Files from '../Files';

describe('<Files />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the Plan component', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Files />
        </IntlProvider>
      </Provider>
    );

    renderedComponent.find('button').simulate('click');
    expect(renderedComponent.find('.plans-files').length).toBe(1);
  });
});
