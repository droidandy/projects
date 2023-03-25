import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';
import { Link } from 'react-router';
import { Grid, Card, Dropdown, Table } from 'semantic-ui-react';
import * as types from '../constants';
import { CARRIER } from '../../../config';

class BrokerVolume extends React.Component {
  static propTypes = {
    volumeGroups: PropTypes.array.isRequired,
    volumeGroup: PropTypes.string.isRequired,
    changeVolumeGroup: PropTypes.func.isRequired,
    productsList: PropTypes.array.isRequired,
    volumeProduct: PropTypes.string.isRequired,
    changeVolumeProduct: PropTypes.func.isRequired,
    groupsTotal: PropTypes.number.isRequired,
    membersTotal: PropTypes.number.isRequired,
    brokerVolume: PropTypes.array.isRequired,
  }

  render() {
    const { volumeGroups, volumeGroup, changeVolumeGroup, productsList,
            volumeProduct, changeVolumeProduct, groupsTotal, membersTotal,
            brokerVolume } = this.props;
    let states = [];
    if (volumeGroup === types.SOLD) states = [types.ON_BOARDING_STATE, types.SOLD_STATE];
    else if (volumeGroup === types.SOLD) states = [types.QUOTED_STATE, types.PENDING_APPROVAL_STATE];
    else if (volumeGroup === types.CLOSED) states = [types.CLOSED_STATE];
    else if (volumeGroup === types.ALL_GROUPS) states = [types.QUOTED_STATE, types.CLOSED, types.ON_BOARDING_STATE, types.SOLD_STATE, types.PENDING_APPROVAL_STATE];
    return (
      <Card className="card-main" fluid>
        <Card.Content>
          <Card.Header>
            Broker Volume
            <div className="header-actions">
              <Dropdown
                search
                selection
                options={volumeGroups}
                value={volumeGroup}
                onChange={(e, inputState) => { changeVolumeGroup(inputState.value); }}
              />
              <Dropdown
                search
                selection
                options={productsList}
                value={volumeProduct}
                onChange={(e, inputState) => { changeVolumeProduct(inputState.value); }}
              />
            </div>
          </Card.Header>
          <Grid>
            <Grid.Row>
              <Grid.Column tablet="8" computer="5">
                <div className="card-sub-title">{volumeGroup === types.SOLD ? 'YTD SOLD CASES' : 'Total active opportunities'}</div>
                <div className="card-count-item"><FormattedNumber value={groupsTotal} /></div>
              </Grid.Column>
              <Grid.Column tablet="8" computer="6">
                <div className="card-sub-title">{volumeGroup === types.SOLD ? 'YTD SOLD Employees' : 'Total potential Employees'}</div>
                <div className="card-count-item"><FormattedNumber value={membersTotal} /></div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width="16">
                <Table className="no-border" singleLine fixed unstackable>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell width={7} className="card-sub-title">
                        TOP BROKERAGES
                      </Table.HeaderCell>
                      <Table.HeaderCell width={4} className="card-sub-title">
                        {(CARRIER === 'ANTHEM') ? 'SAE' : 'AE'}
                      </Table.HeaderCell>
                      <Table.HeaderCell width={2} className="card-sub-title align-right">
                        GROUPS
                      </Table.HeaderCell>
                      <Table.HeaderCell width={3} className="card-sub-title align-right">
                        Employees
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    { brokerVolume.map((item, i) => {
                      if (i <= 5) {
                        return (
                          <Table.Row key={i}>
                            <Table.Cell>
                              <Link
                                to="/clients"
                                onClick={() => { this.setFilters({ brokers: [{ name: item.brokerName, id: item.brokerId }], product: volumeProduct, clientStates: states }); }}
                              >{item.brokerName}</Link>
                            </Table.Cell>
                            <Table.Cell>
                              <Link
                                to="/clients"
                                onClick={() => { this.setFilters({ sales: [{ fullName: item.salesName, id: item.salesId }], product: volumeProduct, clientStates: states }); }}
                              >{item.salesName}</Link>
                            </Table.Cell>
                            <Table.Cell className="align-right">
                              <FormattedNumber value={item.groups} />
                            </Table.Cell>
                            <Table.Cell className="align-right">
                              <FormattedNumber value={item.members} />
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
            <Grid.Row>
              <Grid.Column>
                <div className="card-bottom bordered">
                  <Link to="/clients" onClick={() => { this.setFilters({ product: volumeProduct, clientStates: states }); }}>View All</Link>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Card.Content>
      </Card>
    );
  }
}

export default BrokerVolume;
