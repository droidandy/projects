import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { maxBy, filter, forEach } from 'lodash'

import { BackOfficeLayout } from 'containers/Layouts'
import { media } from 'components/Media'

import { Actions } from './components/Actions'
import { History } from './components/History'
import { Requirements } from './components/Requirements'

import * as mapDispatchToProps from './actions'
import { mapStateToProps } from './reducers'

class BoReview extends Component {
  componentDidMount() {
    const { match: { params: { id } } } = this.props
    if (id) {
      this.props.loadHistory({ userId: id })
      this.props.loadStats({ userId: id })
    }
  }

  render() {
    const {
      currentUser,
      logout,
      history,
      review,
      approveReview,
      rejectReview,
      approveRequirement,
      rejectRequirement,
      updatePhoneContract,
      showComplianceView,
      rhistory,
      stats
    } = this.props
    const requirements = this.requirements

    return (
      <BackOfficeLayout
        currentUser={ currentUser }
        logout={ logout }
        location={ history.location }
      >
        <Container>
          <PageHeader>
            <PageName>{ this.userName(requirements.driver) } onboarding</PageName>
            <Actions
              approveReview={ approveReview }
              rejectReview={ rejectReview }
              userId={ requirements.driver.id }
              history={ history }
              showDialog={ review.showDialog }
              review={ requirements.currentHistory }
              stats={ stats }
            />
          </PageHeader>
          <Content>
            <Requirements
              review={ requirements.currentHistory }
              driver={ requirements.driver }
              stats={ stats }
              loading={ rhistory.loading }
              approveRequirement={ approveRequirement }
              rejectRequirement={ rejectRequirement }
              updatePhoneContract={ updatePhoneContract }
              showComplianceView={ showComplianceView }
              history={ history }
              showDialog={ rhistory.showDialog }
            />
            <History
              loading={ rhistory.loading }
              data={ rhistory.data }
            />
          </Content>
        </Container>
      </BackOfficeLayout>
    )
  }

  userName(driver) {
    return driver ? `${driver.firstName} ${driver.lastName}` : ''
  }

  get requirements() {
    const { rhistory: { data } } = this.props
    let currentHistory = []
    let driver = {}
    const lastReview = maxBy(data, (r) => r.attemptNumber)
    if (lastReview) {
      driver = lastReview.driver
      const filtered = filter(lastReview.reviewUpdates, { current: true })
      forEach(filtered, r => currentHistory[r.requirement] = r)
    }
    return {
      currentHistory,
      driver
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(BoReview)
