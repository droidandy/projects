import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Avatar } from 'components';

function mapStateToProps(state) {
  const { name, address, logoUrl } = state.settings.company;

  return { name, address, logoUrl };
}

const defaultLogoUrl = '/assets/images/no-company-logo.png';

class SidebarHead extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    address: PropTypes.object,
    logoUrl: PropTypes.string
  };

  render() {
    const { name, address, logoUrl } = this.props;

    return (
      <div className="text-center white-text pt-20 pb-20 pl-15 pr-15">
        <Avatar size={ 140 } className="center-block mb-15" src={ logoUrl || defaultLogoUrl } />
        <div className="mb-5">{ name }</div>
        <div className="mb-5">{ address && address.line }</div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(SidebarHead);
