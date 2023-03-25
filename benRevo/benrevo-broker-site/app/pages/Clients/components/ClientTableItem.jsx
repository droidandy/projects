import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button } from 'semantic-ui-react';
import { Link } from 'react-router';
import { getInitials } from '../../../utils/query';

export class ClientTableItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    item: PropTypes.object.isRequired,
  };

  render() {
    const { item } = this.props;
    let members = '';
    item.clientMembers.forEach((member, i) => {
      members += member.fullName;
      if (i < item.clientMembers.length - 1) members += ', ';
    });

    return (
      <Table.Row name={item.clientName}>
        <Table.Cell>
          <span className="client-initials">{getInitials(item.clientName)}</span>
          <Link to={`/clients/${item.id}`}>{item.clientName}</Link>
        </Table.Cell>
        <Table.Cell>{item.effectiveDate}</Table.Cell>
        <Table.Cell>{item.clientState}</Table.Cell>
        <Table.Cell width={4}>{members}</Table.Cell>
        <Table.Cell>
          <Button color="grey" size="medium" as={Link} fluid to={`/clients/${item.id}`}>View</Button>
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default ClientTableItem;
