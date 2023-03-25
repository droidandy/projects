import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as navigatorActions from '../redux/navigator';
import * as panelActions from '../redux/panel';
import * as registerActions from '../redux/register';
import {
  Page,
  Input,
  Button,
  Icon,
  BottomToolbar
} from 'react-onsenui';

import PhraseBox from './PhraseBox';

@connect((state) => ({ navigator: state.navigator, panel: state.panel, auth: state.auth, register: state.register, utility: state.utility }),
    (dispatch) => ({ actions: bindActionCreators({...navigatorActions, ...panelActions, ...registerActions}, dispatch) }))

class ConversationMobileTablet extends React.Component {
  constructor(props) {
    super(props);
    this.renderBottomToolbar = this.renderBottomToolbar.bind(this);
    this.state = {
      currentMessage: '',
      data: [
        {time: '11:30', author: 'Alex', text: 'Lorem ipsum dolor sit amet'},
        {time: '11:31', author: 'Alex', text: 'Consectetur adipisicing elit'},
        {time: '11:32', author: 'me', text: 'Sed do eiusmod tempor incididunt ut labore et dolore'},
        {time: '11:33', author: 'Alex', text: 'Magna aliqua. Ut enim ad minim veniam'},
        {time: '11:34', author: 'Alex', text: 'Quis nostrud exercitation ullamco laboris nisi'},
        {time: '11:34', author: 'me', text: 'Ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in'},
        {time: '11:34', author: 'Alex', text: 'Voluptate velit esse cillum dolore eu fugiat nulla pariatur. '},
        {time: '11:35', author: 'me', text: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}
      ]
    };
  }
  componentDidMount() {
    if (this.props.navigator.previousNamePage === 'NEAR ME' ||
        this.props.navigator.previousNamePage === 'User profile') {
      this.setState({data: []});
    }
  }

  renderPhrases(arr) {
    return arr.map((item, idx) => {
      return (
        <PhraseBox key={'phraseBox_' + idx} time={item.time} author={item.author} text={item.text} />
      );
    });
  }

  renderBottomToolbar() {
    return (
      <BottomToolbar style={{display: 'flex', flexDirection: 'row'}}>
        <Input
          style={{backgroundColor: 'transparent', width: 'calc(100vw - 100px)', height: '44px'}}
          modifier='underbar'
          value={this.state.currentMessage}
          onChange={(event) => { this.setState({currentMessage: event.target.value}); } }
          placeholder='Text input'/>
        <Button
          style={{width: '100px', height: '44px', display: 'flex'}}
          onClick={() => { console.log('SEND MSG CLICK'); }}>
          <Icon style={{margin: 'auto'}} icon='ion-android-send, material:md-mail-send'></Icon>
        </Button>
      </BottomToolbar>
    );
  }

  render() {
    return (
      <Page
        style={{overflowX: 'hidden'}}
        renderBottomToolbar={this.renderBottomToolbar}
      >
        <div style={{overflowX: 'hidden', padding: '0 10px'}}>
          {this.renderPhrases(this.state.data)}
        </div>
      </Page>
    );
  }
}

export default ConversationMobileTablet;
