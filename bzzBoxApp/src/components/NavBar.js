import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    Dimensions
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  containerNavBar: {
    height: Platform.OS === 'ios' ? 64 : 56,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    flexDirection: 'row',
    backgroundColor: '#44c5fb',
    width: deviceWidth,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  buttonNavBar: {
    marginLeft: 7,
    height: 23,
    width: 23
  },
  titleNavBar: {
    color: '#fff',
    fontSize: 17,
  },
  changeNavBar: {
    backgroundColor: '#2d3036',
    position: 'absolute',
    top: 0,
    left: 0,
    height: Platform.OS === 'ios' ? 64 : 56,
    width: deviceWidth
  }
});

class NavBar extends Component {
  static propTypes = {
    onLeftPress: React.PropTypes.func,
    titleNavBar: React.PropTypes.string,
    showMenu: React.PropTypes.bool,
    leftIcon: React.PropTypes.object, //eslint-disable-line react/forbid-prop-types
  }
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const {
      onLeftPress,
      titleNavBar,
      showMenu,
      leftIcon
    } = this.props;
    return (
      <View style={styles.containerNavBar}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity style={{ height: Platform.OS === 'ios' ? 40 : 56, alignItems: 'center', justifyContent: 'center' }} onPress={onLeftPress}>
            {leftIcon}
          </TouchableOpacity>
        </View>
        <View style={{ flex: 7, alignSelf: 'center', alignItems: 'center' }} >
          <Text style={styles.titleNavBar}>{titleNavBar}</Text>
        </View>
        {
          showMenu ?
            <View style={[styles.changeNavBar, { opacity: 0.7 }]} />
              :
            null
        }
        <View style={{ flex: 1 }} />
      </View>
    );
  }
}


export default NavBar;
