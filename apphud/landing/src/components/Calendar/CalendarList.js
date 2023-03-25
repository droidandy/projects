import React from "react";
import PropTypes from "prop-types";
import styles from "./index.module.scss";
import Calendar from "./Calendar";

function CalendarList({ months, focused }) {
    return <div className={styles.calendarList}>
        {months.map((month, key) => (
            <Calendar
                key={key}
                date={month.date.toISO()}
                from={month.period.from}
                to={month.period.to}
                events={month.events}
                isFocused={focused?.startOf("month").toISO() === month.date?.startOf("month").toISO()}
            />
        ))}
    </div>
}

CalendarList.propTypes = {
    from: PropTypes.Date,
    to: PropTypes.Date,
}

export default CalendarList;
