import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from '../../../store';
import PlanSubmit from '../Submit';

describe('<PlanSubmit />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the PlanSubmit page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <PlanSubmit />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('button.not-link-button').forEach((node) => {
      node.simulate('click');
    });
    renderedComponent.find('TextArea').forEach((node) => {
      node.simulate('change');
    });
    renderedComponent.find('Checkbox').forEach((node) => {
      node.simulate('change');
    });
    renderedComponent.find('Dropdown').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.plans-submit').length).toBe(1);
  });
});
