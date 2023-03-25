import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { initialPresentationMasterState } from './../../reducer/state';
import Comparison from '../Comparison';
import ComparisonPage from '../';

configure({ adapter: new Adapter() });

describe('<Comparison />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      presentation: initialPresentationMasterState,
    });
    store = mockStore(initialState);
  });

  const loading = false;
  const openedOption = {
    name: 'Option 1',
  };
  const rows = [
    {
      county: 'Kern',
      decNumber: 4209,
      medicalGroupId: 1,
      name: 'BAKERSFIELD FAMILY MEDICAL CENTER',
      Signature: 1,
      Advantage: 1,
      Alliance: 0,
    },
  ];
  const cols = { Signature: 1, Advantage: 1, Alliance: 0 };

  it('should render the Comparison page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Comparison
            getComparison={jest.fn()}
            changePage={jest.fn()}
            loading={loading}
            rows={rows}
            cols={cols}
            section={'medical'}
            openedOption={openedOption}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('a').forEach((node) => {
      node.simulate('click');
    });
    renderedComponent.find('th').forEach((node) => {
      node.simulate('click');
    });
    renderedComponent.find('input').simulate('change');
    expect(renderedComponent.find('.comparison-page').length).toBe(1);
  });

  it('should render the Comparison page with one row', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Comparison
            getComparison={jest.fn()}
            changePage={jest.fn()}
            loading={loading}
            rows={rows}
            cols={cols}
            section={'medical'}
            openedOption={openedOption}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('a').forEach((node) => {
      node.simulate('click');
    });
    renderedComponent.find('th').forEach((node) => {
      node.simulate('click');
    });
    renderedComponent.find('input').simulate('change');
    expect(renderedComponent.find('tr').length).toBe(2);
  });
});

describe('<ComparisonPage />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      presentation: initialPresentationMasterState,
    });
    store = mockStore(initialState);
  });

  it('should render the ComparisonPage', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <ComparisonPage
            changePage={jest.fn()}
            section={'medical'}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('a').forEach((node) => {
      node.simulate('click');
    });
    renderedComponent.find('th').forEach((node) => {
      node.simulate('click');
    });
    expect(renderedComponent.find('.dimmer').length).toBe(0);
  });
});
