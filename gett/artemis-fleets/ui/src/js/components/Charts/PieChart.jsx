import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, PieChart, Pie } from 'recharts';
import { PieLabel } from './labels';
import { chartFills, nameMapping } from './utils';

export default class Chart extends PureComponent {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    title: PropTypes.string,
    matches: PropTypes.bool,
    unit: PropTypes.string
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
      return data.map((obj, i) => ({ ...obj, name: nameMapping[obj.name] || obj.name, fill: chartFills[i], yLevel: obj.value > 0 ? 0 : yLevel++ }));
    }
  }

  render() {
    const { data, title, matches, unit } = this.props;

    return (
      <div>
        <div className="text-center mb-20 bold-text text-18 navy-text sm-text-14">{ title }</div>
        <ResponsiveContainer height={ matches ? 300 : 150 }>
          <PieChart>
            <Pie
              data={ this.prepareData(data) }
              label={ props => <PieLabel { ...props } unit={ this.dataIsEmpty(data) || unit } /> }
              cx="50%"
              cy="50%"
              outerRadius={ matches ? '50%' : '40%' }
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
