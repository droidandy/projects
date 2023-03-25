import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as navigatorActions from '../redux/navigator';
import * as panelActions from '../redux/panel';

import SplitterButton from './Button';

@connect((state) => ({ navigator: state.navigator, panel: state.panel, utility: state.utility }),
    (dispatch) => ({ actions: bindActionCreators({...navigatorActions, ...panelActions}, dispatch) }))

class LaunchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
        <div className='launchContainer' style={{background: 'url(' + this.props.utility.bannerImage + ')', backgroundSize: 'cover', backgroundPosition: '50%'}}>
          <div className='launchContainer_buttons' >
              <SplitterButton style={{textAlign: 'center', minWidth: '40%', fontSize: '15px', lineHeight: '30px', margin: '10px', background: '#8f1922', border: 'none', float: 'left'}}
                              text='SIGN UP'
                              onClick={() => { console.log('Button click SIGN UP'); this.props.actions.pushPage(true, 'Register'); this.props.actions.changeToolbarType('back'); } } />
              <SplitterButton style={{textAlign: 'center', minWidth: '40%', fontSize: '15px', lineHeight: '30px', margin: '10px', background: 'initial', borderColor: '#fff', borderStyle: 'solid', borderWidth: '1px', float: 'left'}}
                              text='LOG IN'
                              onClick={() => { console.log('Button click LOG IN'); this.props.actions.pushPage(true, 'LOGIN'); this.props.actions.changeToolbarType('back'); } } />
          </div>
          <div className='launchContainer_titles'>
            <div className='launchContainer_titles_main'>
              CONNECT TO THE
            </div>
            <div className='launchContainer_titles_added'>
              ACTION
            </div>
          </div>

        </div>
    );
  }
}

export default LaunchPage;
