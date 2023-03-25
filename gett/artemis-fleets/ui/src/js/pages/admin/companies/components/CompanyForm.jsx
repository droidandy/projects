import React from 'react';
import Form, { Input, AddressAutocomplete, SalesmanSelector, ImageEditor } from 'components/form';
import { Icon, ButtonLink } from 'components';
import { Button, Row, Col } from 'antd';

export default class CompanyForm extends Form {
  save = this.save.bind(this);

  validations = {
    'name': 'presence',
    'address': 'address',
    'admin.firstName': 'presence',
    'admin.lastName': 'presence',
    'admin.phone': 'presence',
    'admin.email': ['presence', 'email'],
    'admin.password': { presence: { if(){ return this.isNew; } } }
  };

  get isNew() {
    return !this.get('id');
  }

  $render($) {
    return (
      <div>
        <div className="mb-30 text-18">{ this.isNew ? 'Add New Company' : `Edit Company #${this.get('id')}` }</div>

        <Row gutter={ 40 } type="flex">
          <Col sm={ 8 } xs={ 24 }>
            <div className="mb-20 text-16 pl-10 pr-10 p-5 sand-bg">Company Details</div>
            <Input { ...$('name') } className="mb-20" label="Company name" labelClassName="required mb-5" />
            <Input { ...$('fleetId') } className="mb-20" label="Fleet ID" labelClassName="required mb-5" />
            <AddressAutocomplete
              { ...$('address') }
              className="block mb-20"
              label="Address"
              labelClassName="required mb-5"
            />
            <Input { ...$('vatNumber') } className="mb-20" label="VAT Number" labelClassName="mb-5" />
            <SalesmanSelector { ...$('salesmanId') } className="block mb-20" label="Sales Person Name" labelClassName="mb-5" />
            <Input { ...$('costCentre') } className="mb-20" label="Cost Centre" labelClassName="mb-5" />
            <Input { ...$('legalName') } className="mb-20" label="Legal Company Name" labelClassName="mb-5" />
            <AddressAutocomplete
              { ...$('legalAddress') }
              className="block mb-20"
              label="Legal Address"
              labelClassName="mb-5"
            />
            <label className="mb-5">Company Logo</label>
            <ImageEditor { ...$('logo') } fallbackUrl={ this.get('logoUrl') } className="mb-20">
              { url => <div><img src={ url } alt="" /></div> }
            </ImageEditor>
          </Col>

          <Col sm={ 8 } xs={ 24 }>
            <div className="mb-20 text-16 pl-10 pr-10 p-5 sand-bg">Admin Details</div>
            <Input { ...$('admin.firstName') } className="mb-20" label="First name" labelClassName="required mb-5" />
            <Input { ...$('admin.lastName') } className="mb-20" label="Second Name" labelClassName="required mb-5" />
            <Input { ...$('admin.phone') } className="mb-20" label="Phone Number" labelClassName="required mb-5" type="tel" />
            <Input { ...$('admin.email') } className="mb-20" label="Email" labelClassName="required mb-5" />
            { this.isNew &&
              <Input { ...$('admin.password') } className="mb-20" label="Password" labelClassName="required mb-5" type="password" />
            }
          </Col>
        </Row>

        <Row type="flex" justify="end" className="border-top pt-20 mb-20">
          <ButtonLink buttonClassName="btn-orange text-uppercase" className="mr-10" to="/companies">
            <Icon className="text-20 mr-10" icon="MdClose" />
            Cancel
          </ButtonLink>
          <Button className="text-uppercase" type="primary" onClick={ this.save }>
            <Icon className="text-20 mr-10" icon="MdAdd" />
            { this.get('id') ? 'Update Company' : 'Add Company' }
          </Button>
        </Row>
      </div>
    );
  }
}
