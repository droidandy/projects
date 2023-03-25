import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Dimmer, Loader, Segment, Button, Header, Table, Input, Icon } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import Helmet from 'react-helmet';

class CreateAccounts extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    currentBroker: PropTypes.object.isRequired,
    selectedClient: PropTypes.object.isRequired,
    next: PropTypes.func.isRequired,
    createAccounts: PropTypes.func.isRequired,
    createAccountsSuccess: PropTypes.bool.isRequired,
    clientTeam: PropTypes.array.isRequired,
  }

  render() {
    const { currentBroker, selectedClient, next, createAccounts, createAccountsSuccess, clientTeam } = this.props;
    const clientTeamReady = clientTeam.every((x) => x.authId);
    return (
      <div className="create-accounts">
        <Helmet
          title="Team Accounts"
          meta={[
            { name: 'description', content: 'Create Client Team Accounts' },
          ]}
        />
        <Grid stackable as={Segment} className="gridSegment">
          <Grid.Row className="header-second">
            <Header as="h1">{currentBroker.name} - {selectedClient.clientName}</Header>
          </Grid.Row>
          <Grid.Row className="header-main">
            <Header as="h2">Create Accounts for Client Team</Header>
            <div className="divider" />
          </Grid.Row>
          <Grid.Row className="table-row">
            <p>Accounts will be created for emails in client list that don&apos;t yet have an authID associated with them.</p>
          </Grid.Row>
          <Grid.Row centered className="table-row">
            <Grid.Column width={6}>
              <Button size="big" primary disabled={createAccountsSuccess || clientTeamReady} onClick={() => { createAccounts(selectedClient.id); }}>Create Client Accounts</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10} only="computer">
            </Grid.Column>
            <Grid.Column tablet={16} computer={6}>
              <Button primary size="big" onClick={() => { next(); }}>Continue</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default CreateAccounts;
