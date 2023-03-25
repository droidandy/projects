import React from 'react';
import { connect } from 'react-redux';
import {
  pushPage,
  changeToolbarType,
  setNavSwipeablePanel
} from '../redux/navigator';
import { registerUser } from '../redux/auth/authActions';
import { getAuth } from '../redux/auth/authSelectors';

import {
    Icon,
    List,
    ListItem,
    Input,
    Row,
    Col,
    Fab,
    AlertDialog
} from 'react-onsenui';

import Select from 'react-select';
import DatePicker from 'react-datepicker';
import {countries} from 'country-data';

import '../css/react-select.css';
import '../css/main.css';
import '../css/react-datepicker.css';

import ProfileSection from './ProfileSection';

import i18nZipcodes from 'i18n-zipcodes';
import zipcoder from '../utils/zipcoder';

import constants from '../constants';

const mapStateToProps = state => ({
  navigator: state.navigator,
  panel: state.panel,
  auth: getAuth(state),
  register: state.register
});

const mapDispatchToProps = dispatch => ({
  pushPage: (showPage, namePage) => dispatch(pushPage(showPage, namePage)),
  changeToolbarType: toolbarType => dispatch(changeToolbarType(toolbarType)),
  setNavSwipeablePanel: isSwipeable => {
    return dispatch(setNavSwipeablePanel(isSwipeable));
  },
  registerUser: user => dispatch(registerUser.request(user))
});

@connect(mapStateToProps, mapDispatchToProps)

class ContinueRegisterPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleAlertDialogCancel = this.handleAlertDialogCancel.bind(this);
    this.handleAlertDialogOk = this.handleAlertDialogOk.bind(this);
    this.dialogSuccess = this.dialogSuccess.bind(this);
    this.renderSexRow = this.renderSexRow.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleLastnameChange = this.handleLastnameChange.bind(this);
    this.handleFirstnameChange = this.handleFirstnameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleDatebirthChange = this.handleDatebirthChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleSpiritualBeliefChange = this.handleSpiritualBeliefChange.bind(this);
    this.handleCurrentSportChange = this.handleCurrentSportChange.bind(this);
    this.handleCurrentAbilityLevelChange = this.handleCurrentAbilityLevelChange.bind(this);
    this.handleAddSport = this.handleAddSport.bind(this);
    this.handleDelSport = this.handleDelSport.bind(this);
    this.renderSports = this.renderSports.bind(this);
    this.handleCityChange = this.handleCityChange.bind(this);
    this.handleZipChange = this.handleZipChange.bind(this);
    this.disableButton = this.disableButton.bind(this);
    this.enableButton = this.enableButton.bind(this);
    this.handleFabClick = this.handleFabClick.bind(this);
    this.state = {
      isOpenModel: false,
      alertDialogMessage: 'Please Validate Your Email Account',
      alertDialogCallback: this.handleAlertDialogCancel,
      countries: null,
      showBlock: false,
      canSubmit: false,
      sexTypes: [
        'male',
        'female'
      ],
      gender: '',
      lastName: '',
      firstName: '',
      userName: '',
      email: '',
      birthDate: null,
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
    let countriesList = countries.all.map((key, index) => ({ label: key.name, value: key.name.replace(/\s*/g, '') }));
    this.setState({ countries: countriesList });
    zipcoder.location(function(data) {
      self.setState({ zipVal: data ? data.zipcode : '', city: data ? data.city : '', isZipShow: true });
    });
    let register = this.props.register.data;
    if (register) {
      this.setState({ firstName: register.firstName, lastName: register.lastName, email: register.email, gender: register.gender });
    }
  }

  componentWillReceiveProps(nextProps) {
    const {userAuthData} = nextProps.auth;
    if (userAuthData) {
      this.setState({isOpenModel: true, alertDialogMessage: 'Finish. Press OK to press OK', alertDialogCallback: this.dialogSuccess});
    }
  }

  dialogSuccess() {
    this.setState({isOpenModel: false});
    this.props.pushPage(false, 'HOME');
    this.props.changeToolbarType('main');
    this.props.setNavSwipeablePanel(true);
  }

  handleAlertDialogCancel() {
    this.setState({isOpenModel: false});
  }

  handleAlertDialogOk() {
    this.setState({isOpenModel: false});
    this.props.pushPage(true, 'LOGIN');
  }

  handleFabClick() {
    if (!this.state.userName) {
      this.setState({ isOpenModel: true, alertDialogMessage: 'Please, type your username.' });
      return;
    }

    const profile = {
      firstName: this.props.register.data.firstName,
      lastName:	this.props.register.data.lastName,
      username: this.state.userName
    };

    if (this.state.gender) profile.gender = this.state.gender;
    if (this.state.birthDate) profile.birthday = this.state.birthDate.format('MM/DD/YYYY');
    if (this.state.city) profile.city = this.state.city;
    if (this.state.countryVal) profile.country = this.state.countryVal.value;
    if (this.state.zipVal) profile.zip = this.state.zipVal;
    if (this.state.stateVal.value) profile.state = this.state.stateVal.value;
    if (this.state.spiritualBeliefVal.value) profile.spiritualBelief = this.state.spiritualBeliefVal.value;
    profile.skills = this.state.currentSportList || [];
    const regInfo = window.localStorage.getItem('regInfo');

    const { email, password, firstName, lastName } = this.props.register.data;

    this.props.registerUser({
      email,
      password,
      firstName,
      lastName,
      regInfo,
      addProfile: profile
    });
  }
  handleSexChange(sex) {
    this.setState({gender: sex});
  }
  handleUsernameChange(e) {
    this.setState({userName: e.target.value});
  }
  handleLastnameChange(e) {
    this.setState({lastName: e.target.value});
  }
  handleFirstnameChange(e) {
    this.setState({firstName: e.target.value});
  }
  handleEmailChange(e) {
    this.setState({email: e.target.value});
  }
  handleDatebirthChange(e) {
    this.setState({birthDate: e});
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
  handleCityChange(e) {
    this.setState({city: e.target.value});
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
            checked={row === this.state.gender}
            onChange={this.handleSexChange.bind(this, row)}
            type='radio'
            />
      </label>
      <label htmlFor={`radio-${row}`} className='center item__label__text'>
        <div className='profile__sex__list-item__label__text__input'>{row}</div>
      </label>
      </ListItem>
    );
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
    this.setState({ currentSportVal: val });
  }

  handleCurrentAbilityLevelChange(val) {
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
              <Col width='20%' className='profile__col'>
                <Icon icon='ion-close-round, material:md-check' className='profile__col__content-center' onClick={() => { this.handleDelSport(idx); }} />
              </Col>
            </Row>
          );
        })
    );
  }

  render() {
    let sport = this.state.currentSportVal;
    let level = this.state.currentAbilityLevelVal;
    let checkAddSport = (!!sport && Object.keys(sport).length !== 0) && (!!level && Object.keys(level).length !== 0);

    return (
        <div >
            <Row verticalAlign='center'>
                <Col width='60%'>
                    <ProfileSection title={'User Registration 2 of 2'}
                                    icon={'user, material:user'}
                                    height={'25px'}
                        />
                    <div className='profile__required' >
                      <span className='profile__required__text' >*</span>
                      Required fields
                    </div>
                    <ProfileSection title={'MEMBER INFO'} />

                    <div className='profile__input__first-child' >
                        <span className='profile__red-label' >*</span>
                        <Input
                            disabled={!!this.state.firstName}
                            className='profile__input__wide'
                            value={this.state.firstName}
                            onChange={this.handleFirstnameChange}
                            modifier='material'
                            placeholder='First Name' />
                    </div>

                    <div className='profile__input__child' >
                        <Input
                            disabled={!!this.state.lastName}
                            className='profile__input__wide'
                            value={this.state.lastName}
                            onChange={this.handleLastnameChange}
                            modifier='material'
                            placeholder='Last Name' />
                    </div>

                    <div className='profile__input__child' >
                        <span className='profile__red-label' >*</span>
                        <Input
                            className='profile__input__wide'
                            value={this.state.userName}
                            onChange={this.handleUsernameChange}
                            modifier='material'
                            placeholder='Username' />
                    </div>

                </Col>
                <Col width='40%'>
                    <List className='profile__sex__list'
                          dataSource={this.state.sexTypes}
                          renderRow={this.renderSexRow}
                        />
                </Col>
            </Row>

            <div className='profile__input__child' >
                <span className='profile__red-label' >*</span>
                <Input
                    disabled={!!this.state.email}
                    className='profile__input__wide'
                    value={this.state.email}
                    onChange={this.handleEmailChange}
                    modifier='material'
                    placeholder='Email' />
            </div>

            <div className='profile__input__child'>
                <DatePicker
                    className='text-input text-input--material '
                    placeholderText='Date of Birth'
                    showYearDropdown
                    selected={this.state.birthDate}
                    onChange={this.handleDatebirthChange} />
            </div>

            <ProfileSection title={'LOCATION'} />

            <Row className='profile__location__row'>
                <Col width='50%'>
                    <div className='profile__input__child' >
                        <Input
                            className='profile__input__wide'
                            value={this.state.city}
                            onChange={this.handleCityChange}
                            modifier='material'
                            placeholder='City' />
                    </div>

                    {
                      this.state.showBlock || this.state.isZipShow ? <div className='profile__input__child' >
                         <Input
                            className='profile__input__wide'
                            value={this.state.zipVal}
                            onChange={this.handleZipChange}
                            modifier='material'
                            placeholder='Zip' />
                        </div> : null
                    }

                </Col>
                <Col width='50%'>
                    <div className='profile__input__child__small' >
                        <Select
                            placeholder='Country'
                            name='form-field-Country'
                            value={this.state.countryVal}
                            options={constants.Country}
                            onChange={this.handleCountryChange}
                            />
                    </div>

                    {
                      this.state.showBlock ? <div className='profile__input__child__small' >
                          <Select
                              placeholder='State'
                              name='form-field-State'
                              value={this.state.stateVal}
                              options={this.state.showBlock ? constants.State[this.state.countryVal.value] : []}
                              onChange={this.handleStateChange}
                              />
                      </div> : null
                    }
                </Col>
            </Row>

            <ProfileSection title={'INTERESTS'} />

            <Col width='100%'>
              <div className='profile__input__child__small' >
                <Select
                  placeholder='Spiritual Belief'
                  name='form-field-spiritualBeliefs'
                  value={this.state.spiritualBeliefVal}
                  options={constants.SpiritualBeliefs}
                  onChange={this.handleSpiritualBeliefChange}
                  />
              </div>
            </Col>
            <Row>
              <Col width='50%'>
                <div className='profile__input__child__small' >
                  <Select
                    placeholder='Sports List'
                    name='form-field-sportsList'
                    value={this.state.currentSportVal}
                    options={constants.Sports}
                    onChange={this.handleCurrentSportChange}
                    />
                </div>
              </Col>
              <Col width='30%'>
                <div className='profile__input__child__small' >
                  <Select
                    placeholder='Ability Level'
                    name='form-field-sportsList'
                    value={this.state.currentAbilityLevelVal}
                    options={constants.AbilityLevels}
                    onChange={this.handleCurrentAbilityLevelChange}
                    />
                </div>
              </Col>
              <Col width='20%' className='profile__col'>
                <div className='profile__col__content-center'>
                  <Icon icon='ion-plus-round, material:md-plus' style={checkAddSport ? null : {color: 'grey'}} onClick={this.handleAddSport}/>
                </div>
              </Col>
            </Row>
            {this.renderSports(this.state.currentSportList)}
            <Fab
              style={{backgroundColor: '#9e1c26'}}
              className='actionButton'
              ripple
              position='bottom right'
              onClick={this.handleFabClick}>
              <Icon icon='md-check, material:md-check' />
            </Fab>

            <AlertDialog isOpen={this.state.isOpenModel} isCancelable={false} onCancel={this.handleAlertDialogCancel}>
                <div className='alert-dialog-title'>Info</div>
                <div className='alert-dialog-content'>
                    {this.state.alertDialogMessage}
                </div>
                <div className='alert-dialog-footer'>
                    <button onClick={this.state.alertDialogCallback} className='alert-dialog-button'>
                        OK
                    </button>
                </div>
            </AlertDialog>
        </div>
    );
  }
}

export default ContinueRegisterPage;
