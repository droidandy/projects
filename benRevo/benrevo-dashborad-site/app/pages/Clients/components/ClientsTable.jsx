import React from 'react';
import PropTypes from 'prop-types';
import { Table, Image, Popup, Checkbox, Grid, Icon } from 'semantic-ui-react';
import { Link } from 'react-router';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import RoundRuler from './RoundRuler';
import { MEDICAL_SECTION, DENTAL_SECTION, VISION_SECTION } from '../../App/constants';
import { TOP_CLIENT_ATT } from '../../Home/constants';
import { ROLE_CARRIER_PRESALE, ROLE_CARRIER_SALES, ROLE_CARRIER_MANAGER, ROLE_SUPERADMIN, ROLE_RENEWAL_MANAGER, ROLE_RENEWAL_SAE } from '../../../utils/authService/constants';
import { getColorProbability, getColorSimple } from './../../../utils/getColor';
import MedicalIcon from '../../../assets/img/svg/medical-icon.svg';
import DentalIcon from '../../../assets/img/svg/dental-icon.svg';
import VisionIcon from '../../../assets/img/svg/vision-icon.svg';
import { CARRIER } from '../../../config';
import { getDate, mappingClientState } from '../../../utils/query';
import { getRole } from '../../../utils/authService/lib';

class ClientsTable extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    clients: PropTypes.array.isRequired,
    role: PropTypes.array.isRequired,
    sort: PropTypes.object.isRequired,
    changeClientsSort: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired,
    setFilter: PropTypes.func.isRequired,
    toggleTopClient: PropTypes.func.isRequired,
    togglingIds: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      column: null,
      direction: null,
      data: [],
      icons: {
        [MEDICAL_SECTION.toUpperCase()]: MedicalIcon,
        [DENTAL_SECTION.toUpperCase()]: DentalIcon,
        [VISION_SECTION.toUpperCase()]: VisionIcon,
      },
      clientNameOverflow: [],
      salesNameOverflow: [],
      brokerNameOverflow: [],
    };

    this.onResize = this.onResize.bind(this);
  }

  componentWillMount() {
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize() {
    this.scrollBar.setScrollTop(0);
  }

  setOverflow(elem, index, type) {
    const { clientNameOverflow, salesNameOverflow, brokerNameOverflow } = this.state;
    if (elem && (elem.clientHeight !== elem.scrollHeight || elem.clientWidth !== elem.scrollWidth)) {
      if (type === 'clientNameOverflow') {
        clientNameOverflow[index] = true;
        this.setState({ clientNameOverflow });
      }
      if (type === 'salesNameOverflow') {
        salesNameOverflow[index] = true;
        this.setState({ salesNameOverflow });
      }
      if (type === 'brokerNameOverflow') {
        brokerNameOverflow[index] = true;
        this.setState({ brokerNameOverflow });
      }
    }
  }

  setFilters(data = {}) {
    const { setFilter, filters } = this.props;
    const newFilter = { ...filters, ...data };

    setFilter(newFilter);
  }

  render() {
    const { togglingIds, toggleTopClient, changeClientsSort, sort, clients, role } = this.props;
    const personsType = (getRole(role, [ROLE_CARRIER_PRESALE, ROLE_CARRIER_MANAGER, ROLE_SUPERADMIN, ROLE_RENEWAL_MANAGER])) ? 'sales' : 'presales';
    const settings = {
      values: [],
      above: [],
      less: [],
      minVal: 0,
      maxVal: 0,
    };
    clients.forEach((item) => {
      const val = parseFloat(item.competitiveVsCurrent);
      if (val) {
        settings.values.push(val);
      }
      if (val < 0) {
        settings.less.push(val);
      }
      if (val > 0) {
        settings.above.push(val);
      }
    });
    settings.less = settings.less.sort((a, b) => a - b).reverse();
    settings.above = settings.above.sort((a, b) => a - b).reverse();
    settings.minVal = Math.min.apply(null, settings.values);
    settings.maxVal = Math.max.apply(null, settings.values);

    let clientTyped = [];
    if (getRole(role, [ROLE_RENEWAL_SAE, ROLE_RENEWAL_MANAGER])) {
      clientTyped = clients.filter((item) => item.clientAttributes && item.clientAttributes.indexOf('RENEWAL') !== -1);
    } else {
      clientTyped = clients.filter((item) => item.clientAttributes && item.clientAttributes.indexOf('RENEWAL') === -1);
    }

    const getIcon = (section, i) => <Image key={i} as={Link} src={this.state.icons[section]} alt="Logo" className="section-icon" />;
    return (
      <PerfectScrollbar ref={(ref) => { this.scrollBar = ref; }} className="clients-table-wrap">
        <Table sortable celled singleLine fixed unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                width="2"
                textAlign="center"
                className={(sort.prop !== 'clientName') ? 'sort-inactive' : ''}
                sorted={(sort.prop === 'clientName') ? sort.order : 'ascending'}
                onClick={() => { changeClientsSort('clientName'); }}
              >
                Name
              </Table.HeaderCell>
              { (getRole(role, [ROLE_RENEWAL_MANAGER])) && (CARRIER === 'UHC') &&
                <Table.HeaderCell
                  width="1"
                  // className={(sort.prop !== 'employeeCount') ? 'sort-inactive' : ''}
                  // sorted={(sort.prop === 'employeeCount') ? sort.order : 'ascending'}
                  // onClick={() => { changeClientsSort('employeeCount'); }}
                  textAlign="center"
                >
                  Top<br />Client
                </Table.HeaderCell>
              }
              <Table.HeaderCell
                width="1"
                textAlign="center"
                className={(sort.prop !== 'employeeCount') ? 'sort-inactive' : ''}
                sorted={(sort.prop === 'employeeCount') ? sort.order : 'ascending'}
                onClick={() => { changeClientsSort('employeeCount'); }}
              >
                Emp
              </Table.HeaderCell>
              <Table.HeaderCell
                width="2"
                textAlign="center"
                className={(sort.prop !== 'quotedProducts') ? 'sort-inactive' : ''}
                sorted={(sort.prop === 'quotedProducts') ? sort.order : 'ascending'}
                onClick={() => { changeClientsSort('quotedProducts'); }}
              >
                Products Quoted
              </Table.HeaderCell>
              { !getRole(role, [ROLE_RENEWAL_MANAGER, ROLE_RENEWAL_SAE]) &&
                <Table.HeaderCell
                  textAlign="center"
                  width="3"
                  className={(sort.prop !== 'competitiveVsCurrent') ? 'sort-inactive' : ''}
                  sorted={(sort.prop === 'competitiveVsCurrent') ? sort.order : 'ascending'}
                  onClick={() => { changeClientsSort('competitiveVsCurrent'); }}
                >
                  Competitive<br />vs Current
                </Table.HeaderCell>
              }
              { getRole(role, [ROLE_RENEWAL_MANAGER, ROLE_RENEWAL_SAE]) &&
                <Table.HeaderCell
                  textAlign="center"
                  width="3"
                  className={(sort.prop !== 'renewal') ? 'sort-inactive' : ''}
                  sorted={(sort.prop === 'renewal') ? sort.order : 'ascending'}
                  onClick={() => { changeClientsSort('renewal'); }}
                >
                  Renewal
                </Table.HeaderCell>
              }
              <Table.HeaderCell
                className={(sort.prop !== 'probability') ? 'sort-inactive' : ''}
                textAlign="center"
                sorted={(sort.prop === 'probability') ? sort.order : 'ascending'}
                onClick={() => { changeClientsSort('probability'); }}
              >
                Probability
              </Table.HeaderCell>
              <Table.HeaderCell
                className={(sort.prop !== 'effectiveDate') ? 'sort-inactive' : ''}
                sorted={(sort.prop === 'effectiveDate') ? sort.order : 'ascending'}
                onClick={() => { changeClientsSort('effectiveDate'); }}
                textAlign="center"
              >
                Effective
              </Table.HeaderCell>
              { getRole(role, [ROLE_CARRIER_SALES]) &&
                <Table.HeaderCell
                  className={(sort.prop !== 'presalesName') ? 'sort-inactive' : ''}
                  sorted={(sort.prop === 'presalesName') ? sort.order : 'ascending'}
                  onClick={() => { changeClientsSort('presalesName'); }}
                  textAlign="center"
                >
                  {(CARRIER === 'ANTHEM') ? 'SAR' : 'NBC'}
                </Table.HeaderCell>
              }
              { (getRole(role, [ROLE_CARRIER_PRESALE, ROLE_CARRIER_MANAGER, ROLE_SUPERADMIN])) &&
                <Table.HeaderCell
                  className={(sort.prop !== 'salesName') ? 'sort-inactive' : ''}
                  sorted={(sort.prop === 'salesName') ? sort.order : 'ascending'}
                  onClick={() => { changeClientsSort('salesName'); }}
                  textAlign="center"
                >
                  {(CARRIER === 'ANTHEM') ? 'SAE' : 'AE'}
                </Table.HeaderCell>
              }
              { (getRole(role, [ROLE_RENEWAL_MANAGER])) &&
                <Table.HeaderCell
                  className={(sort.prop !== 'salesName') ? 'sort-inactive' : ''}
                  sorted={(sort.prop === 'salesName') ? sort.order : 'ascending'}
                  onClick={() => { changeClientsSort('salesName'); }}
                  textAlign="center"
                >
                  SAE
                </Table.HeaderCell>
              }
              { !(getRole(role, [ROLE_RENEWAL_MANAGER, ROLE_RENEWAL_SAE])) &&
                <Table.HeaderCell
                  className={(sort.prop !== 'carrierName') ? 'sort-inactive' : ''}
                  sorted={(sort.prop === 'carrierName') ? sort.order : 'ascending'}
                  onClick={() => { changeClientsSort('carrierName'); }}
                  textAlign="center"
                >
                  Incumbent<br />Carrier
                </Table.HeaderCell>
              }
              <Table.HeaderCell
                className={(sort.prop !== 'brokerName') ? 'sort-inactive' : ''}
                sorted={(sort.prop === 'brokerName') ? sort.order : 'ascending'}
                onClick={() => { changeClientsSort('brokerName'); }}
                textAlign="center"
              >
                Brokerage
              </Table.HeaderCell>
              <Table.HeaderCell
                className={(sort.prop !== 'clientState') ? 'sort-inactive' : ''}
                sorted={(sort.prop === 'clientState') ? sort.order : 'ascending'}
                onClick={() => { changeClientsSort('clientState'); }}
                textAlign="center"
              >
                Status
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          { clientTyped.length > 0 &&
          <Table.Body>
            { (getRole(role, [ROLE_RENEWAL_MANAGER])) &&
            <Table.Row>
              <Table.Cell />
              <Table.Cell />
              <Table.Cell />
              <Table.Cell />
              <Table.Cell textAlign="center" style={{ fontSize: '10px' }}>Starting vs Current Increase</Table.Cell>
              <Table.Cell />
              <Table.Cell />
              <Table.Cell />
              <Table.Cell />
              <Table.Cell />
            </Table.Row>
            }
            { (getRole(role, [ROLE_RENEWAL_SAE])) &&
              <Table.Row>
                <Table.Cell />
                <Table.Cell />
                <Table.Cell />
                <Table.Cell textAlign="center" style={{ fontSize: '10px' }}>Starting vs Current Increase</Table.Cell>
                <Table.Cell />
                <Table.Cell />
                <Table.Cell />
                <Table.Cell />
              </Table.Row>
            }
            {clientTyped && clientTyped.length > 0 && clientTyped.map((item, key) => (
              <Table.Row key={key}>
                <Table.Cell textAlign="left">
                  { !this.state.clientNameOverflow[key] ?
                    (<Link to={`/client/${item.clientId}`}>
                      <div
                        ref={(spanText) => this.setOverflow(spanText, key, 'clientNameOverflow')}
                      >
                        {item.clientName}
                      </div>
                    </Link>) :
                    (<Popup
                      className="table-popup-wrap"
                      trigger={<Link to={`/client/${item.clientId}`}>{item.clientName}</Link>}
                      content={
                        <div className="table-popup">
                          {item.clientName}
                        </div>
                      }
                      inverted
                      wide
                      position="top center"
                    />)}
                </Table.Cell>
                { (getRole(role, [ROLE_RENEWAL_MANAGER])) && (CARRIER === 'UHC') &&
                <Table.Cell textAlign="center">
                  { (item.clientAttributes && item.clientAttributes.indexOf('RENEWAL') !== -1) &&
                    <Checkbox disabled={togglingIds.indexOf(item.clientId) !== -1} className="checkbox-no-bg" checked={(item.clientAttributes && item.clientAttributes.indexOf(TOP_CLIENT_ATT) !== -1)} onChange={(e, inputState) => { toggleTopClient(item, inputState.checked); }} />
                  }
                </Table.Cell>
                }
                <Table.Cell textAlign="center">{item.employeeCount}</Table.Cell>
                <Table.Cell textAlign="left">
                  {item.quotedProducts && item.quotedProducts.map((section, i) => getIcon(section, i))}
                </Table.Cell>
                { !getRole(role, [ROLE_RENEWAL_MANAGER, ROLE_RENEWAL_SAE]) &&
                  <Table.Cell className="round-ruler-cell" textAlign="center">
                    { item.competitiveVsCurrent && <RoundRuler index={key} value={parseFloat(item.competitiveVsCurrent)} settings={settings} /> }
                  </Table.Cell>
                }
                { getRole(role, [ROLE_RENEWAL_MANAGER, ROLE_RENEWAL_SAE]) &&
                  <Table.Cell className="round-ruler-cell">
                    { (item.clientAttributes && item.clientAttributes.indexOf('RENEWAL') !== -1) && item.startingRenewalIncrease &&
                      <Grid stackable={false}>
                        <Grid.Row centered>
                          <Grid.Column width={8}>
                            <span className="renewal_number">{item.startingRenewalIncrease}</span>
                            <Icon name="arrow right" style={{ float: 'none' }} />
                            <span className="renewal_number">{item.currentRenewalIncrease || item.startingRenewalIncrease}</span>
                          </Grid.Column>
                          <Grid.Column width={6} textAlign="right" style={{ color: getColorSimple(item.currentRenewalIncrease - item.startingRenewalIncrease) }}>
                            { parseFloat(item.startingRenewalIncrease) >= parseFloat(item.currentRenewalIncrease || 0) ?
                              <Icon name="arrow down" /> :
                              <Icon name="arrow up" />
                            }
                            { item.currentRenewalIncrease ? (Math.abs(parseFloat(item.currentRenewalIncrease) - parseFloat(item.startingRenewalIncrease))).toFixed(1) : 0}%
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    }
                  </Table.Cell>
                }
                <Table.Cell
                  textAlign="center"
                  style={{ color: getColorProbability(item.probability) }}
                >
                  {item.probability}
                </Table.Cell>
                <Table.Cell
                  textAlign="center"
                  style={moment(new Date(item.effectiveDate)) < moment(new Date()) ? { color: '#d16152' } : {}}
                >{item.effectiveDate ? getDate(item.effectiveDate) : '-'}</Table.Cell>
                { !getRole(role, [ROLE_RENEWAL_SAE]) &&
                  <Table.Cell textAlign="center">
                    { !this.state.salesNameOverflow[key] ?
                      (<Link
                        to="/clients"
                        onClick={() => { this.setFilters({ [personsType]: [{ fullName: item[`${personsType}Name`], id: item[`${personsType}Id`] }] }); }}
                      >
                        <div ref={(spanText) => this.setOverflow(spanText, key, 'salesNameOverflow')}>{item[`${personsType}Name`]}</div>
                      </Link>) :
                      (<Popup
                        className="table-popup-wrap"
                        trigger={<Link
                          to="/clients"
                          onClick={() => { this.setFilters({ [personsType]: [{ fullName: item[`${personsType}Name`], id: item[`${personsType}Id`] }] }); }}
                        >{item[`${personsType}Name`]}</Link>}
                        content={
                          <div className="table-popup">
                            {item[`${personsType}Name`]}
                          </div>
                        }
                        inverted
                        position="top center"
                      />)}
                  </Table.Cell>
                }
                { !(getRole(role, [ROLE_RENEWAL_MANAGER, ROLE_RENEWAL_SAE])) &&
                  <Table.Cell textAlign="center" className="carrier-logo">
                    <div>
                      <Image centered src={item.carrierLogoUrl} />
                    </div>
                  </Table.Cell>
                }
                <Table.Cell textAlign="center">
                  { !this.state.brokerNameOverflow[key] ?
                    (<Link
                      to="/clients"
                      onClick={() => {
                        this.setFilters({ brokers: [{ name: item.brokerName, id: item.brokerId }] });
                      }}
                    >
                      <div
                        ref={(spanText) => this.setOverflow(spanText, key, 'brokerNameOverflow')}
                      >
                        {item.brokerName}
                      </div>
                    </Link>) :
                    (<Popup
                      className="table-popup-wrap"
                      trigger={<Link
                        to="/clients"
                        onClick={() => {
                          this.setFilters({ brokers: [{ name: item.brokerName, id: item.brokerId }] });
                        }}
                      >
                        {item.brokerName}
                      </Link>}
                      content={
                        <div className="table-popup">
                          {item.brokerName}
                        </div>
                      }
                      inverted
                      position="top center"
                    />)}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  <Link to="/clients" onClick={() => { this.setFilters({ clientStates: [item.clientState] }); }} >{(item.quoteType !== 'DECLINED') ? mappingClientState(item.clientState) : 'DTQ'}</Link>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
          }
          { !clientTyped.length &&
          <Table.Body>
            <Table.Row>
              <Table.Cell colSpan={getRole(role, [ROLE_RENEWAL_SAE]) ? '8' : '9'} className="empty" textAlign="center">
                No Clients
              </Table.Cell>
            </Table.Row>
          </Table.Body>
          }
        </Table>
      </PerfectScrollbar>
    );
  }
}

export default ClientsTable;
