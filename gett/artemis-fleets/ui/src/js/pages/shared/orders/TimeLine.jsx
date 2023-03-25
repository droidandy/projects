import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { map, isEmpty, difference, camelCase, snakeCase, get, last } from 'lodash';
import { statusLabels } from './data';
import { Tablet } from 'components';
import CN from 'classnames';
import moment from 'moment';
import update from 'update-js';

import css from './styles.css';

const timeLineStatuses = ['order_received', 'arrived', 'in_progress', 'completed'];

export default class TimeLine extends PureComponent {
  static propTypes = {
    order: PropTypes.object
  };

  getTimeLineStatuses() {
    return timeLineStatuses;
  }

  isPreviousStatusActive(status) {
    return this.props.order.orderStatusName === this.getTimeLineStatuses()[this.getTimeLineStatuses().findIndex(e => e === status) - 1];
  }

  getNextStatus() {
    return difference(this.getTimeLineStatuses(), Object.keys(this.props.order.events).map(snakeCase))[0];
  }

  getStatuses() {
    return this.getTimeLineStatuses().filter(e => !isEmpty(this.props.order.events[camelCase(e)]) || e === this.getNextStatus());
  }

  getStatusesData() {
    const { events } = this.props.order;
    if (this.isInterrupted) {
      const eventToEdit = camelCase(this.getNextStatus());
      return update(events, `${eventToEdit}.interrupted`, true);
    } else {
      return events;
    }
  }

  get isInterrupted() {
    return ['cancelled', 'rejected'].includes(this.props.order.orderStatusName);
  }

  getStatusTime(status) {
    const { events, orderStatusName } = this.props.order;
    const time = get(status.interrupted ? events[orderStatusName] : status, 'time');
    return time && moment(time).format('DD/MM/YYYY - HH:mm');
  }

  isFirst(status) {
    return status === this.getTimeLineStatuses()[0];
  }

  isLast(status) {
    return status === last(this.getTimeLineStatuses());
  }

  isOutSide(status) {
    return this.isFirst(status) || this.isLast(status);
  }

  isCurrentStatus(status) {
    if (this.isInterrupted) {
      return false;
    }
    return status === last(this.getTimeLineStatuses().filter(e => !isEmpty(this.props.order.events[camelCase(e)])));
  }

  renderIntervalAndDistance(statusName, status) {
    if (statusName === 'order_received' || statusName === 'locating') {
      return null;
    }
    const { interval, distance } = status;
    const intervalText = interval > 0 ? moment.duration(interval, 'seconds').humanize() : '';
    const distanceText = distance ? `, ${distance} mi` : '';

    return intervalText + distanceText;
  }

  renderPiece = (statusName) => {
    const { orderStatusName } = this.props.order;
    const status = this.getStatusesData()[camelCase(statusName)] || {};

    return (
      <div key={ statusName } className={ CN('layout horizontal start', css[statusName]) }>
        { !this.isFirst(statusName) &&
          <div className={ css.pointLine }>
            { this.renderIntervalAndDistance(statusName, status) }
          </div>
        }
        <div className={ css.point }>
          <div
            className={
              CN(css.pointMarker, {
                [css.outside]: this.isOutSide(statusName),
                [css.passed]: !!status.time,
                [css.interrupted]: status.interrupted,
                [css.active]: this.isCurrentStatus(statusName)
              })
            }
          />
          <div className="text-10">{ statusLabels[status.interrupted ? orderStatusName : statusName] }</div>
          <div className="text-9">{ this.getStatusTime(status) }</div>
        </div>
      </div>
    );
  };

  renderTabletPiece = (statusName) => {
    const { orderStatusName } = this.props.order;
    const status = this.getStatusesData()[camelCase(statusName)] || {};
    const isOutSide = this.isOutSide(statusName);

    return (
      <div key={ statusName } className={ CN('layout horizontal center', css.intervalSpace, { [css.outside]: isOutSide, [css.first]: this.isFirst(statusName) }) }>
        <div className="flex text-right">
          <div className="text-10">{ statusLabels[status.interrupted ? orderStatusName: statusName] }</div>
          <div className="text-9">{ this.getStatusTime(status) }</div>
        </div>
        <div
          className={
            CN(css.mobilePoint, 'flex none ml-5 mr-5', {
              [css.first]: this.isFirst(statusName),
              [css.outside]: isOutSide,
              [css.passed]: !!status.time,
              [css.interrupted]: status.interrupted,
              [css.completed]: statusName === 'completed',
              [css.active]: this.isCurrentStatus(statusName)
            })
          }
        />
        <div className={ `flex self-start ${css.interval}` }>
          { !this.isFirst(statusName) && this.renderIntervalAndDistance(statusName, status) }
        </div>
      </div>
    );
  };

  render() {
    return (
      <div ref={ node => this.timeLineContent = node }>
        <Tablet>
          { matches => matches
            ?
            <div className="pb-10 mb-10 border-bottom">
              { map(this.getStatuses(), this.renderTabletPiece) }
            </div>
            :
            <div className="layout horizontal pt-30 mb-10">
              { map(this.getStatuses(), this.renderPiece) }
            </div>
          }
        </Tablet>
      </div>
    );
  }
}
