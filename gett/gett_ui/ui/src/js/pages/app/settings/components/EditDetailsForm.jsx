import React, { Fragment } from 'react';
import Form, { Input, AddressAutocomplete, PhoneInput } from 'components/form';
import { ButtonLink, ButtonEdit } from 'components';
import { Row, Col } from 'antd';

import css from './settings.css';
import CN from 'classnames';

export default class EditDetailsForm extends Form {
  save = this.save.bind(this);

  validations = {
    'address': ['presence', 'address'],
    'primaryContact.email': 'email',
    'primaryContact.phone': ['presence', 'phoneNumber'],
    'billingContact.email': 'email'
  };

  $render($) {
    return (
      <Fragment>
        <div className="layout horizontal sm-wrap center-justified">
          <div className="page-title mb-30 sm-mb-20 flex xs-full-width">Account details</div>
          <div className="layout horizontal sm-mb-20 xs-full-width center-center">
            <ButtonLink type="secondary" className="mr-20 sm-pr-0 sm-pl-0" buttonClassName="ant-btn-edit xs-full-width" to="/settings/details">Cancel</ButtonLink>
            <ButtonEdit type="primary" onClick={ this.save }>Save</ButtonEdit>
          </div>
        </div>
          <div className={ CN('layout vertical white-bg full-width pb-40 mb-20', css.wrapper) } data-name="primaryContact">
            <div className={ css.title }>
              Primary Contact
            </div>
            <div className="layout vertical ml-30 sm-ml-20 mt-30 pr-30 sm-pr-20">
              <Row className="xs-flex">
                <Col md={ 9 } sm={ 12 } xs={ 24 }>
                  <Input
                    { ...$('primaryContact.firstName') }
                    className="mb-20 mr-30 xs-mr-0"
                    label="First name"
                    labelClassName="text-12 grey-text bold-text mb-5"
                  />
                </Col>
                <Col md={ 9 } sm={ 12 } xs={ 24 }>
                  <Input
                    { ...$('primaryContact.lastName') }
                    className="mb-20"
                    label="Second name"
                    labelClassName="text-12 grey-text bold-text mb-5"
                  />
                </Col>
              </Row>
              <Row className="xs-flex">
                <Col md={ 9 } sm={ 12 } xs={ 24 }>
                  <PhoneInput
                    { ...$('primaryContact.phone') }
                    className="mb-20 mr-30 xs-mr-0"
                    label="Phone"
                    labelClassName="text-12 grey-text bold-text mb-5"
                  />
                </Col>
                <Col md={ 9 } sm={ 12 } xs={ 24 }>
                  <PhoneInput
                    { ...$('primaryContact.mobile') }
                    className="mb-20"
                    label="Company mobile"
                    labelClassName="text-12 grey-text bold-text mb-5"
                  />
                </Col>
              </Row>
              <Row className="xs-flex">
                <Col md={ 9 } sm={ 12 } xs={ 24 }>
                  <Input
                    { ...$('primaryContact.email') }
                    className="mb-20 mr-30 xs-mr-0"
                    label="Email"
                    labelClassName="text-12 grey-text bold-text mb-5"
                    type="email"
                  />
                </Col>
                <Col md={ 9 } sm={ 12 } xs={ 24 }>
                  <Input
                    { ...$('primaryContact.fax') }
                    className="mb-20" label="Fax"
                    labelClassName="text-12 grey-text bold-text mb-5"
                    type="tel"
                  />
                </Col>
              </Row>
              <Row>
                <Col md={ 18 } xs={ 24 }>
                  <AddressAutocomplete
                    { ...$('address') }
                    icon="GettDude"
                    label="Address & Default office pickup location"
                    labelClassName="text-12 grey-text bold-text mb-5"
                    placeholder="Enter a location"
                  />
                </Col>
              </Row>
            </div>
          </div>
          <div className={ CN('layout vertical white-bg full-width pb-40 mb-20', css.wrapper) } data-name="billingContact">
            <div className={ css.title }>
              Billing Contact
            </div>
            <div className="layout vertical ml-30 sm-ml-20 mt-30 pr-30 sm-pr-20">
              <Row className="xs-flex">
                <Col md={ 9 } sm={ 12 } xs={ 24 }>
                  <Input
                    { ...$('billingContact.firstName') }
                    className="mb-20 mr-30 xs-mr-0"
                    label="First name"
                    labelClassName="text-12 grey-text bold-text mb-5"
                  />
                </Col>
                <Col md={ 9 } sm={ 12 } xs={ 24 }>
                  <Input
                    { ...$('billingContact.lastName') }
                    className="mb-20"
                    label="Second name"
                    labelClassName="text-12 grey-text bold-text mb-5"
                  />
                </Col>
              </Row>
              <Row className="xs-flex">
                <Col md={ 9 } sm={ 12 } xs={ 24 }>
                  <PhoneInput
                    { ...$('billingContact.phone') }
                    className="mb-20 mr-30 xs-mr-0"
                    label="Billing phone"
                    labelClassName="text-12 grey-text bold-text mb-5"
                  />
                </Col>
                <Col md={ 9 } sm={ 12 } xs={ 24 }>
                  <PhoneInput
                    { ...$('billingContact.mobile') }
                    className="mb-20"
                    label="Company mobile"
                    labelClassName="text-12 grey-text bold-text mb-5"
                  />
                </Col>
              </Row>
              <Row className="xs-flex">
                <Col md={ 9 } sm={ 12 } xs={ 24 }>
                  <Input
                    { ...$('billingContact.email') }
                    className="mb-20 mr-30 xs-mr-0"
                    label="Billing Email"
                    labelClassName="text-12 grey-text bold-text mb-5"
                    type="email"
                  />
                </Col>
                <Col md={ 9 } sm={ 12 } xs={ 24 }>
                  <Input
                    { ...$('billingContact.fax') }
                    className="mb-20"
                    label="Billing fax"
                    labelClassName="text-12 grey-text bold-text mb-5"
                    type="tel"
                  />
                </Col>
              </Row>
              <Row className="xs-flex">
                <Col md={ 18 } xs={ 24 }>
                  <AddressAutocomplete
                    { ...$('billingContact.address') }
                    label="Address finder"
                    icon="GettDude"
                    labelClassName="text-12 grey-text bold-text mb-5"
                    placeholder="Enter a location"
                  />
                </Col>
              </Row>
            </div>
          </div>
      </Fragment>
    );
  }
}
