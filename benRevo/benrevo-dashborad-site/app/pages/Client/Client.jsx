import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Grid, Button, Image } from 'semantic-ui-react';
import { ACCESS_STATUS_START, ACCESS_STATUS_STOP, ACCESS_STATUS_WAITING } from './Details/constants';
import AccessImg from '../../assets/img/svg/broker-access.svg';

class Client extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: PropTypes.node,
    clientId: PropTypes.string,
    client: PropTypes.object.isRequired,
    accessStatus: PropTypes.string.isRequired,
    changeAccessStatus: PropTypes.func.isRequired,
  };

  render() {
    const { client, accessStatus, changeAccessStatus, clientId } = this.props;

    return (
      <div className="client">
        { (accessStatus === ACCESS_STATUS_STOP || accessStatus === ACCESS_STATUS_START) && clientId &&
          <div>
            {this.props.children}
          </div>
        }
        { accessStatus === ACCESS_STATUS_STOP && !clientId &&
          <Grid className="message-box">
            <Grid.Row centered>
              <Grid.Column className="message-box-top" computer="10" tablet="14" mobile="16" textAlign="center">
                <div className="message-text">
                  You are on the Quote page.<br />
                  Note: You need to choose a client and access this quote.
                </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row centered>
              <Grid.Column className="message-box-bottom" computer="10" tablet="14" mobile="16" textAlign="center">
                <Button as={Link} primary to="/clients">Choose a Client</Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        }
        { accessStatus === ACCESS_STATUS_WAITING &&
          <Grid className="message-box">
            <Grid.Row centered>
              <Grid.Column className="message-box-top" computer="10" tablet="14" mobile="16" textAlign="center">
                <Image src={AccessImg} centered />
                <div className="message-text">
                  You are viewing the quote for {client.clientName}.<br />
                  Note: Any additions or changes you make will be reflected in the Brokers account.
                </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row centered>
              <Grid.Column className="message-box-bottom" computer="10" tablet="14" mobile="16" textAlign="center" verticalAlign="middle">
                <Button as={Link} size="medium" basic to={`/client/${client.clientId}`} onClick={() => { changeAccessStatus(ACCESS_STATUS_STOP); }}>Go Back</Button>
                <Button as={Link} to={`/client/${client.clientId}/quote`} primary size="medium" onClick={() => { changeAccessStatus(ACCESS_STATUS_START); }}>I Understand</Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        }
      </div>
    );
  }
}

export default Client;
