import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as navigatorActions from '../redux/navigator';

import Tabs, { TabPane } from 'rc-tabs';
import TabContent from 'rc-tabs/lib/TabContent';
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar';

// import {Tabs, Tab} from 'material-ui/Tabs';
// import Slider from 'material-ui/Slider';

import SplitterButton from './Button';
import '../css/rc-tabs.css';

@connect((state) => ({ ...state }), (dispatch) => ({ actions: bindActionCreators({...navigatorActions}, dispatch) }))

class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.selectedChange = this.selectedChange.bind(this);
    this.callback = this.callback.bind(this);
    this.state = {
    };
  }
  callback(key) {
    console.log(key);
  }
  selectedChange() {
  }
  componentDidMount() {
  }
  componentWillUnmount() {
  }
  render() {
    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
        {/*
      <Tabs>
        <Tab label='Item One' >
          <div>
            <h2 style={{fontSize: 24, paddingTop: 16, marginBottom: 12, fontWeight: 400}}>Tab One</h2>
            <p>
              This is an example tab.
            </p>
            <p>
              You can put any sort of HTML or react component in here. It even keeps the component state!
            </p>
          </div>
        </Tab>
        <Tab label='Item Two' >
          <div>
            <h2 style={{fontSize: 24, paddingTop: 16, marginBottom: 12, fontWeight: 400}}>Tab Two</h2>
            <p>
              This is another example tab.
            </p>
          </div>
        </Tab>
        <Tab label='Item Three' >
          <div>
            <h2 style={{fontSize: 24, paddingTop: 16, marginBottom: 12, fontWeight: 400}}>Tab Three</h2>
            <p>
              This is another example tab.
            </p>
          </div>
        </Tab>
        <Tab label='Item One' >
          <div>
            <h2 style={{fontSize: 24, paddingTop: 16, marginBottom: 12, fontWeight: 400}}>Tab One</h2>
            <p>
              This is an example tab.
            </p>
            <p>
              You can put any sort of HTML or react component in here. It even keeps the component state!
            </p>
          </div>
        </Tab>
        <Tab label='Item Two' >
          <div>
            <h2 style={{fontSize: 24, paddingTop: 16, marginBottom: 12, fontWeight: 400}}>Tab Two</h2>
            <p>
              This is another example tab.
            </p>
          </div>
        </Tab>
        <Tab label='Item Three' >
          <div>
            <h2 style={{fontSize: 24, paddingTop: 16, marginBottom: 12, fontWeight: 400}}>Tab Three</h2>
            <p>
              This is another example tab.
            </p>
          </div>
        </Tab>
      </Tabs> */
       }
        <div id='topot' style={{width: '100%', background: '#b2b2b2', backgroundSize: 'cover', minHeight: '250px', backgroundPosition: '50%'}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontWeight: 600, paddingTop: '120px', paddingLeft: '20px', paddingBottom: '75px'}} >
            <div style={{fontSize: '25px', lineHeight: '30px', color: '#373936'}} >
              {'MOST POPULAR /'}
            </div>
            <div style={{fontSize: '25px', lineHeight: '30px', color: '#373936'}} >
              PROMOTED ITEM
            </div>
            <div style={{display: 'flex', justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start'}}>

              <SplitterButton style={{minWidth: '110px', fontSize: '15px', lineHeight: '30px', margin: '10px 10px 10px 0', background: '#8f1922', border: 'none', cursor: 'pointer'}}
                              text='BUY NOW'
                              onClick={() => { console.log('BUY NOW'); } } />
            </div>
          </div>
        </div>

        {

          <Tabs
              defaultActiveKey='2'
              onChange={this.callback}
              renderTabBar={() => <ScrollableInkTabBar />}
              renderTabContent={() => <TabContent />}
              >
            <TabPane tab='tab 1' key='1'>first</TabPane>
            <TabPane tab='tab 2' key='2'>second</TabPane>
            <TabPane tab='tab 3' key='3'>third</TabPane>
            <TabPane tab='tab 4' key='4'>first</TabPane>
            <TabPane tab='tab 5' key='5'>second</TabPane>
            <TabPane tab='tab 6' key='6'>third</TabPane>
            <TabPane tab='tab 7' key='7'>first</TabPane>
            <TabPane tab='tab 8' key='8'>second</TabPane>
            <TabPane tab='tab 9' key='9'>third</TabPane>
          </Tabs>
        }
        <div style={{width: '100%', background: '#9e1c26', height: '44px', textAlign: 'center'}}>
          scrollable tabbar
        </div>

        <div style={{alignSelf: 'stretch', minHeight: '400px', margin: '15px', backgroundColor: '#b2b2b2'}}>
          Shop Item here
          <SplitterButton style={{width: '140px', fontSize: '15px', lineHeight: '30px', margin: '10px', background: '#8f1922', border: 'none', cursor: 'pointer'}}
                          text='temp link to item'
                          onClick={() => {
                            console.log('SHOP ITEM 1 CLICK');
                            this.props.actions.pushPage(true, 'ShopItem');
                            this.props.actions.changeToolbarType('back');
                          } } />
        </div>
      </div>
    );
  }
}

export default Contact;
