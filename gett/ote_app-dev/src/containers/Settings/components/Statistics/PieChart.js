import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { VictoryPie } from 'victory-native';

import { withTheme } from 'theme';

import CardList from './CardList';

import config from './config';

import styles from './PieChartStyles';

const PieChart = ({ data, total, themedStyles, cardProps }) => {
  const preparePieData = data => (
    data.map(item => ({ y: item.value }))
  );

  const renderLabel = () => (
    <View style={themedStyles.labelContainer}>
      <Text style={themedStyles.title}>{total}</Text>
      <Text style={themedStyles.label}>Completed orders</Text>
    </View>
  );

  return (
    <Fragment>
      <CardList {...cardProps} />
      <View style={themedStyles.wrapper}>
        <VictoryPie
          padding={0}
          padAngle={1}
          style={config.pieStyles}
          data={preparePieData(data)}
          innerRadius={58}
          radius={100}
          width={200}
          height={200}
          colorScale={config.colorScale}
        />

        {renderLabel()}
      </View>
    </Fragment>
  );
};

PieChart.propTypes = {
  cardProps: PropTypes.object,
  data: PropTypes.array,
  themedStyles: PropTypes.object,
  total: PropTypes.number
};

export default withTheme(PieChart, styles);
