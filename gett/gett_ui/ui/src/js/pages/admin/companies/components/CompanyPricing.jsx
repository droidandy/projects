import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox } from 'antd';
import { Icon, ResponsiveTable, VehicleType, notification, confirm } from 'components';
import { bindModalState, Select, ModalForm } from 'components/form';
import CompanyPricingForm from './CompanyPricingForm';
import dispatchers from 'js/redux/admin/companies.dispatchers';
import { connect } from 'react-redux';
import moment from 'moment';

import css from './style';

const { Option } = Select;

const typeLabels = {
  area: 'Area',
  fixed: 'Fixed price',
  meter: 'Internal meter'
};

const newPricingRule = {
  ruleType: 'point_to_point',
  priceType: 'fixed',
  bookingType: 'both',
  timeFrame: 'daily',
  minTime: '00:00',
  maxTime: '23:59'
};

function mapStateToProps(state) {
  return {
    items: state.companies.pricingRules,
    companies: state.companies.form.companies
  };
}

class CompanyPricing extends PureComponent {
  static propTypes = {
    companyId: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    getPricingRules: PropTypes.func,
    savePricingRule: PropTypes.func,
    destroyPricingRule: PropTypes.func,
    togglePricingRuleStatus: PropTypes.func,
    items: PropTypes.array,
    companies: PropTypes.array,
    copyPricingRules: PropTypes.func
  };

  state = {};

  componentDidMount() {
    const { companyId, getPricingRules } = this.props;
    getPricingRules(companyId);
  }

  showForm(rule = newPricingRule) {
    if (rule.startingAt && rule.endingAt) {
      rule.startingAt = moment(rule.startingAt);
      rule.endingAt = moment(rule.endingAt);
    }
    this.setState({ formVisible: true, form: rule });
  }

  saveForm = (rule, form) => {
    const { companyId, savePricingRule, getPricingRules } = this.props;
    savePricingRule({ ...rule, companyId })
      .then(this.closeForm)
      .then(() => notification.success(`Pricing Rule has been ${rule.id ? 'updated' : 'created'}`))
      .then(() => getPricingRules(companyId))
      .catch(e => form.setErrors(e.response.data.errors));
  };

  closeForm = () => {
    this.setState({ formVisible: false, form: {} });
  };

  showCopyPricingForm = () => {
    this.setState({ copyPricingFormVisible: true, copyPricingForm: {} });
  };

  closeCopyPricingForm = () => {
    this.setState({ copyPricingFormVisible: false, copyPricingForm: {} });
  };

  submitCopyPricingForm = ({ companyId }) => {
    const { copyPricingRules, getPricingRules, companyId: currentCompanyId } = this.props;

    copyPricingRules(currentCompanyId, companyId)
      .then(this.closeCopyPricingForm)
      .then(() => notification.success('Pricing Rules have been copied'))
      .then(() => getPricingRules(currentCompanyId));
  };

  toggleActive(record) {
    const updated = { ...record, active: !record.active };

    this.props.togglePricingRuleStatus(updated)
      .then(() => notification.success(`Pricing Rule has been ${updated.active ? 'activated' : 'deactivated'}`));
  }

  destroyPricingRule({ id, name }) {
    const { companyId, getPricingRules } = this.props;
    confirm({
      title: `Delete Pricing Rule '${name}'`,
      content: 'Are you sure?',
      onOk: () => {
        this.props.destroyPricingRule(id)
          .then(() => notification.success('Pricing Rule has been deleted'))
          .then(() => getPricingRules(companyId));
      }
    });
  }

  getTypeLabel({ ruleType, priceType }) {
    return (
      `${typeLabels[priceType] ? typeLabels[priceType] : ''}
       ${typeLabels[priceType] && typeLabels[ruleType] ? ' / ' : ''}
       ${typeLabels[ruleType] ? typeLabels[ruleType] : ''}`
    );
  }

  scrollToError() {
    const inputEl = document.querySelector('.error');

    if (inputEl) {
      inputEl.scrollIntoViewIfNeeded();
    }
  }

