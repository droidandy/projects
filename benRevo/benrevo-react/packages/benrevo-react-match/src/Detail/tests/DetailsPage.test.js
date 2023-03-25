import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure, shallow } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { QuoteState } from '@benrevo/benrevo-react-quote';
import { Menu } from 'semantic-ui-react';
import clientsReducerState from './../../reducer/clientsReducerState';
import { additionalState } from './../../reducer/state';
import DetailPage from './../';
import DetailesLifeBody from '../components/DetailesLifeBody';
export const finalQuoteState = QuoteState.mergeDeep(additionalState);

configure({ adapter: new Adapter() });

describe('<DetailPage />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      presentation: finalQuoteState,
      clients: clientsReducerState,
    });
    store = mockStore(initialState);
    window.cancelAnimationFrame = jest.fn();
  });

  const section = 'medical';
  const params = {
    clientId: 1,
  };

  it('should render the DetailPage', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <DetailPage section={section} params={params} />
        </IntlProvider>
      </Provider>
    );

    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });
    expect(renderedComponent.find('.details-page').length).toBe(1);
  });

  it('should render the MenuItem and DetailsBody, also test Menu item clicks', () => {
    const initialState = fromJS({
      presentation: finalQuoteState
      .set('openedOption', { detailedPlans:
        [{ rfpQuoteNetworkId: 1, type: 'HMO', rfpQuoteOptionNetworkId: 1, currentPlan: {} }],
      })
      .set('page', { carrier: { carrier: { name: 'test' } } }),
      clients: clientsReducerState,
    });
    store = mockStore(initialState);
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <DetailPage section={section} params={params} />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.details-body').length).toBe(2);
    expect(renderedComponent.find(Menu.Item).length).toBe(2);

    renderedComponent.find('.add-new-tab').forEach((node) => {
      node.simulate('click');
    });
  });

  it('shallow tests to test state dependent parts', () => {
    const refreshPresentationData = jest.fn();
    const initialState = fromJS({
      presentation: finalQuoteState
      .set('openedOption', { detailedPlans:
        [{ rfpQuoteNetworkId: 1, type: 'HMO', rfpQuoteOptionNetworkId: 1, currentPlan: {} }],
      })
      .set('page', { carrier: { carrier: { name: 'test' } } }),
      clients: clientsReducerState,
    });
    store = mockStore(initialState);
    const renderedComponent = shallow(
      <DetailPage.WrappedComponent
        section={section}
        clientId={'1'}
        refreshPresentationData={refreshPresentationData}
        openedOptionClear={jest.fn()}
        openedOption={{ detailedPlans:
          [{ rfpQuoteNetworkId: 1, type: 'HMO', rfpQuoteOptionNetworkId: 1, currentPlan: {} }],
          id: 1,
        }}
        page={{ carrier: { carrier: { name: 'test' } } }}
        multiMode
        addNetwork={jest.fn()}
        deleteNetwork={jest.fn()}
        changeOptionNetwork={jest.fn()}
        getAllPlans={jest.fn()}
        clearPlans={jest.fn()}
        violationStatus={null}
        getPlansTemplates={jest.fn()}
        addOptionForNewProducts={jest.fn()}
        getAnotherOptions={jest.fn()}
      />
    );

    renderedComponent.setState({ textOverflow: true });
    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });
  });

  it('test for actions and no section', () => {
    const initialState = fromJS({
      presentation: finalQuoteState
      .set('openedOption', { detailedPlans:
        [{ rfpQuoteNetworkId: 1, type: 'HMO', rfpQuoteOptionNetworkId: 1, currentPlan: {} }],
      })
      .set('page', { carrier: { carrier: { name: 'test' } } }),
      clients: clientsReducerState,
    });
    store = mockStore(initialState);
    const renderedComponent = shallow(
      <DetailPage
        routes={['', '', '', '', { path: 'medical' }]}
        params={params}
        store={store}
      />
    ).dive();
    // should call different actions depending on what is passed through,
    // none of these should cause an error
    renderedComponent.instance().networkChange(1, {});
    renderedComponent.instance().networkChange(1, { rfpQuoteOptionNetworkId: 1 });

    renderedComponent.setProps({ multiMode: false });
    renderedComponent.instance().networkChange(1, {});
    renderedComponent.instance().networkChange(1, { rfpQuoteOptionNetworkId: 1 });

    renderedComponent.instance().removeNetwork({ rfpQuoteOptionNetworkId: 1 });

    renderedComponent.instance().getAlternatives();

    // Check the order of the actions that were called since the
    // component mounted
    const realActions = store.getActions();
    const expectedActions = [
      {
        meta: { section: 'medical' }, type: 'app/PresentationBroker/CLEAR_ALTERNATIVES',
      },
      {
        meta: { section: 'medical' }, type: 'app/PresentationPage/OPENED_OPTION_CLEAR',
      },
      {
        meta: { section: 'medical' },
        type: 'app/PresentationPage/REFRESH_PRESENTATION_DATA',
        payload: {
          carrier: {},
          optionId: undefined,
          loading: true,
          kaiser: undefined,
          optionType: '',
          excludes: null,
        },
      },
      {
        meta: { section: 'medical' }, type: 'app/PresentationBroker/PLAN_TEMPLATES_GET',
      },
      {
        meta: { section: 'medical' },
        type: 'app/PresentationPage/OPTION_NETWORK_ADD',
        payload: {
          optionId: undefined,
          networkId: 1,
          clientPlanId: null,
          multiMode: true,
        },
      },
      {
        meta: { section: 'medical' },
        type: 'app/PresentationPage/OPTION_NETWORK_CHANGE',
        payload: {
          optionId: undefined,
          rfpQuoteNetworkId: 1,
          rfpQuoteOptionNetworkId: 1,
          multiMode: true,
          isNetworkId: undefined,
        },
      },
      {
        meta: { section: 'medical' },
        type: 'app/PresentationPage/OPTION_NETWORK_ADD',
        payload: {
          optionId: undefined,
          networkId: 1,
          clientPlanId: null,
          multiMode: false,
        },
      },
      {
        meta: { section: 'medical' },
        type: 'app/PresentationPage/OPTION_NETWORK_CHANGE',
        payload: {
          optionId: undefined,
          rfpQuoteNetworkId: 1,
          rfpQuoteOptionNetworkId: 1,
          multiMode: false,
          isNetworkId: true,
        },
      },
      {
        meta: { section: 'medical' },
        type: 'app/PresentationPage/OPTION_NETWORK_DELETE',
        payload: { optionId: undefined, networkId: 1 },
      },
      {
        meta: { section: 'medical' },
        type: 'app/PresentationPage/PLANS_GET',
        payload: { networkIndex: 0, multiMode: false, clearFilter: true },
      },
    ];
    expect(realActions).toEqual(expectedActions);
  });

  it('should render life sections', () => {
    const initialState = fromJS({
      presentation: finalQuoteState
      .set('openedOption', { detailedPlans:
        [{ rfpQuoteNetworkId: 1, type: 'HMO', rfpQuoteOptionNetworkId: 1, currentPlan: {} }],
      })
      .set('page', { carrier: { carrier: { name: 'test' } } }),
      clients: clientsReducerState,
    });
    store = mockStore(initialState);
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <DetailPage section={'life'} params={params} />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find(DetailesLifeBody).length).toBe(1);
  });
});
