import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as navigatorActions from '../redux/navigator';
import * as panelActions from '../redux/panel';
import {
  // Row,
  // Col
} from 'react-onsenui';

import SplitterButton from './Button';
import staticImage from '../staticImages';
// import Demension from '../constants';

import FooterDesktop from './FooterDesktop';

@connect((state) => ({ navigator: state.navigator, panel: state.panel, utility: state.utility }), (dispatch) => ({ actions: bindActionCreators({...navigatorActions, ...panelActions}, dispatch) }))

class HomeDesktop extends React.Component {
  constructor(props) {
    super(props);
    // this.scrollToTop = this.scrollToTop.bind(this);
    this.state = { };
  }

  render() {
    return (
      <div>
        <div id='topot' style={{width: '100%', background: 'url(' + this.props.utility.bannerImage + ')', backgroundSize: 'cover', height: '500px'}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontWeight: 600, paddingTop: '120px', paddingLeft: '70px'}} >
            <div style={{fontSize: '48px', lineHeight: '60px', color: '#fff'}} >
              CONNECT TO THE
            </div>
            <div style={{fontSize: '75px', lineHeight: '85px', color: '#fff'}} >
              ACTION Egypt
            </div>
            <div style={{display: 'flex', justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start'}}>

              <SplitterButton style={{minWidth: '180px', fontSize: '15px', lineHeight: '30px', margin: '10px', background: '#8f1922', border: 'none', cursor: 'pointer'}}
                              text='SIGN UP'
                              onClick={() => { console.log('Button click SIGN UP'); this.props.actions.pushPage(true, 'Register'); } } />
              <SplitterButton style={{minWidth: '180px', fontSize: '15px', lineHeight: '30px', margin: '10px', background: 'initial', borderColor: '#fff', borderStyle: 'solid', borderWidth: '1px', cursor: 'pointer'}}
                              text='LOG IN'
                              onClick={() => {
                                console.log('Button click LOG IN');
                                this.props.actions.pushPage(true, 'LOGIN');
                                if (this.props.utility.isMobile) {
                                  this.props.actions.changeToolbarType('back');
                                }
                              }} />

            </div>
          </div>
        </div>

        <div style={{width: '100%', backgroundColor: '#fff', minHeight: '460px'}}>
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', fontWeight: 600, padding: '70px'}}>

            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}} >
              <div style={{fontWeight: 400}} >
                <div style={{fontSize: '40px', lineHeight: '58px', color: '#000'}} >
                  JOIN ACTION
                </div>
                <div style={{fontSize: '40px', lineHeight: '58px', color: '#000'}} >
                  SPORTS COMMUNITY
                </div>
                <div style={{fontSize: '21px', lineHeight: '31px', color: '#000', fontWeight: '300'}} >
                  Find and join others as they create meaningful community around their favorite action sports. From one-time outings to consistent groups, we help connect you and get you out where the action is.
                </div>
                <div style={{display: 'flex', justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start'}}>

                  <SplitterButton style={{padding: '7px 22px', minWidth: '90px', fontSize: '15px', lineHeight: '30px', margin: '10px', background: '#8f1922', border: 'none', cursor: 'pointer'}}
                                  text='JOIN NOW'
                                  onClick={() => { console.log('Button click JOIN NOW'); this.props.actions.pushPage(true, 'Register'); } } />
                  <SplitterButton style={{padding: '7px 22px', minWidth: '90px', fontSize: '15px', lineHeight: '30px', margin: '10px', background: 'initial', color: '#9e1c26', borderColor: '#9e1c26', borderStyle: 'solid', borderWidth: '1px', cursor: 'pointer'}}
                                  text='ABOUT US'
                                  onClick={() => { console.log('Button click ABOUT US'); this.props.actions.pushPage(true, 'About'); } } />

                </div>
              </div>
            </div>
            <div style={{width: '100%', background: 'url(' + staticImage.iStock_1 + ')', backgroundSize: 'cover', backgroundPosition: '50%', minHeight: '330px'}}>
            </div>
          </div>
        </div>

        <div style={{width: '100%', backgroundColor: '#e5e5e5', minHeight: '400px', paddingTop: '30px'}}>

          <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'row'}}>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', fontWeight: 600, width: '100%', /* background: 'url(' + phone + ')', backgroundSize: 'cover', backgroundPosition: '10%',*/ minHeight: '330px'}}>
              <img src={staticImage.phone} width='400px' />
            </div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontWeight: 600}} >
              <div style={{marginBottom: '5px', fontSize: '40px', lineHeight: '45px', color: '#333333'}} >
                STAY CONNECTED
              </div>
              <div style={{marginBottom: '20px', fontSize: '40px', lineHeight: '45px', color: '#333333'}} >
                {'ONLINE & MOBILE'}
              </div>
              <div style={{fontWeight: 400, marginBottom: '20px', fontSize: '18px', lineHeight: '25px', color: '#333333', width: '85%'}} >
                With the ASC App, you have the latest action at your fingertips. Find events and groups near you, keep up on your conversation, and create new opportunities to get out with people near you.
              </div>
              <div style={{display: 'flex', width: '100%', justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', paddingTop: '5px', paddingBottom: '5px'}}>
                <div style={{marginRight: '30px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontWeight: 600, marginTop: '15px', marginBottom: '15px'}} >
                  <div style={{fontSize: '12px', lineHeight: '16px', color: '#fff', margin: '5px'}} >
                    <a href='https://www.apple.com/itunes/'><div><img src={staticImage.app_store} height='55' /></div></a>
                  </div>

                </div>

                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontWeight: 600, marginTop: '15px', marginBottom: '15px'}} >
                  <div style={{fontSize: '12px', lineHeight: '16px', color: '#fff', margin: '5px'}} >
                    <a href='https://play.google.com/'><div><img src={staticImage.android_store} height='55' /></div></a>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        <div style={{width: '100%', background: 'url(' + staticImage.iStock_2 + ')', backgroundColor: '#434343', backgroundSize: 'cover', height: '400px'}}>

          <div style={{height: '100%', display: 'flex', justifyContent: 'space-around', flexDirection: 'row', alignItems: 'flex-start', paddingTop: '70px', paddingBottom: '70px'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontWeight: 600, paddingLeft: '70px', paddingRight: '5px'}} >
              <div style={{marginBottom: '20px', fontSize: '25px', lineHeight: '30px', color: '#fff', height: 'calc(100px - 5vw)', minHeight: '30px'}} >
                LATEST COMMUNITY MEMBERS
              </div>

              <div style={{borderBottom: '1px solid #a7a7a7', borderTop: '1px solid #a7a7a7', display: 'flex', width: '100%', justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', paddingTop: '5px', paddingBottom: '5px'}}>
                <div style={{marginRight: '30px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontWeight: 600, marginTop: '15px', marginBottom: '15px'}} >
                  <div style={{fontSize: '12px', lineHeight: '16px', color: '#fff', margin: '5px'}} >
                    <div>John in Seattle, WA</div>
                    <div style={{color: '#b2b2b2'}}>Joined Jan 1</div>
                  </div>
                  <div style={{fontSize: '12px', lineHeight: '16px', color: '#fff', margin: '5px'}} >
                    <div>Susan in Chicago, IL</div>
                    <div style={{color: '#b2b2b2'}}>Joined Jan 1</div>
                  </div>
                </div>

                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontWeight: 600, marginTop: '15px', marginBottom: '15px'}} >
                  <div style={{fontSize: '12px', lineHeight: '16px', color: '#fff', margin: '5px'}} >
                    <div>Jeremiah in Orland, FL</div>
                    <div style={{color: '#b2b2b2'}}>Joined Jan 1</div>
                  </div>
                  <div style={{fontSize: '12px', lineHeight: '16px', color: '#fff', margin: '5px'}} >
                    <div>Henry in Rochester, NY</div>
                    <div style={{color: '#b2b2b2'}}>Joined Jan 1</div>
                  </div>
                </div>

              </div>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontWeight: 600, paddingRight: '70px', paddingLeft: '5px'}} >
              <div style={{marginBottom: '20px', fontSize: '25px', lineHeight: '30px', color: '#fff', height: 'calc(100px - 5vw)', minHeight: '30px'}} >
                RECENT ASC EVENTS
              </div>
              <div style={{borderBottom: '1px solid #a7a7a7', borderTop: '1px solid #a7a7a7', display: 'flex', width: '100%', justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', paddingTop: '5px', paddingBottom: '5px'}}>
                <div style={{marginRight: '30px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontWeight: 600, marginTop: '15px', marginBottom: '15px'}} >
                  <div style={{fontSize: '12px', lineHeight: '16px', color: '#fff', margin: '5px'}} >
                    <div>Mountain Biking</div>
                    <div style={{color: '#b2b2b2'}}>JDuthie Hill, WA</div>
                  </div>
                  <div style={{fontSize: '12px', lineHeight: '16px', color: '#fff', margin: '5px'}} >
                    <div>Skydiving</div>
                    <div style={{color: '#b2b2b2'}}>Snohomish, WA</div>
                  </div>
                </div>

                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontWeight: 600, marginTop: '15px', marginBottom: '15px'}} >
                  <div style={{fontSize: '12px', lineHeight: '16px', color: '#fff', margin: '5px'}} >
                    <div>Wakeboarding Lake Samm</div>
                    <div style={{color: '#b2b2b2'}}>Redmond, WA</div>
                  </div>
                  <div style={{fontSize: '12px', lineHeight: '16px', color: '#fff', margin: '5px'}} >
                    <div>Hiking Mt. Si</div>
                    <div style={{color: '#b2b2b2'}}>North Bend, WA</div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        <div style={{ width: '100%', background: '#9e1c25', padding: '60px 0' }}>
          <div style={{display: 'flex', justifyContent: 'space-around', flexDirection: 'row', alignItems: 'center'}}>
            <div style={{fontSize: '30px', lineHeight: '45px', color: '#fff', textAlign: 'center', marginLeft: '10px'}} >
              GET CONNECTED TO THE ACTION
            </div>
            <SplitterButton style={{minWidth: '180px', fontSize: '15px', lineHeight: '30px', margin: '10px', background: '#ffffff', color: '#9e1c26', borderColor: '#9e1c26', borderStyle: 'solid', borderWidth: '1px', cursor: 'pointer'}}
                            text='SIGN UP NOW'
                            onClick={() => { console.log('Button click SIGN UP NOW'); this.props.actions.pushPage(true, 'Register'); } } />
          </div>
        </div>

        <FooterDesktop />

      </div>
    );
  }
}

export default HomeDesktop;
