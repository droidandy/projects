import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon, ButtonLinkAdd, Search, ResponsiveTable, notification, Status, CompanyType, confirm } from 'components';
import { CompanyDetails } from './components';
import moment from 'moment';
import { debounce, keys, uniq, pickBy, includes, capitalize } from 'lodash';
import dispatchers from 'js/redux/admin/companies.dispatchers';

import css from './components/style.css';

import { creditRateStatuses, ddis, ddiLabels } from './data';

const searchDebounce = 300;
const ddiOptions = ddis.map(value => ({ value, text: ddiLabels[value] }));

function mapStateToProps(state) {
  return state.companies.list;
}

const locale = {
  emptyText: 'No results found.'
};

const actionLabels = {
  true: 'enable',
  false: 'disable'
};

const alertLabels = {
  'notify_with_sms': 'SMS',
  'notify_with_email': 'email',
  'notify_with_push': 'push'
};

class CompaniesList extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    pagination: PropTypes.object,
    query: PropTypes.object,
    locale: PropTypes.object,
    getCompanies: PropTypes.func,
    toggleCompanyStatus: PropTypes.func,
    toggleNotifications: PropTypes.func,
    can: PropTypes.object,
    destroyCompany: PropTypes.func
  };

  state = { search: this.props.query.search };

  componentDidMount() {
    const { getCompanies } = this.props;

    getCompanies({ page: 1, search: this.state.search });

    this.searchCompanies = debounce(() => {
      getCompanies({ ...this.props.query, page: 1, search: this.state.search });
    }, searchDebounce);
  }

  toggleNotifications(company, field, value) {
    const { name, count, id } = company;
    const alertType = alertLabels[field];
    const action = actionLabels[value];

    confirm({
      title: `${capitalize(action)} ${capitalize(alertType)} Alerts: ${name}`,
      content: `Are you sure you would like to ${action} ${alertType} notifications for all ${count} employees of ${name}?`,
      onOk: () => {
        this.props.toggleNotifications(id, {[field]: value})
          .then(() => notification.success('Members have been updated'));
      }
    });
  }

  toggleCompanyStatus(company) {
    const action = company.active ? 'Deactivate' : 'Activate';

    confirm({
      title: `${action} company`,
      content: `Are you sure you would like to ${action} this company?`,
      onOk: () => {
        this.props.toggleCompanyStatus(company.id)
          .then(() => notification.success('Company has been updated'));
      }
    });
  }

  getCreditRatesFilters(statusType) {
    const suitableCreditRateStatuses = pickBy(creditRateStatuses, status =>
      includes(statusType, status.type)
    );

    return uniq(keys(suitableCreditRateStatuses));
  }

  onTableChange = (pagination, filters, sorter) => {
    const { query: { search }, getCompanies } = this.props;
    const query = { page: pagination.current, search };

    if (filters.creditRateStatus) {
      query.creditRateStatus = this.getCreditRatesFilters(filters.creditRateStatus);
    }
    if (filters.ddiType) {
      query.ddiType = filters.ddiType;
    }
    if (filters.countryCode) {
      query.countryCode = filters.countryCode;
    }
    if (sorter.field) { query.order = sorter.field; }
    if (sorter.order) { query.reverse = sorter.order === 'descend'; }

    getCompanies(query);
  };

  onSearch = (value) => {
    this.setState({ search: value }, this.searchCompanies);
  };

  destroyCompany = (company) => {
    confirm({
      title: 'Delete company',
      content: 'Are you sure?',
      onOk: () => {
        this.props.destroyCompany(company.id).then(() => {
          const { query, getCompanies } = this.props;
          getCompanies(query);
        });
      }
    });
  };

  expandRow = (company) => {
    const { expandedId } = this.state;

    this.setState({ expandedId: expandedId === company.id ? null : company.id });
  };

  renderCreditStatus(status) {
    if (status === 'na') { return <span>{ creditRateStatuses.na.label }</span>; }

    const { type, label } = creditRateStatuses[status];

    return (
      <span>
        <Icon icon="MdWarning" className={ `${css[type]} text-24` } />
        { label }
      </span>
    );
  }

  render() {
    const { pagination, items, can } = this.props;
    const { expandedId } = this.state;

    return (
      <Fragment>
        <div className="layout horizontal center xs-wrap mb-30 xs-mb-20 xs-mt-20">
          <div className="page-title flex xs-order-1">Companies</div>
          <Search
            className={ `mr-20 xs-order-3 xs-full-width xs-mt-25 xs-mr-0 ${css.w360}` }
            placeholder="Search company by name"
            value={ this.state.search }
            onChange={ this.onSearch }
            data-name="searchCompany"
          />
          { can && can.createCompany &&
            <ButtonLinkAdd to="/company/new" value="New Company" className="xs-order-2" />
          }
        </div>

        <ResponsiveTable
          className="table-expandable"
          rowKey="id"
          locale={ locale }
          dataSource={ items }
          pagination={ pagination }
          onChange={ this.onTableChange }
          onRow={ company => ({ onClick: () => this.expandRow(company) }) }
          expandedRowRender={ company => (
            <CompanyDetails
              company={ company }
              editURL={ `/company/${company.id}/edit` }
              onToggleStatus={ this.toggleCompanyStatus.bind(this, company) }
              onToggleNotifications={ this.toggleNotifications.bind(this, company) }
              onDestroyCompany={ this.destroyCompany.bind(this, company) }
              can={ can }
            />
          ) }
          expandedRowKeys={ [expandedId] }
          columns={ [
            { title: 'ID', dataIndex: 'id', sorter: true },
            { title: 'Type', dataIndex: 'companyType', sorter: true, render: CompanyType },
            { title: 'DDI', dataIndex: 'ddiType', filterIcon: <Icon icon="Filter" />, render: ddi => ddiLabels[ddi], filters: ddiOptions },
            { title: 'Credit Check Alert',
              dataIndex: 'creditRateStatus',
              filterIcon: <Icon icon="Filter" />,
              filters: [
                { value: 'na', text: 'N/A' },
                { value: 'green', text: 'Green' },
                { value: 'amber', text: 'Amber' },
                { value: 'red', text: 'Red' },
                { value: 'blue', text: 'Blue' }
              ],
              render: this.renderCreditStatus
            },
            { title: 'Company Name', dataIndex: 'name', sorter: true },
            { title: 'Сreation date', dataIndex: 'createdAt', render: createdAt => moment(createdAt).format('YYYY-MM-DD'), sorter: true },
            { title: 'Status', dataIndex: 'active', render: active => active ?
                <Status value="Active" /> : <Status value="Inactive" />,
              sorter: true
            }
          ] }
          mobileColumns={ [
            { title: 'Type', dataIndex: 'companyType', sorter: true, width: 55, render: CompanyType },
            { title: 'DDI', dataIndex: 'ddiType', width: 80, render: ddi => ddiLabels[ddi], filters: ddiOptions },
            { title: 'Company Name', dataIndex: 'name', sorter: true },
            { title: 'Status', dataIndex: 'active', width: 70, render: active => active ?
                <Status value="Active" small /> : <Status value="Inactive" small />,
              sorter: true
            }
          ] }
        />
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(CompaniesList);