  render() {
    const { form, formVisible } = this.state;
    const { items, companies, companyId } = this.props;

    const companiesWithPricing = companies.filter(c => c.hasPricingRulesConfigured && c.id !== companyId);

    return (
      <div className="p-20 sm-p-0">
        <div className="layout horizontal end-justified mb-10">
          <Button className="bread-crumbs-button  mr-10" type="secondary" onClick={ () => this.showForm() }>
            <Icon className="text-20 mr-10" icon="MdAdd" />
            Add New Price Rule
          </Button>
          <Button className="bread-crumbs-button" type="secondary" onClick={ () => this.showCopyPricingForm() }>
            Copy Pricing
          </Button>
        </div>
        <ResponsiveTable
          rowKey="id"
          dataSource={ items }
          columns={ [
            { title: 'Name', dataIndex: 'name', key: 'name', className: 'price-rule-name' },
            { title: 'Pick up', dataIndex: 'pickupAddress.line', key: 'pickup', className: 'price-rule-pickup' },
            { title: 'Destination', dataIndex: 'destinationAddress.line', key: 'destination', className: 'price-rule-destination' },
            { title: 'Vehicle Type', dataIndex: 'vehicleTypes', key: 'vehicleTypes', className: 'price-rule-vehicle-type',
              render: vehicleType => (
                <div className="layout verticale">
                  { vehicleType.map(vehicle => (
                    <VehicleType key={ vehicle } size="small" type={ vehicle } className="mt-5 mb-5" />
                  ))}
                </div>
              )
            },
            { title: 'Type', key: 'type', className: 'price-rule-type',
              render: record => (
                <div>{ this.getTypeLabel(record) }</div>
              )
            },
            { title: 'Active', key: 'active', className: 'price-rule-active',
              render: record => (
                <Checkbox
                  checked={ record.active }
                  onChange={ () => this.toggleActive(record) }
                  data-name="active"
                />
              )
            },
            { title: 'Action',
              render: record => (
                <div>
                  <Button
                    className="mr-10"
                    type="secondary"
                    onClick={ () => this.showForm(record) }
                  >
                    Edit
                  </Button>
                  <Button
                    type="danger"
                    onClick={ () => this.destroyPricingRule(record) }
                  >
                    Delete
                  </Button>
                </div>
              )
            }
          ] }
          mobileColumns={ [
            { title: 'Details', key: 'details',
              render: record => (
                <div>
                  <div className="mb-10">
                    <span className="bold-text mr-10">Pick up:</span>
                    { record.pickupAddress.line }
                  </div>
                  <div className="mb-10">
                    <span className="bold-text mr-10">Destination:</span>
                    { record.destinationAddress.line }
                  </div>
                  <div className="mb-10">
                    <div className="bold-text mb-10">Vehicle Types:</div>
                    <div className="layout verticale">
                      { record.vehicleTypes.map(vehicle => (
                        <VehicleType key={ vehicle } size="small" type={ vehicle } className="mt-5 mb-5" />
                      ))}
                    </div>
                  </div>
                  <div className="mb-10">
                    <span className="bold-text mr-10">Type:</span>
                    { record.priceType }
                  </div>
                </div>
              )
            },
            { title: 'Active', key: 'active', width: '50px',
              render: record => (
                <Checkbox
                  checked={ record.active }
                  onClick={ () => this.toggleActive(record) }
                />
              )
            },
            { title: 'Action',
              render: record => (
                <div className="layout verticale">
                  <Button
                    className="mb-10"
                    type="secondary"
                    onClick={ () => this.showForm(record) }
                  >
                    Edit
                  </Button>
                  <Button
                    type="danger"
                    onClick={ () => this.destroyPricingRule(record) }
                  >
                    Delete
                  </Button>
                </div>
              )
            }
          ] }
        />
        <CompanyPricingForm
          { ...bindModalState(this) }
          width={ 720 }
          title={ form && form.id ? 'Edit Price Rule' : 'New Price Rule' }
          onRequestSave={ this.saveForm }
          onRequestClose={ this.closeForm }
          visible={ formVisible }
          wrapClassName={ css.modalForm }
          onValidationFailed={ this.scrollToError }
        />
        <ModalForm
          { ...bindModalState(this, 'copyPricingForm') }
          width={ 400 }
          title="Copy Pricing Rule"
          onRequestSave={ this.submitCopyPricingForm }
          onRequestClose={ this.closeCopyPricingForm }
          okText="Submit"
          validations={ { 'companyId': 'presence' } }
        >
          { $ => (
            <div>
              <Select
                { ...$('companyId') }
                className={ `mb-20 ${css.select}` }
                placeholder="Please select companies"
                label="Select company to copy pricing rule"
                labelClassName="mb-5"
                filterOption={ Select.caseInsensitiveFilter }
              >
                { companiesWithPricing.map(company => <Option key={ company.id }>{ company.name }</Option>) }
              </Select>
            </div>
          ) }
        </ModalForm>
      </div>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(CompanyPricing);
