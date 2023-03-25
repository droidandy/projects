import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as navigatorActions from '../redux/navigator';
import * as panelActions from '../redux/panel';
import * as registerActions from '../redux/register';
import * as conversationsActions from '../redux/conversations';
import * as selectedConversationActions from '../redux/selectedConversation';
import {
  List// ,
  // Fab,
  // Icon
} from 'react-onsenui';

import SectionInbox from './SectionInbox';

@connect((state) => ({ navigator: state.navigator, conversations: state.conversations, panel: state.panel, auth: state.auth, register: state.register, utility: state.utility }),
    (dispatch) => ({ actions: bindActionCreators({...navigatorActions, ...panelActions, ...registerActions, ...conversationsActions, ...selectedConversationActions}, dispatch) }))

class InboxDesktop extends React.Component {
  constructor(props) {
    super(props);
    // this.renderToolbar = this.renderToolbar.bind(this);
    this.state = {
    };
  }
  componentWillMount() {
  }

  render() {
    console.log('InboxDesktop props', this.props);
    return (
      <div style={{minWidth: '1000px', width: '60%', margin: 'auto'}}>
        <List
            dataSource={Object.keys(this.props.conversations).map((key) => this.props.conversations[key])}
            renderRow={(conversation) => <SectionInbox key={conversation.id}
                                                       {...conversation}
                                                       onClick={() => {
                                                         this.props.actions.selectConversation(conversation.id);
                                                         this.props.actions.pushPage(true, 'Conversation');
                                                         if (this.props.utility.isMobile) {
                                                           this.props.actions.changeToolbarType('back');
                                                         }
                                                       }} /> }
        />
        {/* <Fab style={{backgroundColor: '#9e1c26'}} position='bottom right' onClick={() => { console.log('FAB click'); }}><Icon icon='md-plus'/></Fab>*/}
      </div>
    );
  }
}

export default InboxDesktop;
