import React, {Fragment, useContext, useState} from "react";
import {DateTime as DT, Info} from 'luxon';
import PropTypes from "prop-types";
import styles from "./index.module.scss";
import {getDaysInMonthMode} from "./utils";
import {CalendarContext} from "./AppleFiscalCalendar";

function Calendar(props) {
    const [hover, setHover] = useState(false);
    const { setState } = useContext(CalendarContext);
    const date = DT.fromISO(props.date).startOf('day');
    const days = getDaysInMonthMode(date, props?.from, props?.to);
    const weekDays = [...Info.weekdays('short')];
    const onFocusHandler = (event, data) => {
        if (event) setState(data);
    }
    const onBlurHandler = (event) => {
        if (event) setState(null);
    }
    weekDays.unshift(weekDays.pop());
    return <div className={`${styles.calendar} ${props?.isFocused && styles.focused}`}>
        <div className={styles.heading}>
            {date.toFormat("MMMM")}
        </div>
        <div className={styles.days}>
            {weekDays.map((weekDay, i) => (
                <div className={styles.day} key={i}>
                    <strong>{weekDay.slice(0, 1)}</strong>
                </div>
            ))}
        </div>
        <div className={styles.dates}>
            {days.map((el, key) => {
                const id = `${el.toISO()}-${date.toISO()}`;
                const events  = props.events.filter((e) => e.date.toISO() === el.toISO());
                const isDisabled = events.find((e) => e.disabled);
                const focusDate = events.find((e) => e.focusDate);
                const curMonth = el.month === date.month;
                const hasEvents = events.length > 0;
                return (
                    <>
                        <input
                            id={id}
                            onFocus={() => onFocusHandler(hasEvents, focusDate?.focusDate)}
                            onBlur={() => onBlurHandler(hasEvents)}
                        />
                        <label
                            onMouseOver={() => {
                                if(hasEvents) setHover(id);
                                onFocusHandler(hasEvents, focusDate?.focusDate)
                            }}
                            onMouseOut={() => {
                                if(hasEvents) setHover(false);
                                onBlurHandler(hasEvents)
                            }}
                            htmlFor={id}
                            className={
                                `${styles.date}
                                ${hover === id && styles.hover}
                                ${hasEvents && styles.event}
                                ${isDisabled && curMonth && styles.disabled}
                                ${!curMonth && styles.blocked}`
                            }
                            key={key}>
                            {el.toFormat('d')}
                            {hasEvents && !isDisabled
                                && <div className={styles.popup}>
                                    <div className={styles.content}>
                                        {events.map((event, i) => (
                                            <Fragment key={i}>
                                                <div className={styles.label}>
                                                    Estimated Payment Date
                                                </div>
                                                <p>{event?.paymentDate}</p>
                                                <div className={styles.label}>
                                                    Sales Period
                                                </div>
                                                <p>{event?.salesPeriod}</p>
                                            </Fragment>
                                        ))}
                                    </div>
                                </div>
                            }
                        </label>
                    </>
                )
            })}
        </div>
    </div>;
}

Calendar.defaultProps = {
    date: new Date(),
    events: [],
}

Calendar.propTypes = {
    date: PropTypes.Date,
    events: PropTypes.array,
}

export default Calendar;
