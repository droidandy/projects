import React, { Component } from "react"
import { connect } from "react-redux"
import "react-dates/initialize"
import { DateRangePicker, isInclusivelyAfterDay } from "react-dates"
import "react-dates/lib/css/_datepicker.css"
import moment from "moment"
import { generatePeriod, isMobile } from "../../libs/helpers"
import Aux from "../../hoc/Aux"

class _DateRangePicker extends Component {
  state = {
    focusedInput: null,
    startTime: null,
    endTime: null
  };

  componentWillMount() {
    const { startTime, endTime, handleChangePeriod } = this.props
    this.initialParams = {
      startTime: moment(startTime),
      endTime: moment(endTime)
    }
    this.setState(this.initialParams)
  }

  onFocusChange = (focusedInput) => {
    if (this.state.focusedInput === "endDate" && !focusedInput) return

    this.setState({ focusedInput }, () => {
      const viewport = document.querySelector("meta[name=viewport]")

      if (this.state.focusedInput) {
        document.activeElement.blur()
        viewport.setAttribute(
          "content",
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        )

        if (isMobile()) document.body.classList.add("date-picker__mobile")
      } else viewport.setAttribute("content", "width=1240, initial-scale=1")
    })
  };

  resetViewport = () => {
    const viewport = document.querySelector("meta[name=viewport]")
    viewport.setAttribute("content", "width=1240, initial-scale=1")
    document.body.classList.remove("date-picker__mobile")
  };

  handleCancel = () => {
    this.setState(Object.assign(this.initialParams, { focusedInput: null }))
    this.resetViewport()
  };

  handleChangePeriodFromPreset = (value) => {
    const currentPeriod = generatePeriod(value)

    this.setState(
      {
        startTime: moment(currentPeriod.start_time),
        endTime: moment(currentPeriod.end_time)
      },
      () => {
        this.handleDone(true)
      }
    )
  };

  renderCalendarInfo = () => {
    return (
      <Aux>
        <div className="datepicker-calendar__info">
          {this.props.periods.map((period) => (
            <div
              key={period.value}
              onClick={this.handleChangePeriodFromPreset.bind(
                null,
                period.value
              )}
              className="datepicker-calendar__info-item cp"
            >
              {period.name}
            </div>
          ))}
        </div>
        <div className="datepicker-calendar__info-buttons">
          <button
            onClick={this.handleCancel}
            className="button button_blue button_160"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              this.handleDone()
            }}
            className="button button_green button_160"
          >
            Done
          </button>
        </div>
      </Aux>
    )
  };

  datePickerArrowClick = () => {
    document.querySelector(".DateInput_input").focus()
  };

  handleChangePeriod = ({ startDate, endDate }) => {
    let endTime = endDate
    if (!endTime || startDate.isSame(endTime)) {
      endTime = moment(startDate).endOf("day")
    }
    this.setState({
      startTime: startDate,
      endTime
    })
  };

  handleDone = (fromPreset) => {
    const { handleChangePeriod, name } = this.props
    const { startTime, endTime } = this.state

    if (!fromPreset && name) { localStorage.removeItem(`${name.toLowerCase()}.period`) }

    this.setState({ focusedInput: null }, () => {
      handleChangePeriod({ startDate: startTime, endDate: endTime })
    })
    this.resetViewport()
  };

  componentWillReceiveProps({ startTime, endTime }) {
    this.initialParams = {
      startTime: moment(startTime),
      endTime: moment(endTime)
    }
    this.setState(this.initialParams);
  }

  componentWillUnmount = () => {
    this.resetViewport()
  };

  render() {
    const { focusedInput } = this.state
    const { handleChangePeriod, anchorDirection } = this.props
    const { startTime, endTime } = this.state

    return (
      <div>
        <DateRangePicker
          readOnly
          onClose={this.onClose}
          isOutsideRange={(day) =>
            isInclusivelyAfterDay(day, moment().add(1, "days"))
          }
          anchorDirection={anchorDirection || "left"}
          calendarInfoPosition="before"
          renderCalendarInfo={this.renderCalendarInfo}
          displayFormat={"MMM D, YYYY"}
          customArrowIcon={"–"}
          startDate={startTime}
          startDateId="start_time"
          endDate={endTime || null}
          endDateId="end_time"
          onFocusChange={this.onFocusChange}
          focusedInput={focusedInput}
          onDatesChange={this.handleChangePeriod}
          minimumNights={0}
          withFullScreenPortal={isMobile()}
          numberOfMonths={isMobile() ? 1 : 2}
        />
        <svg
          onClick={this.datePickerArrowClick}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.41 8.59003L12 13.17L16.59 8.59003L18 10L12 16L6 10L7.41 8.59003Z"
            fill="#0085FF"
          />
        </svg>
        {focusedInput && (
          <div
            className="DateRangePicker-overlay"
            onClick={this.handleCancel}
          />
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(_DateRangePicker)

_DateRangePicker.defaultProps = {
  periods: [
    { name: "Today", value: "today" },
    { name: "Yesterday", value: "yesterday" },
    { name: "Last 7 days", value: "last_7_days" },
    { name: "Last 28 days", value: "last_28_days" },
    { name: "This month", value: "this_month" },
    { name: "Last month", value: "last_month" },
    { name: "Last 3 month", value: "last_3_months" },
    { name: "This year", value: "this_year" }
  ]
}
