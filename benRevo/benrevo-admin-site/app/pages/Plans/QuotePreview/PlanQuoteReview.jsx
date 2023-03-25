import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Header, Button, Table } from 'semantic-ui-react';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import QuotePreviewItem from './components/QuotePreviewItem';

class QuotePreview extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    currentBroker: PropTypes.object.isRequired,
    selectedClient: PropTypes.object.isRequired,
    quotePreview: PropTypes.object.isRequired,
  };

  render() {
    const { currentBroker, selectedClient, section, quotePreview } = this.props;
    return (
      <div>
        <Grid stackable container className="plans-review section-wrap">
          <Grid.Row>
            <Grid.Column width={16}>
              <Helmet
                title="Review"
                meta={[
                { name: 'description', content: 'Description of Review' },
                ]}
              />
              <Button as={Link} to="/client/plans/quote" primary size="medium" className="back">Back to Summary</Button>
              <Grid stackable as={Segment} className="gridSegment">

                <Grid.Row className="header-second">
                  <Header as="h1">{currentBroker.name} - {selectedClient.clientName}</Header>
                </Grid.Row>
                <Grid.Row className="header-main">
                  <Header as="h2">{section} - Preview Changes</Header>
                  <div className="divider" />
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={16}>
                    <div />
                    <Table className="data-table column-strip" unstackable>
                      <Table.Header>
                        <Table.Row className="data-table-head">
                          <Table.HeaderCell width="2">Plan</Table.HeaderCell>
                          <Table.HeaderCell width="2">Status</Table.HeaderCell>
                          <Table.HeaderCell>Tier 1 (FROM)</Table.HeaderCell>
                          <Table.HeaderCell>Tier 1 (TO)</Table.HeaderCell>
                          <Table.HeaderCell>Tier 2 (FROM)</Table.HeaderCell>
                          <Table.HeaderCell>Tier 2 (TO)</Table.HeaderCell>
                          <Table.HeaderCell>Tier 3 (FROM)</Table.HeaderCell>
                          <Table.HeaderCell>Tier 3 (TO)</Table.HeaderCell>
                          <Table.HeaderCell>Tier 4 (FROM)</Table.HeaderCell>
                          <Table.HeaderCell>Tier 4 (TO)</Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                      { quotePreview.newPlans &&
                        <Table.Body>
                          { quotePreview.changedPlans.length > 0 && quotePreview.changedPlans.map((item, i) =>
                            <QuotePreviewItem key={i} data={item} title="Rate change" />
                          )}
                          { quotePreview.removedPlans.length > 0 && quotePreview.removedPlans.map((item, i) =>
                            <QuotePreviewItem key={i} data={item} title="Deleted plan" />
                          )}
                          { quotePreview.newPlans.length > 0 && quotePreview.newPlans.map((item, i) =>
                            <QuotePreviewItem key={i} data={item} title="New plan" />
                          )}
                        </Table.Body>
                      }
                    </Table>
                    { !quotePreview.newPlans &&
                    <div className="empty">You have no plans for preview</div>
                    }
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <Button as={Link} to="/client/plans/quote" primary size="medium" className="back">Back to Summary</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default QuotePreview;
