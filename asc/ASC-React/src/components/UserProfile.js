import React from 'react';
import commonUtils from '../utils/commonUtils';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as navigatorActions from '../redux/navigator';
import * as panelActions from '../redux/panel';
import * as utilityActions from '../redux/utility';
import * as registerActions from '../redux/register';
import * as conversationsActions from '../redux/conversations';
import * as selectedConversationActions from '../redux/selectedConversation';

import {
    Icon,
    List,
    ListItem,
    Input,
    Row,
    Col
} from 'react-onsenui';

import {countries} from 'country-data';

import '../css/react-select.css';
import '../css/main.css';

import ProfileSection from './ProfileSection';

import i18nZipcodes from 'i18n-zipcodes';
import zipcoder from '../utils/zipcoder';

import staticImage from '../staticImages';

@connect((state) => ({ navigator: state.navigator, conversations: state.conversations, panel: state.panel, auth: state.auth, register: state.register, utility: state.utility }),
    (dispatch) => ({ actions: bindActionCreators({...navigatorActions, ...panelActions, ...registerActions, ...conversationsActions, ...selectedConversationActions, ...utilityActions}, dispatch) }))

export default class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.renderSexRow = this.renderSexRow.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDatebirthChange = this.handleDatebirthChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleSpiritualBeliefChange = this.handleSpiritualBeliefChange.bind(this);
    this.handleCurrentSportChange = this.handleCurrentSportChange.bind(this);
    this.handleCurrentAbilityLevelChange = this.handleCurrentAbilityLevelChange.bind(this);
    this.handleAddSport = this.handleAddSport.bind(this);
    this.handleDelSport = this.handleDelSport.bind(this);
    this.renderSports = this.renderSports.bind(this);
    this.handleZipChange = this.handleZipChange.bind(this);
    this.disableButton = this.disableButton.bind(this);
    this.enableButton = this.enableButton.bind(this);
    this.state = {
      countries: null,
      showBlock: false,
      canSubmit: false,
      sexTypes: [
        'Male',
        'Female'
      ],
      selectedSexType: 'Male',
      lastname: '',
      firstname: '',
      username: '',
      email: '',
      image: staticImage.profileImage,
      dateBirth: new Date(),
      about: '',
      fbProfile: '',
      twProfile: '',
      address: '',
      newPswd: '',
      confirmPswd: '',
      stateVal: '',
      countryVal: '',
      spiritualBeliefVal: '',
      currentSportVal: null,
      currentAbilityLevelVal: null,
      currentSportList: [],
      city: '',
      zipVal: '',
      isZip: false,
      isZipShow: false
    };
  }
  in_array(value, array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] === value) return true;
    }
    return false;
  }
  componentWillMount() {
    let self = this;
    let countriesList = countries.all.map(function(key, index) { return { label: key.name, value: key.name.replace(/\s*/g, '') }; });
    self.setState({ countries: countriesList });
    zipcoder.location(function(data) {
      self.setState({ zipVal: data ? data.zipcode : '', city: data ? data.city : '', isZipShow: true });
    });
  }
  handleSexChange(sex) {
    this.setState({selectedSexType: sex});
  }
  handleChange(e) {
    this.setState({[e.currentTarget.id]: e.currentTarget.value});
  }
  handleDatebirthChange(e) {
    this.setState({dateBirth: e});
  }
  handleStateChange(val) {
    this.setState({stateVal: val});
  }
  handleCountryChange(val) {
    if (this.in_array(val ? val.value : null, ['Canada', 'USA'])) {
      this.setState({countryVal: val, showBlock: true});
    } else {
      this.setState({countryVal: val, showBlock: false});
    }
  }
  handleZipChange(e) {
    this.setState({zipVal: e.target.value, isZip: i18nZipcodes(window.navigator.language.substr(0, 2), e.target.value)});
  }
  renderSexRow(row) {
    return (
      <ListItem className='selectionSex profile__sex__list-item'
                key={row} >
      <label className='left profile__sex__list-item__label'>
        <Input
            className='profile__sex__list-item__label__input'
            modifier='material'
            inputId={`radio-${row}`}
            checked={row === this.state.selectedSexType}
            disabled
            // onChange={this.handleSexChange.bind(this, row)}
            type='radio'
            />
      </label>
      <label htmlFor={`radio-${row}`} className='center item__label__text'>
        <div className='profile__sex__list-item__label__text__input'>{row}</div>
      </label>
      </ListItem>
    );
  }
  handleFabClick() {
    console.log('fab click');
  }
  submit(data) {
    console.log(JSON.stringify(data, null, 4));
  }
  enableButton() {
    this.setState({ canSubmit: true });
  }
  disableButton() {
    this.setState({ canSubmit: false });
  }

  handleSpiritualBeliefChange(val) {
    this.setState({ spiritualBeliefVal: val });
  }

  handleCurrentSportChange(val) {
    console.log(val);
    this.setState({ currentSportVal: val });
  }

  handleCurrentAbilityLevelChange(val) {
    console.log(val);
    this.setState({ currentAbilityLevelVal: val });
  }

  handleAddSport() {
    let sport = this.state.currentSportVal;
    let level = this.state.currentAbilityLevelVal;
    let list = this.state.currentSportList;

    if ((!!sport && Object.keys(sport).length !== 0) &&
        (!!level && Object.keys(level).length !== 0)
    ) {
      list.push({sport: sport.label, level: level.label});
      this.setState({ currentSportList: list, currentSportVal: null, currentAbilityLevelVal: null });
    }
  }

  handleDelSport(idx) {
    let list = this.state.currentSportList;
    list.splice(idx, 1);
    this.setState({ currentSportList: list });
  }

  renderSports(arr) {
    return (
        arr.map((item, idx) => {
          return (
            <Row key={'currentSportList_' + idx}>
              <Col width='50%'>
                <div className='profile__input__child__small'>
                  {item.sport}
                </div>
              </Col>
              <Col width='30%'>
                <div className='profile__input__child__small'>
                  {item.level}
                </div>
              </Col>
              {/* <Col width='20%' className='profile__col'>
                <Icon icon='ion-close-round, material:md-check' className='profile__col__content-center' onClick={() => { this.handleDelSport(idx); }} />
              </Col>*/}
            </Row>
          );
        })
    );
  }

  render() {
    return (
        <div >
            <Row >
                <Col width='60%'>
                  <div style={{ padding: '10px', display: 'flex' }}>
                    <ProfileSection
                      title={'Eric Qw'}
                      height={'25px'}
                    />
                   <div style={{margin: 'auto auto auto 0'}}>
                      <Icon size={30} style={{padding: '0 10px', color: '#fff'}} icon='md-comment-text' onClick={() => {
                        console.log(this.props.conversationId);
                        this.props.actions.setNavMap(false);
                        this.props.actions.changeToolbarType('back');
                        this.props.actions.setNavSwipeablePanel(true);
                        this.props.actions.pushPage(true, 'Conversation');
                      }} />
                      <Icon size={30} style={{padding: '0 10px', color: '#fff'}} icon='fa-user-plus' onClick={() => { console.log('FOLLOW CLICK'); }} />
                    </div>
                  </div>

                    <div className='profile__input__child' >
                        <Input
                            className='profile__input__wide'
                            value='EricQw'
                            disabled
                            id='username'
                            modifier='material'
                            placeholder='Username' />
                    </div>

                    <div className='profile__input__child' >
                      <a href='http://fb.com/EricQw' target='_blank'>
                        <Input
                            className='profile__input__wide'
                            value='fb.com/EricQw'
                            disabled
                            id='fbProfile'
                            modifier='material'
                            placeholder='Facebook Profile' />
                      </a>
                    </div>

                    <div className='profile__input__child' >
                      <a href='http://tw.com/EricQw' target='_blank'>
                        <Input
                            className='profile__input__wide'
                            value='tw.com/EricQw'
                            disabled
                            id='twProfile'
                            modifier='material'
                            placeholder='Twitter Profile' />
                      </a>
                    </div>

                    <div className='profile__input__child' style={{marginTop: '0px'}}>
                      <List className='profile__sex__list'
                            dataSource={this.state.sexTypes}
                            renderRow={this.renderSexRow}
                          />
                    </div>

                </Col>
                <Col width='40%' >
                  <div className='profile__image' style={{backgroundImage: `url(${this.state.image})`}} />
                </Col>
            </Row>

            <div className='profile__input__child' >
                <textarea
                    className='profile__input__textarea textarea'
                    style={{backgroundColor: commonUtils.isAndroid() ? 'transparent' : null}}
                    rows='3'
                    value='I like to snowboard in Colorado because there is no snowboarding in Nebraska. People say I look a lot like Bradley Cooper.'
                    disabled
                    id='about'
                    placeholder='About'></textarea>
            </div>

            <ProfileSection title={'LOCATION'} />

            <Row>
                <Col width='40%'>
                    <div className='profile__input__first-child' >
                        <Input
                            value='Omaha'
                            onChange={this.handleChange}
                            disabled
                            id='city'
                            modifier='material'
                            placeholder='City' />
                    </div>
                </Col>
                <Col width='20%'>
                    <div className='profile__input__child__small' >
                              <Input
                                  placeholder='State'
                                  name='form-field-State'
                                  value='NE'
                                  onChange={this.handleChange}
                                  id='stateVal'
                                  disabled
                                  modifier='material'
                                  />
                    </div>
              </Col>
              <Col width='20%'>
                    <div className='profile__input__child_small' >
                        <Input // Select
                            placeholder='Country'
                            name='form-field-Country'
                            value='USA'
                            onChange={this.handleChange}
                            id='country'
                            disabled
                            modifier='material'
                            />
                    </div>
              </Col>
            </Row>

            <ProfileSection title={'INTERESTS'} />
            <Col width='100%'>
              <div className='profile__input__child' /* profile__input__child__small*/ >
                <Input // Select
                  placeholder='Spiritual Belief'
                  name='form-field-spiritualBeliefs'
                  value='Atheist'
                  disabled
                  modifier='material'
                  />
              </div>
            </Col>
            <Row>
              <Col width='50%'>
                <div className='profile__input__child' /* profile__input__child__small*/ >
                  <Input // Select
                    placeholder='Sports List'
                    name='form-field-sportsList'
                    value='Snowboarding'
                    disabled
                    modifier='material'
                    />
                </div>
              </Col>
              <Col width='30%'>
                <div className='profile__input__child' /* profile__input__child__small*/ >
                  <Input // Select
                    placeholder='Ability Level'
                    name='form-field-sportsList'
                    value='Advanced'
                    disabled
                    modifier='material'
                    />
                </div>
              </Col>
            </Row>
            {this.renderSports(this.state.currentSportList)}
        </div>
    );
  }
}
