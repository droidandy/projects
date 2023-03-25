import React, { Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as navigatorActions from '../redux/navigator';
import * as panelActions from '../redux/panel';
import * as utilityActions from '../redux/utility';
import * as registerActions from '../redux/register';
import * as conversationsActions from '../redux/conversations';
import * as selectedConversationActions from '../redux/selectedConversation';
// import React, {PropTypes, Component} from 'react/addons';
// import shouldPureComponentUpdate from 'react-pure-render/function';

import listConversation from '../data/dataConversation';
// import {greatPlaceStyle} from './my_great_place_styles.js';
import {
  // Page,
  Icon
} from 'react-onsenui';

@connect((state) => ({ navigator: state.navigator, conversations: state.conversations, panel: state.panel, auth: state.auth, register: state.register, utility: state.utility }),
    (dispatch) => ({ actions: bindActionCreators({...navigatorActions, ...panelActions, ...registerActions, ...conversationsActions, ...selectedConversationActions, ...utilityActions}, dispatch) }))

export default class MapMark extends Component {
  constructor(props) {
    super(props);
    // this.renderToolbar = this.renderToolbar.bind(this);
    this.state = {
      infoWindowIsOpen: false
    };
  }

  render() {
    let color;
    let icon;
    switch (this.props.type) {
      case 'people':
        color = 'blue';
        icon = 'md-account-box';
        break;
      case 'event':
        color = 'red';
        icon = 'md-calendar';
        break;
      case 'group':
        color = 'green';
        icon = 'md-accounts';
        break;
      case 'me':
        color = 'red';
        icon = 'md-account-box';
        break;
      default:
        color = 'blue';
        icon = 'md-account-box';
    };

    return (
      // <div>

        <Icon className='nearMe__map__pin' size={45} icon={icon} style={{color: color, borderBottomColor: color, display: 'block'}} >
        {
          this.props.showInfo
          ? <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '80px',
                width: '250px',
                backgroundColor: '#ffffff',
                position: 'relative',
                bottom: '145px',
                right: '102px',
                border: '1px solid grey',
                borderRadius: '5px',
                zIndex: '1000',
                padding: '10px',
                cursor: 'default',
                boxShadow: '2px 2px 12px rgba(0,0,0,.5)'
              }}>
              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <div style={{fontSize: '20px', color: 'black', fontFamily: 'Roboto, Arial', lineHeight: '20px'}}>{this.props.name}</div>
                <Icon
                  size={15}
                  style={{color: 'grey'}}
                  icon='fa-times'
                  onClick={this.props.hideInfo}
                />
              </div>
              <div style={{fontSize: '17px', color: '#555555', fontFamily: 'Roboto, Arial', lineHeight: '17px'}}>{this.props.sport}, {this.props.level}</div>
              <div style={{fontSize: '10px', color: '#555555', fontFamily: 'Roboto, Arial', lineHeight: '10px'}}>type(will be deleted): {this.props.type}</div>
              <div style={{display: 'flex', flexDirection: 'row', marginTop: 'auto'}}>
                {
                  this.props.type === 'people'
                  ? <Icon size={30} style={{padding: '0 10px', color: 'black'}} icon='md-comment-text' onClick={() => {
                    console.log(this.props.conversationId);
                    this.props.actions.addConversationWithId(listConversation[0], this.props.conversationId);
                    this.props.actions.selectConversation(this.props.conversationId);
                    this.props.actions.setNavMap(false);
                    this.props.actions.changeToolbarType('back');
                    this.props.actions.setNavSwipeablePanel(true);
                    this.props.actions.pushPage(true, 'Conversation');
                  }}></Icon>
                  : null
                }
                {
                  this.props.type === 'people'
                  ? <Icon size={30} style={{padding: '0 10px', color: 'black'}} icon='md-assignment-account' onClick={() => {
                    this.props.actions.addConversationWithId(listConversation[0], this.props.conversationId);
                    this.props.actions.selectConversation(this.props.conversationId);
                    this.props.actions.setNavMap(false);
                    this.props.actions.changeToolbarType('back');
                    this.props.actions.setNavSwipeablePanel(true);
                    this.props.actions.pushPage(true, 'User profile');
                  }}></Icon>
                  : null
                }

              <Icon size={30} style={{padding: '0 10px', color: 'black'}} icon='fa-user-plus' onClick={() => { console.log('FOLLOW CLICK'); }} />
            </div>
          </div>
          : null
        }
        </Icon>
    );
  }
}
