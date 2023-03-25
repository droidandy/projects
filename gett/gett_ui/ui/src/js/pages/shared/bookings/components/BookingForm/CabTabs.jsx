import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tabs, Tooltip } from 'antd';
import { VehicleType, Icon } from 'components';
import { map, isUndefined, every } from 'lodash';
import CN from 'classnames';
import { vehiclesData } from 'pages/shared/bookings/data';
import { centsToPounds, isBbcCompanyType } from 'utils';
import css from 'pages/shared/bookings/style.css';

const { TabPane } = Tabs;
const NOT_AVAILABLE_REASONS = {
  area: 'Vehicle type is not available in this area',
  wheelchair: 'Sorry, this vehicle is not suitable for wheelchair users',
  rule: 'Vehicle isn\'t allowed by Travel Policy',
  'unregistered_user': 'Not possible for unregistered users',
  laterOnly: 'Vehicle available for future order only'
};

function mapStateToProps(state) {
  const { data, failed, distance, duration, bookingFee } = state.bookings.formData.vehicles;

  return {
    vehicles: data,
    failedToLoadVehicles: failed,
    distance,
    duration,
    bookingFee
  };
}

class CabTabs extends PureComponent {
  static propTypes = {
    companyType: PropTypes.string,
    vehicles: PropTypes.arrayOf(PropTypes.object),
    stopsAddresses: PropTypes.arrayOf(PropTypes.object),
    vehicleName: PropTypes.string,
    showEta: PropTypes.bool,
    onChange: PropTypes.func,
    failedToLoadVehicles: PropTypes.bool,
    distance: PropTypes.string,
    duration: PropTypes.string,
    pickupAddress: PropTypes.object,
    destinationAddress: PropTypes.object,
    locked: PropTypes.bool,
    asDirected: PropTypes.bool,
    internationalFlag: PropTypes.bool,
    bookingFee: PropTypes.number
  };

  get isBbcCompanyType() {
    return isBbcCompanyType(this.props.companyType);
  }

  changeVehicleName = (vehicleName, scheduledType) => {
    this.props.onChange(vehicleName, scheduledType);
  };

  handleArrowClick = (index) => {
    const { vehicles, vehicleName } = this.props;

    const availableVehicles = vehicles.filter(v => v.available).map(v => v.name);
    const currentIndex = availableVehicles.findIndex(name => name === vehicleName);
    const nextItem = availableVehicles[currentIndex + index];
    this.changeVehicleName(nextItem ? nextItem : vehicleName);
  };

  handleNextClick = this.handleArrowClick.bind(this, 1);
  handlePrevClick = this.handleArrowClick.bind(this, -1);

  noVehicleAvailable() {
    const { vehicles, failedToLoadVehicles } = this.props;
    return !isUndefined(failedToLoadVehicles) && every(vehicles, v => !v.available);
  }

  renderTabsArrows() {
    return (
      <Fragment>
        <div className="custom-prev-icon" onClick={ this.handlePrevClick } />
        <div className="custom-next-icon" onClick={ this.handleNextClick } />
      </Fragment>
    );
  }

  renderAddressLine(address, key) {
    return address && (
      <div key={ key } className={ CN('text-12 dark-grey-text lh-1', { [css.inside]: key >= 0 }) }>
        { (address.id || address.lat) ? address.line : '—' }
      </div>
    );
  }

  renderVehiclePrice({ price, localPrice, localCurrencySymbol }) {
    if (price && !this.props.asDirected) {
      return localPrice
        ? (<Fragment>
            {`£${centsToPounds(price)}*`}
            <div className="text-12 dark-grey-text bold-text">
              {`${localCurrencySymbol}${centsToPounds(localPrice)}`}
            </div>
          </Fragment>)
        : `£${centsToPounds(price)}*`;
    } else {
      return 'Pay by the meter';
    }
  }

