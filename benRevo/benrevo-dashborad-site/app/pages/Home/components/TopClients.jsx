import React from 'react';
import PropTypes from 'prop-types';
import { Card, Grid, Table, Message } from 'semantic-ui-react';
import { Link } from 'react-router';
import * as types from '../constants';

class TopClients extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    clients: PropTypes.array.isRequired,
    getTopClients: PropTypes.func,
  };

  componentWillMount() {
    this.props.getTopClients();
  }

  render() {
    const { clients } = this.props;
    return (
      <Card className="card-main" fluid>
        <Card.Content>
          <Card.Header>
            Top Clients
          </Card.Header>
          <Grid>
            <Grid.Row>
              <Grid.Column width={16}>
                <Table className="no-border" singleLine fixed unstackable>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell className="card-sub-title">
                        NAME
                      </Table.HeaderCell>
                      <Table.HeaderCell className="card-sub-title align-right">
                        STATUS
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    { clients && clients.length > 0 && clients.map((item, key) => (
                      <Table.Row key={key}>
                        <Table.Cell>
                          <Link to={`/client/${item.clientId}`}>
                            {item.clientName}
                          </Link>
                        </Table.Cell>
                        <Table.Cell textAlign="right">
                          <span>{types[`${item.clientState}_NORMAL`] || '-'}</span>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
                { clients && clients.length === 0 &&
                  <Message info>
                    <Message.Header>No Top Clients Specified</Message.Header>
                    <p>Check clients in list view to mark them as a top client.</p>
                  </Message>
                }
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <div className="card-bottom bordered">
                  <Link to="/clients">View All</Link>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Card.Content>
      </Card>
    );
  }
}

export default TopClients;
