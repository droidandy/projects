import React, { Component } from 'react'
import styled from 'styled-components'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid } from 'recharts'
import { connect } from 'react-redux'
import moment from 'moment'
import { forEach } from 'lodash'

import { BackOfficeLayout } from 'containers/Layouts/BackOfficeLayout'
import { media } from 'components/Media'
import { SecondaryButton } from './components/SecondaryButton'

import * as mapDispatchToProps from './actions'
import { mapStateToProps } from './reducers'

const FORMAT = 'YYYY-MM-DD'

const renderCustomizedYTick = (props) => {
  const { x, y, payload } = props

  return (
    <text x={ x - 25 } y={ y + 5 } textAnchor="middle" fill="#6e7a87">
      {payload.value}
    </text>
  )
}

const renderCustomizedXTick = (props) => {
  const { x, y, payload } = props

  return (
    <Tick x={ x } y={ y + 40 } textAnchor="middle" fill="#6e7a87">
      {payload.value}
    </Tick>
  )
}

class Statistics extends Component {
  state = {
    activeUsers: this.defaultData,
    loginCount: this.defaultData
  }

  dot = {
    r: 7,
    fill: '#f6b530',
    stroke: '#fff',
    strokeWidth: 2
  }

  componentDidMount() {
    const { activeUsers, loginCount } = this.state
    this.props.loadActiveUsers({ ...activeUsers })
    this.props.loadLoginCount({ ...loginCount })
  }

  fullName = () => {
    const { firstName, lastName } = this.props.currentUser
    return `${firstName} ${lastName}`
  }

  logout = () => {
    this.props.logout()
  }

  get dotArea() {
    return {
      ...this.dot
    }
  }

  get defaultData() {
    return {
      from: moment().subtract('1', 'y').format(FORMAT),
      to: moment().format(FORMAT),
      period: 'monthly'
    }
  }

  get activeUsersDaily() {
    return this.state.activeUsers.period === 'daily'
  }

  get loginCountDaily() {
    return this.state.loginCount.period === 'daily'
  }

  data(type) {
    const active = this.props[type]
    const { period } = this.state[type]
    let activeArr = []
    forEach(active, (val) => {
      if (val.amount) {
        activeArr.push({
          date: period !== 'daily' ? moment(`${val.month} ${val.year}`, 'M YYYY').format('MMMM YYYY') : moment(val.date, FORMAT).format(FORMAT),
          [type]: val.amount
        })
      }
    })
    return activeArr
  }

  getActiveUsers = (data) => {
    this.getData(data, 'activeUsers', this.props.loadActiveUsers)
  }

  getLoginCount = (data) => {
    this.getData(data, 'loginCount', this.props.loadLoginCount)
  }

  getData(data, type, func) {
    this.setState(state => {
      let { from, to, period } = state[type]
      let date = data ? data.value || data.activeLabel : {}
      if (period !== 'daily') {
        period = 'daily'
        const daysInMonth = moment(date, 'MMMM').daysInMonth()
        from = moment(date, 'MMMM YYYY').format(FORMAT)
        to = moment(date, 'MMMM YYYY').add(daysInMonth, 'd').format(FORMAT)
        func({ from, to, period })
        return {
          ...state,
          [type]: {
            from, to, period
          }
        }
      }
    })
  }

  resetActiveUsers = () => {
    this.handleReset('activeUsers', this.props.loadActiveUsers)
  }

  resetloginCount = () => {
    this.handleReset('loginCount', this.props.loadLoginCount)
  }

  handleReset = (type, func) => {
    this.setState(state => {
      const data = this.defaultData
      func({ ...data })
      return {
        state,
        [type]: data
      }
    })
  }

