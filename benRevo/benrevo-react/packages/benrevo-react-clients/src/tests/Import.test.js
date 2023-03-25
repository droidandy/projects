import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import { authReducerState } from '@benrevo/benrevo-react-core';
import configureStore from 'redux-mock-store';
import { initialState as clientsReducerState } from './../../src/reducer';
import Import from '../Import';
import ImportClient from '../Import/ImportClient';

configure({ adapter: new Adapter() });

describe('<Import />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;
  const carrierName = 'Anthem Blue Cross';

  beforeAll(() => {
    const initialState = fromJS({
      profile: authReducerState,
      clients: clientsReducerState,
    });
    store = mockStore(initialState);
  });

  it('should render the Import', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <Import carrierName={carrierName} />
      </Provider>
    );
    expect(renderedComponent.find('.clients').length).toBe(2);
  });

  it('should render the Import clients-description', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <Import carrierName={carrierName} />
      </Provider>
    );
    expect(renderedComponent.find('.clients-description').text()).toBe('You can import a completed client RFP from a BenRevo partner portal which can be used to complete RFPs on the Anthem Blue Cross portal.');
  });
});

describe('<ImportClient />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;
  const carrierName = 'Anthem Blue Cross';

  beforeAll(() => {
    const initialState = fromJS({
      profile: authReducerState,
      clients: clientsReducerState,
    });
    store = mockStore(initialState);
  });

  it('should render the ImportClient', () => {
    window.requestAnimationFrame = jest.fn();
    const clientOverride = {
      clientName: '123',
    };
    const isGA = true;
    const importLoading = false;
    const brokerages = [];
    const modalPage = 'page2';
    let wrapper = null;
    const renderedComponent = mount(
      <Provider store={store}>
        <ImportClient
          ref={(c) => { wrapper = c; }}
          clientOverride={clientOverride}
          importClient={jest.fn()}
          info={jest.fn()}
          isGA={isGA}
          importLoading={importLoading}
          brokerages={brokerages}
          carrierName={carrierName}
        />
      </Provider>
    );
    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });
    const importing = true;
    wrapper.setState({ importing });
    wrapper.setState({ modalPage });
    expect(document.querySelectorAll('.client-override-modal-inner').length).toBe(1);
  });

  it('should render the ImportClient', () => {
    window.requestAnimationFrame = jest.fn();
    const clientOverride = {
      clientName: '123',
    };
    const isGA = true;
    const importLoading = false;
    const brokerages = [];
    const modalPage = 'page3';
    let wrapper = null;
    const renderedComponent = mount(
      <Provider store={store}>
        <ImportClient
          ref={(c) => { wrapper = c; }}
          clientOverride={clientOverride}
          importClient={jest.fn()}
          info={jest.fn()}
          isGA={isGA}
          importLoading={importLoading}
          brokerages={brokerages}
          carrierName={carrierName}
        />
      </Provider>
    );
    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });
    const importing = true;
    wrapper.setState({ importing });
    wrapper.setState({ modalPage });
    expect(document.querySelectorAll('.page3').length).toBe(1);
  });

  it('should render the ImportClient GAModal', () => {
    const clientOverride = {
      clientName: '123',
    };
    const isGA = true;
    const importLoading = false;
    const brokerages = [];
    const renderedComponent = mount(
      <Provider store={store}>
        <ImportClient
          clientOverride={clientOverride}
          importClient={jest.fn()}
          info={jest.fn()}
          isGA={isGA}
          importLoading={importLoading}
          brokerages={brokerages}
          carrierName={carrierName}
        />
      </Provider>
    );
    expect(renderedComponent.find('GAModal').length).toBe(1);
  });

  /* it('should render the ImportClient with modal pages', () => {
    window.requestAnimationFrame = jest.fn();
    const clientOverride = {
      clientName: '123',
    };
    const isGA = true;
    const importLoading = false;
    const brokerages = [];
    mount(
      <Provider store={store}>
        <ImportClient
          clientOverride={clientOverride}
          importClient={jest.fn()}
          info={jest.fn()}
          isGA={isGA}
          importLoading={importLoading}
          brokerages={brokerages}
          carrierName={carrierName}
        />
      </Provider>
    );
    expect(document.querySelectorAll('.override-button.violet').length).toBe(1);
    expect(document.querySelectorAll('.change-page-one').length).toBe(2);

    // Construct new wrapper rooted at modal content
    const modalPage2 = document.getElementsByClassName('page2')[0];
    const modalPage2Wrapper = new ReactWrapper(modalPage2, true);

    // Passes
    modalPage2Wrapper.find('.change-page-one').simulate('click');
    expect(document.querySelectorAll('.page1').length).toBe(1);

    const modalPage1 = document.getElementsByClassName('page1')[0];
    const modalPage1Wrapper = new ReactWrapper(modalPage1, true);
    expect(modalPage1Wrapper.find('.new-client-button')).toHaveLength(1);
    modalPage1Wrapper.find('.new-client-button').simulate('click');

    const modalPage3 = document.getElementsByClassName('page3')[0];
    const modalPage3Wrapper = new ReactWrapper(modalPage3, true);
    expect(modalPage3Wrapper.find('.change-page-one')).toHaveLength(1);
    modalPage3Wrapper.find('.change-page-one').simulate('click');
    expect(document.querySelectorAll('.page1').length).toBe(1);
  }); */
});
