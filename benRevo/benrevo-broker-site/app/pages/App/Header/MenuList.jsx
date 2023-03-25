import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import { Menu, Icon, Grid } from 'semantic-ui-react';
import { loggedIn } from '@benrevo/benrevo-react-core';
import UserProfileMenuItem from './UserProfileMenuItem';
import messages from './messages';
import { toggleMobileNav } from '../actions';

class MenuList extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    location: PropTypes.string.isRequired,
    showMobile: PropTypes.func.isRequired,
  };
  state = {
    activeItem: 'home',
  };
  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
  };

  render() {
    const { activeItem } = this.state;
    return (
      <div style={{ float: 'right' }} className="menu-list">
        <Grid>
          <Grid.Column only="computer">
            <Menu secondary size="small">
              {!loggedIn() && this.props.location !== '/login' &&
              <Menu.Menu position="right">
                <Menu.Item as={Link} to="/login" name="login" active={activeItem === 'login'} onClick={this.handleItemClick}>
                  <FormattedMessage {...messages.login} />
                </Menu.Item>
              </Menu.Menu>
              }
              <Menu.Menu position="right">
                {loggedIn() && this.props.location !== '/profile' &&
                  <Menu.Item as={Link} to="/admin" name="admin">
                    <FormattedMessage {...messages.admin} />
                  </Menu.Item>
                }
                {loggedIn() && this.props.location !== '/profile' &&
                  <Menu.Item as={Link} to="/" name="clients">
                    <span className="user-clients-icon" /> <FormattedMessage {...messages.clients} />
                  </Menu.Item>
                }
                { loggedIn() &&
                  <Menu.Item>
                    <UserProfileMenuItem />
                  </Menu.Item>
                }
              </Menu.Menu>
            </Menu>
          </Grid.Column>
        </Grid>
        <Grid>
          <Grid.Column only="tablet mobile">
            <Menu secondary size="small">
              <Menu.Menu position="right" >
                <Menu.Item onClick={this.props.showMobile}>
                  <Icon name="content" />
                </Menu.Item>
              </Menu.Menu>
            </Menu>
          </Grid.Column>
        </Grid>

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
