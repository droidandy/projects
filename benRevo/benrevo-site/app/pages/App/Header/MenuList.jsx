import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import { Menu, Icon, Grid } from 'semantic-ui-react';
import messages from './messages';
import { toggleMobileNav } from '../actions';

class MenuList extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    showMobile: PropTypes.func.isRequired,
    location: PropTypes.string.isRequired,
  };

  render() {
    return (
      <div className="menu-wrap">
        <Grid>
          <Grid.Column only="computer">
            <Menu secondary size="small">
              <Menu.Menu position="right">
                <Menu.Item as={Link} to="/" name="home" activeClassName="active">
                  <FormattedMessage {...messages.home} />
                </Menu.Item>
                <Menu.Item as={Link} to="/carriers" name="carriers" activeClassName="active">
                  <FormattedMessage {...messages.carriers} />
                </Menu.Item>
                <Menu.Item as={Link} to="/brokers" name="brokers" activeClassName="active">
                  <FormattedMessage {...messages.brokers} />
                </Menu.Item>
                <a href="https://app.benrevo.com/login" className="item">
                  <FormattedMessage {...messages.login} />
                </a>
              </Menu.Menu>
            </Menu>
          </Grid.Column>
          <Grid.Column only="tablet">
            <Menu secondary size="small">
              <Menu.Menu position="right">
                <Menu.Item as={Link} to="/" name="home" activeClassName="active">
                  <FormattedMessage {...messages.home} />
                </Menu.Item>
                <Menu.Item as={Link} to="/carriers" name="carriers" activeClassName="active">
                  <FormattedMessage {...messages.carriers} />
                </Menu.Item>
                <Menu.Item as={Link} to="/brokers" name="brokers" activeClassName="active">
                  <FormattedMessage {...messages.brokers} />
                </Menu.Item>
                <a href="https://app.benrevo.com/login" className="item">
                  <FormattedMessage {...messages.login} />
                </a>
              </Menu.Menu>
            </Menu>
          </Grid.Column>
        </Grid>
        <div className="content-icon">
          <Icon onClick={this.props.showMobile} name="content" />
        </div>

      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    showMobile: () => { dispatch(toggleMobileNav()); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuList);
