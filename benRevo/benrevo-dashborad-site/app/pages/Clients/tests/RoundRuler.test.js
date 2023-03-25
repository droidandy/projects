import React from 'react';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from '../../../store';
import RoundRuler from '../components/RoundRuler';

configure({ adapter: new Adapter() });

describe('<RoundRuler />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  const settings = {
    less: [],
    above: [],
  };
  it('should render the RoundRuler component', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <RoundRuler
            index={0}
            value={parseFloat(10)}
            settings={settings}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('a').forEach((node) => {
      node.simulate('click');
    });
    expect(renderedComponent.find('.round-ruler').length).toBe(1);
  });
});
