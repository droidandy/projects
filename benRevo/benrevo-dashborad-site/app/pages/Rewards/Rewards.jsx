import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Card, Table, Loader, Dimmer } from 'semantic-ui-react';
import { getDate } from '../../utils/query';

class Rewards extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    rewards: PropTypes.array.isRequired,
    getRewards: PropTypes.func.isRequired,
    sort: PropTypes.object.isRequired,
    changeSort: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { getRewards, rewards } = this.props;
    if (!rewards.length) getRewards();
  }

  render() {
    const {
      changeSort,
      loading,
      rewards,
      sort,
    } = this.props;

    return (
      <div className="rewards-page">
        <Header className="page-title">Rewards</Header>
        <Grid>
          <Grid.Row>
            <Grid.Column width="16">
              <Card className="card-main" fluid>
                <Card.Content>
                  { !loading && <Grid>
                    <Grid.Row>
                      <Grid.Column width="16">
                        <Table sortable celled singleLine fixed unstackable>
                          <Table.Header>
                            <Table.Row>
                              <Table.HeaderCell
                                className={(sort.prop !== 'recipientName') ? 'sort-inactive' : ''}
                                sorted={(sort.prop === 'recipientName') ? sort.order : 'ascending'}
                                onClick={() => { changeSort('recipientName'); }}
                              >
                                Recipient Name
                              </Table.HeaderCell>
                              <Table.HeaderCell
                                className={(sort.prop !== 'clientName') ? 'sort-inactive' : ''}
                                sorted={(sort.prop === 'clientName') ? sort.order : 'ascending'}
                                onClick={() => { changeSort('clientName'); }}
                              >
                                Client Name
                              </Table.HeaderCell>
                              <Table.HeaderCell
                                className={(sort.prop !== 'requestDate') ? 'sort-inactive' : ''}
                                sorted={(sort.prop === 'requestDate') ? sort.order : 'ascending'}
                                onClick={() => { changeSort('requestDate'); }}
                              >
                                Date Rewards Requested
                              </Table.HeaderCell>
                              <Table.HeaderCell
                                textAlign="center"
                                className={(sort.prop !== 'pointsTotal') ? 'sort-inactive' : ''}
                                sorted={(sort.prop === 'pointsTotal') ? sort.order : 'ascending'}
                                onClick={() => { changeSort('pointsTotal'); }}
                              >
                                Total Points Received
                              </Table.HeaderCell>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {rewards.length > 0 && rewards.map((recipient, l) => {
                              const { clients } = recipient;
                              return (
                                clients.map((item, i) => {
                                  return (
                                    <Table.Row className={i > 0 ? 'row-span' : ''} key={i}>
                                      { i === 0 && <Table.Cell width={4} verticalAlign="top" textAlign="left" rowSpan={clients.length}>
                                        {recipient.recipientName}
                                      </Table.Cell> }
                                      <Table.Cell>
                                        {item.clientName}
                                      </Table.Cell>
                                      <Table.Cell>
                                        {getDate(item.requestDate)}
                                      </Table.Cell>
                                      <Table.Cell>
                                        {item.pointsTotal}
                                      </Table.Cell>
                                    </Table.Row>
                                  )}
                                )
                              )}
                            )}
                          </Table.Body>
                        </Table>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid> }
                  { loading &&
                  <Loader inline active={loading} indeterminate size="big">Fetching rewards</Loader>
                  }
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Rewards;
