/**
 * Universal navbar component
 * Examples of use:
 *
 * 1. <Navbar left="Back" center="Home" onLeftClick={() => this.onBack()}/>
 * 2. <Navbar left="Back" right="Save" center="Home" onLeftClick={() => this.onBack()} onRightClick={() => this.onSave()}/>
 * 3. <Navbar left={["Back", <Image source={require('../img/save.png')}/>]}
 *            right="Remove"
 *            center="Home"
 *            onLeftClick={[() => this.onBack(), () => this.onSave()]}
 *            onRightClick={() => this.onRemove()}/>
 *
 * Also you can set up customStyle prop with object for any listed items, example:
 * <Navbar left="Back" customStyle={{textItem: {color: 'red'}}}/>
 */

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import React, { Component } from 'react';


const Style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 44
  },
  left: {
    flexDirection: 'row',
    flex: 1,
    marginLeft: 7
  },
  right: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 7,
    justifyContent: 'flex-end'
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 3
  },
  centerText: {
    color: 'black',
    fontSize: 20
  },
  buttonItem: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 4,
    paddingRight: 4
  },
  textItem: {
    color: 'black'
  }
});

export default class NavBar extends Component {

  static propTypes = {
    center: React.PropTypes.any,
    left: React.PropTypes.any,
    right: React.PropTypes.any,
    onLeftClick: React.PropTypes.any,
    onRightClick: React.PropTypes.any,
    customStyle: React.PropTypes.object
  };

  static defaultProps = {
    center: null,
    left: null,
    right: null,
    onLeftClick: null,
    onRightClick: null,
    customStyle: {}
  };

  style(styleName) {
    const { customStyle } = this.props;
    return [Style[styleName], customStyle && customStyle[styleName]];
  }

  render() {
    let { center, left, right, onLeftClick, onRightClick } = this.props;

    if (!Array.isArray(left)) {
      left = [left];
    }

    if (!Array.isArray(right)) {
      right = [right];
    }

    if (onLeftClick && !Array.isArray(onLeftClick)) {
      onLeftClick = [onLeftClick];
    }

    if (onRightClick && !Array.isArray(onRightClick)) {
      onRightClick = [onRightClick];
    }

    if (center && typeof center == "string") {
      center = <Text numberOfLines={1} style={this.style('centerText')}>{center}</Text>;
    }


    left = left.map((content, key) => {
      if (typeof content === 'string') {
        content = <Text style={this.style('textItem')}>{content}</Text>;
      }
      return (
        <TouchableOpacity key={key} onPress={onLeftClick ? onLeftClick[key] : null} style={[this.style('buttonItem'), this.props.leftButtonCustomStyle]}>
          {content}
        </TouchableOpacity>
      );
    });

    right = right.map((content, key) => {
      if (typeof content === 'string') {
        content = <Text style={this.style('textItem')}>{content}</Text>;
      }
      return (
        <TouchableOpacity key={key} onPress={onRightClick ? onRightClick[key] : null} style={[this.style('buttonItem'), this.props.rightButtonCustomStyle]}>
          {content}
        </TouchableOpacity>
      );
    });

    return (
      <View style={this.style('container')}>
        <View style={this.style('left')}>
          {left}
        </View>
        <View style={this.style('center')}>
          {center}
        </View>
        <View style={this.style('right')}>
          {right}
        </View>
      </View>
    );
  }

}
