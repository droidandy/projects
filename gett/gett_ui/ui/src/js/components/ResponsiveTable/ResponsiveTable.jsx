import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import { Tablet } from 'components';
import MediaQuery from 'react-responsive';

const phoneBreakPoint =  768;

const defaultLocale = {
  emptyText: 'No results found'
};

export default class ResponsiveTable extends Component {
  static propTypes = {
    columns: PropTypes.array,
    tabletColumns: PropTypes.array,
    mobileColumns: PropTypes.array,
    pagination: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    locale: PropTypes.object
  };

  setTableRef = table => this.table = table;

  dropSort() {
    this.table.setState({ sortColumn: null, sortOrder: null });
  }

  renderTable(columns, pagination, tableProps) {
    return (
      <Table
        ref={ this.setTableRef }
        columns={ columns }
        { ...tableProps }
        pagination={ pagination }
      />
    );
  }

  render() {
    const { columns, tabletColumns, mobileColumns, locale, pagination, ...rest } = this.props;
    const tableLocale = { ...defaultLocale, ...locale };
    const tableProps = { locale: tableLocale, ...rest };

    return (
      <MediaQuery maxWidth={ phoneBreakPoint - 1 }>
        { (match) => {
          return match
            ? this.renderTable(mobileColumns, pagination, tableProps)
            : (
              <Tablet>
                { (match) => {
                  return match
                    ? this.renderTable(tabletColumns || mobileColumns, pagination, tableProps)
                    : this.renderTable(columns, pagination, tableProps);
                }}
              </Tablet>
            );
        }}
      </MediaQuery>
    );
  }
}
