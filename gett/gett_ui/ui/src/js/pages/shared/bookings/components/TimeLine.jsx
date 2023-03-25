import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { map, size } from 'lodash';
import { statusLabels } from '../data';
import { VehicleType, sidebarMenuBreakPoint } from 'components';
import CN from 'classnames';

import css from './styles.css';

const MIN_WIDTH = 140;
const SIDEBAR_WIDTH  = 280;

export default class TimeLine extends PureComponent {
  static propTypes = {
    booking: PropTypes.object
  };

  state = {
    isSmall: false
  };

  componentDidMount() {
    const { events } = this.props.booking;
    // we need to add 1 as we have also buttons column with the same width
    this.eventsLength = size(events) + 1;
    if (this.timeline) {
      this.getSize();
      window.addEventListener('resize', this.getSize);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.getSize);
  }

  getSize = () => {
    let width = window.innerWidth;
    if (width > sidebarMenuBreakPoint) width -= SIDEBAR_WIDTH;
    this.setState({ isSmall: width < MIN_WIDTH * this.eventsLength });
  };

  setTimelineRef = node => this.timeline = node;

  renderCancelledBy(isInterrupted) {
    const { status: currentStatus, cancelledByName } = this.props.booking;

    return (
      isInterrupted &&
      currentStatus === 'cancelled' &&
      !!cancelledByName &&
      <div className="text-10">{ `by ${cancelledByName}` }</div>
    );
  }

  renderPiece = (event) => {
    const { vehicleType, status: currentStatus } = this.props.booking;
    const {
      status,
      intervalAndDistance,
      isActive,
      isFirst,
      isInterrupted,
      isEdge,
      isPreviousActive,
      isAnimated,
      time
    } = event;

    return (
      <div key={ status } className={ CN('layout horizontal start', css[status]) }>
        { !isFirst &&
          <div className={ CN(css.pointLine, 'bold-text medium-grey-text') }>
            { intervalAndDistance }
            { isPreviousActive &&
              <VehicleType
                type={ vehicleType }
                className={ CN(css.vehicle, { [css.animatedVehicle]: isAnimated }) }
              />
            }
          </div>
        }
        <div className={ css.point }>
          <div
            className={
              CN(css.pointMarker, {
                [css.outside]: isEdge,
                [css.passed]: !!time,
                [css.interrupted]: isInterrupted,
                [css.active]: isActive
              })
            }
          />
          <div>{ statusLabels[isInterrupted ? currentStatus : status] }</div>
          { this.renderCancelledBy(isInterrupted) }
          <div className="text-10 bold-text medium-grey-text">{ time }</div>
        </div>
      </div>
    );
  };

  renderTabletPiece = (event) => {
    const { vehicleType, status: currentStatus } = this.props.booking;
    const {
      status,
      intervalAndDistance,
      isActive,
      isFirst,
      isInterrupted,
      isEdge,
      isPreviousActive,
      time
    } = event;

    return (
      <div
        key={ status }
        className={
          CN(
            'layout horizontal center',
            css.intervalSpace,
            { [css.outside]: isEdge, [css.first]: isFirst }
          )
        }
      >
        <div className="flex text-right">
          <div>{ statusLabels[isInterrupted ? currentStatus : status] }</div>
          { this.renderCancelledBy(isInterrupted) }
          <div className="text-10 grey-text">{ time }</div>
        </div>
        <div
          className={
            CN(css.mobilePoint, 'flex none ml-5 mr-5', {
              [css.first]: isFirst,
              [css.outside]: isEdge,
              [css.passed]: !!time,
              [css.interrupted]: isInterrupted,
              [css.completed]: status === 'completed',
              [css.active]: isActive
            })
          }
        />
        <div className={ `flex self-start grey-text text-10 ${css.interval}` }>
          { !isFirst && [
              intervalAndDistance,
              isPreviousActive && <VehicleType key={ vehicleType } type={ vehicleType } />
            ]
          }
        </div>
      </div>
    );
  };

  render() {
    const { events } = this.props.booking;
    const { isSmall } = this.state;

    return (
      <div ref={ this.setTimelineRef }>
        { isSmall
          ? <div className="pb-10 mb-10">
              { map(events, this.renderTabletPiece) }
            </div>
          : <div className="layout horizontal center-justified start pt-30 mb-10">
              { map(events, this.renderPiece) }
          </div>
        }
      </div>
    );
  }
}
