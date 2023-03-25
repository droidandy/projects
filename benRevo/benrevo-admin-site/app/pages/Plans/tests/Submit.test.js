import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from '../../../store';
import Submit from '../Submit';

describe('<Submit />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
    window.requestAnimationFrame = jest.fn();
    window.cancelAnimationFrame = jest.fn();
  });

  it('should render the Plan component', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Submit />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('textarea').forEach((node) => {
      node.simulate('change');
    });
    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });
    expect(renderedComponent.find('.plans-submit').length).toBe(1);
  });
});
