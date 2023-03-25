import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as navigatorActions from '../redux/navigator';
import * as panelActions from '../redux/panel';

import Select from 'react-select';
import SplitterButton from './Button';

import {
  Icon,
  Input,
  List,
  ListItem,
  ListHeader,
  Col,
  AlertDialog
} from 'react-onsenui';

@connect((state) => ({ navigator: state.navigator, panel: state.panel, auth: state.auth, utility: state.utility }),
    (dispatch) => ({ actions: bindActionCreators({...navigatorActions, ...panelActions}, dispatch) }))

class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.handleAlertDialogOk = this.handleAlertDialogOk.bind(this);
    this.state = {
      isOpen: false,
      data: [{name: 'BMX', feed: true, email: true, sms: false, miles: 15},
            {name: 'Inline Skating', feed: true, email: true, sms: false, miles: 15},
            {name: 'Kayaking', feed: true, email: true, sms: false, miles: 15},
            {name: 'Kiteboarding', feed: true, email: true, sms: false, miles: 15},
            {name: 'Motocross', feed: true, email: true, sms: false, miles: 15},
            {name: 'Mountain Biking', feed: true, email: true, sms: false, miles: 15},
            {name: 'Rock Climbing', feed: true, email: true, sms: false, miles: 15},
            {name: 'Skateboarding', feed: true, email: true, sms: false, miles: 15},
            {name: 'Skiing', feed: true, email: true, sms: false, miles: 15},
            {name: 'Skydiving', feed: true, email: true, sms: false, miles: 15},
            {name: 'Snowboarding', feed: true, email: true, sms: false, miles: 15},
            {name: 'Surfing', feed: true, email: true, sms: false, miles: 15},
            {name: 'Wakeboarding', feed: true, email: true, sms: false, miles: 15}
      ],
      options: [
        { value: 15, label: '15 ' },
        { value: 25, label: '25 ' },
        { value: 50, label: '50 ' },
        { value: 100, label: '100 ' }
      ]
    };
  }

  renderHeader() {
    console.log('render header');
    return (
      <ListHeader style={{display: 'flex', color: 'black', backgroundColor: 'white'}}>
        <Col width={'28%'} className='notifications__list__item__col__text'>Interest</Col>
        <Col width={'18%'} className='notifications__list__item__col__text'>App Feed</Col>
        <Col width={'18%'} className='notifications__list__item__col__text'>Email</Col>
        <Col width={'18%'} className='notifications__list__item__col__text'>SMS</Col>
        <Col width={'18%'} className='notifications__list__item__col__text'>Distance</Col>
      </ListHeader>
    );
  }

  renderRow(row, index) {
    let self = this;
    return (
      <ListItem key={index} modifier='thick'>
        <Col width={'28%'} className='notifications__list__item__col__text'>{row}</Col>
        <Col width={'18%'} className='notifications__list__item__col'>
          <Input inputId={`checkbox-${row}`} type='checkbox' checked={true} modifier='material' style={{margin: 'auto'}}/>
        </Col>
        <Col width={'18%'} className='notifications__list__item__col'>
          <Input inputId={`checkbox-${row}`} type='checkbox' modifier='material' style={{margin: 'auto'}}/>
        </Col>
        <Col width={'18%'} className='notifications__list__item__col' onClick={() => { self.setState({isOpen: true}); }}>
          <Input inputId={`checkbox-${row}`} type='checkbox' disabled modifier='material' onClick={() => { self.setState({isOpen: true}); }} style={{margin: 'auto'}}/>
        </Col>
        <Col width={'18%'} style={{padding: '0 15px 0 0'}}>
          <Select style={{maxWidth: '50%', margin: '0 25%'}}
              placeholder=''
              name='form-field-range'
              value={this.state.data[index].miles}
              options={this.state.options}
              onChange={(item) => {
                let state = this.state;
                state.data[index].miles = item ? item.value : null;
                this.setState(state);
              }}
              />
        </Col>
      </ListItem>
    );
  }

  handleFabClick() {
    console.log('handleFabClick');
  }

  renderFooter() {
    return (
      <div style={{display: 'flex', padding: '20px'}}>
        <div className='actionButton notifications__body__save-button'
             onClick={this.handleFabClick}>
          <Icon icon='md-check, material:md-check' />
        </div>
      </div>
    );
  }

  handleAlertDialogOk() {
    this.setState({isOpen: false});
  }

  handleAlertDialogCancel() {
    this.setState({isOpen: false});
  }

  render() {
    return (
      <div className='notifications__container'>
        <div className='notifications__header__container'>
          <div className='notifications__header'>
            <Icon className='navbar__toolbarbutton' icon='md-notifications' style={{paddingRight: '15px'}}/>
            Notifications
          </div>
        </div>

        <List dataSource={['BMX',
          'Inline Skating',
          'Kayaking',
          'Kiteboarding',
          'Motocross',
          'Mountain Biking',
          'Rock Climbing',
          'Skateboarding',
          'Skiing',
          'Skydiving',
          'Snowboarding',
          'Surfing',
          'Wakeboarding']}
          renderRow={this.renderRow}
          renderHeader={ this.renderHeader }
          renderFooter={ this.renderFooter }
          >
        </List>

        <div className='notifications__premium'>
          <span className='notifications__premium__title'>Go Premium</span>
          <SplitterButton style={{fontSize: '15px', lineHeight: '30px', margin: '10px 20px 10px auto', background: '#8f1922', border: 'none', minWidth: '100px'}}
                          text='Button'
                          onClick={() => { console.log('Go Premium FOOTER'); } } />
        </div>

        <AlertDialog isOpen={this.state.isOpen} isCancelable={false} onCancel={this.handleAlertDialogCancel}>
          <div className='alert-dialog-title'>This is a premium membership feature.</div>
            <div className='alert-dialog-content'>
              {this.state.contentAlert}
            </div>
            <div className='alert-dialog-footer'>
              <button onClick={this.handleAlertDialogOk} className='alert-dialog-button'>
                OK
              </button>
          </div>
        </AlertDialog>

        {!this.props.auth.isLogin
          ? <div className='notifications__footer'>
            <span className='notifications__footer__title'>Footer</span>
          </div>
          : null}
      </div>
    );
  }
}

export default Notifications;
