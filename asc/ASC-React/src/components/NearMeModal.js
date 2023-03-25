import React from 'react';

import {
    Modal,
    ListItem,
    Input,
    List
} from 'react-onsenui';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as navigatorActions from '../redux/navigator';
import * as mapActions from '../redux/map';

import SplitterButton from './Button';

import Select from 'react-select';
import constants from '../constants';

@connect((state) => ({ navigator: state.navigator, utility: state.utility, map: state.map }),
    (dispatch) => ({ actions: bindActionCreators({
      ...navigatorActions,
      ...mapActions
    }, dispatch) }))

class NearMeModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sportList: [],
      levelList: []
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
    let sportList = constants.Sports.slice();
    let levelList = constants.AbilityLevels.slice();
    sportList.push({ value: 'All', label: 'All' });
    levelList.push({ value: 'All', label: 'All' });
    this.setState({sportList: sportList, levelList: levelList});
  }

  render() {
    console.log(`value=${this.props.map.peopleSportType}
    options=${this.state.sportList}`);
    return (
      <Modal isOpen={this.props.navigator.nameModal === 'NearMeModal'} animationOptions={{duration: 2.2, delay: 0.4, timing: 'ease-in'}} style={{backgroundColor: 'rgba(0,0,0,0.75)'}}>
        <List noborder style={{width: '30%', margin: 'auto', minWidth: '320px', padding: '52px 0', borderRadius: '10px'}}>
          <ListItem key={0} tappable style={{marginLeft: '0px'}} >
            <label className='left'>
              <Input
                inputId='checkboxShowPeople'
                checked={this.props.map.showPeople}
                onChange={(e) => { this.props.actions.setShowType('showPeople', e.target.checked); }}
                modifier='material'
                type='checkbox'
              />
            </label>
            <label htmlFor='checkboxShowPeople' className='center' style={{backgroundImage: 'none'}}>
              {'People'}
            </label>
          </ListItem>

          <ListItem key={'01'} style={{marginLeft: '0px', visibility: this.props.map.showPeople ? 'visible' : 'hidden'}}>
            <div className='center'>
              <div style={{flexGrow: '55'}}>
                <Select
                  placeholder='Sports List'
                  name='form-field-sportsList'
                  value={this.props.map.peopleSportType}
                  options={this.state.sportList}
                  onChange={(item) => { this.props.actions.setTypeOptions('peopleSportType', item ? item.value : null); }}
                />
              </div>
              <div style={{flexGrow: '45'}}>
                <Select
                  placeholder='Ability Level'
                  name='form-field-sportsList'
                  value={this.props.map.peopleSportLevel}
                  options={this.state.levelList}
                  onChange={(item) => { this.props.actions.setTypeOptions('peopleSportLevel', item ? item.value : null); }}
                />
              </div>
            </div>
          </ListItem>

          <ListItem key={1} tappable style={{marginLeft: '0px'}}>
            <label className='left'>
              <Input
                inputId='checkboxShowEvents'
                checked={this.props.map.showEvents}
                onChange={(e) => { this.props.actions.setShowType('showEvents', e.target.checked); }}
                modifier='material'
                type='checkbox'
              />
            </label>
            <label htmlFor='checkboxShowEvents' className='center' style={{backgroundImage: 'none'}}>
              {'Events'}
            </label>
          </ListItem>

          <ListItem key={'02'} style={{marginLeft: '0px', visibility: this.props.map.showEvents ? 'visible' : 'hidden'}}>
            <div className='center'>
              <div style={{flexGrow: '55'}}>
                <Select
                  placeholder='Sports List'
                  name='form-field-sportsList'
                  value={this.props.map.eventsSportType}
                  options={this.state.sportList}
                  onChange={(item) => { this.props.actions.setTypeOptions('eventsSportType', item ? item.value : null); }}
                />
                </div>
              <div style={{flexGrow: '45'}}>
                <Select
                  placeholder='Ability Level'
                  name='form-field-sportsList'
                  value={this.props.map.eventsSportLevel}
                  options={this.state.levelList}
                  onChange={(item) => { this.props.actions.setTypeOptions('eventsSportLevel', item ? item.value : null); }}
                />
              </div>
            </div>
          </ListItem>

          <ListItem key={2} tappable style={{marginLeft: '0px'}}>
            <label className='left'>
              <Input
                inputId='checkboxShowGroups'
                checked={this.props.map.showGroups}
                onChange={(e) => { this.props.actions.setShowType('showGroups', e.target.checked); }}
                modifier='material'
                type='checkbox'
              />
            </label>
            <label htmlFor='checkboxShowGroups' className='center' style={{backgroundImage: 'none'}}>
              {'Groups'}
            </label>
          </ListItem>

          <ListItem key={'03'} style={{marginLeft: '0px', visibility: this.props.map.showGroups ? 'visible' : 'hidden'}} >
            <div className='center'>
              <div style={{flexGrow: '55'}}>
                <Select
                  placeholder='Sports List'
                  name='form-field-sportsList'
                  value={this.props.map.groupsSportType}
                  options={this.state.sportList}
                  onChange={(item) => { this.props.actions.setTypeOptions('groupsSportType', item ? item.value : null); }}
                />
              </div>
              <div style={{flexGrow: '45'}}>
                <Select
                  placeholder='Ability Level'
                  name='form-field-sportsList'
                  value={this.props.map.groupsSportLevel}
                  options={this.state.levelList}
                  onChange={(item) => { this.props.actions.setTypeOptions('groupsSportLevel', item ? item.value : null); }}
                />
              </div>
            </div>
          </ListItem>

          <SplitterButton style={{fontSize: '15px', lineHeight: '30px', margin: '10px', background: '#8f1922', border: 'none', color: 'white'}}
                          text='Apply'
                          onClick={() => {
                            this.props.actions.pushModal('');
                          } } />
        </List>
      </Modal>
    );
  }
}
export default NearMeModal;
