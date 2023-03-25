import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from '../../../store';
import PlanData from '../Data';

describe('<PlanData />', () => {
  let store;
  beforeAll(() => {
    window.requestAnimationFrame = jest.fn();
    store = configureStore({}, browserHistory);
  });

  it('should render the PlanData component', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <PlanData />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });
    expect(renderedComponent.find('.plan-data').length).toBe(1);
  });
});
