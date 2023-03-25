import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Text, StatusBar, ActivityIndicator } from 'react-native';

import { statistics } from 'api';

import { withTheme } from 'theme';

import TopList from './TopList';
import BarChart from './BarChart';
import PieChart from './PieChart';
import { prepareDataBlocks } from './utils';

import styles from './StatisticsStyles';

class Statistics extends PureComponent {
  static propTypes = {
    theme: PropTypes.object,
    themedStyles: PropTypes.object
  };

  state = {
    loading: true,
    data: null
  };

  componentDidMount() {
    statistics.getStatistics().then(({ data }) => {
      this.setState({ data, loading: false });
    });
  }

  renderChartWrapper = (children, title) => (
    <View key={title}>
      <Text style={this.props.themedStyles.blockTitle}>{title.toUpperCase()}</Text>
      <View style={this.props.themedStyles.block}>
        {children}
      </View>
    </View>
  );

  renderDataBlockByType = (type, props) => {
    const dataBlocks = {
      bar: BarChart,
      pie: PieChart,
      top: TopList
    };

    const Component = dataBlocks[type];

    return <Component {...props} />;
  };

  renderStatistics = () => {
    const { data } = this.state;

    const dataBlocks = prepareDataBlocks(data);

    return (
      <ScrollView contentContainerStyle={this.props.themedStyles.wrapper}>
        {dataBlocks.map(item => (
          this.renderChartWrapper(this.renderDataBlockByType(item.type, item.props), item.title)
        ))}
      </ScrollView>
    );
  };

  render() {
    const { theme, themedStyles } = this.props;
    const nightMode = theme.isNightMode;

    return (
      <View style={[themedStyles.flex, themedStyles.pageWrapper]}>
        <StatusBar barStyle={nightMode ? 'light-content' : 'default'} />

        {this.state.loading
          ? <ActivityIndicator color={theme.color.secondaryText} style={themedStyles.loader} />
          : this.renderStatistics()
        }
      </View>
    );
  }
}

export default withTheme(Statistics, styles);
