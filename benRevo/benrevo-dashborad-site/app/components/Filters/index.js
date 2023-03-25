/**
 *
 * Filters
 *
 */

import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Grid, Button, Image, Icon, Modal, Form, Checkbox, Dropdown, Input } from 'semantic-ui-react';
import { connect } from 'react-redux';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import NumberFormat from 'react-number-format';
import IconFilter from '../../assets/img/svg/icon-filter.svg';
import { CARRIER } from '../../config';
import { ROLE_SUPERADMIN, ROLE_CARRIER_MANAGER, ROLE_RENEWAL_SAE, ROLE_RENEWAL_MANAGER } from '../../utils/authService/constants';
import { getRole } from '../../utils/authService/lib';
import { SOLD_STATE, CLOSED_STATE, ON_BOARDING_STATE } from '../../pages/Home/constants';

const Range = createSliderWithTooltip(Slider.Range);

class Filters extends React.Component {
  static propTypes = {
    filters: PropTypes.object.isRequired,
    relativeElement: PropTypes.string,
    changeFilter: PropTypes.func.isRequired,
    role: PropTypes.array.isRequired,
    carriers: PropTypes.array.isRequired,
    sae: PropTypes.array.isRequired,
    brokers: PropTypes.array.isRequired,
    maxDiff: PropTypes.number.isRequired,
    minDiff: PropTypes.number.isRequired,
    setTooltipOn: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
      includeDate: false,
      top: 0,
      temp: props.filters,
    };

    this.marks = {};
    this.marksDate = {};

