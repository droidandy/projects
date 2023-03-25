import React from 'react';
import commonUtils from '../utils/commonUtils';
import { connect } from 'react-redux';

import { getProfile, updateProfile } from '../redux/auth/authActions';
import { getAuth } from '../redux/auth/authSelectors';

import {
    Icon,
    List,
    ListItem,
    Input,
    Row,
    Col
} from 'react-onsenui';

import Select from 'react-select';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import {countries} from 'country-data';

import '../css/react-select.css';
import '../css/main.css';
import '../css/react-datepicker.css';

import ProfileSection from './ProfileSection';

import i18nZipcodes from 'i18n-zipcodes';
import zipcoder from '../utils/zipcoder';

import constants from '../constants';
import staticImage from '../staticImages';

const mapStateToProps = state => ({
  auth: getAuth(state)
});

const mapDispatchToProps = dispatch => ({
  getProfile: email => dispatch(getProfile.request(email)),
  updateProfile: data => dispatch(updateProfile.request(data))
});

@connect(mapStateToProps, mapDispatchToProps)

class Profile extends React.Component {
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
    this.onloadImg = this.onloadImg.bind(this);
    this.state = {
      profileID: '',
      countries: null,
      showBlock: false,
      canSubmit: false,
      sexTypes: [
        'Male',
        'Female'
      ],
      gender: 'Female',
      lastName: '',
      firstName: '',
      username: '',
      publicEmail: '',
      /*
      mb validate ?
      validateEmail(email) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
      }
      */
      image: staticImage.profileImage,
      birthDay: null,
      about: '',
      Facebook: '',
      Twitter: '',
      address: '',
      newPswd: '',
      confirmPswd: '',
      state: '',
      country: '',
      spiritualBelief: '',
      currentSportVal: null,
      currentAbilityLevelVal: null,
      currentSportList: [],
      city: '',
      zip: '',
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
      self.setState({ zip: data ? data.zipcode : '', city: data ? data.city : '', isZipShow: true });
    });

    const {userAuthData} = this.props.auth;
    if (userAuthData) {
      const email = userAuthData.email;
      // save current user email

      this.setState({publicEmail: userAuthData.email});
      this.props.getProfile(email);
    }
  }
  componentWillReceiveProps(nextProps) {
    const { userProfile } = nextProps.auth;
    if (userProfile) {
      if (userProfile.gender === 'female') {
        userProfile.gender = 'Female';
      }
      if (userProfile.gender === 'male') {
        userProfile.gender = 'Male';
      }
      this.setState({
        ...userProfile,
        profileID: userProfile._id,
        currentSportList: userProfile.skills,
        birthDay: moment(userProfile.birthday)
      });
    }
  }
  handleSexChange(sex) {
    this.setState({gender: sex});
  }
  handleChange(e) {
    this.setState({[e.currentTarget.id]: e.currentTarget.value});
  }
  handleDatebirthChange(e) {
    this.setState({birthDay: e});
  }
  handleStateChange(val) {
    this.setState({state: val});
  }
  handleCountryChange(val) {
    console.log('COUNTRY', val);
    if (this.in_array(val ? val.value : null, ['Canada', 'USA'])) {
      this.setState({country: val.value, showBlock: true});
    } else {
      this.setState({country: val.value, showBlock: false});
    }
  }
  handleZipChange(e) {
    this.setState({zip: e.target.value, isZip: i18nZipcodes(window.navigator.language.substr(0, 2), e.target.value)});
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

  handleFabClick() {
    const profile = {};
    if (this.state.gender === 'Female') {
      profile.gender = 'female';
    }
    if (this.state.gender === 'Male') {
      profile.gender = 'male';
    }
    if (this.state.publicEmail) { profile.publicEmail = this.state.publicEmail; }
    if (this.state.firstName) { profile.firstName = this.state.firstName; }
    if (this.state.lastName) { profile.lastName = this.state.lastName; }
    if (this.state.username) { profile.username = this.state.username; }
    if (this.state.Facebook) { profile.Facebook = this.state.Facebook; }
    if (this.state.Twitter) { profile.Twitter = this.state.Twitter; }
    if (this.state.about) { profile.about = this.state.about; }
    if (this.state.address) { profile.address = this.state.address; }
    if (this.state.birthDay) { profile.birthday = this.state.birthDay.format('MM/DD/YYYY'); }
    if (this.state.city) { profile.city = this.state.city; }
    if (this.state.country) { profile.country = this.state.country; }
    if (this.state.zipVal) { profile.zip = this.state.zipVal; }
    if (this.state.state) { profile.state = this.state.state; }
    if (this.state.spiritualBelief.value) { profile.spiritualBelief = this.state.spiritualBelief.value; }
    if (this.state.image) { profile.avatar = this.state.zipVal; }
    let skills = this.state.currentSportList ? this.state.currentSportList : [];
    if (skills) { profile.skills = skills; }
    this.props.updateProfile({
      profile,
      profileID: this.state.profileID
    });
  }
  submit(data) {
    // console.log(JSON.stringify(data, null, 4));
  }
  enableButton() {
    this.setState({ canSubmit: true });
  }
  disableButton() {
    this.setState({ canSubmit: false });
  }
  handleSpiritualBeliefChange(val) {
    this.setState({ spiritualBelief: val });
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
  onloadImg(e) {
    let resultImg = e.target.result;
    console.log(resultImg);
    this.setState({image: resultImg});
    // smth action with resultImg...
    // $.ajax({
    //    type: 'POST',
    //    url: '/API/load/image',
    //    data: { file: resultImg},
    //    success: function(res) {
    //      if (res.status == "success") {
    //        alertify.success(res.data.message);
    //        let logo = $('.logo').find('img');
    //        logo.attr("src", res.data.file);
    //        imgLoader.wrap('<form>').closest('form').get(0).reset();
    //        imgLoader.unwrap();
    //      } else alertify.error(res.data.msg);
    //    },
    //    error: function(res)   {
    //      console.log(res);
    //       alertify.error(res.statusText);
    //    }
    // });
  }

  render() {
    let sport = this.state.currentSportVal;
    let level = this.state.currentAbilityLevelVal;
    let checkAddSport = (!!sport && Object.keys(sport).length !== 0) && (!!level && Object.keys(level).length !== 0);

    return (
        <div >
            <Row verticalAlign='center'>
                <Col width='60%'>
                    <ProfileSection title={'PROFILE'}
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
                            className='profile__input__wide'
                            value={this.state.firstName}
                            onChange={this.handleChange}
                            id='firstName'
                            modifier='material'
                            placeholder='First Name' />
                    </div>

                    <div className='profile__input__child' >
                        <Input
                            className='profile__input__wide'
                            value={this.state.lastName}
                            onChange={this.handleChange}
                            id='lastName'
                            modifier='material'
                            placeholder='Last Name' />
                    </div>

                    <div className='profile__input__child' >
                        <span className='profile__red-label' >*</span>
                        <Input
                            className='profile__input__wide'
                            value={this.state.username}
                            onChange={this.handleChange}
                            id='username'
                            modifier='material'
                            placeholder='Username' />
                    </div>

                </Col>
                <Col width='40%' >
                  <label
                    className='uploadbutton'
                    style={{cursor: 'pointer'}}>
                    <div
                      style={{
                        width: '100%',
                        backgroundSize: 'cover',
                        backgroundPosition: '50%',
                        backgroundRepeat: 'no-repeat',
                        height: '30vmin',

                        minHeight: '115px',

                        backgroundImage: `url(${this.state.image})`
                      }}
                      > </div>
                    <input
                      style={{display: 'none'}}
                      type='file'
                      accept='image/jpeg,image/png,image/gif'
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          let reader = new FileReader();
                          reader.onload = this.onloadImg;
                          reader.readAsDataURL(e.target.files[0]);
                        }
                      }}/>
                  </label>
                  <List className='profile__sex__list'
                        dataSource={this.state.sexTypes}
                        renderRow={this.renderSexRow}
                      />
                </Col>
            </Row>

            <div className='profile__input__child' >
                <span className='profile__red-label' >*</span>
                <Input
                    className='profile__input__wide'
                    value={this.state.publicEmail}
                    onChange={this.handleChange}
                    id='publicEmail'
                    modifier='material'
                    placeholder='Email' />
            </div>

            <div className='profile__input__child'>
                <DatePicker
                    className='text-input text-input--material'
                    placeholderText='Date of Birth'
                    showYearDropdown
                    defaultValue='01/01/2010'
                    selected={this.state.birthDay}
                    onChange={this.handleDatebirthChange} />
            </div>

            <div className='profile__input__child' >
                <Input
                    className='profile__input__wide'
                    value={this.state.Facebook}
                    onChange={this.handleChange}
                    id='Facebook'
                    modifier='material'
                    placeholder='Facebook Profile' />
            </div>

            <div className='profile__input__child' >
                <Input
                    className='profile__input__wide'
                    value={this.state.Twitter}
                    onChange={this.handleChange}
                    id='Twitter'
                    modifier='material'
                    placeholder='Twitter Profile' />
            </div>

            <div className='profile__input__child' >
                <textarea
                    className='profile__input__textarea textarea'
                    style={{backgroundColor: commonUtils.isAndroid() ? 'transparent' : null}}
                    rows='3'
                    value={this.state.about}
                    onChange={this.handleChange}
                    id='about'
                    placeholder='About'></textarea>
            </div>

            <ProfileSection title={'LOCATION'} />

            <div className='profile__input__first-child' >
                <Input
                    className='profile__input__wide'
                    value={this.state.address}
                    onChange={this.handleChange}
                    id='address'
                    modifier='material'
                    placeholder='Address' />
            </div>
            <Row className='profile__location__row'>
                <Col width='50%'>
                    <div className='profile__input__child' >
                        <Input
                            className='profile__input__wide'
                            value={this.state.city}
                            onChange={this.handleChange}
                            id='city'
                            modifier='material'
                            placeholder='City' />
                    </div>

                    {
                      this.state.showBlock || this.state.isZipShow ? <div className='profile__input__child' >
                         <Input
                            className='profile__input__wide'
                            value={this.state.zip.toString()}
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
                            value={this.state.country}
                            options={constants.Country}
                            onChange={this.handleCountryChange}
                            />
                    </div>

                    {
                      this.state.showBlock ? <div className='profile__input__child__small' >
                          <Select
                              placeholder='State'
                              name='form-field-State'
                              value={this.state.state}
                              options={this.state.showBlock ? constants.State[this.state.country.value] : []}
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
                  value={this.state.spiritualBelief}
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

            <ProfileSection title={'PASSWORD CHANGE'} />

            <div className='profile__input__first-child' >
                <Input
                    className='profile__input__wide'
                    value={this.state.newPswd}
                    onChange={this.handleChange}
                    id='newPswd'
                    modifier='material'
                    type='password'
                    placeholder='New Password' />
            </div>

            <div className='profile__input__child' >
                <Input
                    className='profile__input__wide'
                    value={this.state.confirmPswd}
                    onChange={this.handleChange}
                    id='confirmPswd'
                    modifier='material'
                    type='password'
                    placeholder='Confirm Password' />
            </div>
            <div className='actionButtonContainer' >
              <div className='actionButton'
                   onClick={() => this.handleFabClick() }>
                <Icon icon='md-check, material:md-check' />
              </div>
            </div>

        </div>
    );
  }
}

export default Profile;
