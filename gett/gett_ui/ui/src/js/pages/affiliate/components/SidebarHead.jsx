import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar } from 'components';
import defaultLogo from 'assets/images/no-company-logo.png';

function mapStateToProps(state) {
  const { companyName, address, logoUrl } = state.session.layout;

  return { companyName, address, logoUrl };
}

class SidebarHead extends PureComponent {
  static propTypes = {
    companyName: PropTypes.string,
    address: PropTypes.object,
    logoUrl: PropTypes.string,
    hideMenu: PropTypes.func
  };

  render() {
    const { companyName, address, logoUrl, hideMenu } = this.props;

    return (
      <div className="text-center sm-text-left white-text pt-20 pb-20 pl-15 pr-15">
        <Avatar smSize={ 70 } size={ 140 } className="center-block mb-15 sm-ml-0 sm-mr-0" src={ logoUrl || defaultLogo } />
        <div className="mb-5" data-name="sidebarCompanyName">{ companyName }</div>
        <div className="mb-5" data-name="sidebarCompanyAddress">{ address && address.line }</div>
        <Link to="/settings/details" onClick={ hideMenu } className="white-text underline">View Account Details</Link>
      </div>
    );
  }
}

export default connect(mapStateToProps)(SidebarHead);
