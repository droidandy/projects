import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { nameMapping, tickOptions } from 'components/Charts/utils';
import { AxisLabel, CustomLegend, CustomTooltip } from 'components';

import CN from 'classnames';
import css from './style.css';

export default class SpendChart extends PureComponent {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    label: PropTypes.string,
    dataKey: PropTypes.string,
    height: PropTypes.number,
    legend: PropTypes.object,
    isPdf: PropTypes.bool,
    generalTitle: PropTypes.string,
    name: PropTypes.string
  };

  static defaultProps = {
    height: 200
  };

  renderChart() {
    const { dataKey, data, label, legend, isPdf } = this.props;

    return (
      <BarChart width={ 1200 } height={ 300 } data={ data }>
        <XAxis dataKey={ dataKey } height={ 40 } tick={ tickOptions } tickLine={ false } />
        <YAxis label={ label && <AxisLabel axisType="yAxis">{ label }</AxisLabel> } tickLine={ false } axisLine={ false } tick={ tickOptions } />
        <CartesianGrid stroke="#f7f7f7" vertical={ false } />
        <Tooltip content={ <CustomTooltip /> } cursor={ { fill: '#f0f0f0' } } />
        { isPdf ? <Legend /> : <Legend content={ <CustomLegend /> } /> }
        <Bar
          name={ legend ? legend.firstItem.title : nameMapping('current') }
          dataKey={ legend ? legend.firstItem.key : 'current' }
          fill="#50d166"
        />
        <Bar
          name={ legend ? legend.secondItem.title : nameMapping('previous') }
          dataKey={ legend ? legend.secondItem.key : 'previous' }
          fill="#1875f0"
        />
      </BarChart>
    );
  }

  render() {
    const { isPdf, height, generalTitle, name } = this.props;
    return (
      <div data-name={ name }>
        <div className={ CN({ 'p-20': !isPdf }, 'mb-20 bold-text', css.title) }>
          { generalTitle }
        </div>
        { isPdf
          ? this.renderChart()
          : <ResponsiveContainer width="100%" height={ height }>
              { this.renderChart() }
            </ResponsiveContainer>
        }
      </div>
    );
  }
}
