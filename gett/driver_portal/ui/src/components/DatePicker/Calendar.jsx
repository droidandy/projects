import React, { Component } from 'react'
import moment from 'moment'
import styled from 'styled-components'
import { map } from 'lodash'
import { IconArrow, IconDoubleArrow } from 'components/Icons'
import { TimePicker } from 'components/TimePicker'
import { Button } from 'components/Button'
import parseInput from './utils/parseInput.js'
import { checkRange, checkStartEdge, checkEndEdge } from './utils/tools.js'
import DayCell from './DayCell'
import LangDic from './LangDic.js'

class Calendar extends Component {
  static defaultProps = {
    format: 'DD/MM/YYYY',
    showMonthArrow: true,
    disableDaysBeforeToday: false,
    specialDays: []
  }

  constructor(props, context) {
    super(props, context)

    const { format, range, offset, firstDayOfWeek, locale, shownDate } = props

    if (locale) {
      moment.locale(locale)
    }

    const date = parseInput(props.date, format, 'startOf')
    const rangeCheck = range && range['endDate']
    const showDate = shownDate || rangeCheck || date
    this.state = {
      date,
      shownDate: showDate.clone().add(offset, 'M'),
      firstDayOfWeek: (firstDayOfWeek || moment.localeData().firstDayOfWeek())
    }
  }

  componentDidMount() {
    const { onInit } = this.props
    onInit && onInit(this.state.date)
  }

  componentWillReceiveProps(nextProps) {
    const { range, offset, disableOffset } = nextProps
    const oldRange = this.props.oldRange

    if (!disableOffset) {
      if ((range && range['endDate'] && !range['endDate'].isSame(range['startDate'], 'day')) ||
        (oldRange && !oldRange['startDate'].isSame(range['startDate']))) {
        this.setState({ shownDate: range['endDate'].clone().add(offset, 'M') })
      }
    }
  }

  isOusideMinMax(dayMoment, minDate, maxDate, format) {
    return (
      (minDate && dayMoment.isBefore(parseInput(minDate, format, 'startOf'))) ||
      (maxDate && dayMoment.isAfter(parseInput(maxDate, format, 'endOf')))
    )
  }

  getShownDate() {
    const { link, offset } = this.props
    return (link) ? link.clone().add(offset, 'M') : this.state.shownDate
  }

  handleSelect = (date) => {
    const { link, onChange } = this.props
    onChange && onChange(date, Calendar)

    if (!link) {
      this.setState({ date })
    }
  }

  changeMonth = (event, direction) => {
    event.preventDefault()
    const { link, linkCB, singleRange } = this.props

    if (link && linkCB) {
      return linkCB(direction)
    }

    const shownDate = this.state.shownDate.clone().add(direction, 'M')

    if (!singleRange) {
      this.handleSelect(shownDate)
    }

    this.setState({ shownDate })
  }

  changeYear = (event, direction) => {
    event.preventDefault()
    const { link, linkCB, singleRange } = this.props

    if (link && linkCB) {
      return linkCB(direction, true)
    }

    const shownDate = this.state.shownDate.clone().add(direction, 'y')

    if (!singleRange) {
      this.handleSelect(shownDate)
    }

    this.setState({ shownDate })
  }

  renderMonthAndYear() {
    const { lang, showMonthArrow, offset, range, singleRange } = this.props
    const shownDate = this.getShownDate()
    let month = moment.months(shownDate.month())
    const year = shownDate.year()

    let monthLower = month.toLowerCase()
    month = (lang && LangDic[lang] && LangDic[lang][monthLower]) ? LangDic[lang][monthLower] : month

    let showLeftMonthArrow = true
    let showRightMonthArrow = true
    if (!singleRange && range) {
      showLeftMonthArrow = offset === -1
      showRightMonthArrow = offset === 0
    }

    return (
      <MonthAndYearWrapper>
        {
          showMonthArrow && showLeftMonthArrow
            ? <MonthButton
              type="button"
              onMouseDown={ (e) => this.changeYear(e, -1) }>
              <IconDoubleArrow color="#f6b530" />
            </MonthButton> : null
        }
        {
          showMonthArrow && showLeftMonthArrow
            ? <MonthButtonLeft
              type="button"
              singleRange={ singleRange }
              onMouseDown={ (e) => this.changeMonth(e, -1) }>
              <IconArrow color="#f6b530" width="5" height="9" />
            </MonthButtonLeft> : <div style={ { width: '20px' } } />
        }
        <MonthAndYearMonth>
          <span>{`${month} ${year}`}</span>
        </MonthAndYearMonth>
        {
          showMonthArrow && showRightMonthArrow
            ? <MonthButtonRight
              type="button"
              singleRange={ singleRange }
              onMouseDown={ (e) => this.changeMonth(e, 1) }>
              <IconArrowRight color="#f6b530" width="5" height="9" />
            </MonthButtonRight> : <div style={ { width: '20px' } } />
        }
        {
          showMonthArrow && showRightMonthArrow
            ? <MonthButton
              type="button"
              onMouseDown={ (e) => this.changeYear(e, 1) }>
              <IconDoubleArrowRight color="#f6b530" />
            </MonthButton> : null
        }
      </MonthAndYearWrapper>
    )
  }

  renderWeekdays(cellSize) {
    const dow = this.state.firstDayOfWeek
    const weekdays = []
    const { lang } = this.props

    for (let i = dow; i < 7 + dow; i++) {
      let day = moment.weekdaysMin(i)
      let dayLower = day.toLowerCase()
      day = (lang && LangDic[lang] && LangDic[lang][dayLower]) ? LangDic[lang][dayLower] : day
      weekdays.push(
        <Weekday cellSize={ cellSize } key={ i + day }>{day}</Weekday>
      )
    }

    return weekdays
  }

