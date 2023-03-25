import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';
import { VictoryBar, VictoryGroup, VictoryChart, VictoryAxis, VictoryContainer } from 'victory-native';

import config from './config';
import { getColorFromScale, prepareLabelOfWeek, tickFormat } from './utils';

import CardList from './CardList';

class BarChart extends PureComponent {
  static propTypes = {
    cardProps: PropTypes.object,
    data: PropTypes.array,
    offset: PropTypes.number,
    weekends: PropTypes.array,
    width: PropTypes.number
  };

  static defaultProps = {
    offset: 14,
    width: 380
  };

  state = {
    activeIndex: null
  };

  prepareDayLabelColor = (_, index) => (
    this.props.weekends && this.props.weekends[index] ? '#fc9aac' : '#8e8e93'
  );

  prepareTickFormat = t => (
    (this.isThousandCost() && t >= 1000) ? `${Math.round(t / 1000)}k` : parseInt(t, 10)
  );

  handlePressBar = (_, data) => {
    const nextIndex = this.state.activeIndex !== data.index ? data.index : null;
    this.setState({ activeIndex: nextIndex });
  };

  isThousandCost = () => (
    this.props.data.some(item => item.data.some(rowItem => rowItem.y > 1000))
  );

  renderAxis = content => (
    <ScrollView horizontal>
      <VictoryChart
        width={this.props.width}
        height={300}
        containerComponent={<VictoryContainer disableContainerEvents />}
      >
        <VictoryAxis crossAxis
          style={{
            ...config.barStyles.xAxis,
            tickLabels: { fontSize: 10, fill: this.prepareDayLabelColor }
          }}
          tickFormat={tickFormat}
          label={prepareLabelOfWeek()}
        />
        <VictoryAxis crossAxis dependentAxis
          style={config.barStyles.yAxis}
          tickFormat={this.prepareTickFormat}
          orientation="right"
        />

        {content}
      </VictoryChart>
    </ScrollView>
  );

  renderBar = (item, index) => (
    <VictoryBar
      name={`bar-${index}`}
      key={item.name}
      cornerRadius={!item.width ? 3 : 0}
      barWidth={item.width || 10}
      style={{
        data: {
          stroke: 'none',
          fill: d => item.color || getColorFromScale(d.stack - 1),
          fillOpacity: d => (d.eventKey === this.state.activeIndex ? 0.4 : 1)
        }
      }}
      data={item.data}
    />
  );

  renderGroup = data => (
    <VictoryGroup
      offset={this.props.offset}
      colorScale={config.colorScale}
      events={[{
        childName: 'all',
        target: 'data',
        eventHandlers: { onPressIn: this.handlePressBar }
      }]}
    >
      {data.map(this.renderBar)}
    </VictoryGroup>
  );

  render() {
    const { activeIndex } = this.state;
    const { data, cardProps } = this.props;

    return (
      <Fragment>
        <CardList {...cardProps} data={cardProps.data(activeIndex)} />

        {this.renderAxis(this.renderGroup(data))}
      </Fragment>
    );
  }
}

export default BarChart;