  render() {
    const { currentUser, logout, history: { location } } = this.props
    const activeUsersArr = this.data('activeUsers')
    const loginCountArr = this.data('loginCount')

    return (
      <BackOfficeLayout
        currentUser={ currentUser }
        logout={ logout }
        location={ location }
      >
        <Container>
          <Header>
            <Title>Statistics</Title>
          </Header>
          <Content>
            <AreaWrapper>
              <AreaHeader>
                <AreaTitle>Active Drivers on Portal</AreaTitle>
                {this.activeUsersDaily && <SecondaryButton onClick={ this.resetActiveUsers }>back to monthly</SecondaryButton>}
              </AreaHeader>
              <ResponsiveContainerStyled width="100%" height={ 330 }>
                <AreaChart data={ activeUsersArr }
                  margin={ { top: 40, right: 30, left: 0, bottom: 60 } }
                  stackOffset="expand"
                  syncId="ActiveDrivers"
                  onClick={ this.getActiveUsers }
                >
                  <defs>
                    <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f6b530" stopOpacity={ 1 } />
                      <stop offset="95%" stopColor="#f6b530" stopOpacity={ 0 } />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    padding={ { left: 40, right: 40 } }
                    tick={ renderCustomizedXTick }
                    axisLine={ false }
                    onClick={ this.getActiveUsers }
                  />
                  <YAxis
                    axisLine={ false }
                    tickSize={ 0 }
                    tick={ renderCustomizedYTick }
                  />
                  <CartesianGrid
                    vertical={ false }
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    name="Active Users"
                    dataKey="activeUsers"
                    stroke="#f6b530"
                    fillOpacity={ 1 }
                    fill="url(#color)"
                    dot={ this.dotArea }
                    activeDot={ false }
                  />
                </AreaChart>
              </ResponsiveContainerStyled>
            </AreaWrapper>
            <AreaWrapper>
              <AreaHeader>
                <AreaTitle>Numbers of Logins</AreaTitle>
                {this.loginCountDaily && <SecondaryButton onClick={ this.resetloginCount }>back to monthly</SecondaryButton>}
              </AreaHeader>
              <ResponsiveContainerStyled width="100%" height={ 330 }>
                <AreaChart data={ loginCountArr }
                  margin={ { top: 40, right: 30, left: 0, bottom: 60 } }
                  stackOffset="expand"
                  syncId="numberLogins"
                  onClick={ this.getLoginCount }
                >
                  <defs>
                    <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f6b530" stopOpacity={ 1 } />
                      <stop offset="95%" stopColor="#f6b530" stopOpacity={ 0 } />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    padding={ { left: 40, right: 40 } }
                    tick={ renderCustomizedXTick }
                    axisLine={ false }
                    onClick={ this.getLoginCount }
                  />
                  <YAxis
                    axisLine={ false }
                    tickSize={ 0 }
                    tick={ renderCustomizedYTick }
                  />
                  <CartesianGrid
                    vertical={ false }
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    name="Login Count"
                    dataKey="loginCount"
                    stroke="#f6b530"
                    fillOpacity={ 1 }
                    fill="url(#color)"
                    dot={ this.dotArea }
                    activeDot={ false }
                  />
                </AreaChart>
              </ResponsiveContainerStyled>
            </AreaWrapper>
          </Content>
        </Container>
      </BackOfficeLayout>
    )
  }
}

const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  background-color: #f4f7fa;
  padding-bottom: 70px;
`

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 15px 30px 15px 0px;
  height: 50px;
  margin-bottom: 10px;
  width: 100%;
  box-sizing: border-box;
`

const Title = styled.div`
  font-size: 36px;
  color: #303030;
  margin-left: 30px;
  margin-right: 100px;
  flex: 1;

  ${media.phoneLarge`
    margin-left: 0;
    margin-right: 10px;
  `}

`

const Content = styled.div`
  padding: 30px 30px 30px;
  width: 100%;
  height: 100%;
  background-color: #f4f7fa;
  overflow: auto;

  ${media.phoneLarge`
    padding: 0px;
    overflow: visible;
  `}
`

const ResponsiveContainerStyled = styled(ResponsiveContainer)`
   background-color: #fff;
   border-radius: 4px;
   margin-bottom: 20px;
   .recharts-surface {
    cursor: pointer;
   }
`

const AreaWrapper = styled.div`
  width: 100%;
  background-color: #fff;
  border-radius: 4px;
  margin-bottom: 20px;
`

const AreaTitle = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: #303030;
  padding: 30px;
`

const AreaHeader = styled.div`
  display: flex;
  align-items: center;
`

const Tick = styled.text`
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`

export default connect(mapStateToProps, mapDispatchToProps)(Statistics)
