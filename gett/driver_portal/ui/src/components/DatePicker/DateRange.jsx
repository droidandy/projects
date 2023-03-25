import React, { Component } from 'react'
import styled from 'styled-components'
import parseInput from './utils/parseInput.js'
import Calendar from './Calendar'

class DateRange extends Component {
  static defaultProps = {
    linkedCalendars: false,
    format: 'DD/MM/YYYY',
    calendars: 2,
    offsetPositive: false,
    specialDays: [],
    rangedCalendars: false,
    twoStepChange: false
  }

  constructor(props, context) {
    super(props, context)

    const { format, linkedCalendars } = props

    const startDate = parseInput(props.startDate, format, 'startOf')
    const endDate = parseInput(props.endDate, format, 'endOf')

    this.state = {
      range: { startDate, endDate },
      link: linkedCalendars && endDate
    }

    this.step = 0
  }

  componentDidMount() {
    const { onInit } = this.props
    onInit && onInit(this.state.range)
  }

  orderRange(range) {
    const { startDate, endDate } = range
    const swap = startDate.isAfter(endDate)

    if (!swap) return range

    return {
      startDate: endDate,
      endDate: startDate
    }
  }

  setRange(range, source, triggerChange) {
    const { onChange } = this.props
    range = this.orderRange(range)

    this.setState({ range }, () => triggerChange && onChange && onChange(range, source))
  }

  handleSelect = (date, source) => {
    if (date.startDate && date.endDate) {
      this.step = 0
      return this.setRange(date, source, true)
    }

    const { startDate, endDate } = this.state.range

    const range = {
      startDate: startDate,
      endDate: endDate
    }

    switch (this.step) {
      case 0:
        range['startDate'] = date
        range['endDate'] = date
        this.step = 1
        break

      case 1:
        range['endDate'] = date
        this.step = 0
        break
      default:
        break
    }

    const Step = this.step === 0 && this.props.twoStepChange
    const triggerChange = !this.props.twoStepChange || Step

    this.setRange(range, source, triggerChange)
  }

  handleLinkChange = (direction, year) => {
    const { link } = this.state

    this.setState({
      link: year ? link.clone().add(direction, 'y') : link.clone().add(direction, 'months')
    })
  }

  componentWillReceiveProps(newProps) {
    if (newProps.startDate || newProps.endDate) {
      const format = newProps.format || this.props.format
      const startDate = newProps.startDate && parseInput(newProps.startDate, format, 'startOf')
      const endDate = newProps.endDate && parseInput(newProps.endDate, format, 'endOf')
      const oldStartDate = this.props.startDate && parseInput(this.props.startDate, format, 'startOf')
      const oldEndDate = this.props.endDate && parseInput(this.props.endDate, format, 'endOf')

      if (!startDate.isSame(oldStartDate) || !endDate.isSame(oldEndDate)) {
        this.setRange({
          startDate: startDate || oldStartDate,
          endDate: endDate || oldEndDate
        })
      }
    }
  }

  render() {
    const {
      format,
      linkedCalendars,
      calendars,
      firstDayOfWeek,
      minDate,
      maxDate,
      specialDays,
      lang,
      disableDaysBeforeToday,
      offsetPositive,
      disableOffset,
      shownDate,
      showMonthArrow,
      rangedCalendars,
      className,
      cellSize
    } = this.props
    const { range, link } = this.state

    const yearsDiff = range.endDate.year() - range.startDate.year()
    const monthsDiff = range.endDate.month() - range.startDate.month()
    const diff = yearsDiff * 12 + monthsDiff
    const calendarsCount = Number(calendars) - 1
    const singleRange = calendarsCount < 1

    return (
      <div className={ className }>
        <Delimeter singleRange />

        {(() => {
          const calendars = []
          const method = offsetPositive ? 'unshift' : 'push'
          for (let i = calendarsCount; i >= 0; i--) {
            const offset = offsetPositive ? i : -i
            const realDiff = offsetPositive ? diff : -diff
            const realOffset = (rangedCalendars && i === calendarsCount && diff !== 0) ? realDiff : offset

            calendars[method](
              <CalendarStyled
                showMonthArrow={ showMonthArrow }
                shownDate={ shownDate }
                disableDaysBeforeToday={ disableDaysBeforeToday }
                lang={ lang }
                key={ i }
                offset={ realOffset }
                link={ linkedCalendars && link }
                linkCB={ this.handleLinkChange }
                range={ range }
                format={ format }
                firstDayOfWeek={ firstDayOfWeek }
                minDate={ minDate }
                maxDate={ maxDate }
                specialDays={ specialDays }
                cellSize={ cellSize }
                onChange={ this.handleSelect }
                disableOffset={ disableOffset }
                singleRange={ singleRange }
              />
            )
          }
          return calendars
        })()}
      </div>
    )
  }
}

export default DateRange

const CalendarStyled = styled(Calendar)`
  width: 250px;
  background: #ffffff;
  border-radius: 2px;
  display: inline-block;
  box-sizing: border-box;
  letter-spacing: 0;
  color: #000000;
`

const Delimeter = styled.div`
  position: absolute;
  border: solid 1px #d0d5da;
  width: ${props => props.singleRange ? 95 : 96}%;
  top: 40px;
  left: 10px;
`
