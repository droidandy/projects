import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Avatar, ImageEditor, ButtonLink, Button, PhoneNumber, notification } from 'components';
import { get, isEmpty } from 'lodash';
import CN from 'classnames';
import { put } from 'utils';
import dispatchers from 'js/redux/app/settings.dispatchers';

import css from './components/settings.css';

function mapStateToProps(state) {
  return {
    logoUrl: state.session.layout.logoUrl,
    data: state.settings.account.data,
    can: state.settings.account.can
  };
}

class Details extends PureComponent {
  static propTypes = {
    logoUrl: PropTypes.string,
    data: PropTypes.object,
    can: PropTypes.object,
    getCompanySettings: PropTypes.func,
    updateCompanyLogo: PropTypes.func
  };

  componentDidMount() {
    this.props.getCompanySettings();
  }

  getValue(path, defaultValue = '-') {
    return get(this.props.data, path) || defaultValue;
  }

  updateCompanyLogo = (logo) => {
    return this.props.updateCompanyLogo(logo)
      .then(() => notification.success('Company Logo successfully updated.'));
  };

  synchronizeSftp = () => {
    const { data: { sftp: { hrFeedEnabled, references } } } = this.props;
    let text = '';

    if (hrFeedEnabled && !isEmpty(references)) {
      text = 'Passengers and references will be updated soon.';
    } else if (hrFeedEnabled) {
      text = 'Passengers will be updated soon.';
    } else {
      text = 'References will be updated soon.';
    }

    put('/company/synchronize_sftp')
      .then(() => notification.success(`Synchronization request is processed. ${text}`));
  };
  render() {
    const { logoUrl, can, data: { sftp } } = this.props;

    return (
      <Fragment>
        <div className="layout horizontal center flex">
          <div className="page-title mb-30 flex">Account details</div>
          { can.edit &&
            <ButtonLink type="primary" className="mb-30" buttonClassName="ant-btn-edit" to="/settings/details/edit" data-name="edit">
              Edit
            </ButtonLink>
          }
        </div>
        <div className="layout horizontal sm-wrap">
          <div className="flex sm-mb-20 sm-mr-0 sm-full-width sm-order-2">
            <div data-name="primaryContact" className={ CN('white-bg pb-30 pr-10 mb-30 sm-mb-20', css.wrapper) }>
              <div className={ css.title }>
                Primary Contact
              </div>
              <div className="layout horizontal mb-5 ml-30 mt-30">
                <div className={ `flex none bold-text mr-20 text-12 ${css.label}` }>First Name</div>
                <div className="sm-flex black-text" data-name="primaryContact.firstName">{ this.getValue('primaryContact.firstName') }</div>
              </div>
              <div className="layout horizontal mb-5 ml-30">
                <div className={ `flex none bold-text mr-20 text-12 ${css.label}` }>Last Name</div>
                <div className="sm-flex black-text wrap-break-word" data-name="primaryContact.lastName">{ this.getValue('primaryContact.lastName') }</div>
              </div>
              <div className="layout horizontal mb-5 ml-30">
                <div className={ `flex none bold-text mr-20 text-12 ${css.label}` }>Phone</div>
                <PhoneNumber className="sm-flex black-text wrap-break-word" data-name="primaryContact.phone" phone={ this.getValue('primaryContact.phone', false) } />
              </div>
              <div className="layout horizontal mb-5 ml-30">
                <div className={ `flex none bold-text mr-20 text-12 ${css.label}` }>Company Mobile</div>
                <PhoneNumber className="sm-flex black-text" data-name="primaryContact.mobile" phone={ this.getValue('primaryContact.mobile', false) } />
              </div>
              <div className="layout horizontal mb-5 ml-30">
                <div className={ `flex none bold-text mr-20 text-12 ${css.label}` }>Fax</div>
                <div className="sm-flex black-text wrap-break-word" data-name="primaryContact.fax">{ this.getValue('primaryContact.fax') }</div>
              </div>
              <div className="layout horizontal mb-5 ml-30">
                <div className={ `flex none bold-text mr-20 text-12 ${css.label}` }>Email</div>
                <div className="sm-flex black-text wrap-break-word" data-name="primaryContact.email">{ this.getValue('primaryContact.email') }</div>
              </div>
              <div className="layout horizontal mb-5 ml-30">
                <div className={ `flex none bold-text mr-20 text-12 ${css.label}` }>Address & Default Office Pickup Location</div>
                <div className="sm-flex black-text wrap-break-word" data-name="primaryContact.address">{ this.getValue('address.line') }</div>
              </div>
              <div className="layout horizontal ml-30">
                <div className={ `flex none bold-text mr-20 text-12 ${css.label}` }>Customer Service Phone</div>
                <div className="sm-flex black-text wrap-break-word" data-name="customerServicePhone">{ this.getValue('customerServicePhone') }</div>
              </div>
            </div>
            <div data-name="billingContact" className={ CN('white-bg pb-30 pr-10', css.wrapper) }>
              <div className={ css.title }>
                Billing Contact
              </div>
              <div className="layout horizontal mb-5 ml-30 mt-30">
                <div className={ `flex none bold-text mr-20 text-12 ${css.label}` }>First Name</div>
                <div className="sm-flex black-text wrap-break-word" data-name="billingContact.firstName">{ this.getValue('billingContact.firstName') }</div>
              </div>
              <div className="layout horizontal mb-5 ml-30">
                <div className={ `flex none bold-text mr-20 text-12 ${css.label}` }>Last Name</div>
                <div className="sm-flex black-text wrap-break-word" data-name="billingContact.lastName">{ this.getValue('billingContact.lastName') }</div>
              </div>
              <div className="layout horizontal mb-5 ml-30">
                <div className={ `flex none bold-text mr-20 text-12 ${css.label}` }>Billing Phone</div>
                <PhoneNumber className="sm-flex black-text" data-name="billingContact.phone" phone={ this.getValue('billingContact.phone', false) } />
              </div>
              <div className="layout horizontal mb-5 ml-30">
                <div className={ `flex none bold-text mr-20 text-12 ${css.label}` }>Company Mobile</div>
                <PhoneNumber className="sm-flex black-text" data-name="billingContact.mobile" phone={ this.getValue('billingContact.mobile', false) } />
              </div>
              <div className="layout horizontal mb-5 ml-30">
                <div className={ `flex none bold-text mr-20 text-12 ${css.label}` }>Billing Fax</div>
                <div className="sm-flex black-text wrap-break-word" data-name="billingContact.fax">{ this.getValue('billingContact.fax') }</div>
              </div>
              <div className="layout horizontal mb-5 ml-30">
                <div className={ `flex none bold-text mr-20 text-12 ${css.label}` }>Billing Email</div>
                <div className="sm-flex black-text wrap-break-word" data-name="billingContact.email">{ this.getValue('billingContact.email') }</div>
              </div>
              <div className="layout horizontal ml-30">
                <div className={ `flex none bold-text mr-20 text-12 ${css.label}` }>Billing Address</div>
                <div className="sm-flex black-text wrap-break-word" data-name="billingContact.address">{ this.getValue('billingContact.address.line') }</div>
              </div>
            </div>
          </div>
          <div className={ CN('ml-20 sm-ml-0 sm-mb-20 p-20 sm-order-1 sm-full-width white-bg', css.wrapper, css.right) }>
            <Avatar
              size={ 140 }
              className="mb-20 mt-10 center-block"
              name={ `${this.getValue('primaryContact.firstName')} ${this.getValue('primaryContact.lasttName')}` }
              src={ logoUrl } dataName="companyLogo"
            />
            { can.edit &&
              <div className="layout vertical center">
                <ImageEditor onApply={ this.updateCompanyLogo } uploadText={ logoUrl ? 'Edit' : 'Add' } dataName="add_edit_logo" />
              </div>
            }
            { can.seeSftpOptions && sftp &&
              <div className="mt-30 sm-mb-10">
                <div className="pr-10" data-name="sftpSettings">
                  <div className="text-18 mb-10">SFTP Settings</div>
                  <div className="layout horizontal mb-5">
                    <div className={ `flex none bold-text mr-20 text-12 ${css.label}` }>SFTP Host</div>
                    <div className="sm-flex black-text wrap-break-word" data-name="sftp.host">{ this.getValue('sftp.host') }</div>
                  </div>

                  <div className="layout horizontal mb-5">
                    <div className={ `flex none bold-text mr-20 text-12 ${css.label}` }>SFTP Port</div>
                    <div className="sm-flex black-text wrap-break-word" data-name="sftp.port">{ this.getValue('sftp.port') }</div>
                  </div>

                  <div className="layout horizontal mb-5">
                    <div className={ `flex none bold-text mr-20 text-12 ${css.label}` }>SFTP Username</div>
                    <div className="sm-flex black-text wrap-break-word" data-name="sftp.username">{ this.getValue('sftp.username') }</div>
                  </div>

                  <div className="layout horizontal mb-20">
                    <div className={ `flex none bold-text mr-20 text-12 ${css.label}` }>SFTP Password</div>
                    <div className={ CN('sm-flex black-text wrap-break-word', css.value) } data-name="sftp.password">{ this.getValue('sftp.password') }</div>
                  </div>
                </div>
                { sftp.hrFeedEnabled &&
                  <div data-name="hrFeedPaths">
                    <div className="text-18 mb-10">HR Feed Paths</div>
                    <div className="layout horizontal mb-20">
                      <div className={ `flex none bold-text mr-20 text-12 ${css.label}` }>Users List</div>
                      <div className="sm-flex black-text wrap-break-word" data-name="usersList">hr_feed.csv</div>
                    </div>
                  </div>
                }

                { !isEmpty(sftp.references) &&
                  <div data-name="referencePaths">
                    <div className="text-18 mb-10">Reference Paths</div>
                    { sftp.references.map((reference, i) => (
                      <div className="layout horizontal" key={ `reference-${i}` } data-name="reference">
                        <div className={ `flex none bold-text mr-20 text-12 ${css.label}` }>{ reference.name }</div>
                        <div className="sm-flex black-text wrap-break-word">{ reference.sftpCsvPath }</div>
                      </div>
                    )) }
                  </div>
                }
                <div className="layout vertical center">
                  <Button size="small" type="secondary" className="mt-30" onClick={ this.synchronizeSftp } data-name="ftp_synchronize">
                    Sync with SFTP server
                  </Button>
                </div>
              </div>
            }
          </div>
        </div>
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(Details);
