import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Grid, Container, Image, Button, Modal } from 'semantic-ui-react';
import Scroller from 'react-scroll';
import Carousel from 'nuka-carousel';
import messages from './messages';
import RequestDemo from '../../components/RequestDemo';
import ArrowRightImg from '../../assets/img/brokers-arrow-right.svg';
import ArrowDownImg from '../../assets/img/brokers-arrow-down.svg';

import MainImg from '../../assets/img/broker-laptop.png';
import BrokerMatch from '../../assets/img/broker-match.png';
import Cards from '../../assets/img/cards.png';
import IPad from '../../assets/img/ipad.png';
import FinSum from '../../assets/img/finsum.png';
import AMed from '../../assets/img/amed.png';
import MedDetails from '../../assets/img/med-details.png';
import ADental from '../../assets/img/adental.png';
import AVision from '../../assets/img/avision.png';

import MainImgLarge from '../../assets/img/broker-laptop@3x.png';
import BrokerMatchLarge from '../../assets/img/broker-match@3x.png';
import CardsLarge from '../../assets/img/cards@3x.png';
import IPadLarge from '../../assets/img/ipad@3x.png';
import FinSumLarge from '../../assets/img/finsum@3x.png';
import AMedLarge from '../../assets/img/amed@3x.png';
import MedDetailsLarge from '../../assets/img/med-details@3x.png';
import ADentalLarge from '../../assets/img/adental@3x.png';
import AVisionLarge from '../../assets/img/avision@3x.png';

import Video from '../../assets/video/BenRevo.mp4';

// retina or large screens
const isRetina = window.devicePixelRation > 1 || (screen.width * window.devicePixelRatio) >= 1900;

const Element = Scroller.Element;
const ScrollLink = Scroller.Link;