  renderPrices(vehicle) {
    const { bookingFee } = this.props;
    const { price, traderPrice } = vehicle;

    if (this.isBbcCompanyType) {
      const { bbcP11Tax, bbcTotalCost, bbcTotalCostToBbc, bbcSalaryCharge } = vehicle;

      return (
        <Fragment>
          <div className="layout horizontal center" data-name="journeyCost">
            <div className="w-120 text-12 medium-grey-text">Est. Journey cost:</div>
            { price > 0 ? `£${centsToPounds(price)}` : 'by meter' }
          </div>
          <div className="layout horizontal center" data-name="bookingFee">
            <div className="w-120 text-12 medium-grey-text">Booking Fee:</div>
            { `£${(bookingFee || 0).toFixed(2)}` }
          </div>
          { bbcP11Tax > 0 &&
            <div className="layout horizontal center" data-name="p11Tax">
              <div className="w-120 text-12 medium-grey-text">P11D Tax Liability</div>
              { `£${centsToPounds(bbcP11Tax)}` }
            </div>
          }
          { bbcTotalCost > 0 &&
            <div className="layout horizontal center" data-name="totalCost">
              <div className="w-120 text-12 medium-grey-text">Total cost</div>
              { `£${centsToPounds(bbcTotalCost)}` }
            </div>
          }
          { bbcTotalCostToBbc > 0 &&
            <div className="layout horizontal center" data-name="totalCostBBC">
              <div className="w-120 text-12 medium-grey-text">Total cost to BBC</div>
              { `£${centsToPounds(bbcTotalCostToBbc)}` }
            </div>
          }
          { bbcSalaryCharge > 0 &&
            <div className="layout horizontal center" data-name="salaryCharge">
              <div className="w-120 text-12 medium-grey-text">Salary Charge</div>
              { `£${centsToPounds(bbcSalaryCharge)}` }
            </div>
          }
        </Fragment>
      );
    } else {
      return (
        <div className="text-right" data-name="price">
          { this.renderVehiclePrice(vehicle) }
          { !!traderPrice &&
            <span data-name="traderPrice">{ ` / Trader Price: £${centsToPounds(traderPrice)}**` }</span>
          }
        </div>
      );
    }
  }

