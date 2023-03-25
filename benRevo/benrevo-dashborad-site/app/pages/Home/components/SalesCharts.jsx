import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';
import { Link } from 'react-router';
import { Grid, Card, Dropdown, Table } from 'semantic-ui-react';
import Chart from './Chart';

class SalesCharts extends React.Component {
  static propTypes = {
    volumeGroups: PropTypes.array.isRequired,
    volumeGroup: PropTypes.string.isRequired,
    changeVolumeGroup: PropTypes.func.isRequired,
    brokerVolume: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    chart: PropTypes.object.isRequired,
    clients: PropTypes.array.isRequired,
    filters: PropTypes.object.isRequired,
    changeFilter: PropTypes.func.isRequired,
    getClients: PropTypes.func.isRequired,
    productsList: PropTypes.array.isRequired,
    setFilters: PropTypes.func.isRequired,
    maxDiff: PropTypes.number.isRequired,
    minDiff: PropTypes.number.isRequired,
    clearFilter: PropTypes.func.isRequired,
    filterCarriers: PropTypes.array.isRequired,
    filterBrokerages: PropTypes.array.isRequired,
    filterSales: PropTypes.array.isRequired,
  };

  render() {
    const { volumeGroups, volumeGroup, changeVolumeGroup, brokerVolume, loading,
            chart, clients, filters, changeFilter, getClients,
             productsList, setFilters, clearFilter } = this.props;
    return (
      <Grid stackable className="sales-view">
        <Grid.Row>
          <Grid.Column computer="5" tablet="7" stretched>
            <Card className="card-main" fluid>
              <Card.Content>
                <Card.Header>
                  Brokerages
                  <div className="header-actions">
                    <Dropdown
                      search
                      selection
                      options={volumeGroups}
                      value={volumeGroup}
                      onChange={(e, inputState) => { changeVolumeGroup(inputState.value); }}
                    />
                  </div>
                </Card.Header>
                <Grid>
                  <Grid.Row>
                    <Grid.Column width="16">
                      <Table className="no-border" singleLine fixed unstackable>
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell width={12} className="card-sub-title">
                              TOP BROKERAGES
                            </Table.HeaderCell>
                            <Table.HeaderCell width={4} className="card-sub-title align-right">
                              ACTIVE
                              <br />GROUPS
                            </Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          { brokerVolume.map((item, i) => {
                            if (i <= 13) {
                              return (
                                <Table.Row key={i}>
                                  <Table.Cell>
                                    <Link to="/clients" onClick={() => { this.setFilters({ brokers: [{ name: item.brokerName, id: item.brokerId }] }); }}>{item.brokerName}</Link>
                                  </Table.Cell>
                                  <Table.Cell className="align-right">
                                    <FormattedNumber value={item.groups} />
                                  </Table.Cell>
                                </Table.Row>
                              );
                            }
                            return null;
                          })}
                        </Table.Body>
                      </Table>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column computer="11" tablet="9" stretched>
            { chart &&
              <Chart
                loading={loading}
                chart={chart}
                clients={clients}
                filters={filters}
                changeFilter={changeFilter}
                getClients={getClients}
                products={productsList}
                setFilters={setFilters}
                maxDiff={this.props.maxDiff}
                minDiff={this.props.minDiff}
                clearFilter={clearFilter}
                filterCarriers={this.props.filterCarriers}
                filterBrokerages={this.props.filterBrokerages}
                filterSales={this.props.filterSales}
              />
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default SalesCharts;
