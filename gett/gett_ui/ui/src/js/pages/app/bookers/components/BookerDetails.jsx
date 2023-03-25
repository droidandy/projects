import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Avatar, ButtonLink, SpendChart, PieChart } from 'components';
import dispatchers from 'js/redux/app/bookers.dispatchers';

import css from './style.css';

import { typesDataToPieData } from './utils';

function mapStateToProps(state) {
  return { details: state.bookers.details };
}

class BookerDetails extends PureComponent {
  static propTypes = {
    booker: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      avatarUrl: PropTypes.string
    }).isRequired,
    details: PropTypes.shape({
      loading: PropTypes.bool,
      record: PropTypes.object,
      stats: PropTypes.object
    }),
    dropDetails: PropTypes.func,
    getDetails: PropTypes.func
  };

  componentDidMount() {
    this.props.getDetails(this.props.booker.id);
  }

  render() {
    const { id, avatarUrl, firstName, lastName } = this.props.booker;
    const { loading, stats: { dailyOrders, dailySpent, dailyPresent, showDailySpent, typesData } } = this.props.details;
    return (
      <div className="layout horizontal start wrap" data-name="bookerDetails">
        <div className="text-center mr-20 sm-mr-0 sm-mb-20 sm-full-width">
          <Avatar size={ 200 } name={ `${ firstName } ${ lastName }` } className="mb-20 sm-center-block" src={ avatarUrl } />
          <ButtonLink to={ `/bookers/${id}/edit` } type="primary" disabled={ loading } data-name="edit">Edit</ButtonLink>
        </div>
        <div className={ `flex fix-flex border-block mr-10 mb-10 sm-mr-0 sm-mb-20 sm-min-max-full-width ${css.chartContainer}` }>
          <div className="pr-10 pt-10">
            { dailyPresent
              ? <SpendChart
                  generalTitle="Daily Orders"
                  data={ dailyOrders }
                  dataKey="day"
                  height={ 290 }
                  name="dailyOrdersChart"
                />
              : <div className="pl-10 pb-10">No completed orders yet</div>
            }
          </div>
        </div>
        { showDailySpent &&
          <div className={ `flex fix-flex border-block mr-10 mb-10 sm-mr-0 sm-mb-20 sm-min-max-full-width ${css.chartContainer}` }>
            <div className="pr-10 pt-10">
              { dailyPresent
                ? <SpendChart
                    generalTitle="Daily Spend"
                    data={ dailySpent }
                    dataKey="day"
                    height={ 290 }
                    name="dailySpendChart"
                  />
                : <div className="pl-10 pb-10">No completed orders yet</div>
              }
            </div>
          </div>
        }
        <div className="flex border-block mb-10 sm-full-width">
          <div className="border-bottom p-10 black-text">Order Types</div>
          <div className="text-center">
            { typesData && typesData.total > 0
              ? <PieChart data={ typesDataToPieData(typesData) } unit="value" />
              : <div className="p-10">No completed orders yet</div>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(BookerDetails);
