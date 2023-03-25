import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View, Text, TouchableWithoutFeedback } from 'react-native';
import { FastComponent } from 'utils';

export default class AddressTabBar extends FastComponent {
  constructor(props) {
    super(props);
    const { tabs, onTabChange } = props;
    this.handlers = {};
    tabs.forEach((tab) => {
      this.handlers[tab.id] = onTabChange.bind(this, tab.id);
    });
  }

  static propTypes = {
    activeTab: PropTypes.string,
    onTabChange: PropTypes.func,
    tabs: PropTypes.array,
    themedStyles: PropTypes.object
  };

  renderTab = (tab) => {
    const { label, id } = tab;
    const { themedStyles, activeTab } = this.props;
    return (
      <TouchableWithoutFeedback key={id} onPress={this.handlers[id]}>
        <View style={[themedStyles.tabContainer, id === activeTab && themedStyles.activeTab]}>
          <Text style={[themedStyles.tabLabel, id === activeTab && themedStyles.activeTabLabel]}>
            {label.toUpperCase()}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  render() {
    const { tabs, themedStyles } = this.props;

    return (
      <ScrollView
        keyboardShouldPersistTaps="handled"
        horizontal
        style={themedStyles.tabBarContent}
        showsHorizontalScrollIndicator={false}
        bounces={false}
      >
        {tabs.map(this.renderTab)}
      </ScrollView>
    );
  }
}
