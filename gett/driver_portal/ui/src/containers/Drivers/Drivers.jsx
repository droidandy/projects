import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import { isEmpty, isEqual, debounce, map, pick, size, filter } from 'lodash'
import { connect } from 'react-redux'

import { Empty } from 'components/Empty'
import { Frozen, Active } from 'components/Status'
import { media } from 'components/Media'
import { BackOfficeLayout } from 'containers/Layouts/BackOfficeLayout'

import { Header } from './components/Header'
import { Bottom } from './components/Bottom'
import LastActivity from './components/LastActivity'
import { GridActions } from './components/GridActions'

import * as mapDispatchToProps from './actions'
import { mapStateToProps } from './reducers'
import {
  Grid,
  GridHeader,
  GridHeaders,
  ScrollableBody,
  GridRow,
  GridColumn,
  Dots
} from 'components/Grid'

class Users extends Component {
  state = {
    page: 1,
    perPage: 20,
    query: '',
    category: 'all',
    role: '',
    selected: {}
  }

  componentWillMount() {
    this.props.initialize()
  }

  componentDidMount() {
    this.loadUsers()
  }

  componentDidUpdate(prevProps, prevState) {
    const importantFields = [ 'page', 'perPage', 'query', 'category', 'role' ]

    const dirty = !isEqual(
      pick(prevState, importantFields),
      pick(this.state, importantFields)
    )

    if (dirty) {
      this.loadUsers()
    }
  }

  render() {
    const { query, page, perPage } = this.state
    const { currentUser, logout, loading, total, users, lastSyncAt, history: { location } } = this.props

    return (
      <BackOfficeLayout
        currentUser={ currentUser }
        logout={ logout }
        location={ location }
      >
        <Container>
          <Header
            loading={ loading }
            query={ query }
            onSearch={ this.search }
            onSearchCategory={ this.changeCategory }
            onSearchType={ this.onSearchType }
            onSync={ this.synchronize }
            lastSyncAt={ lastSyncAt }
          />
          <Content>
            {
              isEmpty(users) ? (
                <Empty loading={ loading } />
              ) : (
                <Grid>
                  <GridHeaders>
                    <GridHeader flex="2" margin="0 0 0 20px">Name</GridHeader>
                    <GridHeader>Gett ID</GridHeader>
                    <GridHeader>Phone number</GridHeader>
                    <GridHeader>Onboarding step</GridHeader>
                    <GridHeader>Gett status</GridHeader>
                    <GridHeader>Compliance queue</GridHeader>
                    <GridHeader>Pending documents</GridHeader>
                    <GridHeader flex="0.5" />
                  </GridHeaders>
                  <ScrollableBody>
                    {
                      map(users, user => (
                        <GridRowDrivers key={ user.id } active={ user.active }>
                          <GridColumn flex="2">
                            { `${user.firstName} ${user.lastName}` }
                            <LastActivity lastActivityAt={ user.lastActivityAt } />
                          </GridColumn>
                          <GridColumn>{ user.gettId }</GridColumn>
                          <GridColumn>{ user.phone }</GridColumn>
                          <GridColumn>{ user.onboardingStep }</GridColumn>
                          <GridColumn>
                            <StatusLabelsHolder>
                              {
                                user.isFrozen
                                  ? <FrozenLabel>Frozen</FrozenLabel>
                                  : <Active>Active</Active>
                              }
                            </StatusLabelsHolder>
                          </GridColumn>
                          <GridColumn>{ user.complianceQueuePosition }</GridColumn>
                          <GridColumn>{ user.pendingDocumentsNumber }</GridColumn>
                          <GridColumn flex="0.5">
                            <GridActions
                              trigger={ <Dots /> }
                              user={ user }
                              driverToApproveId={ currentUser.driverToApproveId }
                              onActivate={ this.activate }
                              onDeactivate={ this.deactivate }
                              onInvite={ this.invite }
                              onLoginAsUser={ this.loginAs }
                              onComplianceView={ this.complianceView }
                              onUnclaim={ this.unclaim }
                              onStartReview={ this.startReview }
                            />
                          </GridColumn>
                        </GridRowDrivers>
                      ))
                    }
                  </ScrollableBody>
                </Grid>
              )
            }
          </Content>
          <Bottom
            page={ page }
            perPage={ perPage }
            total={ total }
            selected={ this.selectedUsersCount() }
            onChange={ this.paginate }
            onActivate={ this.activateSelected }
            onDeactivate={ this.deactivateSelected }
            onInvite={ this.inviteSelected }
          />
        </Container>
      </BackOfficeLayout>
    )
  }