export default class BrokerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
    };
    this.handleBgChange = this.handleBgChange.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  handleBgChange = (index) => {
    const defaultClasses = 'computer reversed row slideshow-row';
    if (index === 0) {
      document.getElementById('slideshow-row').className = `${defaultClasses} background1`;
    } else if (index === 1 || index === 3) {
      document.getElementById('slideshow-row').className = `${defaultClasses} background2`;
    } else if (index === 2 || index === 4) {
      document.getElementById('slideshow-row').className = `${defaultClasses} background3`;
    }
  };

  toggleModal() {
    this.setState({ modalOpen: !this.state.modalOpen });
  }

  render() {
    return (
      <div className="app-brokers">
        <div className="top">
          <Grid stackable>
            <Grid.Row>
              <Grid.Column computer="9" tablet="16" className="left-top">
                <div>
                  <div className="broker-page-header"><FormattedMessage {...messages.title} /></div>
                  <div className="broker-page-description"><FormattedMessage {...messages.description} /></div>
                  <div>
                    <Button as={ScrollLink} spy smooth duration={500} to="scroll-to-crt" inverted><FormattedMessage {...messages.demoTitle} /></Button>
                    <Button inverted onClick={this.toggleModal}><FormattedMessage {...messages.playButtonTitle} /></Button>
                  </div>
                </div>
              </Grid.Column>
              <Grid.Column computer="7" tablet="16" textAlign="center">
                <Image className="hero-image" src={isRetina ? MainImgLarge : MainImg} centered verticalAlign="bottom" />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        <Grid className="software-row" stackable>
          <Grid.Row className="home-row">
            <Grid.Column>
              <Container>
                <Grid stackable>
                  <Grid.Row centered>
                    <div className="software-row-header">
                      <FormattedMessage {...messages.message} />
                    </div>
                  </Grid.Row>
                  <Grid.Row centered reversed="computer">
                    <Grid.Column computer="6" tablet="16">
                      <div className="corner-tab-data">
                        <p className="header-text"><FormattedMessage {...messages.efficiencyTitle} /></p>
                        <p><FormattedMessage {...messages.efficiencyParagraph1} /></p>
                      </div>
                      <div className="corner-tab-data effeciency-two">
                        <p className="header-text"><FormattedMessage {...messages.efficiencyTitle2} /></p>
                        <p><FormattedMessage {...messages.efficiencyParagraph2} /></p>
                      </div>
                    </Grid.Column>
                    <Grid.Column computer="1" tablet="16" className="efficiency-spacing" />
                    <Grid.Column computer="8" tablet="16">
                      <Image onClick={this.toggleModal} src={isRetina ? BrokerMatchLarge : BrokerMatch} className="efficiency-image" />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Container>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="gray quote-row">
            <div className="blend-background" />
            <Grid.Column className="quote-container">
              <p className="quote-text"><span className="quote left-quote">“</span><FormattedMessage {...messages.userQuote} /><span className="quote right-quote">“</span></p>
              <p><FormattedMessage {...messages.userQuoteInfo} /></p>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="simplify-row home-row">
            <Grid.Column computer="5" tablet="16" className="left-simplify">
              <div className="corner-tab-data">
                <p className="header-text"><FormattedMessage {...messages.simplifyTitle} /></p>
                <p><FormattedMessage {...messages.simplifyParagraph} /></p>
              </div>
            </Grid.Column>
            <Grid.Column computer="7" tablet="16">
              <Image className="card-image" src={isRetina ? CardsLarge : Cards} centered />
            </Grid.Column>
            <Grid.Column width="2" tablet="16" />
          </Grid.Row>
          <Grid.Row className="slideshow-row background1" id="slideshow-row" reversed="computer">
            <Grid.Column computer="7" tablet="16">
              <p className="header-text"><FormattedMessage {...messages.slideShowHeader1} /></p>
              <p><FormattedMessage {...messages.slideShow1} /></p>
            </Grid.Column>
            <Grid.Column computer="1" tablet="16" />
            <Grid.Column computer="6" tablet="16" textAlign="center">
              <Image className="ipad-image" src={isRetina ? IPadLarge : IPad} centered verticalAlign="bottom" />
              <Carousel
                autoplay
                wrapAround
                renderCenterLeftControls={() => null}
                renderCenterRightControls={() => null}
                width="70%"
                framePadding="0 10px 0 0"
                beforeSlide={this.handleBgChange}
              >
                <div>
                  <Image className="slideshow-img" src={isRetina ? FinSumLarge : FinSum} centered verticalAlign="bottom" />
                </div>
                <div>
                  <Image className="slideshow-img" src={isRetina ? AMedLarge : AMed} centered verticalAlign="bottom" />
                </div>
                <div>
                  <Image className="slideshow-img" src={isRetina ? MedDetailsLarge : MedDetails} centered verticalAlign="bottom" />
                </div>
                <div>
                  <Image className="slideshow-img" src={isRetina ? ADentalLarge : ADental} centered verticalAlign="bottom" />
                </div>
                <div>
                  <Image className="slideshow-img" src={isRetina ? AVisionLarge : AVision} centered verticalAlign="bottom" />
                </div>
              </Carousel>
            </Grid.Column>
            <Grid.Column computer="2" tablet="16" />
          </Grid.Row>
          <Grid.Row className="home-row">
            <Grid.Column>
              <Container>
                <Grid stackable>
                  <Grid.Row centered className="solution-row ">
                    <Grid.Column width="13" textAlign="center">
                      <div className="corner-tab-data">
                        <p className="header-text"><FormattedMessage {...messages.solutionTitle} /></p>
                      </div>
                      <p className="solution-paragraph"><FormattedMessage {...messages.solutionMessage} /></p>
                      <Grid stackable className="solution">
                        <Grid.Row centered columns="5">
                          <Grid.Column className="solution-item">
                            <div className="solution-index">1</div>
                            <FormattedMessage {...messages.solution1} />
                            <Image className="solution-arrow-right" src={ArrowRightImg} />
                            <Image className="solution-arrow-down" src={ArrowDownImg} />
                          </Grid.Column>
                          <Grid.Column className="solution-item">
                            <div className="solution-index">2</div>
                            <FormattedMessage {...messages.solution2} />
                            <Image className="solution-arrow-right" src={ArrowRightImg} />
                            <Image className="solution-arrow-down" src={ArrowDownImg} />
                          </Grid.Column>
                          <Grid.Column className="solution-item">
                            <div className="solution-index">3</div>
                            <FormattedMessage {...messages.solution3} />
                            <Image className="solution-arrow-right" src={ArrowRightImg} />
                            <Image className="solution-arrow-down" src={ArrowDownImg} />
                          </Grid.Column>
                          <Grid.Column className="solution-item">
                            <div className="solution-index">4</div>
                            <FormattedMessage {...messages.solution4} />
                            <Image className="solution-arrow-right" src={ArrowRightImg} />
                            <Image className="solution-arrow-down" src={ArrowDownImg} />
                          </Grid.Column>
                          <Grid.Column className="solution-item">
                            <div className="solution-index">5</div>
                            <FormattedMessage {...messages.solution5} />
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Container>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Element name="scroll-to-crt" />
        <RequestDemo />
        <Modal
          open={this.state.modalOpen}
          onClose={this.toggleModal}
          size="small"
          closeOnDimmerClick={false}
          closeIcon
        >
          <video width="100%" height="100%" controls autoPlay={this.state.modalOpen}>
            <source src={Video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Modal>
      </div>
    );
  }
}
