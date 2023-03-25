import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, shallow, configure } from 'enzyme';
import { Link } from 'react-router';
import { FormattedMessage, IntlProvider } from 'react-intl';
import { Menu } from 'semantic-ui-react';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import messages from '../messages';
import NavigationPresentation from '../NavigationPresentation';
import { initialPresentationMasterState } from './../../reducer/state';
import NavigationPresentationIndex from '../';
configure({ adapter: new Adapter() });

describe('<NavigationPresentation  />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      presentation: initialPresentationMasterState,
    });
    store = mockStore(initialState);
  });

  it('should render sections ', () => {
    const client = { clientName: 'Test', id: 1 };
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <NavigationPresentation client={client} changeCurrentPage={jest.fn()} />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.client-item span').text()).toBe('Test');

    expect(renderedComponent.contains(
      <Menu.Item as={Link} to="/presentation/1/quote" activeClassName="active">
        <FormattedMessage {...messages.quoteSummary} />
      </Menu.Item>
    )).toBe(true);

    expect(renderedComponent.contains(
      <Menu.Item as={Link} to="/presentation/1/enrollment" activeClassName="active">
        <FormattedMessage {...messages.enrollment} />
      </Menu.Item>
    )).toBe(true);

    expect(renderedComponent.contains(
      <FormattedMessage {...messages.medical} />
    )).toBe(true);

    expect(renderedComponent.contains(
      <FormattedMessage {...messages.dental} />
    )).toBe(true);

    expect(renderedComponent.contains(
      <FormattedMessage {...messages.vision} />
    )).toBe(true);

    expect(renderedComponent.contains(
      <FormattedMessage {...messages.finalSelections} />
    )).toBe(true);
  });
});

describe('<NavigationPresentation  />', () => {
  it('should click links ', () => {
    const client = { clientName: 'Test', id: 1 };
    const renderedComponent = shallow(
      <NavigationPresentation client={client} changeCurrentPage={jest.fn()} />
    );
    renderedComponent.find('.to-medical').simulate('click', { button: 0 });
    renderedComponent.find('.to-dental').simulate('click', { button: 0 });
    renderedComponent.find('.to-vision').simulate('click', { button: 0 });
    renderedComponent.find('.to-final').simulate('click', { button: 0 });
  });
});

describe('<NavigationPresentationIndex  />', () => {
  it('should click links ', () => {
    const client = { clientName: 'Test', id: 1 };
    const renderedComponent = shallow(
      <NavigationPresentation client={client} changeCurrentPage={jest.fn()} />
    );
    renderedComponent.find('.to-medical').simulate('click', { button: 0 });
    renderedComponent.find('.to-dental').simulate('click', { button: 0 });
    renderedComponent.find('.to-vision').simulate('click', { button: 0 });
    renderedComponent.find('.to-final').simulate('click', { button: 0 });
  });
});

describe('<NavigationPresentationIndex  />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      presentation: initialPresentationMasterState,
    });
    store = mockStore(initialState);
  });

  it('should render the client name ', () => {
    const client = { clientName: 'Test', id: 1 };
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <NavigationPresentationIndex client={client} changeCurrentPage={jest.fn()} />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.client-item span').text()).toBe('Test');
  });
});
