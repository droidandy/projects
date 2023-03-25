import React from 'react';
import Form, { Input, AddressAutocomplete } from 'components/form';
import { ButtonLink } from 'components';
import { Row, Col, Button } from 'antd';

export default class EditDetailsForm extends Form {
  save = this.save.bind(this);

  validations = {
    'primaryContact.email': 'email',
    'billingContact.email': 'email'
  };

  $render($) {
    return (
      <div className="p-20">
        <Row type="flex" gutter={ 40 } className="mb-10">
          <Col md={ 12 } xs={ 24 }>
            <div className="text-24 bold-text mb-20">Primary Contact</div>
            <Row type="flex" gutter={ 20 }>
              <Col md={ 12 } xs={ 24 }>
                <Input { ...$('primaryContact.firstName') } className="mb-20" label="First Name" labelClassName="mb-5" />
                <Input { ...$('primaryContact.lastName') } className="mb-20" label="Second Name" labelClassName="mb-5" />
                <Input { ...$('primaryContact.phone') } className="mb-20" label="Phone" labelClassName="mb-5" type="tel" />
                <Input { ...$('primaryContact.mobile') } className="mb-20" label="Company Mobile" labelClassName="mb-5" type="tel" />
                <Input { ...$('primaryContact.fax') } className="mb-20" label="Fax" labelClassName="mb-5" type="tel" />
                <Input { ...$('primaryContact.email') } className="mb-20" label="Email" labelClassName="mb-5" type="tel" />
              </Col>
              <Col md={ 12 } xs={ 24 }>
                <AddressAutocomplete
                  { ...$('primaryContact.address') }
                  label="Address Finder"
                  labelClassName="mb-5"
                  placeholder="Enter a location"
                  icon="GoogleIcon"
                />
              </Col>
            </Row>
          </Col>
          <Col md={ 12 } xs={ 24 }>
            <div className="text-24 bold-text mb-20">Billing Contact</div>
            <Row type="flex" gutter={ 20 }>
              <Col md={ 12 } xs={ 24 }>
                <Input { ...$('billingContact.firstName') } className="mb-20" label="First Name" labelClassName="mb-5" />
                <Input { ...$('billingContact.lastName') } className="mb-20" label="Second Name" labelClassName="mb-5" />
                <Input { ...$('billingContact.phone') } className="mb-20" label="Biling Phone" labelClassName="mb-5" type="tel" />
                <Input { ...$('billingContact.mobile') } className="mb-20" label="Company Mobile" labelClassName="mb-5" type="tel" />
                <Input { ...$('billingContact.fax') } className="mb-20" label="Biling Fax" labelClassName="mb-5" type="tel" />
                <Input { ...$('billingContact.email') } className="mb-20" label="Biling Email" labelClassName="mb-5" type="tel" />
              </Col>
              <Col md={ 12 } xs={ 24 }>
                <AddressAutocomplete
                  { ...$('billingContact.address') }
                  label="Address Finder"
                  labelClassName="mb-5"
                  placeholder="Enter a location"
                  icon="GoogleIcon"
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <ButtonLink buttonClassName="btn-orange" className="mr-10" to="/settings/details">Cancel</ButtonLink>
        <Button type="primary" onClick={ this.save }>Save</Button>
      </div>
    );
  }
}
