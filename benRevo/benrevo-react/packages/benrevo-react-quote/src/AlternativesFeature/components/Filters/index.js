/**
 *
 * Filters
 *
 */

import React from 'react';
// import moment from 'moment';
import PropTypes from 'prop-types';
import { Grid, Button, Icon, Modal, Radio, Image } from 'semantic-ui-react';
import { favouriteImage, unfavouriteImage } from '@benrevo/benrevo-react-core';
import { connect } from 'react-redux';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { setPlansFilter, getPlans, clearPlansFilter } from './../../../actions';
// import 'rc-tooltip/assets/bootstrap.css';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

class Filters extends React.Component {
  static propTypes = {
    setFilter: PropTypes.func,
    clearFilter: PropTypes.func,
    getAllPlans: PropTypes.func,
    section: PropTypes.string,
    filter: PropTypes.object,
    updateProps: PropTypes.func,
    index: PropTypes.number,
    openedOptionsType: PropTypes.string,
    values: PropTypes.array,
    minMaxVals: PropTypes.object,
    getImmediately: PropTypes.bool,
    showFavouriteFilter: PropTypes.bool,
    toggleNewPlanColumn: PropTypes.func,
  };

  static defaultProps = {
    toggleNewPlanColumn: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
      modalTop: 0,
      modalLeft: 0,
      filtersValues: {
        diff: {},
        copay: {},
        deduct: {},
        coinsurance: {},
      },
      minValue: 0,
      maxValue: 100,
      currentValue: 0,
      filterUnit: '',
      filterType: '',
      filterName: '',
      valueFrom: 0,
      valueTo: 0,
      marks: {},
      tooltipMinLeft: 0,
      tooltipMaxnLeft: 0,
      tooltipsVisible: false,
    };

    this.marksDate = {};

