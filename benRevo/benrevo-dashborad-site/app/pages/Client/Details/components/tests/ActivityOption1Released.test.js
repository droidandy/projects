import React from 'react';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from '../../../../../store';
import ActivityOption1Released from '../activities/ActivityOption1Released';

configure({ adapter: new Adapter() });

describe('<ActivityOption1Released />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the ActivityOption1Released', () => {
    const item = {};
    const saveButtonText = '';
    const productsList = [];
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <ActivityOption1Released
            item={item}
            saveButtonText={saveButtonText}
            productsList={productsList}
            onStart={jest.fn()}
            onSave={jest.fn()}
            onEdit={jest.fn()}
            onCancel={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.activity-detail').length).toBe(1);
  });
});