  loadUsers = debounce(() => {
    const { query, page, perPage, category, role } = this.state
    this.props.loadUsers({ query, page, perPage, category, role })
  }, 300)

  fullName = () => {
    const { firstName, lastName } = this.props.currentUser
    return `${firstName} ${lastName}`
  }

  invite = (user) => {
    this.props.inviteUser({ user })
  }

  loginAs = (user) => {
    this.props.loginAsUser({ user })
  }

  complianceView = (user) => {
    this.props.showComplianceView({ user, history: this.props.history })
  }

  unclaim = (user) => {
    this.props.unclaimUser({ user })
  }

  startReview = (user) => {
    // const { startReview, history } = this.props
    const { history } = this.props
    history.push(`/boreview/${user.id}`)
  }

  inviteSelected = () => {
    this.props.inviteUsers({ users: this.selectedUsers() })
  }

  activate = (user) => {
    this.props.activateUser({ user })
  }

  activateSelected = () => {
    this.props.activateUsers({ users: this.selectedUsers() })
  }

  deactivate = (user) => {
    this.props.deactivateUser({ user })
  }

  deactivateSelected = () => {
    this.props.deactivateUsers({ users: this.selectedUsers() })
  }

  search = (query) => {
    this.setState({ query })
  }

  changeCategory = (category) => {
    this.setState({ category })
  }

  onSearchType = (driverType) => {
    let role = ''
    if (driverType === 1) role = 'driver'
    else if (driverType === 2) role = 'apollo_driver'
    this.setState({ role })
  }

  paginate = ({ page, perPage }) => {
    this.setState({ page: page || 1, perPage: perPage || this.state.perPage })
  }

  synchronize = () => {
    this.props.synchronizeUsers()
  }

  isSelected = (id) => {
    return this.state.selected['all'] || this.state.selected[id] || false
  }

  select = (id) => {
    if (this.isSelected('all') && id !== 'all') {
      return
    }

    this.setState(state => ({
      ...state,
      selected: { ...state.selected, [id]: !state.selected[id] }
    }))
  }

  selectedUsers = () => {
    return filter(this.props.users, user => this.isSelected(user.id))
  }

  selectedUsersCount = () => {
    if (this.isSelected('all')) {
      return size(this.props.users)
    }

    return size(this.selectedUsers())
  }

  logout = () => {
    this.props.logout()
  }
}

const Container = styled.div`
  position: relative;
  background-color: #f4f7fa;
  padding-bottom: 70px;
  min-height: 100%;
  height: 100%;
`

const Content = styled.div`
  padding: 30px 30px 30px;
  width: 100%;
  height: 100%;
  background-color: #f4f7fa;

  ${media.phoneLarge`
    padding: 0px;
    overflow: visible;
  `}
`

const GridRowDrivers = styled(GridRow)`
  padding-left: 34px;
  ${props => !props.active && css`
    border-left: 6px solid #ff0000;
    padding-left: 28px;
  `}
`

const StatusLabelsHolder = styled.div`
  display: flex;
`

const FrozenLabel = styled(Frozen)`
  margin-left: 10px;
`

export default connect(mapStateToProps, mapDispatchToProps)(Users)
