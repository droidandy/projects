import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Grid, Header, Button, Image, Container, Transition } from 'semantic-ui-react';
import Scroller from 'react-scroll';
import messages from './messages';
import RequestDemo from '../../components/RequestDemo';
import LargeGroupImg from '../../assets/img/home-large-group.svg';

import CarrierMac from '../../assets/img/carrier-mac.png';
import CarrierMacLarge from '../../assets/img/carrier-mac@3x.png';
import RFPThumb from '../../assets/img/rfp-thumb.png';
import RFPThumbLarge from '../../assets/img/rfp-thumb@3x.png';
import DashThumb from '../../assets/img/dash-thumb-4.png';
import DashThumbLarge from '../../assets/img/dash-thumb-4@3x.png';
import AdminThumb from '../../assets/img/admin-thumb.png';
import AdminThumbLarge from '../../assets/img/admin-thumb@3x.png';
import CarrierThumb from '../../assets/img/carrier-thumb.png';
import CarrierThumbLarge from '../../assets/img/carrier-thumb@3x.png';
import BrokerThumb from '../../assets/img/brokerapp-thumb.jpg';
import BrokerThumbLarge from '../../assets/img/brokerapp-thumb@3x.jpg';
import TimelineArrow from '../../assets/img/timeline-arrow.png';
import TimelineArrowLarge from '../../assets/img/timeline-arrow@3x.png';

import TimelineDown from '../../assets/img/timeline-down.png';
import TimelineDownLarge from '../../assets/img/timeline-down@3x.png';

import Benefit1 from '../../assets/img/home-benefits-1.svg';
import Benefit2 from '../../assets/img/home-benefits-2.svg';
import Benefit3 from '../../assets/img/home-benefits-3.svg';
import Benefit4 from '../../assets/img/home-benefits-4.svg';
import Benefit5 from '../../assets/img/home-benefits-5.svg';
import Benefit6 from '../../assets/img/home-benefits-6.svg';

const Element = Scroller.Element;
const ScrollLink = Scroller.Link;

// retina or large screens
const isRetina = window.devicePixelRation > 1 || (screen.width * window.devicePixelRatio) >= 1900;

