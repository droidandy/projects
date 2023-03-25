import React from 'react';
import PropTypes from 'prop-types';
import { Card, Grid, Header, Dropdown } from 'semantic-ui-react';
import ReactEcharts from 'echarts-for-react';
import { HIGH, MEDIUM, LOW, NOT_REPORTED } from '../constants';

class ProbabilityCard extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    productsList: PropTypes.array.isRequired,
    probabilityType: PropTypes.string.isRequired,
    changeProduct: PropTypes.func.isRequired,
    getProbabilityStats: PropTypes.func.isRequired,
    probabilityStats: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleChangeProduct = this.handleChangeProduct.bind(this);
  }

  componentWillMount() {
    const { getProbabilityStats, probabilityType } = this.props;
    getProbabilityStats(probabilityType);
  }

  handleChangeProduct(value) {
    const { changeProduct, getProbabilityStats } = this.props;
    changeProduct(value);
    getProbabilityStats(value);
  }

  render() {
    const { productsList, probabilityType, probabilityStats } = this.props;
    let option = {};
    if (probabilityStats[HIGH]) {
      option = {
        xAxis: {
          type: 'category',
          data: ['LOW', 'MEDIUM', 'HIGH', 'NOT\nREPORTED'],
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            fontWeight: 600,
            width: '60px',
            fontSize: 12,
            fontFamily: 'Open Sans',
            padding: [5, 0],
            color: '#6e7881',
            lineHeight: 20,
          },
          axisLine: {
            lineStyle: {
              color: '#d6d9db',
            },
          },
        },
        yAxis: {
          type: 'value',
          show: false,
        },
        series: [{
          data: [
            {
              value: Object.keys(probabilityStats[LOW])[0],
              itemStyle: { color: '#bd5d51' },
            },
            {
              value: Object.keys(probabilityStats[MEDIUM])[0],
              itemStyle: { color: '#82c58a' },
            },
            {
              value: Object.keys(probabilityStats[HIGH])[0],
              itemStyle: { color: '#2b6540' },
            },
            {
              value: Object.keys(probabilityStats[NOT_REPORTED])[0],
              itemStyle: { color: '#0099cc' },
            },
          ],
          type: 'bar',
        }],
      };
    }
    return (
      <Card className="card-main" fluid>
        <Card.Content>
          <Card.Header>
            Probability of Active Groups
            <div className="header-actions">
              <Dropdown
                search
                selection
                options={productsList}
                value={probabilityType}
                onChange={(e, inputState) => { this.handleChangeProduct(inputState.value); }}
              />
            </div>
          </Card.Header>
          <Grid>
            { probabilityStats[HIGH] &&
              <Grid.Row>
                <Grid.Column tablet={16} largeScreen={7} className="group-probability-data">
                  <ul>
                    <li className="red-bullet">
                      <Header as="h4">Low - Groups {Object.keys(probabilityStats[LOW])[0]}</Header>
                      <p>({Object.values(probabilityStats[LOW])[0]} enrolling employees)</p>
                    </li>
                    <li className="light-green-bullet">
                      <Header as="h4">Medium - Groups {Object.keys(probabilityStats[MEDIUM])[0]}</Header>
                      <p>({Object.values(probabilityStats[MEDIUM])[0]} enrolling employees)</p>
                    </li>
                    <li className="dark-green-bullet">
                      <Header as="h4">High - Groups {Object.keys(probabilityStats[HIGH])[0]}</Header>
                      <p>({Object.values(probabilityStats[HIGH])[0]} enrolling employees)</p>
                    </li>
                    <li className="blue-bullet">
                      <Header as="h4">Not Reported - Groups {Object.keys(probabilityStats[NOT_REPORTED])[0]}</Header>
                      <p>({Object.values(probabilityStats[NOT_REPORTED])[0]} enrolling employees)</p>
                    </li>
                  </ul>
                </Grid.Column>
                <Grid.Column tablet={16} largeScreen={9} className="probability-chart">
                  <ReactEcharts
                    ref={(e) => { this.chart = e; }}
                    option={option}
                    notMerge
                    lazyUpdate
                    style={{ height: '360px', width: '100%' }}
                  />
                </Grid.Column>
              </Grid.Row>
            }
          </Grid>
        </Card.Content>
      </Card>
    );
  }
}

export default ProbabilityCard;
