import React from 'react';
import Form, { Input, Select, DatePicker, CompanySelector } from 'components/form';
import { Button } from 'components';
import { Row, Col } from 'antd';
import CN from 'classnames';
import { invoiceTypeLabels } from 'pages/shared/settings/billing';

import css from './billing.css';

const { Option } = Select;

export default class InvoiceSearchForm extends Form {
  save = this.save.bind(this);

  changeType(value) {
    this.set({
      type: value,
      status: null
    });
  }

  $render($) {
    const { type } = this.props.attrs;

    return (
      <div className={ CN('white-bg sm-full-width', css.wrapper) }>
        <div className={ CN('layout horizontal center pr-20', css.titleWrapper) }>
          <div className={ CN('flex', css.title) }>Search { type }</div>
        </div>
        <div className="p-15 white-bg">
          <div className="mb-20">
            <CompanySelector { ...$('companyId') } label="Company" labelClassName="mb-5" />
          </div>
          <Select
            { ...$('type')(this.changeType) }
            allowClear
            className="mb-20"
            label="Invoice Type"
            labelClassName="mb-5"
            placeholder="Select invoice type"
          >
            <Option key="in" value="invoice">{ invoiceTypeLabels.invoice }</Option>
            <Option key="cc" value="cc_invoice">{ invoiceTypeLabels.cc_invoice }</Option>
            <Option key="cn" value="credit_note">{ invoiceTypeLabels.credit_note }</Option>
          </Select>
          <Select
            { ...$('status') }
            allowClear
            className="mb-20"
            label="Payment Status"
            labelClassName="mb-5"
            placeholder="Select payment status"
          >
            { (!type || type == 'invoice') &&
              [
                <Option key="ouwp" value="outstanding_without_processing">Outstanding</Option>,
                <Option key="ovwp" value="overdue_without_processing">Overdue</Option>,
                <Option key="pr" value="processing">Processing</Option>,
                <Option key="pa" value="paid">{ `Paid${!type ? ' (Invoice)' : ''}` }</Option>,
                <Option key="pp" value="partially_paid">Partially Paid</Option>,
                <Option key="ur" value="under_review">Under Review</Option>
              ]
            }
            { (!type || type == 'credit_note') &&
              [
                <Option key="is" value="issued">{ `Unpaid${!type ? ' (Credit Note)' : ''}` }</Option>,
                <Option key="ap" value="applied">{ `Paid${!type ? ' (Credit Note)' : ''}` }</Option>
              ]
            }
          </Select>

          <Row type="flex" gutter={ 32 }>
            <Col sm={ 12 } xs={ 24 }>
              <label className="mb-5 text-12 dark-grey-text bold-text">From Date</label>
              <DatePicker { ...$('fromDate') } className="mb-20" />
            </Col>

            <Col sm={ 12 } xs={ 24 }>
              <label className="mb-5 text-12 dark-grey-text bold-text">To Date</label>
              <DatePicker { ...$('toDate') } className="mb-20" />
            </Col>
          </Row>

          <Input
            { ...$('overdueBy') }
            type="number"
            className="mb-20"
            label="Overdue By"
            labelClassName="mb-5"
            placeholder="Select overdue by"
          />
          <Input
            { ...$('invoiceId') }
            type="number"
            className="mb-20"
            label="Invoice No"
            labelClassName="mb-5"
            placeholder="Select invoice no"
          />
          <div className="text-right">
            <Button type="danger" className="mr-10" disabled={ this.props.resetDisabled } onClick={ this.props.onReset }>
              Reset Search
            </Button>
            <Button type="primary" onClick={ this.save }>Search</Button>
          </div>
        </div>
      </div>
    );
  }
}