class Home extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      startAnimations: [false, false, false, false, false],
      timelineSet: false,
    };
    this.setParams = this.setParams.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.setParams);
    const animations = this.state.startAnimations;
    this.setParams();
    for (let i = 0; i < animations.length; i += 1) {
      setTimeout(() => {
        animations[i] = true;
        this.setState({ startAnimations: animations }); // eslint-disable-line
      }, i * 100);
    }
  }

  componentWillUpdate() {
    if (!this.state.timelineSet) this.setParams();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setParams);
  }

  setParams() {
    const timeline = document.getElementById('timeline-arrow').getBoundingClientRect();
    if (timeline.height === 0) {
      return;
    }
    this.setState({ timelineSet: true });
    const rfpThumb = document.getElementById('thumb-image');
    const adminThumb = document.getElementById('admin-image');
    const carrierThumb = document.getElementById('carrier-image');
    const dashboardThumb = document.getElementById('dash-image');
    const brokerThumb = document.getElementById('broker-image');
    const ball = document.getElementById('timeline-ball');
    let ratio = 0.9;
    if (window.innerWidth < 980) ratio = 1;
    rfpThumb.style.left = `${(timeline.left * ratio) - 116}px`;
    adminThumb.style.left = `${(timeline.left * ratio) - 70}px`;
    carrierThumb.style.left = `${(timeline.left * ratio) - 122}px`;
    dashboardThumb.style.left = `${(timeline.left * ratio) - 415}px`;
    brokerThumb.style.left = `${(timeline.left * ratio)}px`;
    ball.style.left = `${timeline.left + 10}px`;
  }

  render() {
    return (
      <div className="app-home">
        <div className="top">
          <Grid textAlign="center">
            <Grid.Row centered>
              <Grid.Column textAlign="center">
                <Transition animation={'fade up'} visible={this.state.startAnimations[0]}>
                  <div className="simpler"><FormattedMessage {...messages.simpler} /></div>
                </Transition>
                <Transition animation={'fade up'} visible={this.state.startAnimations[1]}>
                  <Header as="h1" className="page-header"><FormattedMessage {...messages.title} /></Header>
                </Transition>
                <Transition animation={'fade up'} visible={this.state.startAnimations[2]}>
                  <div className="page-description"><FormattedMessage {...messages.description} /></div>
                </Transition>
                <Transition animation={'fade up'} visible={this.state.startAnimations[3]}>
                  <div><Button as={ScrollLink} spy smooth duration={500} to="scroll-to-crt" inverted><FormattedMessage {...messages.demoTitle} /></Button></div>
                </Transition>
                <Transition animation={'fade up'} visible={this.state.startAnimations[4]}>
                  <Image src={isRetina ? CarrierMacLarge : CarrierMac} centered verticalAlign="bottom" />
                </Transition>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        <Grid className="bottom">
          <Grid.Row className="home-row timeline-row">
            <Grid.Column width={16}>
              <div className="corner-tab-data section-header">
                <p className="header-text"><FormattedMessage {...messages.timelineHeader} /></p>
              </div>
              <p className="center-paragraph"><FormattedMessage {...messages.timelineSubheader} /></p>
            </Grid.Column>
            <Grid.Column width={16} className="floating-timeline">
              <Image className="float" id="thumb-image" src={isRetina ? RFPThumbLarge : RFPThumb} centered verticalAlign="bottom" />
              <Image className="float delay1" id="admin-image" src={isRetina ? AdminThumbLarge : AdminThumb} centered verticalAlign="bottom" />
              <Image className="float delay2" id="carrier-image" src={isRetina ? CarrierThumbLarge : CarrierThumb} centered verticalAlign="bottom" />
              <Image className="float delay4" id="broker-image" src={isRetina ? BrokerThumbLarge : BrokerThumb} centered verticalAlign="bottom" />
              <Image className="float delay3" id="dash-image" src={isRetina ? DashThumbLarge : DashThumb} centered verticalAlign="bottom" />
              { window.innerWidth < 980 ?
                <Image id="timeline-arrow" src={isRetina ? TimelineDownLarge : TimelineDown} centered verticalAlign="bottom" />
                :
                <Image id="timeline-arrow" src={isRetina ? TimelineArrowLarge : TimelineArrow} centered verticalAlign="bottom" />
              }
              <div id="timeline-ball" />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="home-row">
            <Grid.Column textAlign="center">
              <Container>
                <div className="corner-tab-data section-header benefits-header">
                  <p className="header-text"><FormattedMessage {...messages.benefitsTitle} /></p>
                </div>
                <Grid stackable className="features">
                  <Grid.Row centered>
                    <Grid.Column computer="8" tablet="16">
                      <div className="image-wrap"><Image src={Benefit1} /></div>
                      <div className="features-text">
                        <Header as="h3"><FormattedMessage {...messages.benefits1} /></Header>
                        <div><FormattedMessage {...messages.benefits1Message} /></div>
                      </div>
                    </Grid.Column>
                    <Grid.Column computer="8" tablet="16">
                      <div className="image-wrap"><Image src={Benefit2} /></div>
                      <div className="features-text">
                        <Header as="h3"><FormattedMessage {...messages.benefits6} /></Header>
                        <div><FormattedMessage {...messages.benefits6Message} /></div>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row centered>
                    <Grid.Column computer="8" tablet="16">
                      <div className="image-wrap"><Image src={Benefit3} /></div>
                      <div className="features-text">
                        <Header as="h3"><FormattedMessage {...messages.benefits3} /></Header>
                        <div><FormattedMessage {...messages.benefits3Message} /></div>
                      </div>
                    </Grid.Column>
                    <Grid.Column computer="8" tablet="16">
                      <div className="image-wrap"><Image src={Benefit4} /></div>
                      <div className="features-text">
                        <Header as="h3"><FormattedMessage {...messages.benefits2} /></Header>
                        <div><FormattedMessage {...messages.benefits2Message} /></div>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row centered>
                    <Grid.Column computer="8" tablet="16">
                      <div className="image-wrap"><Image src={Benefit5} /></div>
                      <div className="features-text">
                        <Header as="h3"><FormattedMessage {...messages.benefits5} /></Header>
                        <div><FormattedMessage {...messages.benefits5Message} /></div>
                      </div>
                    </Grid.Column>
                    <Grid.Column computer="8" tablet="16">
                      <div className="image-wrap"><Image src={Benefit6} /></div>
                      <div className="features-text">
                        <Header as="h3"><FormattedMessage {...messages.benefits4} /></Header>
                        <div><FormattedMessage {...messages.benefits4Message} /></div>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Container>
            </Grid.Column>
          </Grid.Row>
          <div className="divider" />
          <Grid.Row className="home-row">
            <Grid.Column>
              <Container>
                <Grid stackable className="solution">
                  <Grid.Row centered>
                    <Grid.Column computer="7" tablet="16" className="solution-left">
                      <div className="corner-tab-data section-header solution-header">
                        <p className="header-text"><FormattedMessage {...messages.solutionTitle} /></p>
                      </div>
                      <p className="center-paragraph"><FormattedMessage {...messages.solutionMessage} /></p>
                    </Grid.Column>
                    <Grid.Column computer="8" tablet="16" textAlign="center">
                      <Image src={LargeGroupImg} centered verticalAlign="bottom" />
                      <div className="large-group">
                        <Header as="h2"><FormattedMessage {...messages.solutionLargeGroup} /></Header>
                        <div><FormattedMessage {...messages.solutionEmployee} /></div>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Container>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Element name="scroll-to-crt" />
        <RequestDemo />
      </div>
    );
  }
}

export default Home;
