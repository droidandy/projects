import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation';
import { Answers } from 'react-native-fabric';

import { withTheme } from 'theme';

import { OrdersList } from './components';

import styles from './styles';

function renderTab(route, { isActive, onPress, themedStyles }) {
  return (
    <TouchableWithoutFeedback key={route.routeName} onPress={onPress}>
      <View style={[themedStyles.tab, isActive && themedStyles.activeTab]}>
        <Text style={[themedStyles.tabLabel, isActive && themedStyles.activeTabLabel]}>
          {`${route.routeName.toUpperCase()}\n(${route.params.count || 0})`}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

function renderTabBar({ navigationState, navigation, themedStyles }) {
  return (
    <View style={themedStyles.tabsWrapper}>
      {navigationState.routes.map((route, index) => (
        renderTab(route, {
          isActive: index === navigationState.index,
          themedStyles,
          onPress: () => {
            Answers.logContentView(`${route.routeName} tab was opened`, 'tab view', `${route.routeName}TabOpen`);
            navigation.navigate(route.routeName);
            navigationState.params.onChangeTab(route.routeName);
          }
        })))
      }
    </View>
  );
}

export default createMaterialTopTabNavigator(
  {
    Personal: { screen: props => <OrdersList idsType="include" {...props} /> },
    Business: { screen: props => <OrdersList idsType="exclude" {...props} /> },
    Previous: { screen: props => <OrdersList type="previous" {...props} /> }
  },
  {
    tabBarComponent: withTheme(renderTabBar, styles),
    backBehavior: 'none'
  }
);

renderTabBar.propTypes = {
  navigation: PropTypes.object,
  navigationState: PropTypes.object,
  themedStyles: PropTypes.object
};
