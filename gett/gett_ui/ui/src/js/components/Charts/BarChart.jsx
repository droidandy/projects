import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import { CustomLegend, CustomTooltip, Icon } from 'components';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { AxisLabel } from './labels';
import { chartFills, nameMapping, tickOptions } from './utils';
import { drop, isEmpty, isEqual } from 'lodash';

import CN from 'classnames';
import css from './style.css';

export default class Chart extends PureComponent {
  static propTypes = {
    generalData: PropTypes.arrayOf(PropTypes.object),
    extendedData: PropTypes.arrayOf(PropTypes.array),
    generalTitle: PropTypes.string,
    extendedTitle: PropTypes.string,
    yAxisLabel: PropTypes.string,
    tooltipOptions: PropTypes.object,
    referenceLineOptions: PropTypes.object,
    legendOptions: PropTypes.object,
    unit: PropTypes.string,
    className: PropTypes.string,
    settings: PropTypes.object,
    onIndexChange: PropTypes.func,
    isPdf: PropTypes.bool,
    height: PropTypes.number,
    pdfHeight: PropTypes.number,
    name: PropTypes.string,
    noDataMessage: PropTypes.string
  };

  static defaultProps = {
    generalData: [],
    extendedData: [],
    generalTitle: '',
    extendedTitle: '',
    yAxisLabel: '',
    backButtonLabel: '',
    className: 'mb-40',
    height: 300,
    pdfHeight: 325,
    noDataMessage: 'There are no orders yet'
  };

  constructor(props) {
    super(props);
    const { generalData, extendedData, settings, isPdf } = this.props;
    this.state = {
      activeIndex: settings ? settings.index : 0,
      general: settings ? settings.general : true,
      generalData: isPdf ? this.getChartData(generalData, extendedData, 'generalData') : null,
      extendedData: isPdf ? this.getChartData(generalData, extendedData, 'extendedData') : null
    };
  }

  componentDidUpdate(prevProps) {
    const { generalData, extendedData } = this.props;
    const { generalData: pGeneralData, extendedData: pExtendedData } = prevProps;
    if (!isEmpty(generalData) && !isEmpty(extendedData) && (!isEqual(pGeneralData, generalData) || !isEqual(pExtendedData, extendedData))) {
      this.setState({ ...this.sanitizeData(generalData, extendedData) });
    }
  }

  getChartData(generalData, extendedData, dataType) {
    const sanitized = this.sanitizeData(generalData, extendedData);
    return sanitized[dataType];
  }

  // TODO: resolve issues with 'react/sort-comp' linter rule and place before lifecycle definitions
  static Bar = Bar;

  sanitizeData(generalData, extendedData) {
    while (generalData[0] && this.isBlank(generalData[0])) {
      generalData = drop(generalData);
      extendedData = drop(extendedData);
    }

    return { generalData, extendedData };
  }

  dataIsEmpty() {
    return isEmpty(this.state.generalData);
  }

  getData() {
    const { generalData, extendedData, activeIndex, general } = this.state;

    if (this.dataIsEmpty()) return [{ name, value: 0 }];

    if (general) {
      return generalData;
    } else {
      return extendedData[activeIndex];
    }
  }

  extend = (data) => {
    if (this.dataIsEmpty()) return;

    if (data && this.state.general) {
      if (this.props.onIndexChange) {
        this.props.onIndexChange({ index: data.activeTooltipIndex, general: false });
      }
      this.setState({ activeIndex: data.activeTooltipIndex, general: false });
    }
  };

  onXAxisClick = (data, index) => {
    if (this.state.general) {
      if (this.props.onIndexChange) {
        this.props.onIndexChange({ index, general: false });
      }
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
    const { generalData, extendedData } = this.props;
    const { general } = this.state;

    if (!generalData[0]) return [];

    const propertySource = general ? generalData[0] : extendedData[0][0];

    return Object
      .getOwnPropertyNames(propertySource)
      .filter(prop => prop != 'name' && prop != 'date');
  }

  renderBars() {
    const { noDataMessage, isPdf, unit } = this.props;

    if (this.dataIsEmpty()) return <Bar dataKey="value" name={ noDataMessage } />;

    return this.getBars().map((dataKey, i) => {
      return (
        <Bar
          key={ dataKey }
          dataKey={ dataKey }
          isAnimationActive={ !isPdf }
          name={ nameMapping(dataKey) }
          unit={ unit }
          fill={ chartFills(i) }
        />
      );
    });
  }

  renderChart() {
    const { general, activeIndex, generalData } = this.state;
    const { yAxisLabel, tooltipOptions, referenceLineOptions, legendOptions, pdfHeight, isPdf } = this.props;
    const yLabel = general ? yAxisLabel : `${yAxisLabel} ${generalData && (generalData[activeIndex].name || '') }`;

    return (
      <BarChart width={ 1200 } height={ pdfHeight } className={ CN({ [css.chart]: general }) } data={ this.getData() } onClick={ this.extend }>
        <XAxis dataKey="name" height={ 40 } onClick={ this.onXAxisClick } tick={ tickOptions } tickLine={ false } />
        <YAxis label={ <AxisLabel axisType="yAxis">{ yLabel }</AxisLabel> } tickLine={ false } axisLine={ false } tick={ tickOptions } />
        <CartesianGrid stroke="#f7f7f7" vertical={ false } />
        { !this.dataIsEmpty() && <Tooltip content={ <CustomTooltip /> } cursor={ { fill: '#f0f0f0' } } { ...tooltipOptions } /> }
        { isPdf ? <Legend { ...legendOptions } /> : <Legend content={ <CustomLegend /> } { ...legendOptions } /> }
        { this.renderBars() }
        <ReferenceLine { ...referenceLineOptions } />
      </BarChart>
    );
  }

  render() {
    const { general } = this.state;
    const { generalTitle, extendedTitle, className, height, isPdf, name } = this.props;
    return (
      <div data-name={ name }>
        { generalTitle &&
          <div className={ CN({ 'p-20': !isPdf }, 'layout horizontal center mb-20 bold-text', css.title) }>
            <div className="flex">{ `${general ? generalTitle : extendedTitle}` }</div>
            { !isPdf && !general &&
              <div className="layout horizontal center pointer blue-link" onClick={ this.generalize }>
                <Icon icon="MdArrowBack" className="mr-10 text-20" />
                back to monthly
              </div>
            }
          </div>
        }

        <Row className={ className } type="flex">
          <Col span={ 24 }>
            { isPdf
              ? this.renderChart()
              : <ResponsiveContainer width="100%" height={ height }>
                  { this.renderChart() }
                </ResponsiveContainer>
            }
          </Col>
        </Row>
      </div>
    );
  }
}
