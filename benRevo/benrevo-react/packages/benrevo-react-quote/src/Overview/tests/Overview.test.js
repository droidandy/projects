import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import PresentationPage from '../';
import { initialPresentationMasterState } from './../../reducer/state';

configure({ adapter: new Adapter() });

describe('<PresentationPage />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      clients: clientsReducerState,
      presentation: initialPresentationMasterState,
    });
    store = mockStore(initialState);
    window.requestAnimationFrame = jest.fn();
    window.cancelAnimationFrame = jest.fn();
  });

  const section = 'medical';
  const carrier = {
    carrier: {
      carrierId: 1,
    },
  };
  const load = true;

  it('should render the RiderCard page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <PresentationPage
            section={section}
            changePage={jest.fn()}
            openedOptionClear={jest.fn()}
            refreshPresentationData={jest.fn()}
            addNetwork={jest.fn()}
            changeOptionNetwork={jest.fn()}
            getDisclaimer={jest.fn()}
            saveContributions={jest.fn()}
            changeContributionType={jest.fn()}
            changeContribution={jest.fn()}
            deleteNetwork={jest.fn()}
            load={load}
            carrier={carrier}
            setCurrentNetworkName={jest.fn()}
            optionRiderSelect={jest.fn()}
            optionRiderUnSelect={jest.fn()}
            saveRiderFee={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });
    expect(renderedComponent.find('.presentation-overview').length).toBe(1);
  });
});
