import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import { Menu, Icon } from 'semantic-ui-react';
import UserProfileMenuItem from './UserProfileMenuItem';
import messages from './messages';
import { toggleMobileNav } from '../actions';
import { loggedIn, getProfile, getRole } from './../../../utils/authService/lib';
import { ROLE_IMPLEMENTATION_MANAGER } from './../../../utils/authService/constants';

class MenuList extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    location: PropTypes.string.isRequired,
    brokerageRole: PropTypes.array.isRequired,
    showMobile: PropTypes.func,
    // CARRIER: PropTypes.string,
    openFeedbackModal: PropTypes.func.isRequired,
  };
  state = {
    activeItem: 'home',
  };

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
    const newTarget = e.currentTarget.getAttribute('href');
    if (newTarget.indexOf('/clients') !== -1 && window.location.href.indexOf('/clients/') === -1 && window.location.href.indexOf('/clients') !== -1) {
      location.reload();
    }
  };

  render() {
    const { openFeedbackModal, brokerageRole, /* CARRIER, location */ } = this.props;
    const { activeItem } = this.state;
    const profile = getProfile();
    const hasImpManRole = getRole(brokerageRole, [ROLE_IMPLEMENTATION_MANAGER]);
    return (
      <div style={{ float: 'right' }}>
        <Menu secondary size="small" className="computer large-screen only" >
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
            <Menu.Item as={Link} className="login-button" to="/login" name="login" active={activeItem === 'login'} onClick={this.handleItemClick}>
              <FormattedMessage {...messages.login} />
            </Menu.Item>
          </Menu.Menu>
          }
          {loggedIn() &&
          <Menu.Menu position="right">
            {/* { profile && profile.firstName && profile.lastName && this.props.location !== '/' && CARRIER === 'ANTHEM' && !hasImpManRole &&
              <Menu.Item as={'a'} target="_tab" href="https://s3-us-west-2.amazonaws.com/benrevo-static-anthem/User+Guide_Anthem.pdf" name="guide">
                <FormattedMessage {...messages.guide} />
              </Menu.Item>
            }
            { profile && profile.firstName && profile.lastName && this.props.location !== '/' && CARRIER === 'UHC' && !hasImpManRole &&
              <Menu.Item as={'a'} target="_tab" href="https://s3-us-west-2.amazonaws.com/benrevo-static-uhc/User+Guide_UHC.pdf" name="guide">
                <FormattedMessage {...messages.guide} />
              </Menu.Item>
            } */}
            <Menu.Item as={'a'} onClick={openFeedbackModal}>
              <FormattedMessage {...messages.feedback} />
            </Menu.Item>
            { profile && profile.firstName && profile.lastName && !hasImpManRole &&
              <Menu.Item as={Link} to="/admin" name="admin">
                <Icon name="user" /><FormattedMessage {...messages.admin} />
              </Menu.Item>
            }
            { profile && profile.firstName && profile.lastName &&
              <Menu.Item as={Link} to="/clients" name="clients" onClick={this.handleItemClick}>
                <Icon name="doctor" /><FormattedMessage {...messages.clients} />
              </Menu.Item>
            }
            <Menu.Item>
              <UserProfileMenuItem />
            </Menu.Item>
          </Menu.Menu>
          }
        </Menu>
        <Menu secondary size="small" className="mobile tablet only">
          <Menu.Menu position="right">
            <Menu.Item onClick={this.props.showMobile}>
              <Icon name="content" />
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const profile = state.get('profile');

  return {
    brokerageRole: profile.get('brokerageRole').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    showMobile: () => { dispatch(toggleMobileNav()); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuList);
