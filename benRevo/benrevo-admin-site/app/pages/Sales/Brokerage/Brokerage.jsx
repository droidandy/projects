import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Grid, Dimmer, Loader, Segment, Header, Table, Dropdown, Button } from 'semantic-ui-react';
import SelectPerson from './components/SelectPerson';

class Brokerage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    saving: PropTypes.bool.isRequired,
    changeBrokerage: PropTypes.func.isRequired,
    updateBrokerage: PropTypes.func.isRequired,
    saveBrokerage: PropTypes.func.isRequired,
    brokerages: PropTypes.array.isRequired,
    sales: PropTypes.array.isRequired,
    presales: PropTypes.array.isRequired,
    brokerage: PropTypes.object.isRequired,
  };

  render() {
    const { loading, saving, brokerages, brokerage, changeBrokerage, sales, presales, updateBrokerage, saveBrokerage } = this.props;
    const showItems = (!loading || brokerages.length > 0) && brokerage.id;

    return (
      <div className="brokerage">
        <Helmet
          title="Sales/Presales - Brokerage"
          meta={[
            { name: 'description', content: 'Sales/Presales - Brokerage' },
          ]}
        />
        <Grid stackable as={Segment} className="gridSegment top-segment">
          <Grid.Row className="header-main">
            <Header as="h2">Edit Brokerage</Header>
            <div className="divider" />
          </Grid.Row>
          <Grid.Row className="table-row">
            <Dimmer active={loading && !brokerages.length} inverted>
              <Loader indeterminate size="big">Getting sales and presales</Loader>
            </Dimmer>
          </Grid.Row>
          { (!loading || brokerages.length > 0) &&
          <Grid.Row>
            <Grid.Column width="4">
              <div className="header3">Brokerage</div>
            </Grid.Column>
            <Grid.Column width="12">
              <Table className="data-table basic" unstackable>
                <Table.Header>
                  <Table.Row className="data-table-head">
                    <Table.HeaderCell width="8"><div className="header3">Select the BROKERAGE</div></Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row className="data-table-body">
                    <Table.Cell verticalAlign="top">
                      <Grid>
                        <Grid.Row>
                          <Grid.Column width="8">
                            <Dropdown
                              placeholder="Choose"
                              search
                              selection
                              options={brokerages}
                              value={brokerage.id}
                              onChange={(e, inputState) => { changeBrokerage(inputState.value); }}
                            />
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Grid.Column>
          </Grid.Row>
          }

          { showItems &&
          <Grid.Row>
            <div className="divider" />
          </Grid.Row>
          }

          { showItems &&
          <SelectPerson
            title="Sales"
            list={sales}
            brokerage={brokerage}
            itemKey={'salesEmail'}
            updateBrokerage={updateBrokerage}
          />
          }

          { showItems &&
          <Grid.Row>
            <div className="divider" />
          </Grid.Row>
          }

          { showItems &&
          <SelectPerson
            title="PreSales"
            list={presales}
            brokerage={brokerage}
            itemKey={'presalesEmail'}
            updateBrokerage={updateBrokerage}
          />
          }
        </Grid>
        { showItems &&
        <Grid stackable as={Segment} className="gridSegment">
          <Grid.Row className="header-main">
            <Header as="h2">Save Changes</Header>
            <div className="divider" />
          </Grid.Row>
          <Grid.Row>
            <Table className="data-table" unstackable>
              <Table.Header>
                <Table.Row className="data-table-head">
                  <Table.HeaderCell width="5">Type</Table.HeaderCell>
                  <Table.HeaderCell />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row className="data-table-body">
                  <Table.Cell width="5" verticalAlign="top">Persons</Table.Cell>
                  <Table.Cell verticalAlign="middle">
                    <div className="buttons-list">
                      <Button
                        disabled={!brokerage.presalesEmail || !brokerage.salesEmail}
                        size="big"
                        color="orange"
                        className="upload-separate not-link-button"
                        primary
                        onClick={saveBrokerage}
                      >Save
                      </Button>
                    </div>
                    <Loader inline active={saving} />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Row>
        </Grid>
        }
      </div>
    );
  }
}

export default Brokerage;
