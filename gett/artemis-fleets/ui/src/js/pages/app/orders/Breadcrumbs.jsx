import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Breadcrumbs as Basecrumbs, Icon, Button } from 'components';
import { Route } from 'react-router-dom';
import { urlFor } from 'utils';
import { Modal, DatePicker, LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import moment from 'moment';
import map from 'lodash/map';

const pages = {
  '/orders/active': 'Acttive',
  '/orders/completed': 'Completed',
  '/orders/future': 'Future'
};

const { confirm } = Modal;

export default class Breadcrumbs extends PureComponent {
  static propTypes = {
    userRole: PropTypes.string
  };

  onFromDateChange = (date) => {
    this.setState({ from: date });
  };

  onToDateChange = (date) => {
    this.setState({ to: date });
  };

  chooseDateRange = () => {
    this.setState({ from: moment().subtract(1, 'month'), to: moment() }, () => {
      confirm({
        title: 'Select date range to export',
        content: this.renderDates(),
        cancelText: 'Cancel',
        okText: 'Export',
        onOk: () => {
          const { from, to } = this.state;
          const url = `/api/orders_report/export?from=${from.format('DD-MM-YYYY')}&to=${to.format('DD-MM-YYYY')}`;

          window.open(urlFor.tokenized(url));
        }
      });
    });
  };

  renderButtons = () => {
    return (
      <div>
        <Button onClick={ this.chooseDateRange } type="secondary" className="mr-10">
          <Icon className="text-20 mr-10" icon="MdFileDownload" />
          Export
        </Button>
      </div>
    );
  };

  renderDates() {
    const { from, to } = this.state;

    return (
      <LocaleProvider locale={ enUS }>
        <div>
          <div className="text-14 mb-10">
            { "Select the date range for the orders you would like to download and click 'export'. Orders data will be exported as a .CSV file" }
          </div>
          <div>{ 'From:' }</div>
          <DatePicker defaultValue={ from } onChange={ this.onFromDateChange } className="sm-flex" allowClear={ false } />
          <div>{ 'To:' }</div>
          <DatePicker defaultValue={ to } onChange={ this.onToDateChange } className="sm-flex" allowClear={ false } />
        </div>
      </LocaleProvider>
    );
  }

  render() {
    const { userRole } = this.props;

    return (
      <Basecrumbs>
        <div>
          { map(pages, (title, path) =>
            <Route key={ path } exact path={ path } render={ () => <span>{ title } </span> } />)
          }
          Orders
        </div>
        { userRole === 'admin' && this.renderButtons() }
      </Basecrumbs>
    );
  }
}
