import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { map, debounce, isEmpty, isEqual, pick, forEach } from 'lodash'
import moment from 'moment'

import { media } from 'components/Media'
import { Empty } from 'components/Empty'
import { DateTime } from 'components/DateTime'
import { BackOfficeLayout } from 'containers/Layouts/BackOfficeLayout'
import { Loader } from 'components/Loader'
import { SearchField } from 'components/SearchField'

import DocumentCheck from './components/DocumentCheck'
import CheckIn from './components/CheckIn'
import Identify from './components/Identify'
import Assign from './components/Assign'
import Filter from './components/Filter'
import AssignDialog from './components/AssignDialog'

import * as mapDispatchToProps from './actions'
import { mapStateToProps } from './reducers'

import faye from 'api/faye'

import {
  Grid,
  GridHeader,
  GridHeaders,
  GridBody,
  GridRow,
  GridColumn
} from 'components/Grid'

const PER_PAGE = 10
const FORMAT = 'YYYY-MM-DDTHH:mm:ss'

class BoAssignment extends Component {
  fayeSubscriptions = []
  state = {
    page: 1,
    perPage: PER_PAGE,
    query: '',
    datepicker: {
      startDate: moment().startOf('day'),
      endDate: moment().endOf('day'),
      disabled: false
    },
    assignDialog: {
      active: false
    }
  }

  componentWillMount() {
    this.props.initialize()
  }

  componentDidMount() {
    this.loadAssignment()
  }

  componentWillUpdate(nextProps, nextState) {
    const { agents, updateSuccess, updateAgentSuccess } = this.props
    if (!isEqual(agents.channels, nextProps.agents.channels)) {
      forEach(nextProps.agents.channels, ch => {
        this.fayeSubscriptions.push(faye.on(`/${ch}`, (msg) => {
          msg.driver && updateSuccess({ data: msg.driver })
          msg.agent && updateSuccess({ data: msg.agent, byIndex: 'agent' })
          msg.agent && updateAgentSuccess({ data: msg.agent })
        }))
      })
    }

    const reset = nextState.page === 1
    if (reset) this.container.scrollTop = 0

    const importantFields = [ 'page', 'perPage', 'query', 'assignShow' ]

    let dirty = false

    if (this.compareDates(nextState.datepicker)) {
      this.setState({ page: 1, hidePicker: true, reset: true })
      dirty = true
    } else {
      dirty = !isEqual(
        pick(nextState, importantFields),
        pick(this.state, importantFields)
      )
    }

    if (dirty) {
      this.loadAssignment()
    }
  }

  componentWillUnmount() {
    if (!isEmpty(this.fayeSubscriptions)) {
      forEach(this.fayeSubscriptions, ch => ch.cancel())
    }
  }

  handleScroll = (e) => {
    const { assignment: { page } } = this.props
    if ((e.target.scrollTop + e.target.clientHeight + 100 > e.target.scrollHeight) &&
      page > this.state.page) {
      this.setState({ page, hidePicker: true })
    }
  }

  render() {
    const {
      currentUser,
      assignment: { drivers, loading, last },
      logout,
      history: { location },
      agents
    } = this.props
    const { query, assignShow, today, datepicker, hidePicker, assignDialog } = this.state

    return (
      <BackOfficeLayout
        currentUser={ currentUser }
        logout={ logout }
        location={ location }
        onScroll={ this.handleScroll }
      >
        <Container innerRef={ (node) => this.container = node }>
          <PageHeader>
            <PageName>
              Assignment
            </PageName>
            <Search
              borderRadius="0px 4px 4px 0px"
              value={ query }
              onChange={ this.search }
              clear={ this.clearSearch }
            />
          </PageHeader>
          <Filter
            datepicker={ datepicker }
            hidePicker={ hidePicker }
            handleDatePicker={ this.handleDatePicker }
            handleChangePicker={ this.handleChangePicker }
            assignShowCheck={ this.assignShowCheck }
            assignShow={ assignShow }
            today={ today }
            todayCheck={ this.todayCheck }
          />
          <GridWrapper>
            {
              isEmpty(drivers) ? (
                <Empty loading={ loading } />
              ) : (
                <Grid>
                  <GridHeaders>
                    <GridHeader>Driver name</GridHeader>
                    <GridHeader>Phv number</GridHeader>
                    <GridHeader>Сontact number</GridHeader>
                    <GridHeader>Appointment time</GridHeader>
                    <GridHeader margin="0px 0px 0px 15px">Documents</GridHeader>
                    <GridHeader margin="0px 0px 0px 15px">Check in</GridHeader>
                    <GridHeader margin="0px 0px 0px 15px">Identity check</GridHeader>
                    <GridHeader>Assign to agent</GridHeader>
                  </GridHeaders>
                  <GridBody>
                    {
                      map(drivers, (item, index) => (
                        <GridRow key={ `Driver_${item.id}` }>
                          <GridColumn>{ item.name }</GridColumn>
                          <GridColumn>{ item.license }</GridColumn>
                          <GridColumn>{ item.phone }</GridColumn>
                          <GridColumn>
                            <DateTime
                              value={ item.scheduledAt }
                            />
                          </GridColumn>
                          <GridColumn margin="0px 0px 0px 15px">
                            <DocumentCheck documentsReady={ item.documentsReady } />
                          </GridColumn>
                          <GridColumn margin="0px 0px 0px 15px">
                            <CheckIn
                              time={ item.checkinAt }
                              value="Check in"
                              onClick={ () => this.checkIn(item.id) }
                            />
                          </GridColumn>
                          <GridColumn margin="0px 0px 0px 15px">
                            <Identify
                              time={ item.identityCheckedAt }
                              value="Identify"
                              onClick={ () => this.identify(item.id) }
                            />
                          </GridColumn>
                          <GridColumn>
                            <Assign
                              time={ !item.checkinAt }
                              agent={ item.agent }
                              value="Assign"
                              onClick={ () => this.assign(item) }
                              disabled={ item.agentAssigned }
                            />
                          </GridColumn>
                        </GridRow>
                      ))
                    }
                  </GridBody>
                </Grid>
              )
            }
            {!isEmpty(drivers) && (loading ? <LoaderStyled color="#FDB924" /> : !last && <LoaderText>Scroll down to see more</LoaderText>)}
          </GridWrapper>
          <AssignDialog
            active={ assignDialog.active }
            driver={ assignDialog.driver }
            onClose={ this.closeAssignDialog }
            agents={ agents }
            assignUser={ this.assignUser }
          />
        </Container>
      </BackOfficeLayout>
    )
  }

