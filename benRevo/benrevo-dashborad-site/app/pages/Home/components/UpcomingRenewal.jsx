import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router';
import { Card, Dropdown, Grid, Loader, Table } from 'semantic-ui-react';
import { getDate } from '../../../utils/query';

class UpcomingRenewal extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    productsList: PropTypes.array.isRequired,
    clients: PropTypes.array.isRequired,
    product: PropTypes.string.isRequired,
    getClients: PropTypes.func.isRequired,
    upcomingLoading: PropTypes.bool.isRequired,
    setFilters: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { getClients, product } = this.props;
    getClients(product);
  }

  render() {
    const { productsList, clients, upcomingLoading, product, getClients, setFilters } = this.props;
    const sortedClients = clients.sort((a, b) => {
      if (!a.effectiveDate && b.effectiveDate) {
        return 1;
      }
      if (a.effectiveDate && !b.effectiveDate) {
        return -1;
      }
      return a.effectiveDate - b.effectiveDate;
    }).splice(0, 5);
    return (
      <Card className="card-main" fluid>
        <Card.Content>
          <Card.Header>
            Upcoming Renewal
            <div className="header-actions">
              <Dropdown
                search
                selection
                options={productsList}
                value={product}
                onChange={(e, inputState) => { getClients(inputState.value); }}
              />
            </div>
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
                        EFFECTIVE DATE
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    { !upcomingLoading && sortedClients && sortedClients.length > 0 && sortedClients.map((item, key) => (
                      <Table.Row key={key}>
                        <Table.Cell>
                          <Link to={`/client/${item.clientId}`}>
                            {item.clientName}
                          </Link>
                        </Table.Cell>
                        <Table.Cell textAlign="right">
                          { item.effectiveDate ?
                            <span
                              style={moment(new Date(item.effectiveDate)) < moment(new Date()) ? { color: '#d16152' } : {}}
                            >{getDate(item.effectiveDate)}</span> : '-'
                          }
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </Grid.Column>
            </Grid.Row>
            { upcomingLoading &&
              <Grid.Row>
                <Grid.Column>
                  <Loader active={upcomingLoading} />
                </Grid.Column>
              </Grid.Row>
            }
            { !upcomingLoading && sortedClients && sortedClients.length > 0 &&
              <Grid.Row>
                <Grid.Column>
                  <div className="card-bottom bordered">
                    <Link to="/clients" onClick={() => { setFilters({ product }); }}>View All</Link>
                  </div>
                </Grid.Column>
              </Grid.Row>
            }
          </Grid>
        </Card.Content>
      </Card>
    );
  }
}

export default UpcomingRenewal;
