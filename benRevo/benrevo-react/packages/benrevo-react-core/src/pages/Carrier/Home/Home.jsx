import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Image, Card, Button } from 'semantic-ui-react';
import Round1 from './../../../assets/img/svg/1.svg';
import Round2 from './../../../assets/img/svg/2.svg';
import Round3 from './../../../assets/img/svg/3.svg';
import messages from './../messages';


class Home extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    profile: PropTypes.object,
  };

  render() {
    const { profile } = this.props;
    return (
      <div className="carrier-home">
        <div className="carrierHeader">
          <Header sub>Welcome {profile.name},</Header>
          <span>Thank you for working with UnitedHealthcare for your insurance needs.</span>
        </div>
        <Grid className="carrierGrid">
          <Grid.Row columns={3}>
            <Grid.Column>
              <Card className="carrierCard">
                <Card.Content>
                  <Card.Header>{messages.presentation.defaultMessage.toUpperCase()}</Card.Header>
                  <div className="imgBlock">
                    <Image src={Round1} size='medium' shape='circular' />
                  </div>
                  <Card.Description>Tools that will help them effectively navigate through the purchasing process in order to make.</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Button primary>View {messages.presentation.defaultMessage}</Button>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column>
              <Card className="carrierCard">
                <Card.Content>
                  <Card.Header>{messages.questionaire.defaultMessage.toUpperCase()}</Card.Header>
                  <div className="imgBlock">
                    <Image src={Round2} size='medium' shape='circular' />
                  </div>
                  <Card.Description>Tools that will help them effectively navigate through the purchasing process in order to make.</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Button>View {messages.questionaire.defaultMessage}</Button>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column>
              <Card className="carrierCard">
                <Card.Content>
                  <Card.Header>{messages.timeline.defaultMessage.toUpperCase()}</Card.Header>
                  <div className="imgBlock">
                    <Image src={Round3} size='medium' shape='circular' />
                  </div>
                  <Card.Description>Tools that will help them effectively navigate through the purchasing process in order to make.</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Button>View {messages.timeline.defaultMessage}</Button>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Home;
