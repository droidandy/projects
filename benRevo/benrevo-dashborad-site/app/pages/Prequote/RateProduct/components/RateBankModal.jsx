import React from 'react';
import { Grid, Button, Header } from 'semantic-ui-react';
import { Link } from 'react-router';
import moment from 'moment';


class RateBankModal extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Grid className="send-page">
        <Grid.Row>
          <Grid.Column width={16} textAlign="center">
            <Header as="h1" className="title1">Request Rate Bank</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16} textAlign="center">
            <div className="top-divider" />
            <div className="send-icon" />
            <div className="send-title">Quote has been sent to the Broker</div>
            <div className="send-date"> on {moment(new Date()).format('MMMM Do YYYY, h:mm:ss a')}</div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row centered>
          <Grid.Column computer={12} tablet={16}>
            <div className="send-message">
              <div className="send-message-title">What happens next:</div>
              <ul>
                <li>Your manager will receive a rate bank request email</li>
                <li>The SAR, SAE, business analyst and rater will all be included on the email</li>
                <li>If approved, you can update the quoted rates by revisiting the Upload Quote section</li>
              </ul>
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row centered>
          <Grid.Column computer={5} tablet={16} mobile={16}>
            <Button as={Link} to="/prequote/clients" primary size="big" fluid>{'<'} Back to Clients</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  }

export default RateBankModal;
