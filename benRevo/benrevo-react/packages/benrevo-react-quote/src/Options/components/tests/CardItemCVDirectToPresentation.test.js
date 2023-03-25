import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import CardItemCVDirectToPresentation from '../CardItemCVDirectToPresentation';

configure({ adapter: new Adapter() });

describe('<CardItemCVDirectToPresentation />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
    });
    store = mockStore(initialState);
  });

  it('should render the CardItemCVDirectToPresentation component', () => {
    const client = {};
    const qualification = {};
    const qualificationLoading = true;
    const createDTPClearValue = () => {};
    const updateClient = () => {};
    const getDTPClearValueStatus = () => {};

    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <CardItemCVDirectToPresentation client={client} qualification={qualification} qualificationLoading={qualificationLoading} createDTPClearValue={createDTPClearValue} updateClient={updateClient} getDTPClearValueStatus={getDTPClearValueStatus} />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.card-dtp-cv').length).toBe(2);
    expect(renderedComponent.find('Modal').length).toBe(1);
  });
});
