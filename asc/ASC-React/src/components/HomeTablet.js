import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as navigatorActions from '../redux/navigator';
import * as panelActions from '../redux/panel';
import {
  Row,
  Col
} from 'react-onsenui';

import SplitterButton from './Button';
import staticImage from '../staticImages';

import FooterDesktop from './FooterDesktop';

@connect((state) => ({ navigator: state.navigator, panel: state.panel, utility: state.utility }), (dispatch) => ({ actions: bindActionCreators({...navigatorActions, ...panelActions}, dispatch) }))

class HomeTablet extends React.Component {
  constructor(props) {
    super(props);
    // this.scrollToTop = this.scrollToTop.bind(this);
    this.state = { };
  }

  render() {
    return (
      <div>
        <div id='topot' className='homeTablet__header' style={{backgroundImage: `url(${this.props.utility.bannerImage})`}}>
          <div className='homeTablet__header__container'>
            <div className='homeTablet__header__connect'>
              CONNECT TO THE
            </div>
            <div className='homeTablet__header__action'>
              ACTION
            </div>
            <div className='homeTablet__header__buttonRow'>

              <SplitterButton className='homeTablet__header__button homeTablet__header__button__signup'
                              text='SIGN UP'
                              onClick={() => { console.log('Button click SIGN UP'); this.props.actions.pushPage(true, 'Register'); } } />
              <SplitterButton className='homeTablet__header__button homeTablet__header__button__login'
                              text='LOG IN'
                              onClick={() => { console.log('Button click LOG IN'); this.props.actions.pushPage(true, 'LOGIN'); } } />
            </div>
          </div>
        </div>

        <div className='homeTablet__join__container' >
          <div className='homeTablet__join__container__inner' >

            <div className='homeTablet__join__container__text' >
                <div className='homeTablet__join__container__text__headline' >
                  JOIN THE ACTION
                </div>
                <div className='homeTablet__join__container__text__headline' >
                  SPORTS COMMUNITY
                </div>
                <div className='homeTablet__join__container__text__body' >
                  Find and join others as they create meaningful community around their favorite action sports. From one-time outings to consistent groups, we help connect you and get you out where the action is.
                </div>
                <div className='homeTablet__join__container__buttons' >

                  <SplitterButton className='homeTablet__join__container__button homeTablet__join__container__button__signup'
                                  text='JOIN NOW'
                                  onClick={() => { console.log('Button click JOIN NOW'); this.props.actions.pushPage(true, 'Register'); } } />
                  <SplitterButton className='homeTablet__join__container__button homeTablet__join__container__button__login'
                                  text='ABOUT US'
                                  onClick={() => { console.log('Button click ABOUT US'); this.props.actions.pushPage(true, 'About'); } } />
                </div>
            </div>
          </div>
        </div>

        <div className='homeTablet__join__image' style={{backgroundImage: `url(${staticImage.iStock_1})`}} ></div>

        {
          !this.props.utility.isDevice
          ? <div className='homeTablet__stayConnected__container' >

              <div className='homeTablet__stayConnected__image' >
                <img src={staticImage.phone} width='300px' />
              </div>
              <div className='homeTablet__stayConnected__text' >
                <div className='homeTablet__stayConnected__text__headline' >
                  STAY CONNECTED
                </div>
                <div className='homeTablet__stayConnected__text__headline' >
                  ONLINE & MOBILE
                </div>
                <div className='homeTablet__stayConnected__text__body' >
                  With the ASC App, you have the latest action at your fingertips. Find events and groups near you, keep up on your conversation, and create new opportunities to get out with people near you.
                </div>
                <div className='homeTablet__stayConnected__imgButtons' >
                  <div className='homeTablet__stayConnected__imgButton' >
                    <div className='homeTablet__stayConnected__imgButton__inner' >
                      <a href='https://www.apple.com/itunes/'><div><img src={staticImage.app_store} height='55' /></div></a>
                    </div>

                  </div>

                  <div className='homeTablet__stayConnected__imgButton' >
                    <div className='homeTablet__stayConnected__imgButton__inner' >
                      <a href='https://play.google.com/'><div><img src={staticImage.android_store} height='55' /></div></a>
                    </div>
                  </div>

                </div>
              </div>

          </div>
        : null
      }

        <div className='homeTablet__recentActivity'
          style={{backgroundImage: `url(${staticImage.iStock_2})`}}>

            <Row className='homeTablet__recentActivity__container' >
              <Col width='50%' className='homeTablet__recentActivity__container__column' >
                <div className='homeTablet__recentActivity__container__column__headline' >
                  LATEST COMMUNITY MEMBERS
                </div>

                <div className='homeTablet__recentActivity__container__column__body' >
                  <div className='homeTablet__recentActivity__container__column__body__left' >
                    <div className='homeTablet__recentActivity__container__column__body__text' >
                      <div>John in Seattle, WA</div>
                      <div className='homeTablet__recentActivity__container__column__body__text__date'>Joined Jan 1</div>
                    </div>
                    <div className='homeTablet__recentActivity__container__column__body__text' >
                      <div>Susan in Chicago, IL</div>
                      <div className='homeTablet__recentActivity__container__column__body__text__date'>Joined Jan 1</div>
                    </div>
                  </div>

                  <div className='homeTablet__recentActivity__container__column__body__right' >
                    <div className='homeTablet__recentActivity__container__column__body__text' >
                      <div>Jeremiah in Orland, FL</div>
                      <div className='homeTablet__recentActivity__container__column__body__text__date'>Joined Jan 1</div>
                    </div>
                    <div className='homeTablet__recentActivity__container__column__body__text' >
                      <div>Henry in Rochester, NY</div>
                      <div className='homeTablet__recentActivity__container__column__body__text__date'>Joined Jan 1</div>
                    </div>
                  </div>

                </div>
              </Col>

              <Col width='50%'>
                <div className='homeTablet__recentActivity__container__column' >
                  <div className='homeTablet__recentActivity__container__column__headline' >
                    RECENT ASC EVENTS
                  </div>
                  <div className='homeTablet__recentActivity__container__column__body' >
                    <div className='homeTablet__recentActivity__container__column__body__left' >
                      <div className='homeTablet__recentActivity__container__column__body__text' >
                        <div>Mountain Biking</div>
                        <div className='homeTablet__recentActivity__container__column__body__text__date'>JDuthie Hill, WA</div>
                      </div>
                      <div className='homeTablet__recentActivity__container__column__body__text' >
                        <div>Skydiving</div>
                        <div className='homeTablet__recentActivity__container__column__body__text__date'>Snohomish, WA</div>
                      </div>
                    </div>

                    <div className='homeTablet__recentActivity__container__column__body__right' >
                      <div className='homeTablet__recentActivity__container__column__body__text' >
                        <div>Wakeboarding Lake Samm</div>
                        <div className='homeTablet__recentActivity__container__column__body__text__date'>Redmond, WA</div>
                      </div>
                      <div className='homeTablet__recentActivity__container__column__body__text' >
                        <div>Hiking Mt. Si</div>
                        <div className='homeTablet__recentActivity__container__column__body__text__date'>North Bend, WA</div>
                      </div>
                    </div>

                  </div>
                </div>
              </Col>
            </Row>

        </div>

        <div className='homeTablet__getConnected' >
          <div className='homeTablet__getConnected__container' >
            <div className='homeTablet__getConnected__text' >
              GET CONNECTED TO THE ACTION
            </div>
            <SplitterButton className='homeTablet__header__button homeTablet__getConnected__button'
                            text='SIGN UP NOW'
                            onClick={() => { console.log('Button click SIGN UP NOW'); this.props.actions.pushPage(true, 'Register'); } } />
          </div>
        </div>

        <FooterDesktop />

      </div>
    );
  }
}

export default HomeTablet;
