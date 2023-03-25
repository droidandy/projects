import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Header, Button, Table, Loader } from 'semantic-ui-react';
import Helmet from 'react-helmet';

class Decline extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    declineQuote: PropTypes.func.isRequired,
    declineApprove: PropTypes.func.isRequired,
    currentBroker: PropTypes.object.isRequired,
    selectedClient: PropTypes.object.isRequired,
    loadingDeclineApprove: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.declineQuote = this.declineQuote.bind(this);
  }

  declineQuote(category) {
    this.props.declineQuote({ category });
  }

  render() {
    const {
      currentBroker,
      selectedClient,
      loadingDeclineApprove,
    } = this.props;

    const uploadRow = (category) => <Table.Row className="data-table-body">
      <Table.Cell verticalAlign="top">
        <div>{category}</div>
      </Table.Cell>
      <Table.Cell textAlign="right" verticalAlign="top">
        <Button onClick={() => { this.declineQuote(category); }} size="medium" className="upload-separate not-link-button" primary>Decline</Button>
      </Table.Cell>
    </Table.Row>;

    return (
      <div className="plans-submit">
        <Helmet
          title="Decline"
          meta={[
            { name: 'description', content: 'Description of Decline' },
          ]}
        />

        <Grid stackable as={Segment} className="gridSegment" verticalAlign="middle">
          <Grid.Row className="header-second">
            <Header as="h1">{currentBroker.name} - {selectedClient.clientName}</Header>
          </Grid.Row>
          <Grid.Row className="header-main">
            <Header as="h2">Decline to Quote</Header>
            <div className="divider" />
          </Grid.Row>
          <Grid.Row>
            <div />
            <Table className="data-table" unstackable>
              <Table.Header>
                <Table.Row className="data-table-head">
                  <Table.HeaderCell width="5">Product</Table.HeaderCell>
                  <Table.HeaderCell width="11" />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {uploadRow('medical')}
                {uploadRow('dental')}
                {uploadRow('vision')}
              </Table.Body>
            </Table>
          </Grid.Row>
        </Grid>

        <Grid stackable as={Segment} className="gridSegment">
          <Grid.Row className="header-main">
            <Header as="h2">Decline approval request</Header>
            <div className="divider" />
          </Grid.Row>
          <Grid.Row>
            <div />
            <Table className="data-table" unstackable>
              <Table.Header>
                <Table.Row className="data-table-head">
                  <Table.HeaderCell width="5">To</Table.HeaderCell>
                  <Table.HeaderCell width="2">Date</Table.HeaderCell>
                  <Table.HeaderCell />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row className="data-table-body" verticalAlign="top">
                  <Table.Cell>
                    <div>{currentBroker.name} -</div>
                    <div>{selectedClient.clientName}</div>
                  </Table.Cell>
                  <Table.Cell>
                    { !loadingDeclineApprove && <span>N/A</span> }
                    <Loader inline active={loadingDeclineApprove} />
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      className="not-link-button"
                      disabled={(selectedClient.clientState !== 'PENDING_APPROVAL' && selectedClient.clientState !== 'ON_BOARDING') || loadingDeclineApprove}
                      primary
                      size="big"
                      color="orange"
                      onClick={this.props.declineApprove}
                    >Decline</Button>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Decline;
