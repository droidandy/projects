import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import { Button } from 'semantic-ui-react';
import configureStore from './../../store';
import AddEmail from './../AddEmail';

configure({ adapter: new Adapter() });

describe('<AddEmail />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  const modalOpen = true;
  it('should render the AddEmail component', () => {
    const emails = [];
    const renderedComponent = mount( // eslint-disable-line function-paren-newline
      <Provider store={store}>
        <IntlProvider locale="en">
          <AddEmail
            modalOpen={modalOpen}
            emails={emails}
            modalToggle={jest.fn()}
            save={jest.fn()}
          />
        </IntlProvider>
      </Provider>);
    expect(renderedComponent.find('.add-email-modal').length).toBe(1);
  });

  it('should not render invalid email text', () => {
    const emails = [{ text: 'lemdy.orakwue+dev.broker@benrevo.com', invalid: false }, { text: 'blankText@example.com', invalid: false }];
    const renderedComponent = shallow( // eslint-disable-line function-paren-newline
      <AddEmail
        modalOpen={modalOpen}
        emails={emails}
        modalToggle={jest.fn()}
        save={jest.fn()}
      />
    );
    renderedComponent.setState({ current: emails });
    renderedComponent.find(Button).last().simulate('click');
    expect(renderedComponent.find('.invalid-email-text').length).toBe(0);
  });

  it('should render invalid email text', () => {
    const emails = [{ text: 'a.com', invalid: false }, { text: 'Awelemdy Orakwue <lemdy.orakwue@benrevo.com>', invalid: false }];
    const renderedComponent = shallow( // eslint-disable-line function-paren-newline
      <AddEmail
        modalOpen={modalOpen}
        emails={emails}
        modalToggle={jest.fn()}
        save={jest.fn()}
      />
    );
    renderedComponent.setState({ current: emails });
    renderedComponent.find(Button).last().simulate('click');
    expect(renderedComponent.find('.invalid-email-text').length).toBe(2);
  });
});
