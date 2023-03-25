
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { initialPresentationMasterState } from './../../reducer/state';
import Filters from './../components/Filters';

configure({ adapter: new Adapter() });

describe('<Filters />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;
  beforeAll(() => {
    const initialState = fromJS({
      presentation: initialPresentationMasterState,
    });
    store = mockStore(initialState);
  });
  it('should render the Filters', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Filters
            section={'medical'}
            index={0}
            updateProps={jest.fn()}
            openedOptionsType={'HMO'}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('span').first().text()).toBe('% Diff from Current');
    expect(renderedComponent.find('span').at(1).text()).toBe('PCP Copay ');
    expect(renderedComponent.find('span').last().text()).toBe('PCP Copay ');
    expect(renderedComponent.find('.card-filters').length).toBe(1);
  });
  it('should render the Filters', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Filters
            section={'medical'}
            index={0}
            updateProps={jest.fn()}
            openedOptionsType={'HSA'}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('span').first().text()).toBe('% Diff from Current');
    expect(renderedComponent.find('span').at(1).text()).toBe('Co-insurance');
    expect(renderedComponent.find('span').last().text()).toBe('Co-insurance');
  });
  it('should render the Filters', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Filters
            section={'medical'}
            index={0}
            updateProps={jest.fn()}
            openedOptionsType={'PPO'}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('span').first().text()).toBe('% Diff from Current');
    expect(renderedComponent.find('span').at(1).text()).toBe('PCP Copay ');
    expect(renderedComponent.find('span').last().text()).toBe('Co-insurance');
  });
});
