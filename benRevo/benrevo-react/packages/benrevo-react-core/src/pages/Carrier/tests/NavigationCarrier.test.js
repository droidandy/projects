/* import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { Menu } from 'semantic-ui-react';
import messages from '../../messages';
import NavigationCarrier from '../NavigationCarrier'; */

describe('<NavigationCarrier  />', () => {
 /* it('should render the quote tab', () => {
    const renderedComponent = shallow(
      <NavigationCarrier client={{ client_name: 'Test' }} />
    );
    expect(renderedComponent.contains(
      <Menu.Item as={Link} to="/presentation/quote" activeClassName="active">
        <FormattedMessage {...messages.quoteSummary} />
      </Menu.Item>
    )).toBe(true);
  }); */
  it('Expect to have unit tests specified', () => {
    expect(true).toEqual(true);
  });
});