  loadAssignment = debounce(() => {
    const { page, perPage, reset, query, assignShow, datepicker: { startDate, endDate, disabled } } = this.state
    this.setState({ reset: false }, () => this.props.loadAssignment({
      page,
      perPage,
      reset,
      query,
      readyForAssignment: assignShow || undefined,
      from: !disabled ? moment(startDate).format(FORMAT) : null,
      to: !disabled ? moment(endDate).format(FORMAT) : null
    }))
  }, 300)

  checkIn = (driverId) => {
    this.props.checkInAssignment({ driverId })
  }

  identify = (driverId) => {
    this.props.identifyAssignment({ driverId })
  }

  assign = (driver) => {
    this.setState({
      assignDialog: {
        active: true,
        driver
      }
    }, this.props.loadAgents)
  }

  search = (query) => {
    this.setState({ query, reset: true, page: 1 })
  }

  clearSearch = () => {
    this.setState({ query: '', reset: true, page: 1 })
  }

  assignShowCheck = () => {
    this.setState(state => ({
      ...state,
      assignShow: !state.assignShow,
      reset: true,
      page: 1,
      today: false,
      datepicker: {
        ...state.datepicker,
        disabled: !state.datepicker.disabled
      }
    }))
  }

  todayCheck = () => {
    const datepicker = {
      startDate: moment().startOf('day'),
      endDate: moment().endOf('day'),
      disabled: false
    }
    this.setState(state => ({
      ...state,
      today: !state.today,
      datepicker,
      assignShow: false,
      reset: true
    }))
  }

  handleChangePicker = () => {
    this.setState({ hidePicker: false })
  }

  handleDatePicker = (datepicker) => {
    if (datepicker && datepicker.startDate && datepicker.endDate) {
      this.setState({ datepicker, today: false })
    }
  }

  compareDates({ startDate, endDate }) {
    return (!(moment(endDate).isSame(this.state.datepicker.endDate)) ||
      !(moment(startDate).isSame(this.state.datepicker.startDate))) &&
      !(moment(startDate).isSame(endDate))
  }

  closeAssignDialog = (callback) => {
    this.setState({
      assignDialog: {
        active: false
      }
    }, callback)
  }

  assignUser = ({ driver, agentId }) => {
    this.closeAssignDialog(() => this.props.assignUser({ driver, agentId }))
  }
}

const Container = styled.div`
  position: relative;
  background: #f4f7fa;
  min-height: 100%;
`

const PageHeader = styled.div`
  display: flex;
  height: 48px;
  align-items: center;
  justify-content: flex-start;
  margin-top: 20px;
`

const PageName = styled.span`
  font-size: 36px;
  color: #303030;
  margin: auto;
  margin-left: 30px;

  ${media.phoneLarge`
    font-size: 22px;
    margin-left: 15px;
  `}
`

const GridWrapper = styled.div`
  padding: 30px 30px 30px;
  margin-top: 10px;
  width: 100%;
  height: 100%;
  background-color: #f4f7fa;
`

const LoaderStyled = styled(Loader)`
  margin-bottom: 15px;
`
const LoaderText = styled.div`
  font-size: 14px;
  text-align: center;
  color: #000000;
  margin: 15px 0 15px 0;
`

const Search = styled(SearchField)`
  margin-right: 30px;
  max-width: 420px;
  width: 100%;
`

export default connect(mapStateToProps, mapDispatchToProps)(BoAssignment)
