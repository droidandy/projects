import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'

import { BackOfficeLayout } from 'containers/Layouts'
import { Button } from 'components/Button'
import { media } from 'components/Media'

import apolloCar from 'assets/images/apollo-car@2x.png'

import * as mapDispatchToProps from './actions'
import { mapStateToProps } from './reducers'

class BoAlerts extends PureComponent {
  startReview = () => {
    const { history, loadNextDriver } = this.props
    loadNextDriver({ history })
  }

  render() {
    const { currentUser, logout, history: { location } } = this.props
    if (currentUser.driverToApproveId) {
      return <Redirect to="/bodocuments" />
    }

    return (
      <BackOfficeLayout currentUser={ currentUser } logout={ logout } location={ location }>
        <Container>
          <PageHeader>
            <PageName>Alerts</PageName>
          </PageHeader>
          <Content>
            <Tile>
              <Title>Apollo</Title>
              <Img src={ apolloCar } />
              <StyledButton onClick={ this.startReview }>Start</StyledButton>
            </Tile>
          </Content>
        </Container>
      </BackOfficeLayout>
    )
  }
}

const PageHeader = styled.div`
  display: flex;
  height: 48px;
  align-items: center;
  margin: 20px 0;
`

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0 30px;
  margin-top: 20px;
  background: #f4f7fa;

  ${media.phoneMedium`
    padding: 0;
  `}
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

const Content = styled.div`
  display: flex;
  height: calc(100% - 88px);
`

const Tile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  background: #fff;
`

const Title = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: #000;
  margin-top: 100px;
`

const Img = styled.img`
  max-width: 100%;
  margin: 100px 0 30px;
`

const StyledButton = styled(Button)`
  width: 130px;
  flex: none;
`

export default connect(mapStateToProps, mapDispatchToProps)(BoAlerts)
