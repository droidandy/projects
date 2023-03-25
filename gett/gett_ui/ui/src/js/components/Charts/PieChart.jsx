import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, PieChart, Pie, Curve } from 'recharts';
import { PieLabel } from './labels';
import { chartFills, nameMapping } from './utils';

import CN from 'classnames';
import css from './style.css';

export default class Chart extends PureComponent {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    title: PropTypes.string,
    matches: PropTypes.bool,
    unit: PropTypes.string,
    isPdf: PropTypes.bool,
    name: PropTypes.string
  };

  static defaultProps = {
    data: [],
    title: '',
    matches: true,
    unit: 'percentage'
  };

  dataIsEmpty = data => !data.find(obj => obj.value > 0);

  emptyData = [{ name: 'No Data', value: 1 }];

  prepareData = (data) => {
    if (this.dataIsEmpty(data)) {
      return this.emptyData ;
    } else {
      // yLevel is required to disperse pie chart labels in case of several zero values, otherwise they overlap each other
      let yLevel = 0;
      return data.map((obj, i) => ({ ...obj, name: nameMapping(obj.name), fill: chartFills(i), yLevel: obj.value > 0 ? 0 : yLevel++ }));
    }
  }

  renderPieLabel(props) {
    const { data, unit } = this.props;

    if (!props.value) return;

    return <PieLabel { ...props } unit={ this.dataIsEmpty(data) || unit } />;
  }

  renderLabelLine(props) {
    const { points, stroke, value } = props;

    if (!value) return;

    return <Curve stroke={ stroke } points={ points } />;
  }

  renderChart() {
    const { data, matches, isPdf } = this.props;

    return (
      <PieChart width={ 550 } height={ 300 }>
        <Pie
          dataKey="value"
          isAnimationActive={ !isPdf }
          data={ this.prepareData(data) }
          labelLine={ props => this.renderLabelLine(props) }
          label={ props => this.renderPieLabel(props) }
          cx="50%"
          cy="50%"
          outerRadius={ matches ? '50%' : '40%' }
        />
      </PieChart>
    );
  }

  render() {
    const { title, matches, isPdf, name } = this.props;

    return (
      <div data-name={ name }>
        { title && <div className={ CN('mb-20 p-20 bold-text', css.border, css.title) }>{ title }</div> }
        { isPdf
          ? this.renderChart()
          : <ResponsiveContainer height={ matches ? 300 : 150 }>
              { this.renderChart() }
            </ResponsiveContainer>
        }
      </div>
    );
  }
}
