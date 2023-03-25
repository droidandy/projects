import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Grid, Header, Image, Container, Button } from 'semantic-ui-react';
import Scroller from 'react-scroll';
import messages from './messages';
import RequestDemo from '../../components/RequestDemo';
import MainImg from '../../assets/img/carriers-main.svg';
import ProcessImg from '../../assets/img/carrier-process.svg';

import CarrierMac from '../../assets/img/carrier-mac.png';
import MatchDetails from '../../assets/img/match-details.png';
import ManagerDashboard from '../../assets/img/mgr-dashboard.png';
import CarrierMacLarge from '../../assets/img/carrier-mac@3x.png';
import MatchDetailsLarge from '../../assets/img/match-details@3x.png';
import ManagerDashboardLarge from '../../assets/img/mgr-dashboard@3x.png';

// retina or large screens
const isRetina = window.devicePixelRation > 1 || (screen.width * window.devicePixelRatio) >= 1900;

const Element = Scroller.Element;
const ScrollLink = Scroller.Link;

class Carriers extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <div className="app-carriers">
        <div className="top">
          <Grid>
            <Grid.Row>
              <Grid.Column textAlign="center">
                <Header as="h1" className="page-header"><FormattedMessage {...messages.titleBenrevo} /><FormattedMessage {...messages.titleCarrier} /></Header>
                <div className="page-description"><FormattedMessage {...messages.description} /></div>
                <div>
                  <Button as={ScrollLink} spy smooth duration={500} to="scroll-to-crt" inverted><FormattedMessage {...messages.demoTitle} /></Button>
                </div>
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
                    <div className="center-row-header">
                      <FormattedMessage {...messages.technologyHeaderMessage} />
                    </div>
                  </Grid.Row>
                  <Grid.Row centered>
                    <Grid.Column width="16" verticalAlign="middle" textAlign="center">
                      <Image src={ProcessImg} centered verticalAlign="bottom" className="benrevo-center" />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Container>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="mac-row">
            <Grid.Column width={16}>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={16} className="mac-row-header" textAlign="center">
                    <div className="header-text"><FormattedMessage {...messages.macRowHeaderMessage} /></div>
                    <div className="sub-header-text"><FormattedMessage {...messages.macRowHeaderSubMessage} /></div>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column computer={7} tablet={16}>
                    <Image src={isRetina ? CarrierMacLarge : CarrierMac} centered verticalAlign="bottom" className="carrier-mac" />
                  </Grid.Column>
                  <Grid.Column computer={9} tablet={16}>
                    <Grid className="snippets">
                      <Grid.Row>
                        <Grid.Column width={7} className="snippet-column">
                          <div className="snippet-header"><FormattedMessage {...messages.infoHeader1} /></div>
                          <div className="snippet-paragraph"><FormattedMessage {...messages.infoParagraph1} /></div>
                          <div className="snippet-header"><FormattedMessage {...messages.infoHeader2} /></div>
                          <div className="snippet-paragraph"><FormattedMessage {...messages.infoParagraph2} /></div>
                          <div className="snippet-header"><FormattedMessage {...messages.infoHeader3} /></div>
                          <div className="snippet-paragraph"><FormattedMessage {...messages.infoParagraph3} /></div>
                        </Grid.Column>
                        <Grid.Column width={7} className="snippet-column">
                          <div className="snippet-header"><FormattedMessage {...messages.infoHeader4} /></div>
                          <div className="snippet-paragraph"><FormattedMessage {...messages.infoParagraph4} /></div>
                          <div className="snippet-header"><FormattedMessage {...messages.infoHeader5} /></div>
                          <div className="snippet-paragraph"><FormattedMessage {...messages.infoParagraph5} /></div>
                          <div className="snippet-header"><FormattedMessage {...messages.infoHeader6} /></div>
                          <div className="snippet-paragraph"><FormattedMessage {...messages.infoParagraph6} /></div>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="screenshots-row">
            <Grid.Column width={8} className="screenshot-column">
              <div className="corner-tab-data">
                <p className="header-text"><FormattedMessage {...messages.dashboardHeader} /></p>
                <p><FormattedMessage {...messages.dashboardDescription} /></p>
              </div>
              <div>
                <ul>
                  <li><FormattedMessage {...messages.dashboardText1} /></li>
                  <li><FormattedMessage {...messages.dashboardText2} /></li>
                  <li><FormattedMessage {...messages.dashboardText3} /></li>
                </ul>
              </div>
            </Grid.Column>
            <Grid.Column width={8} className="screenshot-column image-column">
              <Image src={isRetina ? ManagerDashboardLarge : ManagerDashboard} centered verticalAlign="bottom" className="mgr-dashboard" />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="screenshots-row screenshots-row-bottom" reversed="tablet">
            <Grid.Column width={8} className="screenshot-column image-column">
              <Image src={isRetina ? MatchDetailsLarge : MatchDetails} centered verticalAlign="bottom" className="match-details" />
            </Grid.Column>
            <Grid.Column width={8} className="screenshot-column">
              <div className="corner-tab-data">
                <p className="header-text"><FormattedMessage {...messages.internalMatchHeader} /></p>
                <p><FormattedMessage {...messages.internalMatchSubHeader} /></p>
              </div>
              <div>
                <ul>
                  <li><FormattedMessage {...messages.internalMatchText1} /></li>
                  <li><FormattedMessage {...messages.internalMatchText2} /></li>
                </ul>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Element name="scroll-to-crt" />
        <RequestDemo />
      </div>
    );
  }
}

export default Carriers;