    this.saveFilters = this.saveFilters.bind(this);
    this.modalToggle = this.modalToggle.bind(this);
    this.modalClose = this.modalClose.bind(this);
    this.changeRange = this.changeRange.bind(this);
    this.setPosition = this.setPosition.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.changeFavourite = this.changeFavourite.bind(this);
  }

  componentWillMount() {
    const { clearFilter, section, getAllPlans, getImmediately } = this.props;
    if (getImmediately) {
      clearFilter(section);
      getAllPlans(this.props.section, this.props.index, this.state.multiMode);
    }
  }

  getDifference(value) {
    return (value > 0) ? `+${value}` : value;
  }

  setPosition(targetId) {
    const elem = document.querySelector(`#${targetId}`);
    if (elem) {
      const rect = elem.getBoundingClientRect();
      const scroll = window.pageYOffset;
      this.setState({
        modalTop: rect.top + scroll + 50,
        modalLeft: rect.left,
      });
      setTimeout(() => {
        this.updateTooltipsPosition('123');
      }, 100);
    }
  }

  setMarks(targetId) {
    const { minValue, maxValue } = this.state;
    const center = (minValue + maxValue) / 2;
    const half = Math.ceil((center + maxValue) / 2);
    const eight = Math.ceil((minValue + center) / 2);
    const marks = {
      [minValue]: minValue < 0 ? minValue : `${minValue}`,
      [eight]: eight < 0 ? eight : `${eight}`,
      [center]: center < 0 ? center : `${center}`,
      [half]: half < 0 ? half : `${half}`,
      [maxValue]: maxValue < 0 ? maxValue : `${maxValue}`,
    };
    this.setState({ marks }, () => {
      this.setPosition(targetId);
    });
  }

  changeRange(data) {
    this.setState({ valueFrom: data[0], valueTo: data[1] }, this.updateTooltipsPosition);
  }

  changeCheckbox(from, to, checked) {
    if (checked) {
      this.setState({
        valueFrom: from,
        valueTo: to,
      });
    }
  }

  updateTooltipsPosition() {
    const slider = document.querySelector('.rc-slider');
    let offset = 0;
    if (slider) {
      const rect = slider.getBoundingClientRect();
      offset = rect.left;
    }
    const handleMin = document.querySelector('.rc-slider-handle.rc-slider-handle-1');
    if (handleMin) {
      const rect = handleMin.getBoundingClientRect();
      this.setState({ tooltipMinLeft: rect.left - offset });
    }
    const handleMax = document.querySelector('.rc-slider-handle.rc-slider-handle-2');
    if (handleMax) {
      const rect = handleMax.getBoundingClientRect();
      this.setState({ tooltipMaxLeft: rect.left - offset });
    }
    if (handleMin && handleMax) {
      this.setState({ tooltipsVisible: true });
    }
  }

  saveFilters(data = {}) {
    const { filter, setFilter, section, updateProps, getAllPlans } = this.props;
    updateProps();
    const valueFrom = (data.valueFrom !== undefined) ? data.valueFrom : this.state.valueFrom;
    const valueTo = (data.valueTo !== undefined) ? data.valueTo : this.state.valueTo;
    const newFiltersValues = Object.assign({}, this.state.filtersValues);
    newFiltersValues[this.state.filterType] = {
      from: valueFrom,
      to: valueTo,
    };
    switch (this.state.filterType) {
      case 'diff':
        filter.diffPercentFrom = valueFrom;
        filter.diffPercentTo = valueTo;
        break;
      case 'copay':
        filter.copayFrom = valueFrom;
        filter.copayTo = valueTo;
        break;
      case 'deduct':
        filter.deductibleFrom = valueFrom;
        filter.deductibleTo = valueTo;
        break;
      case 'coinsurance':
        filter.coinsuranceFrom = valueFrom;
        filter.coinsuranceTo = valueTo;
        break;
      default:
        break;
    }
    this.setState({ modalOpen: !this.state.modalOpen }, () => {
      setFilter(section, filter);
      getAllPlans(this.props.section, this.props.index, this.state.multiMode);
    });
  }

  modalClose() {
    this.setState({ modalOpen: false, tooltipsVisible: false });
  }

  modalToggle(rangeType) {
    if (this.state.modalOpen && rangeType !== this.state.filterType) {
      this.setState({ modalOpen: false, tooltipsVisible: false }, () => {
        this.toggleOpenModal(rangeType);
      });
    } else {
      this.toggleOpenModal(rangeType);
    }
  }

  toggleOpenModal(rangeType) {
    const { values, minMaxVals } = this.props;
    this.setState({ modalOpen: true }, () => {
      let targetId = '';
      let newState = {};
      let newValue = {};
      switch (rangeType) {
        case 'diff':
          newState = {
            filterType: 'diff',
            filterName: '% Diff from Current',
            minValue: -99999,
            maxValue: 99999,
            valueFrom: this.props.filter.diffPercentFrom,
            valueTo: this.props.filter.diffPercentTo,
            currentValue: 0,
          };
          targetId = 'diff-filter-button';
          break;
        case 'copay':
          if (values) newValue = values.filter((x) => x.sysName === 'PCP')[0];
          newState = {
            filterType: 'copay',
            filterName: 'PCP copay',
            filterUnit: 'dollar',
            minValue: parseInt(minMaxVals.minCopay, 10),
            maxValue: parseInt(minMaxVals.maxCopay, 10),
            valueFrom: this.props.filter.copayFrom || parseInt(minMaxVals.minCopay, 10),
            valueTo: this.props.filter.copayTo || parseInt(minMaxVals.maxCopay, 10),
            currentValue: newValue.value || newValue.valueIn || 0,
          };
          targetId = 'copay-filter-button';
          break;

        case 'deduct':
          if (values) newValue = values.filter((x) => x.sysName === 'DEDUCTIBLE_TYPE')[0];
          newState = {
            filterType: 'deduct',
            filterName: 'deductible',
            filterUnit: 'dollar',
            minValue: 0,
            maxValue: 7000,
            valueFrom: this.props.filter.deductibleFrom || 0,
            valueTo: this.props.filter.deductibleTo || 7000,
            currentValue: newValue.value || newValue.valueIn || 0,
          };
          targetId = 'deduct-filter-button';
          break;

        case 'coinsurance':
          if (values) newValue = values.filter((x) => x.sysName === 'CO_INSURANCE')[0];
          newState = {
            filterType: 'coinsurance',
            filterName: 'Co-insurance',
            filterUnit: 'percent',
            minValue: parseInt(minMaxVals.minCoinsurance, 10),
            maxValue: parseInt(minMaxVals.maxCoinsurance, 10),
            valueFrom: this.props.filter.coinsuranceFrom || parseInt(minMaxVals.minCoinsurance, 10),
            valueTo: this.props.filter.coinsuranceTo || parseInt(minMaxVals.maxCoinsurance, 10),
            currentValue: newValue.valueIn || 0,
          };
          targetId = 'coinsurance-filter-button';
          break;

        default:
          break;
      }
      this.setState(newState, () => {
        this.setMarks(targetId);
      });
    });
  }

  clearFilter() {
    this.saveFilters({ valueFrom: null, valueTo: null });
  }

  changeFavourite() {
    const { filter, setFilter, section, getAllPlans } = this.props;
    filter.favourite = !filter.favourite;
    setFilter(section, filter);
    getAllPlans(this.props.section, this.props.index, this.state.multiMode);
  }

  render() {
    const {
      openedOptionsType,
      values,
      toggleNewPlanColumn,
    } = this.props;
    const {
      modalTop,
      modalLeft,
      minValue,
      maxValue,
      currentValue,
      filterUnit,
      filterName,
      filterType,
      valueFrom,
      valueTo,
      marks,
      tooltipMinLeft,
      tooltipMaxLeft,
      tooltipsVisible,
    } = this.state;
    // console.log('filters props', this.props);
    return (
      <div className="card-filters">
        { (openedOptionsType === 'HMO' || openedOptionsType === 'HSA' || openedOptionsType === 'PPO') &&
          <Button
            id="diff-filter-button"
            className={this.props.filter.diffPercentTo !== null ? 'filter-button blue' : 'filter-button'}
            onClick={(e) => {
              e.nativeEvent.stopImmediatePropagation();
              this.modalToggle('diff');
            }}
          >
            <span>% Diff from Current</span>
            <Icon name="dropdown" />
          </Button>
        }
        { (openedOptionsType === 'HMO' || openedOptionsType === 'PPO') &&
        <Button
          id="copay-filter-button"
          className={this.props.filter.copayTo !== null ? 'filter-button blue' : 'filter-button'}
          onClick={(e) => {
            e.nativeEvent.stopImmediatePropagation();
            this.modalToggle('copay');
          }}
        >
          <span>PCP Copay {this.props.filter.copayTo !== null ? `$${this.props.filter.copayFrom}-$${this.props.filter.copayTo}` : ''}</span>
          <Icon name="dropdown" />
        </Button>
        }
        {/* { (openedOptionsType === 'HMO' || openedOptionsType === 'HSA' || openedOptionsType === 'PPO') &&
        <Button
          id="deduct-filter-button"
          className={this.props.filter.deductibleTo !== null ? 'filter-button blue' : 'filter-button'}
          onClick={() => {
            this.modalToggle('deduct');
          }}
        >
          <span>{this.props.filter.deductibleTo !== null ? `Ded $${parseInt(this.props.filter.deductibleFrom / 1000, 10)}K-$${parseInt(this.props.filter.deductibleTo / 1000, 10)}K` : 'Deductible'}</span>
          <Icon name="dropdown" />
        </Button>
        } */}
        { (openedOptionsType === 'HSA' || openedOptionsType === 'PPO') &&
        <Button
          id="coinsurance-filter-button"
          className={this.props.filter.coinsuranceTo !== null ? 'filter-button blue' : 'filter-button'}
          onClick={(e) => {
            e.nativeEvent.stopImmediatePropagation();
            this.modalToggle('coinsurance');
          }}
        >
          <span>{this.props.filter.coinsuranceTo !== null ? `Co-ins ${this.props.filter.coinsuranceFrom}%-${this.props.filter.coinsuranceTo}%` : 'Co-insurance'}</span>
          <Icon name="dropdown" />
        </Button>
        }
        { this.props.showFavouriteFilter &&
        <Button
          id="favourite-filter-button"
          primary
          className={`${this.props.filter.favourite ? 'filter-button blue favourite-button' : 'un filter-button blue favourite-button'}`}
          onClick={() => this.changeFavourite()}
        >
          <span>
            { this.props.filter.favourite &&
            <Image src={favouriteImage} />
            }
            { !this.props.filter.favourite &&
            <Image src={unfavouriteImage} />
            }
            Favorites
            </span>
        </Button>
        }
        { toggleNewPlanColumn &&
        <Button primary className="add-plan-button" onClick={() => toggleNewPlanColumn(true)}>
          <span>
            Add Plan
          </span>
        </Button>
        }
        <Modal
          closeOnDocumentClick
          style={{ top: modalTop, left: modalLeft }}
          className="modal-alternatives-filters"
          open={this.state.modalOpen}
          onClose={this.modalClose}
          closeOnDimmerClick
          dimmer={false}
          size="large"
        >
          <Modal.Content>
            <Grid stackable>
              {filterType !== 'diff' &&
              <Grid.Row className="title">
                {filterType !== 'coinsurance' &&
                  <Grid.Column>
                    <h4>Choose a range between {`${filterUnit === 'dollar' ? '$' : ''}`}{minValue}{`${filterUnit === 'percent' ? '%' : ''}`}-{`${filterUnit === 'dollar' ? '$' : ''}`}{maxValue}{`${filterUnit === 'percent' ? '%' : ''}`}</h4>
                    { values &&
                      <p>(Current {filterName} is {`${filterUnit === 'dollar' ? '$' : ''}`}{currentValue}{`${filterUnit === 'percent' ? '%' : ''}`})</p>
                    }
                  </Grid.Column>
                }
                {filterType === 'coinsurance' &&
                  <Grid.Column>
                    <h4>Choose an in-network {filterName} range:</h4>
                    { values &&
                      <p>(Current in-network {filterName} is {`${filterUnit === 'dollar' ? '$' : ''}`}{currentValue}{`${filterUnit === 'percent' ? '%' : ''}`})</p>
                    }
                  </Grid.Column>
                }
              </Grid.Row>
              }
              {filterType !== 'diff' &&
              <Grid.Row>
                <Grid.Column>
                  <div className="slider-container">
                    {tooltipsVisible &&
                    <div
                      className="tooltip min"
                      style={{ left: tooltipMinLeft }}
                    >
                      {filterUnit === 'dollar' &&
                      <span>$</span>
                      }
                      {valueFrom}
                      {filterUnit === 'percent' &&
                      <span>%</span>
                      }
                    </div>
                    }
                    {tooltipsVisible &&
                    <div
                      className="tooltip max"
                      style={{ left: tooltipMaxLeft }}
                    >
                      {filterUnit === 'dollar' &&
                      <span>$</span>
                      }
                      {valueTo}
                      {filterUnit === 'percent' &&
                      <span>%</span>
                      }
                    </div>
                    }
                    <Range
                      min={minValue}
                      max={maxValue}
                      defaultValue={[valueFrom, valueTo]}
                      marks={marks}
                      step={1}
                      onChange={this.changeRange}
                    />
                  </div>
                </Grid.Column>
              </Grid.Row>
              }
              {filterType === 'diff' &&
              <Grid.Row>
                <Grid.Column>
                  <div>
                    <Radio
                      label="Below current"
                      checked={valueTo !== null && valueTo <= 0}
                      onChange={(e, inputState) => { this.changeCheckbox(-99999, 0, inputState.checked); }}
                    />
                  </div>
                  <div>
                    <Radio
                      checked={valueTo > 0 && valueTo <= 10}
                      label="0-10 above current"
                      onChange={(e, inputState) => { this.changeCheckbox(0, 10, inputState.checked); }}
                    />
                  </div>
                  <div>
                    <Radio
                      checked={valueTo > 10}
                      label="10+ above current"
                      onChange={(e, inputState) => { this.changeCheckbox(10, 99999, inputState.checked); }}
                    />
                  </div>
                </Grid.Column>
              </Grid.Row>
              }
              <Grid.Row>
                <Grid.Column width={10} verticalAlign="middle">
                  <a tabIndex={0} className="clear-filter-button" onClick={this.clearFilter}>Clear Filter</a>
                </Grid.Column>
                <Grid.Column width={6}>
                  <Button size="medium" primary onClick={this.saveFilters}>See Plans</Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const presentationState = state.get('presentation').get(ownProps.section);
  return {
    filter: presentationState.get('filter').toJS(),
    minMaxVals: presentationState.get('minMaxVals').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clearFilter: (section) => { dispatch(clearPlansFilter(section)); },
    setFilter: (section, filter) => { dispatch(setPlansFilter(section, filter)); },
    getAllPlans: (section, networkIndex, multiMode) => {
      dispatch(getPlans(section, networkIndex, multiMode));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
