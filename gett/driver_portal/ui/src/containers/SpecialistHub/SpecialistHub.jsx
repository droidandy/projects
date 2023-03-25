import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { map, debounce, isEmpty, isEqual, forEach } from 'lodash'

import { timeFromNow } from 'utils'
import faye from 'api/faye'
import { media, sizes } from 'components/Media'
import { IconApproved, IconRejected } from 'components/Icons'
import { ButtonLink } from 'components/Button'
import { Grid, GridHeaders, GridHeader, GridBody, GridRow, GridColumn } from 'components/Grid'
import { Empty } from 'components/Empty'
import { BackOfficeLayout } from 'containers/Layouts'
import { ReviewIcon } from './components/ReviewIcon'

import * as mapDispatchToProps from './actions'
import { mapStateToProps } from './reducers'

import { StatusBar } from './components/StatusBar'

class SpecialistHub extends Component {
  fayeSubscriptions = []

  componentDidMount() {
    this.loadDrivers()
  }

  componentWillUpdate(nextProps) {
    const { channels } = this.props
    if (!isEqual(channels, nextProps.channels)) {
      forEach(nextProps.channels, ch => {
        this.fayeSubscriptions.push(faye.on(`/${ch}`, () => {
          this.loadDrivers()
        }))
      })
    }
  }

  componentWillUnmount() {
    if (!isEmpty(this.fayeSubscriptions)) {
      forEach(this.fayeSubscriptions, ch => ch.cancel())
    }
  }

  render() {
    const {
      history,
      currentUser,
      loading, drivers,
      setStatus,
      logout,
      status,
      statusChangedAt
    } = this.props
    return (
      <BackOfficeLayout
        currentUser={ currentUser }
        logout={ logout }
        location={ history.location }
      >
        <Container>
          <PageHeader>
            <PageName>Onboarding Specialist Hub</PageName>
            <StatusBar
              status={ status || currentUser.agentStatus }
              trainingStartedAt={ statusChangedAt || currentUser.agentStatusUpdatedAt }
              drivers={ !isEmpty(drivers) }
              setStatus={ setStatus }
              disableStart={ isEmpty(drivers) }
            />
          </PageHeader>
          <Content>
            {
              isEmpty(drivers) ? (
                <Empty loading={ loading }>
                  You have no assigned drivers
                </Empty>
              ) : (
                <Grid>
                  <GridHeaders visibleFrom={ sizes.phoneLarge }>
                    <GridHeader>
                      Driver Name
                    </GridHeader>
                    <GridHeader>
                      Waiting Time
                    </GridHeader>
                    <GridHeader>
                      PHV Number
                    </GridHeader>
                    <GridHeader>
                      Contact Number
                    </GridHeader>
                    <GridHeader flex="0.7">
                      Documents
                    </GridHeader>
                    <GridHeader>
                      Review Summary
                    </GridHeader>
                    <GridHeader />
                  </GridHeaders>
                  <GridBody>
                    {
                      map(drivers, user => (
                        <GridRow key={ user.id }>
                          <GridColumn>
                            { user.name }
                          </GridColumn>
                          <GridColumn>
                            { timeFromNow(user.scheduledAt) }
                          </GridColumn>
                          <GridColumn>{ user.license }</GridColumn>
                          <GridColumn>{ user.phone }</GridColumn>
                          <GridColumn flex="0.7">
                            {
                              user.documentsReady
                                ? <IconApproved />
                                : <IconRejected />
                            }
                          </GridColumn>
                          <GridHeader>
                            <ReviewIcon user={ user } />
                          </GridHeader>
                          <GridColumn>
                            <ReviewButton to={ `/boreview/${user.id}` } target="_blank">
                              Review
                            </ReviewButton>
                          </GridColumn>
                        </GridRow>
                      ))
                    }
                  </GridBody>
                </Grid>
              )
            }
          </Content>
        </Container>
      </BackOfficeLayout>
    )
  }

  loadDrivers = debounce(() => {
    this.props.loadDrivers()
  }, 300)
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

const ReviewButton = styled(ButtonLink)`
  background-color: #fff;
  border: solid 1px #f6b530;
  max-width: 100px;
  margin: auto;

  &:hover {
    background-color: #e1a62c;
  }

  ${media.phoneLarge`
    margin-right: 0px;
  `}
`

export default connect(mapStateToProps, mapDispatchToProps)(SpecialistHub)
