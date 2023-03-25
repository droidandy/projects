import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as navigatorActions from '../redux/navigator';
import * as panelActions from '../redux/panel';

import {
    // Input
} from 'react-onsenui';
import staticImage from '../staticImages';

@connect((state) => ({ navigator: state.navigator, panel: state.panel, auth: state.auth, utility: state.utility }), (dispatch) => ({ actions: bindActionCreators({...navigatorActions, ...panelActions}, dispatch) }))

class FooterDesktop extends React.Component {
  constructor(props) {
    super(props);
    // this.function1 = this.function1.bind(this);
    this.state = {
    };
  }

  scrollToTop() {
    if (document.getElementById('topot')) {
      document.getElementById('topot').scrollIntoView();
    }
  }

  render() {
    return (
      <div style={{width: '100%', backgroundColor: '#252525', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>

        <div style={{height: '100%', display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingTop: '30px', paddingBottom: '50px'}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontWeight: 600, paddingLeft: '70px', paddingRight: '5px'}} >
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}} >
              <img src={staticImage.navBarLogo} height='30' />
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', fontSize: '12px', alignItems: 'flex-start', marginLeft: '7px', lineHeight: '16px', fontWeight: 600 }}>
                  <div>ACTION SPORTS</div>
                  <div>COMMUNITY</div>
                </div>
              </div>
            </div>

            <div style={{display: 'flex', width: '100%', justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', paddingTop: '5px', paddingBottom: '5px'}}>
              <div style={{fontSize: '14px', lineHeight: '16px', color: '#fff', fontWeight: 600, marginTop: '15px', marginBottom: '15px', marginLeft: '5px', marginRight: '5px'}} >
                <div style={{cursor: 'pointer'}} onClick={() => { this.props.actions.pushPage(false, 'HOME'); }}>HOME</div>
              </div>

              <div style={{fontSize: '14px', lineHeight: '16px', color: '#fff', fontWeight: 600, marginTop: '15px', marginBottom: '15px', marginLeft: '5px', marginRight: '5px'}} >
                <div>|</div>
              </div>

              <div style={{fontSize: '14px', lineHeight: '16px', color: '#fff', fontWeight: 600, marginTop: '15px', marginBottom: '15px', marginLeft: '5px', marginRight: '5px'}} >
                <div style={{cursor: 'pointer'}} onClick={() => { this.props.actions.pushPage(false, 'Contact'); }}>CONTACT</div>
              </div>

              <div style={{fontSize: '14px', lineHeight: '16px', color: '#fff', fontWeight: 600, marginTop: '15px', marginBottom: '15px', marginLeft: '5px', marginRight: '5px'}} >
                <div>|</div>
              </div>

              <div style={{fontSize: '14px', lineHeight: '16px', color: '#fff', fontWeight: 600, marginTop: '15px', marginBottom: '15px', marginLeft: '5px', marginRight: '5px'}} >
                <div style={{cursor: 'pointer'}} onClick={() => { this.props.actions.pushPage(false, 'Register'); }}>SIGN UP</div>
              </div>

              <div style={{fontSize: '14px', lineHeight: '16px', color: '#fff', fontWeight: 600, marginTop: '15px', marginBottom: '15px', marginLeft: '5px', marginRight: '5px'}} >
                <div>|</div>
              </div>

              <div style={{fontSize: '14px', lineHeight: '16px', color: '#fff', fontWeight: 600, marginTop: '15px', marginBottom: '15px', marginLeft: '5px', marginRight: '5px'}} >
                <div style={{cursor: 'pointer'}} onClick={() => {
                  this.props.actions.pushPage(true, 'LOGIN');
                  if (this.props.utility.isMobile) {
                    this.props.actions.changeToolbarType('back');
                  }
                }} >LOG IN</div>
              </div>
            </div>

            <div style={{display: 'flex', width: '100%', justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', paddingTop: '5px', paddingBottom: '5px'}}>
              <div style={{fontSize: '12px', lineHeight: '14px', color: '#fff', fontWeight: 400, marginTop: '3px', marginBottom: '3px', marginLeft: '5px', marginRight: '5px'}} >
                <div>Copyright 2016</div>
              </div>

              <div style={{fontSize: '12px', lineHeight: '14px', color: '#fff', fontWeight: 400, marginTop: '3px', marginBottom: '3px', marginLeft: '5px', marginRight: '5px'}} >
                <div>|</div>
              </div>

              <div style={{fontSize: '12px', lineHeight: '14px', color: '#fff', fontWeight: 400, marginTop: '3px', marginBottom: '3px', marginLeft: '5px', marginRight: '5px'}} >
                <div style={{cursor: 'pointer'}} onClick={() => { this.props.actions.pushPage(false, 'HOME'); }}>Actions Sports Community</div>
              </div>

              <div style={{fontSize: '12px', lineHeight: '14px', color: '#fff', fontWeight: 400, marginTop: '3px', marginBottom: '3px', marginLeft: '5px', marginRight: '5px'}} >
                <div>|</div>
              </div>

              <div style={{fontSize: '12px', lineHeight: '14px', color: '#fff', fontWeight: 400, marginTop: '3px', marginBottom: '3px', marginLeft: '5px', marginRight: '5px'}} >
                <div style={{cursor: 'pointer'}} onClick={() => { this.props.actions.pushPage(true, 'Terms'); }}>Terms</div>
              </div>
            </div>

          </div>

          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontWeight: 600, paddingRight: '0px', paddingLeft: '5px'}} >

            <div style={{display: 'flex', width: '100%', justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', paddingTop: '5px', paddingBottom: '5px'}}>

              <div style={{fontSize: '12px', lineHeight: '16px', color: '#fff', margin: '5px'}} >
                <a href='https://www.facebook.com/'><div><img src={staticImage.fb} height='45' /></div></a>
              </div>
              <div style={{fontSize: '12px', lineHeight: '16px', color: '#fff', margin: '5px'}} >
                <a href='https://www.twitter.com/'><div><img src={staticImage.tw} height='45' /></div></a>
              </div>
              <div style={{fontSize: '12px', lineHeight: '16px', color: '#fff', marginTop: '5px', marginLeft: '50px', marginBottom: '5px', marginRight: '5px'}}
                   onClick={() => { this.scrollToTop(); } }>
                <div><img src={staticImage.top} height='45' /></div>
              </div>
            </div>
          </div>

        </div>
      </div>

    );
  }
}

export default FooterDesktop;
