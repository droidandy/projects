import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

class QuotePreviewItem extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    data: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
  };

  render() {
    const { data, title } = this.props;
    const getValue = (value) => {
      if (value) {
        return (
          <span>${ value }</span>
        );
      }

      return <span> - </span>;
    };

    return (
      <Table.Row className="data-table-body" verticalAlign="top">
        <Table.Cell>
          {data.planName}
        </Table.Cell>
        <Table.Cell>
          {title}
        </Table.Cell>
        <Table.Cell>
          {getValue(data.currentRates[0])}
        </Table.Cell>
        <Table.Cell>
          {getValue(data.newRates[0])}
        </Table.Cell>
        <Table.Cell>
          {getValue(data.currentRates[1])}
        </Table.Cell>
        <Table.Cell>
          {getValue(data.newRates[1])}
        </Table.Cell>
        <Table.Cell>
          {getValue(data.currentRates[2])}
        </Table.Cell>
        <Table.Cell>
          {getValue(data.newRates[2])}
        </Table.Cell>
        <Table.Cell>
          {getValue(data.currentRates[3])}
        </Table.Cell>
        <Table.Cell>
          {getValue(data.newRates[3])}
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default QuotePreviewItem;
