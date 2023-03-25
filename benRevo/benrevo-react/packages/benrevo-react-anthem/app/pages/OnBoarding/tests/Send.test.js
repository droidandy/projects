import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { Send } from '@benrevo/benrevo-react-onboarding';
import configureStore from '../../../store';
import Questions from '../questions';

configure({ adapter: new Adapter() });

describe('<Send />', () => {
  const CARRIER = 'ANTHEM';
  const uhc = CARRIER === 'UHC';
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the Send table', () => {
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = () => {};
    }
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Send Questions={Questions} />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('#sendAnswers').forEach((node) => {
      node.simulate('click');
    });
    renderedComponent.find('#questionnare').forEach((node) => {
      node.simulate('click');
    });
    expect(renderedComponent.find('.send-table').length).toBe(3);
  });

  it('should render the Send table rows', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Send Questions={Questions} />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('#sendAnswers').forEach((node) => {
      node.simulate('click');
    });
    renderedComponent.find('#questionnare').forEach((node) => {
      node.simulate('click');
    });
    expect(renderedComponent.find('.question-row').length).toBe((uhc) ? 14 : 10);
  });
});
