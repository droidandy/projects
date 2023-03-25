import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveTable } from 'components';

export default class ChangeLog extends PureComponent {
  static propTypes = {
    items: PropTypes.array,
    id: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    pagination: PropTypes.object,
    query: PropTypes.object,
    getLog: PropTypes.func
  };

  componentDidMount() {
    const { getLog, id } = this.props;

    getLog({ id });
  }

  onTableChange = () => {
    const { getLog, id, pagination } = this.props;
    const query = { id, page: pagination.current };

    getLog(query);
  };

  render() {
    const { items, pagination } = this.props;

    return (
      <div className="p-20 sm-p-10">
        <ResponsiveTable
          className="table-expandable"
          rowKey="id"
          dataSource={ items }
          pagination={ pagination }
          onChange={ this.onTableChange }
          columns={ [
            { title: 'Field Name', dataIndex: 'field', width: '8%' },
            { title: 'Author', dataIndex: 'author', width: '20%' },
            { title: 'From', dataIndex: 'from', width: '31%' },
            { title: 'To', dataIndex: 'to', width: '31%' },
            { title: 'Date & Time', dataIndex: 'datetime', width: '10%' }
          ] }
          mobileColumns={ [
            { title: 'Details',
              key: 'details',
              render: record => (
                <div>
                  <div className="mb-5">
                    <span className="bold-text mr-5">Field Name:</span>
                    { record.field }
                  </div>
                  <div className="mb-5">
                    <span className="bold-text mr-5">Author:</span>
                    { record.author }
                  </div>
                  <div className="mb-5">
                    <span className="bold-text mr-5">From:</span>
                    { record.from }
                  </div>
                  <div className="mb-5">
                    <span className="bold-text mr-5">To:</span>
                    { record.to }
                  </div>
                  <div className="mb-5">
                    <span className="bold-text mr-5">Date & Time:</span>
                    { record.datetime }
                  </div>
                </div>
              )
            }
          ] }
        />
      </div>
    );
  }
}
