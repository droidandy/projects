import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Avatar, ButtonLink, SpendChart, PieChart } from 'components';
import { typesDataToPieData } from './utils';
import { camelCase } from 'lodash';
import css from './style.css';

export default class PassengerDetails extends PureComponent {
  static propTypes = {
    passenger: PropTypes.shape({
      id: PropTypes.number,
      avatarUrl: PropTypes.string
    }).isRequired,
    stats: PropTypes.object,
    getStats: PropTypes.func,
    editPath: PropTypes.string
  };

  componentDidMount() {
    const { getStats, passenger } = this.props;

    getStats(passenger.id);
  }

  renderChart(data, title, defaultText) {
    const { dailyPresent } = this.props.stats;

    return (
      <div className={ `flex fix-flex border-block mr-10 mb-10 sm-mr-0 sm-mb-20 sm-min-max-full-width ${css.chartContainer}` }>
        <div className="pr-10 pt-10">
          { dailyPresent
            ? <SpendChart
                generalTitle={ title }
                data={ data }
                dataKey="day"
                height={ 290 }
                name={ camelCase(title).concat('Chart') }
              />
            : <div className="pl-10 pb-10">{ `Passenger has no ${defaultText}.` }</div>
          }
        </div>
      </div>
    );
  }

  render() {
    const {
      passenger: { id, avatarUrl, firstName, lastName },
      stats: { dailyOrders, dailySpent, typesData },
      editPath
    } = this.props;

    return (
      <div>
        <div className="layout horizontal start wrap" data-name="passengerDetails">
          <div className="text-center mr-20 sm-mr-0 sm-mb-20 sm-full-width">
            <Avatar size={ 200 } className="mb-20 sm-center-block" src={ avatarUrl } name={ `${firstName} ${lastName}` } data-name="detailsAvatar" />
            <ButtonLink type="secondary" to={ `${editPath}/${id}/edit` } data-name="edit">Edit</ButtonLink>
          </div>
          { this.renderChart(dailyOrders, 'Daily Orders', 'completed orders') }
          { this.renderChart(dailySpent, 'Daily Spend', 'completed orders') }
          <div className="flex border-block sm-full-width">
            <div className="border-bottom p-10 black-text">Order Types</div>
            <div className="text-center">
              { typesData && typesData.total > 0
                ? <PieChart data={ typesDataToPieData(typesData) } unit="value" />
                : <div className="p-10 text-center">No completed orders yet</div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
