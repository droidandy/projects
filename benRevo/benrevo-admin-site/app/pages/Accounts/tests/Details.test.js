import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from '../../../store';
import Details from '../Details';

describe('<Details />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
    window.requestAnimationFrame = jest.fn();
    window.cancelAnimationFrame = jest.fn();
  });
  it('should render the Details component', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Details />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('.btn').forEach((node) => {
      node.simulate('click');
    });
    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.gridSegment').length).toBe(1);
  });
});
