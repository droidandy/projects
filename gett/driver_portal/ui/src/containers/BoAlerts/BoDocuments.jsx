import React, { Component } from 'react'
import styled from 'styled-components'
import { find } from 'lodash'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'

import { BackOfficeLayout } from 'containers/Layouts'
import { media } from 'components/Media'

import { Actions } from './components/Actions'
import { Header } from './components/Header'
import { List } from './components/List'
import { DocumentsStatuses } from './components/DocumentsStatuses'

import * as mapDispatchToProps from './actions'
import { mapStateToProps } from './reducers'

class BoDocuments extends Component {
  state = {
    scrollTo: '',
    vehicleId: false,
    loadedUser: false,
    user: {
      approvalStatus: null,
      gettId: 0
    }
  }

  componentDidMount() {
    const { currentUser: { driverToApproveId } } = this.props
    this.loadDocuments(driverToApproveId)
  }

  loadDocuments(driverToApproveId) {
    if (driverToApproveId) {
      const { loadVehicles, loadDocuments, loadKinds } = this.props
      loadVehicles({ driverToApproveId })
      loadDocuments({ driverToApproveId })
      loadKinds({ driverToApproveId })
    }
  }

  componentWillReceiveProps(newProps) {
    const { vehicles } = newProps
    const { loadVehiclesDocuments, loadVehiclesKinds, loadUser, currentUser: { driverToApproveId } } = this.props
    const { vehicleId, user, loadedUser } = this.state
    if (newProps.currentUser.driverToApproveId !== driverToApproveId) {
      this.loadDocuments(newProps.currentUser.driverToApproveId)
    }
    if (vehicles && vehicles[0] && (!vehicleId || !find(vehicles, { id: vehicleId }))) {
      const vehicleId = vehicles[0].id
      this.setState({ vehicleId })
      loadVehiclesKinds({ driverToApproveId, vehicleId })
      loadVehiclesDocuments({ driverToApproveId, vehicleId })
    }

    if (newProps.user.approvalStatus &&
      newProps.user.approvalStatus !== user.approvalStatus) {
      this.setState({ user: newProps.user })
    } else if (!loadedUser && driverToApproveId) {
      this.setState({ loadedUser: true }, () => loadUser({ userId: driverToApproveId }))
    }
  }

  clearScroll = () => {
    this.setState({ scrollTo: '' })
  }

  loadNextDriver = () => {
    const { loadNextDriver, history } = this.props
    loadNextDriver({ history })
  }

  render() {
    const {
      currentUser,
      currentUser: { driverToApproveId },
      logout,
      history: { location },
      documents,
      kinds,
      approveDocument,
      approveVehicleDocument,
      rejectDocument,
      rejectVehicleDocument,
      updateVehicleDetails,
      vehicles,
      finished,
      notification
    } = this.props
    const { scrollTo, vehicleId, user } = this.state
    const vehicle = vehicles.find(item => item.id === vehicleId)

    if (!driverToApproveId) {
      return <Redirect to="/boalerts" />
    }

    return (
      <BackOfficeLayout
        currentUser={ currentUser }
        logout={ logout }
        location={ location }
      >
        <Container>
          <PageHeader>
            <PageName>Alerts</PageName>
            <Actions
              onLoginAsUser={ this.loginAs }
              exit={ this.exit }
              sendNotification={ this.sendNotification }
              onNextDriver={ this.loadNextDriver }
              finished={ finished }
              loadMessage={ this.loadMessage }
              notification={ notification }
            />
          </PageHeader>
          <Header
            user={ user }
            vehicles={ vehicles }
            vehicleId={ vehicleId }
            selectVehicle={ this.selectVehicle }
          />
          <Content>
            <DocumentsStatuses
              scrollToDocument={ this.scrollToDocument }
              driverKinds={ kinds.driver }
              vehiclesKinds={ kinds.vehicles }
              driverDocuments={ documents.driver }
              vehiclesDocuments={ documents.vehicles }
            />
            <DocumentsList>
              <List
                clearScroll={ this.clearScroll }
                scrollTo={ scrollTo }
                title="Driver Documents"
                documents={ documents.driver }
                kinds={ kinds.driver }
                approveDocument={ approveDocument }
                rejectDocument={ rejectDocument }
                userId={ currentUser.driverToApproveId }
              />
              <List
                clearScroll={ this.clearScroll }
                scrollTo={ scrollTo }
                title="Vehicles Documents"
                documents={ documents.vehicles }
                kinds={ kinds.vehicles }
                approveDocument={ approveVehicleDocument }
                rejectDocument={ rejectVehicleDocument }
                vehicle={ vehicle }
                userId={ currentUser.driverToApproveId }
                updateVehicleDetails={ updateVehicleDetails }
              />
            </DocumentsList>
          </Content>
        </Container>
      </BackOfficeLayout>
    )
  }

  loginAs = () => {
    const { loginAsUser, currentUser: { driverToApproveId } } = this.props
    loginAsUser({ driverToApproveId })
  }

  selectVehicle = (vehicleId) => {
    const { currentUser: { driverToApproveId }, loadVehiclesDocuments } = this.props
    this.setState({ vehicleId, scrollTo: '' }, () => loadVehiclesDocuments({ driverToApproveId, vehicleId }))
  }

  exit = () => {
    const { exitAlerts, history, currentUser: { driverToApproveId } } = this.props
    exitAlerts({ driverToApproveId, history })
  }

  scrollToDocument = (scrollTo) => {
    this.setState({ scrollTo })
  }

  sendNotification = (message) => {
    const { currentUser: { driverToApproveId }, sendNotification } = this.props
    sendNotification({ driverToApproveId, message })
  }

  loadMessage = () => {
    const { currentUser: { driverToApproveId }, loadNotificationMsg } = this.props
    loadNotificationMsg({ driverToApproveId })
  }
}

const PageHeader = styled.div`
  display: flex;
  height: 48px;
  align-items: center;
  margin: 20px 0;
  justify-content: space-between;
`

const Container = styled.div`
  position: relative;
  width: 100%;
  padding: 0 30px;
  margin-top: 30px;
  background: #f4f7fa;

  ${media.phoneMedium`
    padding: 0;
  `}
`

const PageName = styled.span`
  font-size: 36px;
  color: #303030;
  margin: auto;
  margin-left: 0px;

  ${media.phoneLarge`
    font-size: 22px;
  `}
`

const Content = styled.div`
  display: flex;
`

const DocumentsList = styled.div`
  flex: 3;
  margin: 20px 0 0 20px;
`

export default connect(mapStateToProps, mapDispatchToProps)(BoDocuments)
