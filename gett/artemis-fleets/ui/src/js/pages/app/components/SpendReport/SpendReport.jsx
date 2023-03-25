import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default class SpendReport extends PureComponent {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    domain: PropTypes.array,
    name: PropTypes.string
  };

  render() {
    const { name, data, domain } = this.props;
    
    return (
      <div>
        <div className="text-center mb-20 bold-text text-20 navy-text sm-text-14">{ name ? name : 'Rate' }</div>

        <div className="mb-40">
          <ResponsiveContainer height={ 300 }>
            <AreaChart data={ isEmpty(data) ? [{ name: '', value: 0 }] : data }>
             <XAxis dataKey="name" />
             <YAxis tickLine={ false } axisLine={ false } domain={ domain }  />
             <CartesianGrid vertical={ false } />
             <Tooltip />
             <Legend />
              <Area type="monotone" name={ name ? name : 'Rate' } dataKey="value" stroke="#92c1f0" fillOpacity={ 0.8 } fill="#a3cbf2" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
}
