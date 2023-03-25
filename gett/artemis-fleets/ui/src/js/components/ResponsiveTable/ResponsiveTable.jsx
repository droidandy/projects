import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import { Desktop } from 'components';

const defaultLocale = {
  emptyText: 'No results found'
};

export default class ResponsiveTable extends PureComponent {
  static propTypes = {
    columns: PropTypes.array,
    mobileColumns: PropTypes.array,
    pagination: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    locale: PropTypes.object
  };

  render() {
    const { columns, mobileColumns, locale, pagination, ...rest } = this.props;
    const tableLocale = { ...defaultLocale, ...locale };
    const tableProps = { locale: tableLocale, ...rest };

    return (
      <Desktop>
        { matches => (
          <Table
            columns={ matches ? columns : mobileColumns }
            { ...tableProps }
            pagination={ pagination && { ...pagination, size: matches ? '' : 'small' } }
          />
        ) }
      </Desktop>
    );
  }
}
