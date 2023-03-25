import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { Menu, Header } from 'semantic-ui-react';

class SubNavigation extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    route: PropTypes.object.isRequired,
    messages: PropTypes.object.isRequired,
  };


  render() {
    return (
      <div className="sub-nav">
        <Header as="h4" textAlign="left" className="title"><FormattedMessage {...this.props.messages[this.props.route.name]} /></Header>
        <Menu pointing secondary vertical>
          {this.props.route.childRoutes.map(
            (item, i) => (
              <Menu.Item as={Link} to={`${this.props.route.path}/${item.path}`} key={i} activeClassName="active"><FormattedMessage {...this.props.messages[item.path]} /></Menu.Item>
              )
          )}
        </Menu>
      </div>
    );
  }
}

export default SubNavigation;
