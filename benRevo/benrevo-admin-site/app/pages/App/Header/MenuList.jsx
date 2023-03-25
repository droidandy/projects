import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import { Menu, Icon, Grid } from 'semantic-ui-react';
import { loggedIn } from 'utils/authService/lib';
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
      <div style={{ float: 'right' }}>
        <Grid>
          <Grid.Column only="computer">
            <Menu secondary size="small">
              {!loggedIn() && this.props.location !== '/login' &&
              <Menu.Menu position="right">
                <Menu.Item as={Link} to="/" name="home" active={activeItem === 'home'} onClick={this.handleItemClick}>
                  <FormattedMessage {...messages.home} />
                </Menu.Item>
                {/* <Menu.Item as={Link} to="/tour" name="tour" active={activeItem === 'tour'} onClick={this.handleItemClick}>
                 <FormattedMessage {...messages.tour} />
                 </Menu.Item>
                 <Menu.Item as={Link} to="/getstarted" name="get-started" active={activeItem === 'get-stared'} onClick={this.handleItemClick}>
                 <FormattedMessage {...messages.getStarted} />
                 </Menu.Item> */}
                <Menu.Item as={Link} to="/login" name="login" active={activeItem === 'login'} onClick={this.handleItemClick}>
                  <FormattedMessage {...messages.login} />
                </Menu.Item>
              </Menu.Menu>
              }
              {loggedIn() &&
              <Menu.Menu position="right">
                {/* <Menu.Item as={Link} to="/clients" name="clients"  onClick={this.handleItemClick}>
                  <Icon name="doctor" /><FormattedMessage {...messages.clients} />
                </Menu.Item> */}
                <Menu.Item>
                  <UserProfileMenuItem />
                </Menu.Item>
              </Menu.Menu>
              }
            </Menu>
          </Grid.Column>
        </Grid>
        <Grid>
          <Grid.Column only="tablet">
            <Menu secondary size="small">
              <Menu.Menu icon position="right" >
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
