import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import InfiniteCalendar, { Calendar as CalendarComponent, defaultMultipleDateInterpolation, withMultipleDates } from '@GettUK/react-infinite-calendar';
import { some } from 'lodash';
import moment from 'moment';

const MultipleDatesCalendar = withMultipleDates(CalendarComponent);

export default class Calendar extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    value: PropTypes.arrayOf(PropTypes.object),
    onChange: PropTypes.func,
    error: PropTypes.string,
  };

  static defaultProps = {
    value: []
  };

  handleChange = (date) => {
    const { value, onChange } = this.props;

    // We always have to store original selected date
    // even if 00.00AM is 10.00PM of previous day in current local timezone
    const absoluteDate = moment(date).add(moment(date).local().utcOffset(), 'minutes');

    if (some(value, d => d.isSame(absoluteDate, 'day'))) {
      onChange(value.filter(d => !d.isSame(absoluteDate, 'day')));
    } else {
      onChange([...value, absoluteDate]);
    }
  };

  render() {
    const { className, error, value, ...rest } = this.props;
    const dateValue = value.map(v => v.clone().utc().startOf('day').toDate());
    const theme = {
      selectionColor: '#fdb924',
      textColor: {
        default: '#373737',
        active: '#373737'
      }
    };

    return (
      <div className={ className }>
        <InfiniteCalendar
          Component={ MultipleDatesCalendar }
          interpolateSelection={ defaultMultipleDateInterpolation }
          selected={ dateValue }
          onSelect={ this.handleChange }
          theme={ theme }
          { ...rest }
        />
        { error &&
          <div className="error">{ error }</div>
        }
      </div>
    );
  }
}
