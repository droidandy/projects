import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as navigatorActions from '../redux/navigator';
import * as panelActions from '../redux/panel';
import {
  Page// ,
  // Row,
  // Col
} from 'react-onsenui';

import Section from './Section';
import SectionItem from './SectionItem';
import ToolbarMobile from './ToolbarMobile';

// import HomeTablet from './HomeTablet';
import SplitterButton from './Button';
import staticImage from '../staticImages';

@connect((state) => ({ navigator: state.navigator, panel: state.panel, utility: state.utility, auth: state.auth }), (dispatch) => ({ actions: bindActionCreators({...navigatorActions, ...panelActions}, dispatch) }))

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.renderToolbar = this.renderToolbar.bind(this);
    this.state = { };
  }
  renderToolbar() {
    return (
      this.props.utility.isMobile
        ? <ToolbarMobile />
        : null
    );
  }

  render() {
    return (
      this.props.auth.isLogin
      ? <Page renderToolbar={this.renderToolbar}>
          <Section title={'FEED'}
                   icon={'list-ul, material:list-ul'}
              />
          <SectionItem leftIcon={'calendar-minus-o, material:calendar-minus-o'}
                       rightIcon={'ion-android-star-outline, material:ion-android-star-outline'}
                       rigthAction={() => { console.log('SectionItem1 click'); }}
                       title={'Item Title Jan 1 Item Title Jan 1 Item Title Jan 1 '}
                       label={'Jan 1 | Location Name '}
              />
          <SectionItem leftIcon={'user, material:user'}
                       rightIcon={'ion-android-star-outline, material:ion-android-star-outline'}
                       rigthAction={() => { console.log('SectionItem2 click'); }}
                       title={'New User in Bothell'}
                       label={'Jan 1'}
              />
          <SectionItem leftIcon={'users, material:users'}
                       rightIcon={'ion-android-star-outline, material:ion-android-star-outline'}
                       rigthAction={() => { console.log('SectionItem3 click'); }}
                       title={'New Groups in Bothell'}
                       label={'Sport Category'}
              />
          <Section title={'MY EVENTS'}
                   icon={'list-ul, material:list-ul'}
                   fabAction={() => { console.log('section2 click'); }}
                   fabIcon={'ion-plus, material:ion-plus'}
              />
          <SectionItem leftIcon={'calendar-minus-o, material:calendar-minus-o'}
                       rightIcon={'ion-edit, material:ion-edit'}
                       rigthAction={() => { console.log('SectionItem EVENTS click'); }}
                       title={'Item Title '}
                       label={'Jan 1 | Location Name '}
              />
          <SectionItem leftIcon={'calendar-minus-o, material:calendar-minus-o'}
                       rightIcon={'ion-edit, material:ion-edit'}
                       rigthAction={() => { console.log('SectionItem EVENTS click'); }}
                       title={'Item Title '}
                       label={'Jan 1 | Location Name '}
              />
          <SectionItem leftIcon={'calendar-minus-o, material:calendar-minus-o'}
                       rightIcon={'ion-edit, material:ion-edit'}
                       rigthAction={() => { console.log('SectionItem EVENTS click'); }}
                       title={'Item Title '}
                       label={'Jan 1 | Location Name '}
              />
          <Section title={'MY INBOX'}
                   icon={'list-ul, material:list-ul'}
                   fabAction={() => { console.log('section3 click'); }}
                   fabIcon={'ion-plus, material:ion-plus'}
              />
        </Page>
      : <Page renderToolbar={this.renderToolbar}>
          <div>
            <div id='topot' className='homeMobile__header' style={{backgroundImage: `url(${this.props.utility.bannerImage})`}}>
              <div className='homeMobile__header__container'>
                <div className='homeTablet__header__connect'>
                  CONNECT TO THE
                </div>
                <div className='homeTablet__header__action'>
                  ACTION
                </div>
                <div className='homeMobile__header__buttonCol'>

                  <SplitterButton className='homeTablet__header__button homeTablet__header__button__signup'
                                  text='SIGN UP'
                                  onClick={() => {
                                    console.log('Button click SIGN UP');
                                    this.props.actions.pushPage(true, 'Register');
                                    this.props.actions.changeToolbarType('back');
                                  } } />
                  <SplitterButton className='homeTablet__header__button homeTablet__header__button__login'
                                  text='LOG IN'
                                  onClick={() => {
                                    console.log('Button click LOG IN');
                                    this.props.actions.pushPage(true, 'LOGIN');
                                    this.props.actions.changeToolbarType('back');
                                  } } />
                </div>
              </div>
            </div>

            <div className='homeMobile__join__container' >
              <div className='homeTablet__join__container__text' >
                  <div className='homeMobile__join__container__text__headline' >
                    JOIN THE ACTION SPORTS COMMUNITY
                  </div>
                  <div className='homeMobile__join__container__text__body' >
                    Find and join others as they create meaningful community around their favorite action sports. From one-time outings to consistent groups, we help connect you and get you out where the action is.
                  </div>
                  <div className='homeMobile__join__container__buttons' >

                    <SplitterButton className='homeTablet__join__container__button homeTablet__join__container__button__signup'
                                    text='JOIN NOW'
                                    onClick={() => { console.log('Button click JOIN NOW'); this.props.actions.pushPage(true, 'Register'); } } />
                    <SplitterButton className='homeTablet__join__container__button homeTablet__join__container__button__login'
                                    text='ABOUT US'
                                    onClick={() => { console.log('Button click ABOUT US'); this.props.actions.pushPage(true, 'About'); } } />
                  </div>
              </div>
            </div>

            <div className='homeTablet__join__image' style={{backgroundImage: `url(${staticImage.iStock_1})`}} ></div>

            {
              !this.props.utility.isDevice
              ? <div className='homeMobile__stayConnected__container' >

                  <div className='homeMobile__stayConnected__text' >
                    <div className='homeMobile__stayConnected__text__headline' >
                      STAY CONNECTED
                    </div>
                    <div className='homeMobile__stayConnected__text__headline' >
                      ONLINE & MOBILE
                    </div>
                    <div className='homeTablet__stayConnected__text__body' >
                      With the ASC App, you have the latest action at your fingertips. Find events and groups near you, keep up on your conversation, and create new opportunities to get out with people near you.
                    </div>
                    <div className='homeMobile__stayConnected__imgButtons' >
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

                  <div className='homeMobile__stayConnected__image' >
                    <img src={staticImage.phone} width='300px' />
                  </div>

              </div>
              : null
            }

            <div className='homeTablet__recentActivity'
              style={{backgroundImage: `url(${staticImage.iStock_2})`}}>

              <div className='homeTablet__recentActivity__container__column' >
                <div className='homeMobile__recentActivity__container__column__headline' >
                  LATEST COMMUNITY MEMBERS
                </div>

                <div className='homeMobile__recentActivity__container__column__body' >
                  <div className='homeMobile__recentActivity__container__column__body__left' >
                    <div className='homeTablet__recentActivity__container__column__body__text' >
                      <div>John in Seattle, WA</div>
                      <div className='homeTablet__recentActivity__container__column__body__text__date'>Joined Jan 1</div>
                    </div>
                    <div className='homeTablet__recentActivity__container__column__body__text' >
                      <div>Susan in Chicago, IL</div>
                      <div className='homeTablet__recentActivity__container__column__body__text__date'>Joined Jan 1</div>
                    </div>
                  </div>

                  <div className='homeMobile__recentActivity__container__column__body__right' >
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
              </div>

              <div className='homeTablet__recentActivity__container__column' >
                  <div className='homeMobile__recentActivity__container__column__headline' >
                    RECENT ASC EVENTS
                  </div>
                  <div className='homeMobile__recentActivity__container__column__body' >
                    <div className='homeMobile__recentActivity__container__column__body__left' >
                      <div className='homeTablet__recentActivity__container__column__body__text' >
                        <div>Mountain Biking</div>
                        <div className='homeTablet__recentActivity__container__column__body__text__date'>JDuthie Hill, WA</div>
                      </div>
                      <div className='homeTablet__recentActivity__container__column__body__text' >
                        <div>Skydiving</div>
                        <div className='homeTablet__recentActivity__container__column__body__text__date'>Snohomish, WA</div>
                      </div>
                    </div>

                    <div className='homeMobile__recentActivity__container__column__body__right' >
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

            </div>

            <div className='homeTablet__getConnected' >
              <div className='homeMobile__getConnected__container' >
                <div className='homeMobile__getConnected__text' >
                  GET CONNECTED TO THE ACTION
                </div>
                <SplitterButton className='homeTablet__header__button homeTablet__getConnected__button'
                                text='SIGN UP NOW'
                                onClick={() => { console.log('Button click SIGN UP NOW'); this.props.actions.pushPage(true, 'Register'); } } />
              </div>
            </div>

            {/* <FooterDesktop />*/}

          </div>
        </Page>
    );
  }
}

export default Home;
