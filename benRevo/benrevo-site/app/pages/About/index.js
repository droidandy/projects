import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Grid, Header, Image, Container } from 'semantic-ui-react';
import messages from './messages';
import RequestDemo from '../../components/RequestDemo';
import MainImg from '../../assets/img/dark-main-bg.svg';
import JimsonImg from '../../assets/img/jimson.png';
import OjasImg from '../../assets/img/ojas.png';
import JasonImg from '../../assets/img/jason.png';

class About extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const Persons = ({ only }) => <Grid.Column width="6" only={only}>
      <div className={`person jimson ${only}`}>
        <Image src={JimsonImg} centered />
        <Header className="person-name"><FormattedMessage {...messages.jimson} /></Header>
        <Header className="person-title"><FormattedMessage {...messages.jimsonTitle} /></Header>
      </div>
      <div className={`person ojas ${only}`}>
        <Image src={OjasImg} centered />
        <Header className="person-name"><FormattedMessage {...messages.ojas} /></Header>
        <Header className="person-title"><FormattedMessage {...messages.ojasTitle} /></Header>
      </div>
      <div className={`person jason ${only}`}>
        <Image src={JasonImg} centered />
        <Header className="person-name"><FormattedMessage {...messages.jason} /></Header>
        <Header className="person-title"><FormattedMessage {...messages.jasonTitle} /></Header>
      </div>
    </Grid.Column>;

    return (
      <div className="app-about">
        <div className="top">
          <Grid>
            <Grid.Row>
              <Grid.Column textAlign="center">
                <Header as="h1" className="page-header white"><FormattedMessage {...messages.title} /></Header>
                <Image src={MainImg} centered verticalAlign="bottom" />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        <Grid className="bottom">
          <Grid.Row className="home-row">
            <Grid.Column>
              <Container>
                <Grid stackable className="team">
                  <Grid.Row centered>
                    <Persons only={'computer'} />
                    <Persons only={'tablet'} />
                    <Grid.Column width="7">
                      <p><FormattedMessage {...messages.paragraph1} /></p>
                      <p><FormattedMessage {...messages.paragraph2} /></p>
                    </Grid.Column>
                    <Persons only={'mobile'} />
                  </Grid.Row>
                </Grid>
              </Container>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <RequestDemo />
      </div>
    );
  }
}

export default About;