  render() {
    const {
      vehicleName, vehicles, failedToLoadVehicles, distance, duration,
      showEta, pickupAddress, destinationAddress, locked, asDirected, internationalFlag, stopsAddresses
    } = this.props;

    return (
      <div data-name="vehicleName">
        <Tabs
          className={ css.tabs }
          onChange={ this.changeVehicleName }
          activeKey={ vehicleName }
          tabBarExtraContent={ this.renderTabsArrows() }
        >
          { vehicles.map((vehicle) => {
              const vehicleData = vehiclesData[vehicle.name];
              let tooltipOptions = { visible: false, title: '' };

              if (!locked) {
                if (isUndefined(failedToLoadVehicles)) { // vehicles were never requested
                  tooltipOptions = { title: 'Please make sure all of the necessary fields are filled out in order to select your vehicle.' };
                } else if (vehicle.prebook) {
                  tooltipOptions = { title: 'Vehicle is available only for Pre Book, please click "Pre Book Only" link.' };
                } else if (!vehicle.available) {
                  tooltipOptions = { title: NOT_AVAILABLE_REASONS[vehicle.reason] };
                }
                tooltipOptions.overlayClassName = css.tooltip;
              }

              return (
                <TabPane
                  key={ vehicle.name }
                  tab={
                    <Tooltip { ...tooltipOptions }>
                      <div className={ CN({ 'cursor-default': !vehicle.available }, 'text-center') } data-name={ vehicleData.label } data-disabled={ !vehicle.available }>
                        <div className="mb-20">
                          <div className="black-text text-14">{ vehicleData.label }</div>
                          { vehicle.available && showEta &&
                            <div className="mt-5 text-12 black-text bold-text">
                              { `ETA: ${vehicle.eta ? vehicle.eta : '> 25'} min` }
                            </div>
                          }
                          { vehicle.prebook &&
                            <div className={ CN('mt-5 text-10 p-5 br-9 white-text bold-text pointer blue-bg', css.preBookBtn) } onClick={ () => this.changeVehicleName(vehicle.name, 'later') }>
                              Pre-Book Only
                            </div>
                          }
                        </div>
                        <VehicleType
                          className={ CN({ 'fade': !vehicle.available  }, 'center-block') }
                          size="big"
                          type={ vehicle.name }
                          serviceType={ vehicle.serviceType }
                          via={ vehicle.via }
                        />
                      </div>
                    </Tooltip>
                  }
                >
                  { (vehicle.available || (vehicle.name === vehicleName && locked)) &&
                    <div className="extra-light-grey-bg br-6 hidden-overflow" data-name="vehicleDescription">
                      <div className="p-20">
                        <div className="layout horizontal center mb-20">
                          <div className="bold-text black-text flex">{ vehicleData.label }</div>
                          <div className="black-text text-20 bold-text">
                            { this.renderPrices(vehicle) }
                          </div>
                        </div>
                        <div className="mb-20 border-bottom" />
                        { !this.isBbcCompanyType &&
                          <div className="text-12 dark-grey-text bold-text mb-20">
                            { vehicle.description }
                          </div>
                        }
                        <div className={ CN('mb-30 relative', destinationAddress ? css.cabTabsAddress : css.cabTabsAddressAsDirected) }>
                          { pickupAddress && <div className="mb-15">{ this.renderAddressLine(pickupAddress) }</div> }
                          { stopsAddresses && map(stopsAddresses, (stop, key) => this.renderAddressLine(stop.address, key)) }
                          { destinationAddress && this.renderAddressLine(destinationAddress) }
                        </div>
                        <div className="layout horizontal xs-wrap start mb-35">
                          <div className="flex xs-full-width mr-30 xs-mr-0 xs-mb-20">
                            { !internationalFlag && vehicle.details &&
                              <Fragment>
                                { map(vehicle.details, (item, index) => (
                                    <div key={ index } className="layout horizontal center mb-15">
                                      <Icon className="text-18 dark-grey-text bold-text mr-15" icon="MdCheck" />
                                      <div className="text-12 dark-grey-text bold-text">{ item }</div>
                                    </div>
                                  ))
                                }
                              </Fragment>
                            }
                          </div>
                          <div className="flex xs-full-width text-12 bold-text">
                            { distance && duration && !asDirected &&
                              <Fragment>
                                <div className="layout horizontal mb-15 black-text">
                                  <span className="medium-grey-text w-150 mr-10">Estimated Distance:</span>
                                  { distance || 'N/A' }
                                </div>
                                <div className="layout horizontal mb-15 black-text">
                                  <span className="medium-grey-text w-150 mr-10">Estimated Journey Time:</span>
                                  { duration || 'N/A' }
                                </div>
                              </Fragment>
                            }
                          </div>
                        </div>
                      </div>

                      <div className="sand-bg text-center text-12 black-text pt-10 pb-10 pr-40 pl-40">
                        { this.isBbcCompanyType
                          ? <div>
                              *The price may increase if additional stops or waiting time in incurred
                            </div>
                          : <Fragment>
                              <div>
                                *Excluding VAT & fees. The final price may increase should the final destination
                                be amended after the journey has started. If additional stops are added or the free waiting time is exceeded.
                              </div>
                              { !!vehicle.traderPrice &&
                                <div>
                                  **VAT and One Transport Fees are not included in the quote, changes in destination, parking, waiting times, stop points
                                  will automatically change the final fare.
                                </div>
                              }
                            </Fragment>
                        }
                      </div>
                    </div>
                  }
                </TabPane>
              );
          }) }
        </Tabs>
        { (failedToLoadVehicles || this.noVehicleAvailable()) &&
          <div className="error block text-center">Vehicles are not available in this area or not allowed by Travel Policy</div>
        }
      </div>
    );
  }
}

export default connect(mapStateToProps)(CabTabs);
