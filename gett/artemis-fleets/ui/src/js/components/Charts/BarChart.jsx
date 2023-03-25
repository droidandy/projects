import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import { Button } from 'components';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { AxisLabel } from './labels';
import { chartFills, nameMapping } from './utils';
import { drop, isEmpty, omit } from 'lodash';

import CN from 'classnames';
import css from './style.css';

export default class Chart extends PureComponent {
  static Bar = Bar;

  static propTypes = {
    generalData: PropTypes.arrayOf(PropTypes.object),
    extendedData: PropTypes.arrayOf(PropTypes.array),
    generalTitle: PropTypes.string,
    extendedTitle: PropTypes.string,
    yAxisLabel: PropTypes.string,
    tooltipOptions: PropTypes.object,
    legendOptions: PropTypes.object,
    unit: PropTypes.string
  };

  static defaultProps = {
    generalData: [],
    extendedData: [],
    generalTitle: '',
    extendedTitle: '',
    yAxisLabel: '',
    backButtonLabel: ''
  };

  state = {
    activeIndex: 0,
    general: true,
    generalData: null,
    extendedData: null
  };

  componentWillReceiveProps({ generalData, extendedData }) {
    if (!isEmpty(generalData) && !isEmpty(extendedData)) {
      this.setState({ ...this.sanitizeData(generalData, extendedData) });
    }
  }

  sanitizeData(generalData, extendedData) {
    while (generalData[0] && this.isBlank(generalData[0])) {
      generalData = drop(generalData);
      extendedData = drop(extendedData);
    }

    return { generalData, extendedData };
  }
  
  isDataEmpty() {
    return isEmpty(this.state.generalData);
  }

  getData() {
    const { generalData, extendedData, activeIndex, general } = this.state;

    if (this.isDataEmpty()) return [{ name, value: 0 }];

    return general ? generalData : extendedData[activeIndex];
  }

  extend = (data) => {
    if (this.isDataEmpty()) return;

    if (data && this.state.general) {
      this.setState({ activeIndex: data.activeTooltipIndex, general: false });
    }
  };

  onXAxisClick = (data, index) => {
    if (this.state.general) {
      this.setState({ activeIndex: index, general: false });
    }
  };

  generalize = () => {
    this.setState({ general: true });
  };

  isBlank(object) {
    return !Object.getOwnPropertyNames(object).some(prop => object[prop] > 0);
  }

  getBars() {
    const data = this.props.generalData[0];
    return !data ? [] : Object.keys(omit(data, ['name', 'date']));
  }

  renderBars() {
    // TODO: "There are no orders yet" message suggests that chart is used specifically
    // for rendering information on orders. In that case it cannot be named as genetic
    // BarChart. But most likely, this message has to be passed in props.
    if (this.isDataEmpty()) return <Bar dataKey="value" name="There are no orders yet" />;

    return this.getBars().map((dataKey, i) => {
      return (
        <Bar
          key={ dataKey }
          dataKey={ dataKey }
          name={ nameMapping[dataKey] }
          unit={ this.props.unit }
          fill={ chartFills[i] }
        />
      );
    });
  }

  render() {
    const { general, activeIndex, generalData } = this.state;
    const { generalTitle, extendedTitle, yAxisLabel, tooltipOptions, legendOptions } = this.props;
    const yLabel = general ? yAxisLabel : `${yAxisLabel} ${generalData && generalData[activeIndex].name}`;

    return (
      <div>
        <div className="text-center mb-20 sm-mb-25 bold-text text-20 navy-text sm-text-14">
          { `${general ? generalTitle : extendedTitle}` }
        </div>

        <Row className="mb-40" type="flex">
          <Col span={ 24 }>
            { !general &&
              <Button size="small" className={ css.backButton } type="secondary" onClick={ this.generalize }>
                Back to monthly report
              </Button>
            }

            <ResponsiveContainer height={ 300 }>
              <BarChart className={ CN({ [css.chart]: general }) } data={ this.getData() } onClick={ this.extend }>
                <XAxis dataKey="name" onClick={ this.onXAxisClick } />
                <YAxis label={ <AxisLabel axisType="yAxis">{ yLabel }</AxisLabel> } tickLine={ false } axisLine={ false } />
                <CartesianGrid vertical={ false } />
                { !this.isDataEmpty() && <Tooltip { ...tooltipOptions } /> }
                <Legend { ...legendOptions } />
                { this.renderBars() }
              </BarChart>
            </ResponsiveContainer>
          </Col>
        </Row>
      </div>
    );
  }
}