    this.saveFilters = this.saveFilters.bind(this);
    this.changeInclude = this.changeInclude.bind(this);
    this.modalToggle = this.modalToggle.bind(this);
    this.changeRange = this.changeRange.bind(this);
    this.changeDateRange = this.changeDateRange.bind(this);
    this.setPosition = this.setPosition.bind(this);
    this.getBrokerById = this.getBrokerById.bind(this);
  }

  getDifference(value) {
    return (value > 0) ? `+${value}` : value;
  }

  setPosition(relativeElement = this.props.relativeElement) {
    const elem = document.querySelector(relativeElement);
    if (elem) {
      const rect = elem.getBoundingClientRect();
      const scroll = window.pageYOffset;
      this.setState({ top: rect.top + 59 + scroll });
    }
  }

  setMarks() {
    const props = this.props;
    const center = (props.minDiff + props.maxDiff) / 2;
    const half = Math.ceil((center + props.maxDiff) / 2);
    const eight = Math.ceil((props.minDiff + center) / 2);
    this.marks = {
      [props.minDiff]: props.minDiff < 0 ? props.minDiff : `+${props.minDiff}`,
      [eight]: eight < 0 ? eight : `+${eight}`,
      [center]: center < 0 ? center : `+${center}`,
      [half]: half < 0 ? half : `+${half}`,
      [props.maxDiff]: props.maxDiff < 0 ? props.maxDiff : `+${props.maxDiff}`,
    };
  }

  getBrokerById(id) {
    const brokers = this.props.brokers;
    let broker = {};

    for (let i = 0; i < brokers.length; i += 1) {
      const item = brokers[i];

      if (item.value === id) {
        broker = { id, name: item.text };
        break;
      }
    }

    return broker;
  }

  changeRange(data) {
    const range = data;
    if (range[0] < this.props.minDiff) range[0] = this.props.minDiff;
    if (range[1] > this.props.maxDiff) range[1] = this.props.maxDiff;

    if (range[0] === '-0') range[0] = '0';
    if (range[1] === '-0') range[1] = '0';

    range[0] = range[0].toString();
    range[1] = range[1].toString();

    this.setState({
      temp: { ...this.state.temp, difference: range },
    });
  }

  changeDateRange(data) {
    this.setState({
      temp: { ...this.state.temp, effectiveDate: data },
    });
  }

  changeInclude(type, checked) {
    this.setState({
      [type]: checked,
    });
  }

  changeList(item, checked, type, key = null, unique, isArray) {
    let data = [...this.state.temp[type]];

    if (!checked && !isArray) {
      for (let i = 0; i < data.length; i += 1) {
        if (key !== null && item[key] === data[i][key]) {
          data.splice(i, 1);
          break;
        } else if (key === null && item === data[i]) {
          data.splice(i, 1);
          break;
        }
      }
    } else if (!checked && isArray) {
      for (let i = 0; i < item.length; i += 1) {
        for (let j = 0; j < data.length; j += 1) {
          if (item[i] === data[j]) {
            data.splice(j, 1);
            break;
          }
        }
      }
    } else {
      let found = false;
      if (unique) {
        for (let i = 0; i < data.length; i += 1) {
          if (key !== null && item[key] === data[i][key]) {
            found = true;
            break;
          } else if (key === null && item === data[i]) {
            found = true;
            break;
          }
        }
      }

      if (!found && !isArray) data.push(item);
      else if (!found && isArray) data = data.concat(item);
    }

    this.setState({
      temp: { ...this.state.temp, [type]: data },
    });
  }

  saveFilters() {
    if (this.state.includeDate) this.props.changeFilter('effectiveDate', this.state.temp.effectiveDate);
    else this.props.changeFilter('effectiveDate', []);

    this.props.changeFilter('difference', this.state.temp.difference);
    this.props.changeFilter('carriers', this.state.temp.carriers);
    this.props.changeFilter('sales', this.state.temp.sales);
    this.props.changeFilter('brokers', this.state.temp.brokers);
    this.props.changeFilter('clientStates', this.state.temp.clientStates);
    // this.props.saveFilters();
    this.modalToggle();
  }

  modalToggle() {
    const { setTooltipOn } = this.props;
    const close = !this.state.modalOpen;
    if (setTooltipOn) {
      setTooltipOn(this.state.modalOpen);
    }
    this.setState({ modalOpen: close, temp: this.props.filters }, () => {
      if (close) {
        this.setPosition();
        const newFilters = { ...this.props.filters };
        if (!newFilters.difference.length) {
          newFilters.difference = [this.props.minDiff, this.props.maxDiff];
        }

        if (!newFilters.effectiveDate.length) {
          newFilters.effectiveDate = this.props.filters.effectiveDate.length ? this.props.filters.effectiveDate : [0, 7];
          this.setState({ includeDate: false });
        } else {
          this.setState({ includeDate: true });
        }

        for (let i = newFilters.effectiveDate[0]; i <= newFilters.effectiveDate[1]; i += 1) {
          this.marksDate[i] = moment().add(i, 'months').startOf('month').format('MMM');
        }

        this.setState({ modalOpen: close, temp: newFilters });
        this.setMarks();
      }
    });
  }

  checkList(id, list, key = null, isArray) {
    if (!isArray) {
      for (let i = 0; i < list.length; i += 1) {
        if (key !== null && id === list[i][key]) return true;
        else if (key === null && id === list[i]) return true;
      }
    } else {
      let found = false;
      for (let i = 0; i < id.length; i += 1) {
        for (let j = 0; j < list.length; j += 1) {
          if (id[i] === list[j]) {
            found = true;
            break;
          }
        }
      }

      if (found) return true;
    }

    return false;
  }

  render() {
    const { carriers, sae, brokers, role, minDiff, maxDiff } = this.props;
    const { temp } = this.state;
    const rangeDifference = [...temp.difference];
    const effectiveDate = [...temp.effectiveDate];
    const hideDiff = minDiff === 0 && maxDiff === 0;
    if (rangeDifference[0] === '-' || rangeDifference[0] === '') rangeDifference[0] = 0;
    if (rangeDifference[1] === '-' || rangeDifference[1] === '') rangeDifference[1] = 0;
    return (
      <div className="card-filters">
        <Button className="filter-button-toggle" onClick={this.modalToggle}>
          <Image src={IconFilter} floated="left" />
          <span>FILTERS</span>
          <Icon name="dropdown" />
        </Button>
        <Modal
          style={{ top: this.state.top }}
          className="dashboard-modal-filters"
          open={this.state.modalOpen}
          onClose={this.modalToggle}
          closeOnDimmerClick
          dimmer={false}
          size="large"
        >
          <Modal.Content scrolling>
            <Grid stackable>
              <Grid.Row>
                <Grid.Column tablet="16" computer="5" textAlign="center">
                  { !hideDiff && <div className="filter-title">% diff from incumbent rate</div> }
                  { !hideDiff && <div className="range-slider-left-tip range-slider-tip">
                    <NumberFormat
                      decimalScale={1}
                      name="activity-value"
                      customInput={Input}
                      prefix={(temp.difference[0] > 0) ? '+' : ''}
                      value={temp.difference[0]}
                      onValueChange={(inputState) => { this.changeRange([inputState.value, temp.difference[1]]); }}
                    />
                  </div> }
                  { !hideDiff && <div className="range-slider-right-tip range-slider-tip">
                    <NumberFormat
                      decimalScale={1}
                      name="activity-value"
                      customInput={Input}
                      prefix={(temp.difference[1] > 0) ? '+' : ''}
                      value={temp.difference[1]}
                      onValueChange={(inputState) => { this.changeRange([temp.difference[0], inputState.value]); }}
                    />
                  </div> }
                  { !hideDiff && <Range
                    step={0.1}
                    marks={this.marks}
                    min={minDiff}
                    max={maxDiff}
                    className="range-slider"
                    value={rangeDifference}
                    dots={false}
                    allowCross={false}
                    onChange={this.changeRange}
                  /> }
                  <div className="filter-title">
                    <Checkbox
                      checked={this.state.includeDate}
                      onChange={(e, inputState) => { this.changeInclude('includeDate', inputState.checked); }}
                    />
                    Effective Date
                  </div>
                  <Range
                    disabled={!this.state.includeDate}
                    step={1}
                    marks={this.marksDate}
                    min={0}
                    max={7}
                    className="range-slider date"
                    value={effectiveDate}
                    dots={false}
                    allowCross={false}
                    onChange={this.changeDateRange}
                  />
                </Grid.Column>
                { carriers.length > 0 && (!getRole(role, [ROLE_RENEWAL_SAE, ROLE_RENEWAL_MANAGER])) &&
                  <Grid.Column tablet="6" computer="3">
                    <div className="filter-title">Carrier</div>
                    <Form>
                      { carriers.map((item, i) =>
                        <Form.Field key={i}>
                          <Checkbox
                            label={item.name}
                            checked={this.checkList(item.id, temp.carriers, 'id')}
                            onChange={(e, inputState) => { this.changeList(item, inputState.checked, 'carriers', 'id', false, false); }}
                          />
                        </Form.Field>
                      )}
                    </Form>
                  </Grid.Column>
                }
                { (getRole(role, [ROLE_CARRIER_MANAGER, ROLE_SUPERADMIN, ROLE_RENEWAL_MANAGER])) && sae.length > 0 &&
                  <Grid.Column tablet="6" computer="4">
                    <div className="filter-title"> {(CARRIER === 'ANTHEM') ? 'SAE' : 'AE'}</div>
                    <Form>
                      { sae.map((item, i) =>
                        <Form.Field key={i}>
                          <Checkbox
                            label={item.name}
                            checked={this.checkList(item.id, temp.sales, 'id')}
                            onChange={(e, inputState) => { this.changeList(item, inputState.checked, 'sales', 'id', false, false); }}
                          />
                        </Form.Field>
                      )}
                    </Form>
                  </Grid.Column>
                }
                { brokers.length > 0 &&
                <Grid.Column computer="4" tablet="4" className="filter-list-wrap">
                  <div className="filter-title">BROKERAGES</div>
                  <Dropdown
                    search
                    selection
                    placeholder="Select"
                    options={brokers}
                    value={null}
                    selectOnBlur={false}
                    fluid
                    onChange={(e, inputState) => { this.changeList(this.getBrokerById(inputState.value), true, 'brokers', 'id', true, false); }}  // eslint-disable-line no-underscore-dangle
                  />
                  <div className="filter-list">
                    { temp.brokers.map((item, i) =>
                      <div key={i}><a tabIndex={0} className="filter-item" onClick={() => { this.changeList(item, false, 'brokers', 'id', false, false); }}>{item.name}</a></div>
                    )}
                  </div>
                  <div>
                    <div className="filter-title">Include in Result</div>
                    <Form>
                      <Form.Field>
                        <Checkbox
                          label={'Sold Groups'}
                          checked={this.checkList([SOLD_STATE, ON_BOARDING_STATE], temp.clientStates, null, true)}
                          onChange={(e, inputState) => {
                            this.changeList([SOLD_STATE, ON_BOARDING_STATE], inputState.checked, 'clientStates', null, false, true);
                          }}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Checkbox
                          label={'Closed Groups (Dead or Past Effective Date)'}
                          checked={this.checkList(CLOSED_STATE, temp.clientStates)}
                          onChange={(e, inputState) => { this.changeList(CLOSED_STATE, inputState.checked, 'clientStates', null, false, false); }}
                        />
                      </Form.Field>
                    </Form>
                  </div>
                </Grid.Column>
                }
              </Grid.Row>
            </Grid>
          </Modal.Content>
          <Modal.Actions>
            <Button size="medium" basic onClick={this.modalToggle}>Cancel</Button>
            <Button size="medium" primary onClick={this.saveFilters}>See Clients</Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const profileState = state.get('profile');

  return {
    role: profileState.get('brokerageRole').toJS(),
  };
}

function mapDispatchToProps() {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
