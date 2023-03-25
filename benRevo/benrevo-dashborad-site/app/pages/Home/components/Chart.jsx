import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';
import { Link } from 'react-router';
import { Card, Dropdown, Loader, Grid } from 'semantic-ui-react';
import ReactEcharts from 'echarts-for-react';
import Filters from '../../../components/Filters';
import FilterList from '../../../components/Filters/List';
import { getColor } from './../../../utils/getColor';
import { BENREVO_PATH } from './../../../config';
import { getDate } from '../../../utils/query';

class Chart extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    filters: PropTypes.object.isRequired,
    chart: PropTypes.object.isRequired,
    clients: PropTypes.array.isRequired,
    products: PropTypes.array.isRequired,
    changeFilter: PropTypes.func.isRequired,
    getClients: PropTypes.func.isRequired,
    setFilters: PropTypes.func.isRequired,
    clearFilter: PropTypes.func.isRequired,
    maxDiff: PropTypes.number.isRequired,
    minDiff: PropTypes.number.isRequired,
    filterCarriers: PropTypes.array.isRequired,
    filterBrokerages: PropTypes.array.isRequired,
    filterSales: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      tooltipOn: true,
    };

    this.setTooltipOn = this.setTooltipOn.bind(this);
  }

  onSetCurrentRange(range) {
    this.props.changeFilter('difference', range);
  }

  setTooltipOn(bool) {
    this.setState({ tooltipOn: bool });
  }

  render() {
    const { filters, changeFilter, clients, chart, loading, getClients, products, setFilters, clearFilter } = this.props;
    const positions = [];
    for (let i = 0; i < clients.length; i += 1) {
      const client = clients[i];
      positions.push([client.diffPercent, client.employeeCount]);
    }
    const option = {
      tooltip: {
        show: this.state.tooltipOn,
        enterable: true,
        padding: 15,
        backgroundColor: '#3A444D',
        position: 'top',
        formatter: (ticket) => {
          const client = clients[ticket.dataIndex];
          const dtq = clients[ticket.dataIndex].quoteType === 'DECLINED';

          return `<div>
                  <div class="chart-tooltip-title">${client.clientName}</div>
                  <div class="chart-tooltip-time">${getDate(client.effectiveDate)}</div>
                  <div class="${dtq ? 'chart-tooltip-declined' : ''}">${dtq ? 'Declined to Quote (DTQ)' : ''}</div>
                  <span class="chart-tooltip-diff">${(client.diffPercent > 0) ? `+${client.diffPercent}` : client.diffPercent}%</span>
                  <a href="${BENREVO_PATH}client/${client.clientId}">DETAILS</a>
                  </div>`;
        },
      },
      grid: {
        top: '10',
        bottom: '70',
        left: '80',
        right: '20',
      },
      xAxis: {
        name: '% Diff vs Current',
        inverse: true,
        nameLocation: 'middle',
      //  boundaryGap: ['10%', '0'],
        offset: 10,
        nameGap: 40,
        minInterval: chart.step,
        maxInterval: chart.step,
        interval: chart.step,
        axisLine: {
          show: false,
          onZero: false,
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        name: 'Eligible Employees',
        nameLocation: 'middle',
        boundaryGap: ['10%', '20%'],
        offset: 20,
        nameGap: 50,
        splitNumber: 4,
        splitLine: {
          interval: 80,
          lineStyle: {
            color: ['#EAEAEA'],
          },
        },
        axisLine: {
          show: false,
          onZero: false,
        },
        axisTick: {
          show: false,
        },
      },
      series: [{
        data: positions,
        type: 'custom',
        renderItem: (params, api) => {
          const valDiff = api.value(0);
          const baseNum = 10;
          let size = 25;
          let coef = clients.length / baseNum;
          const coords = api.coord([valDiff, api.value(1)]);
          const dtq = clients[params.dataIndex] && clients[params.dataIndex].quoteType === 'DECLINED';

          const style = {
            fill: !dtq ? getColor(parseFloat(valDiff)) : '#D3CD00',
            stroke: 'white',
            textFill: 'white',
          };

          if (coef > 3.5) coef = 3.5;
          else if (coef < 1) coef = 1;

          size /= coef;

          if (size >= 20) {
            style.text = `${valDiff}%`;
          }

          return {
            type: 'circle',
            shape: {
              cx: coords[0], cy: coords[1], r: size,
            },
            style,
          };
        },
      }],
    };

    return (
      <Card className="card-main card-chart" fluid>
        <Card.Content>
          <Card.Header>
            Clients
            <Filters
              relativeElement={'.card-main.card-chart'}
              filters={filters}
              changeFilter={changeFilter}
              saveFilters={getClients}
              maxDiff={this.props.maxDiff}
              minDiff={this.props.minDiff}
              carriers={this.props.filterCarriers}
              brokers={this.props.filterBrokerages}
              sae={this.props.filterSales}
              setTooltipOn={this.setTooltipOn}
            />
            <span className="header-actions">
              <Dropdown
                search
                selection
                options={products}
                value={filters.product}
                onChange={(e, inputState) => { changeFilter('product', inputState.value); }}
              />
            </span>
          </Card.Header>
          <FilterList changeFilter={changeFilter} filters={filters} clearFilter={clearFilter} />
          <div className="chart-wrap">
            { !loading && clients.length > 0 &&
            <Grid className="chart-legend">
              <Grid.Row columns={chart.ranges.length}>
                { chart.ranges.map((item, i) => {
                  const showFull = chart.ranges.length === 1 || (chart.ranges.length === 2 && chart.ranges[0][0] === 0 && chart.ranges[1][1] === 0);
                  const className = (chart.ranges.length === 1) ? 'bordered' : '';
                  let text = '';
                  if (i === 0 && !showFull) text = <span>{'> '}<FormattedNumber value={item[0]} />% {item[0] < 0 ? 'BELOW' : 'ABOVE'}</span>;
                  else if (i === chart.ranges.length - 1 && !showFull) text = <span>{'< '}<FormattedNumber value={item[1]} />% {item[1] < 0 ? 'BELOW' : 'ABOVE'}</span>;
                  else text = <span><FormattedNumber value={item[1]} /> to <FormattedNumber value={item[0]} />% {item[1] < 1 ? 'BELOW' : 'ABOVE'}</span>;

                  return (
                    <Grid.Column className={className} tabIndex={0} key={i} textAlign="center" onClick={() => { this.onSetCurrentRange(item); }}>
                      <div className="legend-title">{text}</div>
                      <a>{chart.positions[i] ? chart.positions[i].length : '0'} Clients</a>
                    </Grid.Column>
                  );
                })}
              </Grid.Row>
            </Grid>
            }
            { !loading && clients.length > 0 &&
            <ReactEcharts
              ref={(e) => { this.chart = e; }}
              option={option}
              notMerge
              lazyUpdate
              style={{ height: '360px', width: '100%' }}
              theme={'theme_name'}
            />
            }
            { (loading || !clients.length) &&
            <div className="empty">
              <Loader inline indeterminate active={loading} size="big">Fetching clients</Loader>
              { !clients.length && !loading && <span>No Clients</span> }
            </div>
            }
          </div>
          <Grid>
            <Grid.Row>
              <Grid.Column>
                <div className="card-bottom">
                  <Link to="/clients" onClick={() => { setFilters(); }}>View All Clients</Link>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Card.Content>
      </Card>
    );
  }
}

export default Chart;
