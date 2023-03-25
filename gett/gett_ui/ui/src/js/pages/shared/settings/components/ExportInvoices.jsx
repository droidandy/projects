import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Select, Notification } from 'antd';
import { Button, Desktop } from 'components';
import { isEmpty, last } from 'lodash';
import { urlFor, get, post } from 'utils';
import qs from 'qs';

const { Option } = Select;

export default class ExportInvoices extends PureComponent {
  static propTypes = {
    admin: PropTypes.bool
  };

  state = {
    selectedMonths: [],
    monthsList: [],
    visible: false
  };

  get apiPrefix() {
    return this.props.admin ? '/admin' : '';
  }

  showExport = (type) => {
    get(`${this.apiPrefix}/invoices/exportable_periods`)
      .then((res) => {
        const months = res.data.items;

        this.setState({
          monthsList: months,
          selectedMonths: months.length ? [last(months).value] : [],
          visible: true,
          type
        });
      });
  };

  closeExport = () => {
    this.setState({
      loading: false,
      visible: false,
      selectedMonths: [],
      type: ''
    });
  };

  exportInvoices = () => {
    const { selectedMonths, type } = this.state;
    const params = { periods: selectedMonths };

    this.setState({ loading: true });

    if (type === 'pdf') {
      post(`${this.apiPrefix}/invoices/export_bunch`, params)
        .then(() => {
          this.closeExport();
          Notification.open({
            message: 'Please wait...',
            description: 'Your download is about to start...',
            duration: 1.5
          });
        });
    } else {
      const query = qs.stringify(params, { encode: false, arrayFormat: 'brackets' });
      urlFor.download(`/api${this.apiPrefix}/invoices/export_csv?${query}`)();
      this.closeExport();
    }
  };

  renderExportModal() {
    const { monthsList, selectedMonths, type, visible } = this.state;
    const extension = type === 'pdf' ? 'ZIP' : 'CSV';

    return (
      <Modal
        visible={ visible }
        title="Select date range to export"
        onCancel={ this.closeExport }
        footer={ [
          <Button key="back" type="secondary" onClick={ this.closeExport }>Cancel</Button>,
          <Button key="submit" type="primary" disabled={ isEmpty(selectedMonths) } onClick={ this.exportInvoices }>
            Export
          </Button>,
        ] }
      >
        <div className="text-14 mb-10">
          Select the month(s) for the invoices you would like to download and click 'export'.
          Invoices data will be exported as a { extension } file
        </div>
        <div>Month:</div>
        <Select
          mode="multiple"
          className="full-width"
          placeholder="Please select"
          value={ selectedMonths }
          onChange={ value => this.setState({ selectedMonths: value }) }
        >
          { monthsList.map(item => <Option key={ item.value }>{ item.label } </Option>) }
        </Select>
      </Modal>
    );
  }

  render() {
    return (
      <Desktop>
        <div className="justified-right">
          <Button onClick={ () => this.showExport('csv') } type="primary" className="mr-10">
            Export CSV
          </Button>
          <Button onClick={ () => this.showExport('pdf') } type="primary">
            Export PDF
          </Button>
        </div>
        { this.renderExportModal() }
      </Desktop>
    );
  }
}