  renderDays(cellSize) {
    const { range, minDate, maxDate, format, disableDaysBeforeToday, specialDays } = this.props

    const shownDate = this.getShownDate()
    const { date, firstDayOfWeek } = this.state
    const dateUnix = date.unix()

    const monthNumber = shownDate.month()
    const dayCount = shownDate.daysInMonth()
    const startOfMonth = shownDate.clone().startOf('month').isoWeekday()

    const lastMonth = shownDate.clone().month(monthNumber - 1)
    const lastMonthDayCount = lastMonth.daysInMonth()

    const nextMonth = shownDate.clone().month(monthNumber + 1)

    const days = []

    // Previous month's days
    const diff = (Math.abs(firstDayOfWeek - (startOfMonth + 7)) % 7)
    for (let i = diff - 1; i >= 0; i--) {
      const dayMoment = lastMonth.clone().date(lastMonthDayCount - i)
      days.push({ dayMoment, isPassive: true })
    }

    // Current month's days
    for (let i = 1; i <= dayCount; i++) {
      const dayMoment = shownDate.clone().date(i)
      // set days before today to isPassive
      const _today = moment()
      if (disableDaysBeforeToday && Number(dayMoment.diff(_today, 'days')) <= -1) {
        days.push({ dayMoment, isPassive: true })
      } else {
        days.push({ dayMoment })
      }
    }

    // Next month's days
    // 42 cells = 7days * 6rows
    const remainingCells = 42 - days.length
    for (let i = 1; i <= remainingCells; i++) {
      const dayMoment = nextMonth.clone().date(i)
      days.push({ dayMoment, isPassive: true })
    }

    const today = moment().startOf('day')
    return map(days, (data, index) => {
      const { dayMoment, isPassive } = data
      const isSelected = !range && (dayMoment.unix() === dateUnix)
      const isInRange = range && checkRange(dayMoment, range)
      const isStartEdge = range && checkStartEdge(dayMoment, range)
      const isEndEdge = range && checkEndEdge(dayMoment, range)
      const isEdge = isStartEdge || isEndEdge
      const isToday = today.isSame(dayMoment)
      const isSunday = dayMoment.day() === 0
      const isSpecialDay = specialDays && specialDays.some((specialDay) => {
        return dayMoment.endOf('day').isSame(specialDay.date.endOf('day'))
      })
      const isOutsideMinMax = this.isOusideMinMax(dayMoment, minDate, maxDate, format)

      return (
        <DayCell
          onSelect={ this.handleSelect }
          { ...data }
          isStartEdge={ isStartEdge }
          isEndEdge={ isEndEdge }
          isSelected={ isSelected || isEdge }
          isInRange={ isInRange }
          isSunday={ isSunday }
          isSpecialDay={ isSpecialDay }
          isToday={ isToday }
          key={ index }
          cellSize={ cellSize }
          isPassive={ isPassive || isOutsideMinMax }
        />
      )
    })
  }

  render() {
    const { className, cellSize, showTime, handleSelectTime, onApply } = this.props

    return (
      <CalendarWrapper className={ className } cellSize={ cellSize }>
        <div>{ this.renderMonthAndYear() }</div>
        <Weekdays>{ this.renderWeekdays(cellSize) }</Weekdays>
        <Days>{ this.renderDays(cellSize) }</Days>
        { showTime && <TimePicker onChange={ handleSelectTime } /> }
        { showTime && <Apply onClick={ onApply } >Apply</Apply> }
      </CalendarWrapper>
    )
  }
}

export default Calendar

const CalendarWrapper = styled.div`
  width: 250px;
  background: #ffffff;
  border-radius: 2px;
  display: inline-block;
  box-sizing: border-box;
  letter-spacing: 0;
  color: #000000;
`

const Weekday = styled.span`
  font-size: 12px;
  color: #6e7a87;
  line-height: ${props => props.cellSize ? props.cellSize / 2 : 37 / 2}px;
  display: inline-block;
  box-sizing: border-box;
  width: ${props => props.cellSize ? props.cellSize + 10 : 37}px;
  height: ${props => props.cellSize ? props.cellSize / 2 : 37 / 2}px;
  margin-bottom: 2px;
  text-align: center;
  letter-spacing: initial;
`

const Weekdays = styled.div`
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 20px;
  margin-bottom: 10px;
`

const MonthAndYearWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  font-size: 12px;
  padding: 10px 0;
  height: 38px;
  line-height: 18px;
`

const MonthAndYearMonth = styled.span`
  font-size: 14px;
  font-weight: bold;
`

const MonthButton = styled.button`
  display: block;
  box-sizing: border-box;
  padding: 0;
  margin: 0 10px;
  border: none;
  outline: none;
  background: #fff;
  height: 18px;
  width: 18px;
  cursor: pointer;
  border-radius: 4px;
  
  &:hover {
    background: #6e7a87;
  }
`

const MonthButtonLeft = styled(MonthButton)`
  margin-left: ${props => props.singleRange ? -20 : -45}px;
`

const MonthButtonRight = styled(MonthButton)`
  margin-right: ${props => props.singleRange ? -22 : -50}px;
`

const IconArrowRight = styled(IconArrow)`
  transform: rotate(-180deg);
`

const IconDoubleArrowRight = styled(IconDoubleArrow)`
  transform: rotate(-180deg);
`

const Days = styled.div`
  margin-bottom: 28px;
  margin-left: 6px;
  margin-right: 5px;
`

const Apply = styled(Button)`
  width: 100%;
`
