import React from 'react';
import PropTypes from 'prop-types';
import { Card, Dropdown, Grid, Loader, Table } from 'semantic-ui-react';
import { Link } from 'react-router';
import { getColorProbability } from './../../../utils/getColor';
import { HIGH, MEDIUM, LOW } from '../constants';

class AtRisk extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    productsList: PropTypes.array.isRequired,
    clients: PropTypes.array.isRequired,
    product: PropTypes.string.isRequired,
    getClients: PropTypes.func.isRequired,
    riskLoading: PropTypes.bool.isRequired,
    setFilters: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { getClients, product } = this.props;
    getClients(product);
  }

  render() {
    const { productsList, clients, product, getClients, riskLoading, setFilters } = this.props;
    const sortedClients = clients.sort((a, b) => {
      if (a.probability === b.probability) {
        return 0;
      }
      if (a.probability === LOW || (a.probability === MEDIUM && b.probability !== LOW) || (a.probability === HIGH && b.probability !== LOW && b.probability !== MEDIUM)) {
        return -1;
      }
      return 1;
    }).splice(0, 5);
    return (
      <Card className="card-main" fluid>
        <Card.Content>
          <Card.Header>
            At Risk
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
                        PROBABILITY
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    { !riskLoading && sortedClients && sortedClients.length > 0 && sortedClients.map((item, key) => (
                      <Table.Row key={key}>
                        <Table.Cell>
                          <Link to={`/client/${item.clientId}`}>
                            {item.clientName}
                          </Link>
                        </Table.Cell>
                        <Table.Cell textAlign="right">
                          <span style={{ color: getColorProbability(item.probability) }}>{item.probability || '-'}</span>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </Grid.Column>
            </Grid.Row>
            { riskLoading &&
              <Grid.Row>
                <Grid.Column>
                  <Loader active={riskLoading} />
                </Grid.Column>
              </Grid.Row>
            }
            { !riskLoading && sortedClients && sortedClients.length > 0 &&
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

export default AtRisk;
