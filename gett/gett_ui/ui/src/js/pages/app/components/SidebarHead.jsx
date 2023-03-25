import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, Icon } from 'components';
import auth from 'utils/auth';

function mapStateToProps(state) {
  const { name, layout: { companyName, logoUrl, avatarUrl } } = state.session;

  return { companyName, name, logoUrl, avatarUrl };
}

const defaultLogoUrl = '/assets/images/no-company-logo.png';

function signOut() {
  auth.revoke();
}

class SidebarHead extends PureComponent {
  static propTypes = {
    companyName: PropTypes.string,
    name: PropTypes.string,
    logoUrl: PropTypes.string,
    avatarUrl: PropTypes.string,
    hideMenu: PropTypes.func
  };

  render() {
    const { companyName, name, logoUrl, avatarUrl, hideMenu } = this.props;

    return (
      <div className="mt-20 mr-30 ml-30 mb-30">
        <Link to="/settings/details" onClick={ hideMenu } className="layout horizontal center mb-30">
          <Avatar size={ 80 } src={ logoUrl || defaultLogoUrl } className="flex none mr-20" />
          <div className="flex black-text bold-text elipsis-text" data-name="sidebarCompanyName">{ companyName }</div>
        </Link>
        <div className="layout horizontal center-center pb-20 pt-20 border-bottom border-top">
          <Avatar size={ 40 } src={ avatarUrl } name={ name } className="flex none mr-10" />
          <div className="flex black-text bold-text elipsis-text" data-name="currentUserName">{ name }</div>
          <Icon icon="Exit" className="text-22 pointer flex none light-grey-link" data-name="logoutIcon" onClick={ signOut } />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(SidebarHead);
