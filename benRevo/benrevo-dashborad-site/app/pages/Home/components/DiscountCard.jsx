import React from 'react';
import PropTypes from 'prop-types';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import { Card, Grid, Table, Dropdown, Message } from 'semantic-ui-react';
import NumberFormat from 'react-number-format';

class DiscountCard extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    discountStats: PropTypes.object.isRequired,
    quarterYear: PropTypes.string.isRequired,
    changeQY: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.toNiceNumber = this.toNiceNumber.bind(this);
  }

  componentWillMount() {
    const { changeQY, quarterYear } = this.props;
    changeQY(quarterYear);
  }

  toNiceNumber(value) {
    let commas = 0;
    let endValue = parseFloat(value);
    while (endValue >= 1000) {
      endValue /= 1000;
      commas += 1;
    }
    endValue = endValue.toFixed(2);
    switch (commas) {
      case 4: return `$${endValue}T`;
      case 3: return `$${endValue}B`;
      case 2: return `$${endValue}M`;
      case 1: return `$${endValue}K`;
      default: return `$${endValue}`;
    }
  }

  render() {
    const { discountStats, quarterYear, changeQY } = this.props;
    const discountPersons = discountStats.salesPersons;

    const quarterOptions = [];
    for (let i = 0; i < 4; i += 1) {
      const forwards = moment().add(i, 'Q').format('[Q]Q YYYY');
      quarterOptions.push({ key: forwards, value: forwards, text: forwards });
      if (i > 0) {
        const backwards = moment().subtract(i, 'Q').format('[Q]Q YYYY');
        quarterOptions.unshift({ key: backwards, value: backwards, text: backwards });
      }
    }

    const nameLength = Math.max.apply(null, discountPersons.map((item) => item.name.length));

    const option = {
      title: {
        text: 'DISCOUNTS\nCLOSED/PENDING',
        left: 'center',
        top: '33%',
        padding: [24, 0],
        textStyle: {
          align: 'center',
          fontWeight: 'normal',
          color: '#99A1A7',
          fontSize: 14,
        },
      },
      legend: {
        orient: 'vertical',
        type: 'scroll',
        x: 'center',
        y: 'bottom',
        borderColor: '#99A1A7',
        textStyle: {
          fontFamily: 'monospace',
        },
        data: discountPersons.map((item) => item.name),
        formatter: (name) => {
          for (let i = 0; i < discountPersons.length; i += 1) {
            if (discountPersons[i].name === name) {
              return `${name.padEnd(nameLength + 3)} $${discountPersons[i].discounts.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
            }
          }
          return '';
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}:<br />&#36;{c} ({d}%)',
      },
      series: [
        {
          name: this.toNiceNumber(discountStats.totalGroupDiscounts),
          type: 'pie',
          radius: ['80px', '95px'],
          startAngle: -60,
          avoidLabelOverlap: false,
          center: ['50%', '35%'],
          label: {
            normal: {
              show: false,
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: [
            {
              value: '-',
              name: this.toNiceNumber(discountStats.totalGroupDiscounts),
              itemStyle: { opacity: 0 },
              label: {
                normal: {
                  show: true,
                  position: 'center',
                  formatter: '{a}',
                  fontSize: 25,
                  fontWeight: 'bold',
                  color: '#3A444D',
                },
              },
            },
          ].concat(discountPersons.map((item) => ({ value: item.discounts, name: item.name }))),
        },
      ],
    };
    return (
      <Card className="card-main" fluid>
        <Card.Content>
          <Card.Header>
            Discounts Applied
            <div className="header-actions">
              <Dropdown
                search
                selection
                options={quarterOptions}
                value={quarterYear}
                onChange={(e, inputState) => { changeQY(inputState.value); }}
              />
            </div>
          </Card.Header>
          { discountStats.salesPersons.length > 0 &&
            <Grid>
              <Grid.Row>
                <Grid.Column width={6}>
                  <Table className="discounts-info-table">
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell>
                          <p className="discount-subheader discount-blue">CLOSED ({discountStats.closedGroupCount})</p>
                          <div className="person-outline-icon"></div>
                          <div className="person-count-text">{discountStats.closedGroupEmployeeCount}</div>
                          <p className="money-text">
                            <NumberFormat
                              thousandSeparator
                              prefix="$"
                              value={discountStats.closedGroupDiscounts}
                              displayType={'text'}
                            />
                          </p>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell className="discounts-pending">
                          <p className="discount-subheader discount-blue">PENDING ({discountStats.pendingGroupCount})</p>
                          <div className="person-outline-icon"></div>
                          <div className="person-count-text">{discountStats.pendingGroupEmployeeCount}</div>
                          <p className="money-text">
                            <NumberFormat
                              thousandSeparator
                              prefix="$"
                              value={discountStats.pendingGroupDiscounts}
                              displayType={'text'}
                            />
                          </p>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell className="discounts-total">
                          <p className="discount-subheader">TOTAL ({discountStats.totalGroupCount})</p>
                          <div className="person-outline-icon-black"></div>
                          <div className="person-count-text">{discountStats.totalGroupEmployeeCount}</div>
                          <p className="money-text">
                            <NumberFormat
                              thousandSeparator
                              prefix="$"
                              value={discountStats.totalGroupDiscounts}
                              displayType={'text'}
                            />
                          </p>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row><Table.Cell></Table.Cell></Table.Row>
                    </Table.Body>
                  </Table>
                </Grid.Column>
                <Grid.Column width={10}>
                  <ReactEcharts
                    ref={(e) => { this.chart = e; }}
                    option={option}
                    notMerge
                    lazyUpdate
                    style={{ height: '344px', width: '100%' }}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          }
          { discountStats.salesPersons.length === 0 &&
            <Message info>
              <Message.Header>No Discount Data</Message.Header>
              <p>There is currently no discount data to show for {quarterYear}</p>
            </Message>
          }
        </Card.Content>
      </Card>
    );
  }
}

export default DiscountCard;
