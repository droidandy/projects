import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { Section } from '@benrevo/benrevo-react-onboarding';
import configureStore from '../../../store';
import Questions from '../questions';

configure({ adapter: new Adapter() });

describe('<Section />', () => {
  let store;
  const CARRIER = 'ANTHEM';
  const uhc = CARRIER === 'UHC';
  const routes = [
    {},
    {
      childRoutes: [
        {
          path: 'Administrative',
        },
      ],
    },
    {
      path: 'administrative',
    },
    {
      path: 'section1',
    },
  ];

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the section1 into Administrative page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Section
            Questions={Questions}
            routes={routes}
          />
        </IntlProvider>
      </Provider>
    );

    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });

    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });

    expect(renderedComponent.find('.form-item').length).toBe((uhc) ? 12 : 5);
  });

  it('should render the section2 into Administrative page', () => {
    routes[3].path = 'section2';

    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Section
            Questions={Questions}
            routes={routes}
          />
        </IntlProvider>
      </Provider>
    );

    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });

    expect(renderedComponent.find('.form-item').length).toBe((uhc) ? 11 : 6);
  });

  it('should render the section1 into Billing page', () => {
    routes[2].path = 'billing';
    routes[3].path = 'section1';

    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Section
            Questions={Questions}
            routes={routes}
          />
        </IntlProvider>
      </Provider>
    );

    renderedComponent.find('select').forEach((node) => {
      node.simulate('change');
    });

    expect(renderedComponent.find('.form-item').length).toBe((uhc) ? 2 : 1);
  });

  it('should render the section1 into Broker page', () => {
    routes[2].path = 'broker';
    routes[3].path = 'section1';

    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Section
            Questions={Questions}
            routes={routes}
          />
        </IntlProvider>
      </Provider>
    );

    renderedComponent.find('input[type="checkbox"]').forEach((node) => {
      node.simulate('change');
    });

    expect(renderedComponent.find('.form-item').length).toBe((uhc) ? 13 : 0);
  });

  it('should render the section2 into Broker page', () => {
    routes[2].path = 'broker';
    routes[3].path = 'section2';

    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Section
            Questions={Questions}
            routes={routes}
          />
        </IntlProvider>
      </Provider>
    );

    renderedComponent.find('DatePicker').forEach((node) => {
      node.prop('onChange')(new Date());
    });

    expect(renderedComponent.find('.form-item').length).toBe((uhc) ? 8 : 0);
  });

  it('should render the section1 into Coverage page', () => {
    routes[2].path = 'coverage';
    routes[3].path = 'section1';

    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Section
            Questions={Questions}
            routes={routes}
          />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.form-item').length).toBe((uhc) ? 7 : 0);
  });

  it('should render the section1 into Client page', () => {
    routes[2].path = 'client';
    routes[3].path = 'section1';

    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Section
            Questions={Questions}
            routes={routes}
          />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.form-item').length).toBe((uhc) ? 10 : 1);
  });

  it('should render the section2 into Client page', () => {
    routes[2].path = 'client';
    routes[3].path = 'section2';

    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Section
            Questions={Questions}
            routes={routes}
          />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.form-item').length).toBe((uhc) ? 7 : 2);
  });

  it('should render the section1 into Eligibility page', () => {
    routes[2].path = 'eligibility';
    routes[3].path = 'section1';

    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Section
            Questions={Questions}
            routes={routes}
          />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.form-item').length).toBe((uhc) ? 10 : 10);
  });

  it('should render the section1 into Disclosure page', () => {
    routes[2].path = 'disclosure';
    routes[3].path = 'section1';

    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Section
            Questions={Questions}
            routes={routes}
          />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.form-item').length).toBe((uhc) ? 5 : 0);
  });

  if (uhc) {
    it('should render the section2 into Disclosure page', () => {
      routes[2].path = 'disclosure';
      routes[3].path = 'section2';

      const renderedComponent = mount(
        <Provider store={store}>
          <IntlProvider locale="en">
            <Section
              Questions={Questions}
              routes={routes}
            />
          </IntlProvider>
        </Provider>
      );

      renderedComponent.find('input[type="radio"]').first().simulate('change');

      expect(renderedComponent.find('.form-item').length).toBe((uhc) ? 3 : 0);
    });
  }
});
