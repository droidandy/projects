import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    Dimensions,
    StatusBar,
    TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import List from 'antd-mobile/lib/list';
import Checkbox from 'antd-mobile/lib/checkbox';
import Button from 'antd-mobile/lib/button';
import InputItem from 'antd-mobile/lib/input-item';
import Icon from 'react-native-vector-icons/FontAwesome';
import ModalPicker from '../components/modalPicker';
import NavBar from '../components/NavBar';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

// let heightBotton = Platform.OS === 'ios' ? 55 : 78;

const styles = StyleSheet.create({
  head: {
    color: '#2d3036',
    marginTop: 10,
    fontSize: 25,
    marginBottom: 10,
    alignSelf: 'center',
    textAlign: 'center'
  },
  sub_head: {
    textAlign: 'center',
    fontSize: 15,
    color: '#333333',
    marginBottom: 10,
  },
  register_text_first: {
    fontSize: 15,
    color: '#2d3036',
  },
  register_text_last: {
    fontSize: 15,
    color: '#108ee9',
  },
  line: {
    height: deviceHeight,
    width: deviceWidth,
    backgroundColor: '#2d3036',
    position: 'absolute',
    top: 0
  },
  item: {
    height: deviceHeight,
    width: deviceWidth,
    position: 'absolute',
    top: 0
  }
});

@connect(state => ({ ...state }), dispatch => bindActionCreators({}, dispatch))

class DashboardPage extends Component {
  static propTypes = {
    navigator: React.PropTypes.any.isRequired, //eslint-disable-line react/forbid-prop-types
  }
  constructor(props) {
    super(props);
    this.onPressBack = this.onPressBack.bind(this);
    this.state = {
      checked: false,
      email: '',
      password: '',
      confirmPassword: '',
      nickname: '',
      phoneNumber: '',
      selectedValuePicker: 1,

    };
  }

  componentWillMount() {

  }
  onPressBack() {
    const { navigator } = this.props;
    navigator.pop();
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor="#44c5fb" barStyle="light-content" />
        <NavBar
          leftIcon={<Icon name="angle-left" size={35} color="#fff" />}
          titleNavBar={''}
          onLeftPress={this.onPressBack}
        />
        <ScrollView scrollEnabled contentContainerStyle={{ }}>
          <Text style={styles.head}>Create an Account</Text>
          <List style={{ marginTop: 10 }}>
            <InputItem
              placeholder="E-mail"
              labelNumber={6}
              value={this.state.email}
              onChange={(val) => { this.setState({ email: val }); }}
            >
              E-mail
            </InputItem>
            <InputItem
              placeholder="Password"
              type="password"
              labelNumber={6}
              value={this.state.password}
              onChange={(val) => { this.setState({ password: val }); }}
            >
              Password
            </InputItem>
            <InputItem
              placeholder="Confirm Password"
              type="password"
              labelNumber={6}
              value={this.state.confirmPassword}
              onChange={(val) => { this.setState({ confirmPassword: val }); }}
            >
              Confirm Password
            </InputItem>
            <InputItem
              placeholder="Nickname"
              labelNumber={6}
              value={this.state.nickname}
              onChange={(val) => { this.setState({ nickname: val }); }}
            >
              Nickname
            </InputItem>
            <ModalPicker
              data={[{ key: 0, label: 'Fruits' }, { key: 1, label: 'Red Apples' }, { key: 2, label: 'Cherries' }]}
              initValue="Hebitual Residense"
              onChange={(option) => { console.log(`${option.label} (${option.key}) nom nom nom`); }}
            />
            <InputItem
              type="phone"
              placeholder="Phone number"
              labelNumber={6}
              value={this.state.phoneNumber}
              onChange={(val) => { this.setState({ phoneNumber: val }); }}
            >
              Phone number
            </InputItem>
          </List>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 10, marginBottom: 10, marginLeft: 15 }}>
            <Checkbox
              name={'agree'}
              checked={this.state.checked}
              defaultChecked={this.state.checked}
              onChange={(e) => { this.setState({ checked: e.target.checked }); }}
            />
            <Text style={styles.register_text_first}> I had read the</Text>
            <TouchableOpacity>
              <Text style={styles.register_text_last}> agreement</Text>
            </TouchableOpacity>
          </View>
          <Button
            style={{ width: (deviceWidth / 3), justifyContent: 'center', alignSelf: 'center', marginTop: 10, marginBottom: 10 }}
            type={'primary'}
            onClick={() => { console.log('Register'); }}
          >
            Register
          </Button>
        </ScrollView>
      </View>
    );
  }
}

export default DashboardPage;
