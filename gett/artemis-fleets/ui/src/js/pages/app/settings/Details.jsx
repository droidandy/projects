import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Avatar, ImageEditor, ButtonLink } from 'components';
import { Row, message } from 'antd';
import get from 'lodash/get';
import dispatchers from 'js/redux/app/settings.dispatchers';

import css from './components/settings.css';

function mapStateToProps(state) {
  return {
    logoUrl: state.settings.company.logoUrl,
    settings: state.settings.data,
    userRole: state.settings.role
  };
}

class Details extends PureComponent {
  static propTypes = {
    logoUrl: PropTypes.string,
    settings: PropTypes.object,
    userRole: PropTypes.string,
    getCompanySettings: PropTypes.func,
    updateCompanyLogo: PropTypes.func
  };

  componentDidMount() {
    this.props.getCompanySettings();
  }

  getValue(path) {
    return get(this.props.settings, path) || '-';
  }

  updateCompanyLogo = (logo) => {
    return this.props.updateCompanyLogo(logo)
      .then(() => message.success('Company Logo successfully updated.'));
  };

  get isAdmin() {
    return this.props.userRole === 'admin';
  }

  render() {
    const { logoUrl } = this.props;

    return (
      <div className="p-20">
        <Row type="flex">
          <div className="mb-25 mr-40">
            <div className="text-24 bold-text mb-20">Primary Contact</div>
            <Row type="flex" className="mb-5">
              <div className={ `bold-text mr-30 ${css.label}` }>First Name</div>
              <div className="flex">{ this.getValue('primaryContact.firstName') }</div>
            </Row>
            <Row type="flex" className="mb-5">
              <div className={ `bold-text mr-30 ${css.label}` }>Last Name</div>
              <div className="flex">{ this.getValue('primaryContact.lastName') }</div>
            </Row>
            <Row type="flex" className="mb-5">
              <div className={ `bold-text mr-30 ${css.label}` }>Phone</div>
              <div className="flex">{ this.getValue('primaryContact.phone') }</div>
            </Row>
            <Row type="flex" className="mb-5">
              <div className={ `bold-text mr-30 ${css.label}` }>Company Mobile</div>
              <div className="flex">{ this.getValue('primaryContact.mobile') }</div>
            </Row>
            <Row type="flex" className="mb-5">
              <div className={ `bold-text mr-30 ${css.label}` }>Fax</div>
              <div className="flex">{ this.getValue('primaryContact.fax') }</div>
            </Row>
            <Row type="flex" className="mb-5">
              <div className={ `bold-text mr-30 ${css.label}` }>Email</div>
              <div className="flex">{ this.getValue('primaryContact.email') }</div>
            </Row>
            <Row type="flex" className="mb-30">
              <div className={ `bold-text mr-30 ${css.label}` }>Full Address</div>
              <div className="flex">{ this.getValue('primaryContact.address.line') }</div>
            </Row>
            <div className="text-24 bold-text mb-20">Billing Contact</div>
            <Row type="flex" className="mb-5">
              <div className={ `bold-text mr-30 ${css.label}` }>First Name</div>
              <div className="flex">{ this.getValue('billingContact.firstName') }</div>
            </Row>
            <Row type="flex" className="mb-5">
              <div className={ `bold-text mr-30 ${css.label}` }>Last Name</div>
              <div className="flex">{ this.getValue('billingContact.lastName') }</div>
            </Row>
            <Row type="flex" className="mb-5">
              <div className={ `bold-text mr-30 ${css.label}` }>Billing Phone</div>
              <div className="flex">{ this.getValue('billingContact.phone') }</div>
            </Row>
            <Row type="flex" className="mb-5">
              <div className={ `bold-text mr-30 ${css.label}` }>Company Mobile</div>
              <div className="flex">{ this.getValue('billingContact.mobile') }</div>
            </Row>
            <Row type="flex" className="mb-5">
              <div className={ `bold-text mr-30 ${css.label}` }>Billing Fax</div>
              <div className="flex">{ this.getValue('billingContact.fax') }</div>
            </Row>
            <Row type="flex" className="mb-5">
              <div className={ `bold-text mr-30 ${css.label}` }>Billing Email</div>
              <div className="flex">{ this.getValue('billingContact.email') }</div>
            </Row>
            <Row type="flex" className="mb-30">
              <div className={ `bold-text mr-30 ${css.label}` }>Billing Address</div>
              <div className="flex">{ this.getValue('billingContact.address.line') }</div>
            </Row>
          </div>
          <div className="ml-40 text-center">
            <Avatar size={ 250 } className="mb-20 mt-20" src={ logoUrl } />
            { this.isAdmin &&
              <ImageEditor onApply={ this.updateCompanyLogo } uploadText="Edit Logo" />
            }
          </div>
        </Row>
        { this.isAdmin &&
          <ButtonLink type="primary" className="mr-10" to="/settings/details/edit">
            Edit
          </ButtonLink>
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(Details);
