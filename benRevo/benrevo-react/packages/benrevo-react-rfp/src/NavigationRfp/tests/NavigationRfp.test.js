import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { Menu } from 'semantic-ui-react';
import messages from '../messages';
import NavigationRfp from '../NavigationRfp';
configure({ adapter: new Adapter() });

describe('<NavigationRfp  />', () => {
  const products = {
    medical: true,
    dental: true,
    vision: true,
    life: true,
    std: true,
    ltd: true,
  };
  const virginCoverage = {
    medical: false,
    dental: false,
    vision: false,
    life: false,
    std: false,
    ltd: false,
  };
  it('should render the client tab', () => {
    const renderedComponent = shallow(
      <NavigationRfp client={{ client_name: 'Test' }} products={products} virginCoverage={virginCoverage} />
    );
    expect(renderedComponent.contains(
      <Menu.Item as={Link} to="/rfp/client" activeClassName="active">
        <FormattedMessage {...messages.client} />
      </Menu.Item>
    )).toBe(true);
  });

  it('should render the medical tab', () => {
    const renderedComponent = shallow(<NavigationRfp client={{ client_name: 'Test' }} products={products} virginCoverage={virginCoverage} />);
    expect(renderedComponent.contains(
      <Menu.Item as={Link} to="/rfp/medical" activeClassName="active">
        <FormattedMessage {...messages.medical} />
      </Menu.Item>
    )).toBe(true);
  });
});
