import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from '../../../store';
import AddPerson from '../AddPerson';

describe('<AddPerson />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the AddPerson page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <AddPerson />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.add-person').length).toBe(1);
    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });
    renderedComponent.find('.button-add-another').forEach((node) => {
      node.simulate('click');
    });
    renderedComponent.find('.personRemove').forEach((node) => {
      node.simulate('click');
    });
    renderedComponent.find('.dropdown').forEach((node) => {
      node.simulate('change');
    });
    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });
    renderedComponent.unmount();
  });

  it('should render the AddPerson with disabled button', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <AddPerson />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.button').prop('disabled')).toBe(true);
    renderedComponent.unmount();
  });

  it('should render the AddPerson with not disabled button', () => {
    const enableStore = configureStore({
      sales: {
        loading: false,
        sales: [],
        presales: [],
        newPeople: [{ firstName: 'has', lastName: 'has', email: 'test', type: 'cool' }],
        selectedCarrier: {},
        saving: false,
      },
    }, browserHistory);
    const renderedComponent = mount(
      <Provider store={enableStore}>
        <IntlProvider locale="en">
          <AddPerson />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.button').length).toBe(1);
    expect(renderedComponent.find('.button').prop('disabled')).toBe(undefined);
    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });
    renderedComponent.unmount();
  });
});
