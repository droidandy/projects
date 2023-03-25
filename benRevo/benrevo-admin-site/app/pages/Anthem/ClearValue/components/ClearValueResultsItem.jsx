import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

class ClearValueResultsItem extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    data: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    rfpQuoteNetwork: PropTypes.string,
  };

  render() {
    const { data, title, index, rfpQuoteNetwork } = this.props;
    return (
      <Table.Row className="data-table-body" verticalAlign="top">
        <Table.Cell className="tableCell title">
          { index === 0 && title}
        </Table.Cell>
        <Table.Cell className="tableCell rfpQuoteNetwork">
          { index === 0 && rfpQuoteNetwork}
        </Table.Cell>
        <Table.Cell className="tableCell">
          {data.planName}
        </Table.Cell>
        <Table.Cell className="tableCell">
          {data.tier1Rate}
        </Table.Cell>
        <Table.Cell className="tableCell">
          {data.tier2Rate}
        </Table.Cell>
        <Table.Cell className="tableCell">
          {data.tier3Rate}
        </Table.Cell>
        <Table.Cell className="tableCell">
          {data.tier4Rate}
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default ClearValueResultsItem;
