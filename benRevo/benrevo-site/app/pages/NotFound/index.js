import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Grid, Header, Image, Container } from 'semantic-ui-react';
import messages from './messages';
import MainImg from '../../assets/img/common-main.svg';

class NotFound extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="app-notfound">
        <div className="top">
          <Grid>
            <Grid.Row>
              <Grid.Column textAlign="center">
                <Header as="h1" className="page-header"><FormattedMessage {...messages.title} /></Header>
                <Image src={MainImg} centered verticalAlign="bottom" />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        <Grid className="bottom">
          <Grid.Row className="home-row">
            <Grid.Column>
              <Container>
                <Grid stackable className="benefits">
                  <Grid.Row centered>
                    <Grid.Column width={13} textAlign="center" verticalAlign="middle">
                      <Header as="h1"><FormattedMessage {...messages.message} /></Header>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Container>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default NotFound;
